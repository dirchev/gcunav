var $require = require(process.cwd() + '/lib/require')
var Floor = $require('server/models/floor')

module.exports = function (helpers) {
  return {
    'POST /': [
      helpers.allowAdmin,
      function (req, res, next) {
        Floor.insert(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings/' + req.body.building_id + '/')
        })
      }
    ]
  }
}
