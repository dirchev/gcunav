var $require = require(process.cwd() + '/lib/require')
var navigation = $require('server/models/navigation')

var Room = $require('server/models/room')

module.exports = function (helpers) {
  var loadStartRoom = function (req, res, next) {
    if (req.query.start) {
      Room.getByIdPopulated(req.query.start, function (err, room) {
        if (err) return next(err)
        req.startPoint = room
        next()
      })
    } else {
      return next()
    }
  }
  var loadEndRoom = function (req, res, next) {
    if (req.query.end) {
      Room.getByIdPopulated(req.query.end, function (err, room) {
        if (err) return next(err)
        req.endPoint = room
        next()
      })
    } else {
      return next()
    }
  }
  return {
    'GET /': [
      loadStartRoom,
      loadEndRoom,
      function (req, res, next) {
        if (!req.query.start && !req.query.end) {
          res.view = 'navigation'
          next()
        } else {
          var room1 = req.query.start
          var room2 = req.query.end

          navigation(room1, room2, function (err, navigationSteps) {
            if (err) return next(err)
            res.viewData = {
              steps: navigationSteps,
              start: req.startPoint,
              end: req.endPoint
            }
            res.view = 'directions'
            next()
          })
        }
      }
    ]
  }
}
