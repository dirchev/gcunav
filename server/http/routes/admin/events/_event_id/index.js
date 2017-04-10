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

  var loadEvent = function (req, res, next) {
    Event.getById(req.params.event_id, function (err, events) {
      if (err) return next(err)
      req.event = events[0]
      next()
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      loadBuildingsWithRooms,
      loadEvent,
      function (req, res, next) {
        res.viewData = {
          buildings: req.buildings,
          event: req.event
        }
        res.view = 'admin/event'
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
        req.body.event_id = req.params.event_id
        Event.update(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/events/' + req.params.event_id)
        })
      }
    ],
    'POST /delete': [
      helpers.allowAdmin,
      function (req, res, next) {
        Event.deleteById(req.params.event_id, function (err) {
          if (err) return next(err)
          res.redirect('/admin/events')
        })
      }
    ],
  }
}
