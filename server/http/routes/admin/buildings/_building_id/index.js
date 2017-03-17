var $require = require(process.cwd() + '/lib/require')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  var loadBuidlingToEdit = function (req, res, next) {
    if (!req.params.building_id) return next()
    Building.getById(req.params.building_id, function (err, result) {
      if (err) return next(err)
      req.building = result[0]
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadBuidlingToEdit,
      function (req, res, next) {
        res.viewData = {building: req.building}
        res.view = 'admin/buildings/building'
        next()
      }
    ],
    'POST /update': [
      helpers.allowAdmin,
      function (req, res, next) {
        Building.update(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings/' + req.params.building_id + '/')
        })
      }
    ],
    'POST /delete': [
      helpers.allowAdmin,
      function (req, res, next) {
        Building.deleteById(req.params.building_id, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings')
        })
      }
    ]
  }
}
