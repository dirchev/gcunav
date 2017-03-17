var $require = require(process.cwd() + '/lib/require')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  return {
    'GET /': [
      helpers.allowAdmin,
      function (req, res, next) {
        Building.getAll(function (err, results, fields) {
          if (err) return next(err)
          res.viewData = {buildings: results}
          res.view = 'admin/buildings'
          next()
        })
      }
    ],
    'POST /': [
      helpers.allowAdmin,
      function (req, res, next) {
        Building.insert(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings')
        })
      }
    ]
  }
}
