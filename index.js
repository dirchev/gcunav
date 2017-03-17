var bodyParser = require('body-parser')
var path = require('path')
var express = require('express')
var port = process.env.PORT || 3000
var ip = process.env.IP

// init the app
var app = express()

// body parser
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// set view engine
app.set('view engine', 'ejs')
// specify where the ejs views are
app.set('views', './client/views')

// set the public folder
app.use(express.static('public'))

// load API routes
require('./lib/loadRoutes')(app, path.join(process.cwd(), '/server/http'), function () {
  // start the server
  app.listen(port, ip, function () {
    console.log('App runnin on port ' + port)
  })
})

