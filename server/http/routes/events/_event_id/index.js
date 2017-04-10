var $require = require(process.cwd() + '/lib/require')
var Event = $require('server/models/event')

module.exports = function (helpers) {
  var getEvent = function (req, res, next) {
    Event.getById(req.params.event_id, function (err, events) {
      if (err) return next(err)
      req.event = events[0]
      next()
    })
  }
  return {
    'GET /': [
      getEvent,
      function (req, res, next) {
        res.viewData = {
          event: req.event
        }
        res.view = 'event'
        next()
      }
    ]
  }
}
