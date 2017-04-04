var $require = require(process.cwd() + '/lib/require')
var User = $require('server/models/user.js')
var Cookie = $require('server/models/cookie.js')

module.exports = function (helpers) {
  var setCookie = function (req, res, next) {
    Cookie.createForUser(res.user.user_id, function (err, cookie) {
      res.cookie('user', cookie[0].hash)
      next()
    })
  }
  return {
    'POST /': [
      function (req, res, next) {
        User.getByCredentials(req.body, function (err, user) {
          if (err) return next(err)
          res.user = user
          next()
        })
      },
      setCookie,
      function (req, res, next) {
        res.redirect('/')
      }
    ]
  }
}
