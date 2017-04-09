var _ = require('lodash')
var connection = require('./connection')

module.exports = {
  getAll: function (next) {
    connection.query('SELECT * FROM rooms', next)
  },
  getById: function (room_id, next) {
    connection.query('SELECT * FROM rooms WHERE room_id = ?', room_id, next)
  },
  getByIdPopulated: function (room_id, next) {
    connection.query(
      `
        SELECT
          rooms.*,
          buildings.building_id,
          floors.floor_id,
          buildings.name as building_name,
          floors.name as floor_name
        FROM rooms
        INNER JOIN floors ON floors.floor_id = rooms.floor_id
        INNER JOIN buildings ON floors.building_id = buildings.building_id
        WHERE room_id = ?
      `,
      room_id,
      function (err, found) {
        if (err) return next(err)
        return next(null, found[0])
      }
    )
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
  },
  getFeatured: function (next) {
    connection.query('SELECT * FROM rooms WHERE picture_url IS NOT NULL', next)
  }
}
