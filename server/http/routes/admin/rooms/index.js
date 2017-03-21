var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room')

module.exports = function (helpers) {
  return {
    'POST /': [
      helpers.allowAdmin,
      function (req, res, next) {
        Room.insert(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/floors/' + req.body.floor_id + '/')
        })
      }
    ]
  }
}
