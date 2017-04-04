var $require = require(process.cwd() + '/lib/require')
var User = $require('server/models/user.js')

module.exports = function (helpers) {
  return {
    'POST /': [
      function (req, res, next) {
        var userData = req.body
        User.insert(userData, function (err, result) {
          res.user = result
          next()
        })
      },
      function (req, res, next) {
        res.redirect('/')
      }
    ]
  }
}
