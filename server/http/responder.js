module.exports = function (app) {
  // default not found handler
  app.use(function (req, res, next) {
    if (res.body) {
      res.send(res.body)
    } else if (res.view) {
      res.render(res.view, res.viewData)
    } else {
      res.status(404).end()
    }
  })
}
