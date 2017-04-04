var $require = require(process.cwd() + '/lib/require')
var User = $require('server/models/user.js')
var Cookie = $require('server/models/cookie.js')

module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        res.clearCookie('user')
        res.redirect('/')
      }
    ]
  }
}
