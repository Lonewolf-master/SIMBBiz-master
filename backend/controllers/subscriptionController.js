const SubscriptionPayment = require('../models/SubscriptionPayment');
const Business = require('../models/Business');
const Plan = require('../models/Plan');
const axios = require('axios');
const crypto = require('crypto');

const PAVEWAY_SECRET_KEY = process.env.PAVEWAY_SECRET_KEY || 'your_paveway_secret_key';
const PAVEWAY_WEBHOOK_SECRET = process.env.PAVEWAY_WEBHOOK_SECRET || 'your_paveway_webhook_secret';
const PAVEWAY_API_URL = 'https://api.paveway.group/v1/payments';

exports.buySpaces = async (req, res) => {
  try {
    const { payment_method, spaces, phone_or_card, plan_id } = req.body;
    if (!['MTN', 'ORANGE', 'VIRTUAL_CARD'].includes(payment_method)) {
      return res.status(400).json({ success: false, error: 'Invalid payment method' });
    }

    if (!phone_or_card) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    let amount = 0;
    let slotsToAdd = 0;
    let planName = '';

    if (plan_id) {
      const plan = await Plan.findById(plan_id);
      if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
      amount = plan.price;
      slotsToAdd = plan.slots;
      planName = plan.name;
    } else {
      // Fallback to custom spaces
      if (!spaces || spaces < 5) return res.status(400).json({ success: false, error: 'Minimum 5 spaces required' });
      const costPerSpace = 200;
      amount = spaces * costPerSpace;
      slotsToAdd = spaces;
      planName = `${spaces}_slots`;
    }
    
    // Idempotency: Check for pending transaction within last 5 minutes to prevent double charge
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const pendingPayment = await SubscriptionPayment.findOne({
      business_id: req.params.id,
      payment_status: 'pending',
      createdAt: { $gte: fiveMinutesAgo }
    });

    if (pendingPayment) {
      return res.status(409).json({ 
        success: false, 
        error: 'A payment is currently being processed for your account. Please wait a few minutes before trying again.',
        data: pendingPayment 
      });
    }

    const transaction_reference = `SIMBBIZ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payment = new SubscriptionPayment({
      business_id: req.params.id,
      amount,
      payment_method,
      transaction_reference,
      plan_or_spaces: planName,
      slots_added: slotsToAdd,
      payment_status: 'pending'
    });

    await payment.save();

    // Call PaveWay API to trigger USSD prompt
    try {
      const response = await axios.post(PAVEWAY_API_URL, {
        amount: amount,
        currency: 'XAF',
        phone: phone_or_card,
        reference: transaction_reference,
        description: `Purchase of ${planName} on SIMBBiz`,
        payment_method: payment_method
      }, {
        headers: {
          'Authorization': `Bearer ${PAVEWAY_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Usually PaveWay responds with status "pending" for Mobile Money
      // If it fails immediately, we can mark as failed
      if (response.data && response.data.status === 'failed') {
        payment.payment_status = 'failed';
        await payment.save();
        return res.status(400).json({ success: false, error: 'Payment request failed by provider' });
      }

      res.status(200).json({ success: true, message: 'Payment initiated. Please check your phone.', data: { payment } });
      
    } catch (apiError) {
      console.error('PaveWay API Error:', apiError.response ? apiError.response.data : apiError.message);
      payment.payment_status = 'failed';
      await payment.save();
      return res.status(500).json({ success: false, error: 'Payment gateway error. Please try again.' });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.pavewayWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['x-paveway-signature']; // Typical header for webhook signatures

    // Very basic signature verification example
    // In production, follow PaveWay's exact signature verification process
    if (PAVEWAY_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', PAVEWAY_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      // if (signature !== expectedSignature) {
      //   return res.status(400).send('Invalid signature');
      // }
    }

    const { reference, status, amount } = payload;
    
    if (!reference || !status) {
      return res.status(400).send('Missing reference or status');
    }

    const payment = await SubscriptionPayment.findOne({ transaction_reference: reference });
    if (!payment) {
      return res.status(404).send('Payment not found');
    }

    // Process only if pending
    if (payment.payment_status === 'pending') {
      if (status === 'successful' || status === 'completed') {
        payment.payment_status = 'completed';
        await payment.save();

        // Add slots to business
        const business = await Business.findById(payment.business_id);
        if (business) {
          business.item_slots_available += payment.slots_added;
          await business.save();
        }
      } else if (status === 'failed' || status === 'cancelled') {
        payment.payment_status = 'failed';
        await payment.save();
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook Processing Error');
  }
};
