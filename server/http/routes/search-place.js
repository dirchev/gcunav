var Place = require('../../models/place.js')

module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        // get the text parameter
        var text = req.query.text || ''

        // get places by search text
        var places = Place.search(text)

        // choose the view and pass data
        res.view = 'search-place'
        res.viewData = {places: places, searchText: text}

        // go to the next handler
        next()
      }
    ]
  }
}
