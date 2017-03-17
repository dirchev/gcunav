var $require = require(process.cwd() + '/lib/require')
var Floor = $require('server/models/floor')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  var loadBuilding = function (req, res, next) {
    if (!req.params.floor_id) return next()
    Building.getByFloorId(req.params.floor_id, function (err, result) {
      if (err) return next(err)
      req.building = result[0]
      next()
    })
  }

  return {
    'POST /update': [
      helpers.allowAdmin,
      function (req, res, next) {
        console.log(req.body)
        Floor.update(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/floors/' + req.params.floor_id)
        })
      }
    ],
    'POST /delete': [
      helpers.allowAdmin,
      loadBuilding,
      function (req, res, next) {
        Floor.deleteById(req.params.floor_id, function (err) {
          if (err) return next(err)
          res.redirect('/admin/buildings/' + req.building.building_id)
        })
      }
    ]
  }
}
