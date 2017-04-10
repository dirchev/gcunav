var $require = require(process.cwd() + '/lib/require')
var qr = require('qrcode')
var endpoint = $require('secret/endpoint.json').endpoint

module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        var link = endpoint + '/room/' + req.params.room_id
        qr.toFileStream(res, link, function (err, url) {
          if (err) return next(err)
        })
      }
    ]
  }
}
