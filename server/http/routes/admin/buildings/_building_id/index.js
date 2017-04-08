var $require = require(process.cwd() + '/lib/require')
var Building = $require('server/models/building')
var Floor = $require('server/models/floor')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads' })

module.exports = function (helpers) {
  var loadBuilding = function (req, res, next) {
    if (!req.params.building_id) return next()
    Building.getById(req.params.building_id, function (err, result) {
      if (err) return next(err)
      req.building = result[0]
      next()
    })
  }

  var loadBuildingFloors = function (req, res, next) {
    if (!req.params.building_id) return next()
    Floor.getByBuildingId(req.params.building_id, function (err, result) {
      if (err) return next(err)
      req.floors = result
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadBuilding,
      loadBuildingFloors,
      function (req, res, next) {
        res.viewData = {building: req.building, floors: req.floors}
        res.view = 'admin/building'
        next()
      }
    ],
    'POST /update': [
      helpers.allowAdmin,
      upload.single('picture'),
      function (req, res, next) {
        if (req.file) {
          req.body.picture_url = req.file.path.substring('public'.length)
        }
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
