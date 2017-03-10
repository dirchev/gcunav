var path = require('path')
var glob = require('glob-stream')
var sort = require('sort-stream')

var methods = require('methods').map(function(m){
  return m.toUpperCase()
})

var loadHelpers = function(app, folderName, done){
  folderName = folderName || path.join(process.cwd(), '/server/http')

  var helpers = {}
  var routesHelpersRootPath = path.join(folderName, '/helpers')

  console.log(path.join(routesHelpersRootPath, '/**/*.js'))
  // glob for action helpers
  glob.create(path.join(routesHelpersRootPath, '/**/*.js'))
    .on('data', function(file){
      var helperId = file.path.split(routesHelpersRootPath).pop().replace(path.sep,'').replace(/\//g, path.sep)
      var sep = path.sep == '\\' ? '\\\\' : path.sep;
      helperId = helperId.replace(path.extname(file.path), '').replace(new RegExp(sep,'g'), '/')
      helpers[helperId] = require(file.path)
      console.log('loaded helper', helperId, '->',file.path.split(routesHelpersRootPath).pop())
    })
    .on('error', console.error)
    .on('end', function(){
      done(helpers)
    })
}

var loadActions = function(app, folderName, helpers, done) {
  folderName = folderName || path.join(process.cwd(), '/server/http')
  var routesRootPath = path.join(folderName, '/routes')

  // glob for action handlers
  glob
    .create(path.join(routesRootPath, '/**/*.js'))
    .pipe(sort(function (a,b) {
      if (a.path.indexOf('index') !== -1 && b.path.indexOf('index') === -1) return -1
      if (a.path.indexOf('index') === -1 && b.path.indexOf('index') !== -1) return 1
      if (a.path.indexOf('index') !== -1 && b.path.indexOf('index') !== -1) return 0
      if (a.path.indexOf('index') === -1 && b.path.indexOf('index') === -1) return 0
    }))
    .on('data', function (file) {
      var builder = require(file.path)

      if (typeof builder !== 'function') return
      var api = builder(helpers)

      for (var key in api) {
        if (key.indexOf(' ') !== -1 || methods.indexOf(key) !== -1) {
          var method = key.split(' ').shift()
          var url = file.path.split(routesRootPath).pop()
          var sep = path.sep === '\\' ? '\\\\' : path.sep
          url = url.replace(path.extname(file.path), '').replace(new RegExp(sep,'g'), '/')
          if (key.indexOf(' ') !== -1) url += key.split(' ').pop()
          if (url.indexOf('/index') !== -1) url = url.replace('/index', '')
          if (url.indexOf('/_') !== -1) url = url.replace(new RegExp('/_', 'g'), '/:')
          if (url === '') url = '/'
          if (method === '*') app.all(url, api[key])
          else app[method.toLowerCase()](url, api[key])

          console.log('mounted action ', '-', method, '-', url, '->', file.path.split(routesRootPath).pop())
        }
      }
    })
    .on('error', console.error)
    .on('end', function () {
      done()
    })
}

module.exports = function (app, folderName, next) {
  loadHelpers(app, folderName, function (helpers) {
    loadActions(app, folderName, helpers, function () {
      require(path.join(process.cwd(), '/server/http/responder.js'))(app)
      next()
    })
  })
}
