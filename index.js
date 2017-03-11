var path = require('path')
var express = require('express')
var app = express()

require('./lib/loadRoutes')(app, path.join(process.cwd(), '/server/http'), function () {
  var port = process.env.PORT || 3000
  var ip = process.env.IP || '127.0.0.1'
  app.listen(port, ip, function () {
    console.log('Example app listening on port 3000!')
  })
})

