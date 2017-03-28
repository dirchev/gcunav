var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room')
var Building = $require('server/models/building')
var Floor = $require('server/models/floor')

module.exports = function (helpers) {
  var getRoom = function (req, res, next) {
    var room_id = req.params.room_id
    Room.getById(room_id, function (err, results) {
      if (err) return next(err)
      req.room = results[0]
      next()
    })
  }

  var getBuilding = function (req, res, next) {
    var room_id = req.params.room_id
    Building.getByRoomId(room_id, function (err, results) {
      if (err) return next(err)
      req.building = results[0]
      next()
    })
  }

  var getFloor = function (req, res, next) {
    var room_id = req.params.room_id
    Floor.getByRoomId(room_id, function (err, results) {
      if (err) return next(err)
      req.floor = results[0]
      next()
    })
  }
  return {
    'GET /:room_id': [
      getRoom,
      getBuilding,
      getFloor,
      function (req, res, next) {
        res.viewData = {
          room: req.room,
          floor: req.floor,
          building: req.building
        }
        res.view = 'room'
        next()
      }
    ]
  }
}
