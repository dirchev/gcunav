var $require = require(process.cwd() + '/lib/require')
var User = $require('server/models/user')

module.exports = function (app) {
  // setting logged user data
  app.use(function (req, res, next) {
    var userCookie = req.cookies.user
    if (userCookie) {
      User.getByCookieHash(userCookie, function (err, users) {
        if (err) return next(err)
        if (users.length) {
          res.user = users[0]
          res.viewData = res.viewData || {}
          res.viewData.loggedUser = res.user
        }
        return next()
      })
    } else {
      return next()
    }
  })
  // default not found handler
  app.use(function (req, res, next) {
    if (res.body) {
      res.send(res.body)
    } else if (res.view) {
      res.render(res.view, res.viewData)
    } else {
      res.status(404).end()
    }
  })
}
