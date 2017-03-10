module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        res.body = `
          <div>
            <h1>Home</h1>
          </div>
          <a href="/">Back</a>
        `
        next()
      }
    ]
  }
}
