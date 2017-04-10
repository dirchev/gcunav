var $require = require(process.cwd() + '/lib/require')
var Event = $require('server/models/event')

module.exports = function (helpers) {
  var getEvents = function (req, res, next) {
    Event.getAllPublicUpcomming(function (err, events) {
      if (err) return next(err)
      req.allEvents = events
      next()
    })
  }

  var getUpcomingEvents = function (req, res, next) {
    Event.getForToday(function (err, events) {
      if (err) return next(err)
      req.upcomingEvents = events
      next()
    })
  }

  return {
    'GET /': [
      getEvents,
      getUpcomingEvents,
      function (req, res, next) {
        res.viewData = {
          allEvents: req.allEvents,
          upcomingEvents: req.upcomingEvents
        }
        res.view = 'events'
        next()
      }
    ]
  }
}
