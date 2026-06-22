const Item = require('../models/Item')

async function listItems(req, res) {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'failed to list items' })
  }
}

async function createItem(req, res) {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const it = new Item({ name })
    await it.save()
    res.status(201).json(it)
  } catch (err) {
    res.status(500).json({ error: 'failed to create item' })
  }
}

module.exports = {
  listItems,
  createItem,
}
