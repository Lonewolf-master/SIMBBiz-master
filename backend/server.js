const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const routes = require('./routes/itemRoutes')
const setupSwagger = require('./swagger')
const config = require('./config')
const logger = require('./utils/logger')

const apiRoutes = require('./routes/index')

const app = express()
app.use(cors({
  origin: true, // Allow any origin in dev (or specify front-end URL)
  credentials: true
}))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/api/ping', (req, res) => res.json({ pong: true }))

app.use('/api', apiRoutes)

setupSwagger(app)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Mongo connection error', err.message))

const PORT = config.PORT
app.listen(PORT, () => logger.info(`Backend listening on ${PORT}`))
