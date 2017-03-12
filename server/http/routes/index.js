module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        res.view = 'home'
        res.viewData = {
          events: [
            {
              id: 1,
              name: 'Graduation Fair'
            },
            {
              id: 2,
              name: 'Gaming Fair'
            },
            {
              id: 3,
              name: 'Some Other Fair'
            }
          ]
        }
        next()
      }
    ]
  }
}
