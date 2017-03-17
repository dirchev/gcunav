var $require = require(process.cwd() + '/lib/require')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  var loadBuidlingToEdit = function (req, res, next) {
    if (!req.query.building_id) return next()
    Building.getById(req.query.building_id, function (err, result) {
      if (err) return next(err)
      req.buildingToEdit = result[0]
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadBuidlingToEdit,
      function (req, res, next) {
        Building.getAll(function (err, results, fields) {
          if (err) return next(err)
          res.viewData = {buildings: results, buildingToEdit: req.buildingToEdit}
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
    ],
    'POST /update': [
      helpers.allowAdmin,
      function (req, res, next) {
        Building.update(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings')
        })
      }
    ],
    'POST /:building_id/delete': [
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
