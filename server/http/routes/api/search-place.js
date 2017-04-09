var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room.js')

module.exports = function (helpers) {
  var getRooms = function (req, res, next) {
    // get the text parameter
    var text = req.query.text

    // get places by search text
    Room.search(text, function (err, results) {
      if (err) return next(err)
      req.rooms = results
      next()
    })
  }
  return {
    'GET /': [
      getRooms,
      function (req, res, next) {
        res.json(req.rooms)
        next()
      }
    ]
  }
}
