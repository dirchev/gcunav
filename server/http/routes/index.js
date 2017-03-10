module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        res.body = `
          <div>
            <h1>That works</h1>
          </div>
          <a href="/home">Home</a>
        `
        next()
      }
    ]
  }
}
