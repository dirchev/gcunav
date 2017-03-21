var _ = require('lodash')
var connection = require('./connection')

module.exports = {
  getAll: function (next) {
    connection.query('SELECT * FROM rooms', next)
  },
  getById: function (room_id, next) {
    connection.query('SELECT * FROM rooms WHERE room_id = ?', room_id, next)
  },
  getByFloorId: function (floor_id, next) {
    connection.query('SELECT * FROM rooms WHERE floor_id = ?', floor_id, next)
  },
  insert: function (room, next) {
    connection.query('INSERT INTO rooms SET ?', room, next)
  },
  update: function (room, next) {
    connection.query(
      'UPDATE rooms SET ? WHERE room_id = ?',
      [_.omit(room, 'room_id'), room.room_id],
      next
    )
  },
  deleteById: function (room_id, next) {
    connection.query('DELETE FROM rooms WHERE room_id = ?', room_id, next)
  },
  search: function (text, next) {
    if (text) {
      text = '%' + text + '%'
      connection.query('SELECT * FROM rooms WHERE name LIKE ?', text, next)
    } else {
      this.getAll(next)
    }
  }
}
