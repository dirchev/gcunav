module.exports = function (helpers) {
  return {
    'GET /': [
      helpers.allowAdmin,
      function (req, res, next) {
        res.view = 'admin/floors'
        next()
      }
    ]
  }
}
