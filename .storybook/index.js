const express = require('express')
const expressMiddleware = require('./middleware')

const app = express()
expressMiddleware(app)

app.use(express.static('./storybook-static'))
app.listen('6006', () => {
  console.log('storybook server started at 6006')
})
