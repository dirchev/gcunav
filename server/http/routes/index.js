module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        res.view = 'home'
        next()
      }
    ]
  }
}
