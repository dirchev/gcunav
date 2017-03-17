// dummy list of places
var places = [
  {
    id: 1,
    name: 'George Moore Cafe',
    description: 'Caffeteria which also has meal deals.',
    tags: ['coffee', 'caffeteria', 'meal deal', 'cafe']
  },
  {
    id: 2,
    name: 'George Moore Canteen',
    description: 'The one and only student canteen in GCU. Has options for breakfast and lunch and also offers a great coffee',
    tags: ['coffee', 'caffeteria', 'cafe', 'lunch', 'breakfast', 'canteen']
  },
  {
    id: 3,
    name: 'Saltire Centre Cafe',
    description: 'Caffeteria with option for a quick snack',
    tags: ['coffee', 'caffeteria', 'cafe', 'snack']
  }
]

module.exports = {
  search: function (query) {
    // make the search query lowercase (so the search is case insensitive)
    query = query.toLowerCase()

    // we want to use this query to match either one of the tags, the name or the description
    return places.filter(function (place) {
      // if the query is within the name
      if (place.name.toLowerCase().indexOf(query) !== -1) {
        return true
      }

      // if the query is within the descitption
      if (place.description.toLowerCase().indexOf(query) !== -1) {
        return true
      }

      // if the query is matching one of the tags
      if (place.tags.indexOf(query) !== -1) {
        return true
      }

      return false
    })
  }
}
