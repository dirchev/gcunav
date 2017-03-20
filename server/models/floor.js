var _ = require('lodash')
var connection = require('./connection')

module.exports = {
  getAll: function (next) {
    connection.query('SELECT * FROM floors', next)
  },
  getById: function (floor_id, next) {
    connection.query('SELECT * FROM floors WHERE floor_id = ?', floor_id, next)
  },
  getByBuildingId: function (building_id, next) {
    connection.query('SELECT * FROM floors WHERE building_id = ?', building_id, next)
  },
  getByRoomId: function (room_id, next) {
    connection.query(
      `
        SELECT floors.* FROM floors
          INNER JOIN rooms ON floors.floor_id = rooms.floor_id
          WHERE rooms.room_id = ?
      `,
      room_id,
      next
    )
  },
  insert: function (floor, next) {
    connection.query('INSERT INTO floors SET ?', floor, next)
  },
  update: function (floor, next) {
    connection.query(
      'UPDATE floors SET ? WHERE floor_id = ?',
      [_.omit(floor, 'floor_id'), floor.floor_id],
      next
    )
  },
  deleteById: function (floor_id, next) {
    connection.query('DELETE FROM floors WHERE floor_id = ?', floor_id, next)
  }
}
