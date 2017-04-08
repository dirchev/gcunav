var $require = require(process.cwd() + '/lib/require')
var Room = $require('server/models/room')
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads' })

module.exports = function (helpers) {
  return {
    'POST /': [
      helpers.allowAdmin,
      upload.single('picture'),
      function (req, res, next) {
        if (req.file) {
          req.body.picture_url = req.file.path.substring('public'.length)
        }
        Room.insert(req.body, function (err) {
          if (err) return next(err)
          res.redirect('/admin/floors/' + req.body.floor_id + '/')
        })
      }
    ]
  }
}
