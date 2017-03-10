var path = require('path')
var express = require('express')
var app = express()

require('./lib/loadRoutes')(app, path.join(process.cwd(), '/server/http'), function () {
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })
})

