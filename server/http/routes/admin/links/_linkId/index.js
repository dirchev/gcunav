var $require = require(process.cwd() + '/lib/require')
var FloorLink = $require('server/models/floor-link')

module.exports = function (helpers) {
  return {
    'POST /delete': [
      helpers.allowAdmin,
      function (req, res, next) {
        FloorLink.deleteById(req.params.linkId, function (err) {
          if (err) return next(err)
          res.redirect('/admin/links')
          next()
        })
      }
    ]
  }
}
