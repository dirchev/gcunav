var async = require('async')

var multer  = require('multer')
var upload = multer({ dest: 'public/uploads' })

var $require = require(process.cwd() + '/lib/require')
var Building = $require('server/models/building')
var Room = $require('server/models/room')
var Event = $require('server/models/event')

module.exports = function (helpers) {
  var loadBuildingsWithRooms = function (req, res, next) {
    Building.getAll(function (err, buildings) {
      if (err) return next(err)
      async.mapSeries(
        buildings,
        populateWithRooms,
        function (err, buildings) {
          if (err) return next(err)
          req.buildings = buildings
          next()
        }
      )
    })
  }

  var populateWithRooms = function (building, next) {
    Room.getByBuildingId(building.building_id, function (err, rooms) {
      if (err) return next(err)
      building.rooms = rooms
      next(null, building)
    })
  }

  var loadAllEvents = function (req, res, next) {
    Event.getAllPublic(function (err, events) {
      if (err) return next(err)
      req.events = events
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadBuildingsWithRooms,
      loadAllEvents,
      function (req, res, next) {
        res.viewData = {
          buildings: req.buildings,
          events: req.events
        }
        res.view = 'admin/events'
        next()
      }
    ],
    'POST /': [
      helpers.allowAdmin,
      upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'poster', maxCount: 1 }
      ]),
      function (req, res, next) {
        if (req.files.thumbnail) {
          req.body.thumbnail_url = req.files.thumbnail[0].path.substring('public'.length)
        }
        if (req.files.poster) {
          req.body.poster_url = req.files.poster[0].path.substring('public'.length)
        }
        Event.insert(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/events')
        })
      }
    ]
  }
}
