var path = require('path')
var auth = require('http-auth')

var basic = auth.basic({
  realm: 'GCU NAVIGATION AUTH',
  file: path.join(process.cwd(), 'secret/user.htpasswd')
})

module.exports = auth.connect(basic)
