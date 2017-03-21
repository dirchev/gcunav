var $require = require(process.cwd() + '/lib/require')

var Room = $require('server/models/room')
var Floor = $require('server/models/floor')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  var loadFloor = function (req, res, next) {
    if (!req.params.floor_id) return next()
    Floor.getById(req.params.floor_id, function (err, result) {
      if (err) return next(err)
      req.floor = result[0]
      next()
    })
  }

  var loadBuilding = function (req, res, next) {
    if (!req.params.floor_id) return next()
    Building.getByFloorId(req.params.floor_id, function (err, result) {
      if (err) return next(err)
      req.building = result[0]
      next()
    })
  }

  var loadFloorRooms = function (req, res, next) {
    if (!req.params.floor_id) return next()
    Room.getByFloorId(req.params.floor_id, function (err, result) {
      if (err) return next(err)
      req.rooms = result
      next()
    })
  }


  return {
    'GET /': [
      helpers.allowAdmin,
      loadFloor,
      loadBuilding,
      loadFloorRooms,
      function (req, res, next) {
        res.viewData = {building: req.building, floor: req.floor, rooms: req.rooms}
        res.view = 'admin/floor'
        next()
      }
    ],
    'POST /update': [
      helpers.allowAdmin,
      function (req, res, next) {
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
