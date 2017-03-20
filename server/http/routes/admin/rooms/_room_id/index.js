var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room')
var Floor = $require('server/models/floor')
var Building = $require('server/models/building')

module.exports = function (helpers) {
  var loadRoom = function (req, res, next) {
    if (!req.params.room_id) return next()
    Room.getById(req.params.room_id, function (err, result) {
      if (err) return next(err)
      req.room = result[0]
      next()
    })
  }
  var loadFloor = function (req, res, next) {
    if (!req.params.room_id) return next()
    Floor.getByRoomId(req.params.room_id, function (err, result) {
      if (err) return next(err)
      req.floor = result[0]
      next()
    })
  }
  var loadBuilding = function (req, res, next) {
    if (!req.params.room_id) return next()
    Building.getByRoomId(req.params.room_id, function (err, result) {
      if (err) return next(err)
      req.building = result[0]
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadRoom,
      loadFloor,
      loadBuilding,
      function (req, res, next) {
        res.viewData = {
          room: req.room,
          floor: req.floor,
          building: req.building
        }
        res.view = 'admin/room'
        next()
      }
    ],
    'POST /update': [
      helpers.allowAdmin,
      function (req, res, next) {
        Room.update(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/rooms/' + req.params.room_id)
        })
      }
    ],
    'POST /delete': [
      helpers.allowAdmin,
      loadFloor,
      function (req, res, next) {
        Room.deleteById(req.params.room_id, function (err) {
          if (err) return next(err)
          res.redirect('/admin/floors/' + req.floor.floor_id)
        })
      }
    ]
  }
}
