var $require = require(process.cwd() + '/lib/require')
var exec = require('child_process').exec

module.exports = function (helpers) {
  return {
    'GET /': [
      function (req, res, next) {
        var text = req.query.text
        var filepath = process.cwd() + '/temp/audio.wav'
        exec('espeak -w ' + filepath + ' "' + text + '"', function (err) {
          if (err) return next(err)
          res.sendFile(filepath)
        })
      }
    ]
  }
}
