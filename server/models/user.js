var _ = require('lodash')
var bcrypt = require('bcrypt')
var connection = require('./connection')
var $require = require(process.cwd() + '/lib/require')

module.exports = {
  getById: function (user_id, next) {
    connection.query('SELECT * FROM users WHERE user_id = ?', user_id, next)
  },
  getByCredentials(credentials, next) {
    connection.query('SELECT * FROM users WHERE email = ?', credentials.email, function (err, users) {
      if (err) return next(err)
      var user = users[0]
      if (user && comparePass(credentials.password, user.password)) {
        return next(null, user)
      } else {
        return next()
      }
    })
  },
  insert: function (user, next) {
    user.password = hashPass(user.password)
    connection.query('INSERT INTO users SET ?', user, next)
  },
  getByCookieHash: function (cookieHash, next) {
    connection.query(
      `
        SELECT users.*
        FROM users
          INNER JOIN cookies ON users.user_id = cookies.user_id
        WHERE cookies.hash = ?
      `,
      cookieHash, next)
  },
}

var hashPass = function (pass) {
  return bcrypt.hashSync(pass, 10)
}

var comparePass = function (pass, hashedPass) {

  return bcrypt.compareSync(pass, hashedPass)
}
