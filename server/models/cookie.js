var _ = require('lodash')
var connection = require('./connection')
var uuid = require('node-uuid')

module.exports = {
  createForUser: function (user_id, next) {
    var cookieData = {
      user_id: user_id,
      hash: uuid.v4()
    }
    connection.query('INSERT INTO cookies SET ?', cookieData, function (err) {
      if (err) return next(err)
      connection.query('SELECT * FROM cookies WHERE hash = ?', cookieData.hash, next)
    })
  },
  getUser: function (cookieHash, next) {
    var cookieData = {
      user_id: user_id,
      hash: uuid.v4()
    }
    connection.query(
      `
        SELECT * FROM cookies
        INNER JOIN users ON cookies.user_id = users.user_id
        WHERE cookies.hash = ?
      `,
      cookieHash,
      next
    )
  }
}
