const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const swaggerUi = require('swagger-ui-express')

function setupSwagger(app){
  try{
    const specPath = path.join(__dirname, 'swagger.yaml')
    const doc = yaml.load(fs.readFileSync(specPath, 'utf8'))
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc))
  }catch(e){
    console.warn('Could not load swagger spec', e.message)
  }
}

module.exports = setupSwagger
