var _ = require('lodash')
var connection = require('./connection')

module.exports = {
  getAllPublic: function (next) {
    connection.query('SELECT * FROM events WHERE user_id IS NULL', next)
  },
  getAllPublicUpcomming: function (next) {
    connection.query(
      `
        SELECT
          events.*,
          rooms.name as room_name,
          rooms.room_id
        FROM events
        INNER JOIN rooms ON rooms.room_id = events.room_id
        WHERE user_id IS NULL AND DATE(datetime) > DATE(NOW())
      `,
      next
    )
  },
  getForToday: function (next) {
    connection.query(
      `
        SELECT
          events.*,
          rooms.name as room_name,
          rooms.room_id
        FROM events
        INNER JOIN rooms ON rooms.room_id = events.room_id
        WHERE user_id IS NULL AND DATE(datetime) = DATE(NOW())
      `,
      next
    )
  },
  getById: function (event_id, next) {
    connection.query(`
      SELECT
        events.*,
        rooms.name as room_name,
        rooms.room_id
      FROM events
      LEFT JOIN rooms ON rooms.room_id = events.room_id
      WHERE event_id = ?`,
      event_id,
      next
    )
  },
  insert: function (event, next) {
    connection.query('INSERT INTO events SET ?', event, next)
  },
  update: function (event, next) {
    connection.query(
      'UPDATE events SET ? WHERE event_id = ?',
      [_.omit(event, 'event_id'), event.event_id],
      next
    )
  },
  deleteById: function (event_id, next) {
    connection.query('DELETE FROM events WHERE event_id = ?', event_id, next)
  }
}
