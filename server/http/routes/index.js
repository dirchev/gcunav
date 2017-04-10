var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room')
var Building = $require('server/models/building')
var Event = $require('server/models/event')

module.exports = function (helpers) {
  var getFeaturedEvents = function (req, res, next) {
    Event.getForToday(function (err, events) {
      if (err) return next(err)
      req.featuredEvents = events
      next()
    })
  }

  var getFeaturedRooms = function (req, res, next) {
    Room.getFeatured(function (err, rooms) {
      if (err) return next(err)
      req.featuredRooms = rooms
      next()
    })
  }

  var getFeaturedBuildings = function (req, res, next) {
    Building.getFeatured(function (err, buildings) {
      if (err) return next(err)
      req.featuredBuildings = buildings
      next()
    })
  }
  return {
    'GET /': [
      getFeaturedRooms,
      getFeaturedBuildings,
      getFeaturedEvents,
      function (req, res, next) {
        res.viewData = {
          featuredEvents: req.featuredEvents,
          featuredRooms: req.featuredRooms,
          featuredBuildings: req.featuredBuildings,
        }
        res.view = 'home'
        next()
      }
    ]
  }
}
