const express = require('express')
const router = express.Router()
const controller = require('../controllers/itemController')

router.get('/', controller.listItems)
router.post('/', controller.createItem)

module.exports = router
