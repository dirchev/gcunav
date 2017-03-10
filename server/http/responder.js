module.exports = function (app) {
  // default not found handler
  app.use(function (req, res, next) {
    if (res.body) {
      res.send(res.body)
    } else {
      res.status(404).end()
    }
  })
}
