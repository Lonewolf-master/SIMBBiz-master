const mongoose = require('mongoose');

const ticketReplySchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  replies: [ticketReplySchema]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
