var _ = require('lodash')
var connection = require('./connection')

module.exports = {
  getAll: function (next) {
    connection.query('SELECT * FROM buildings', next)
  },
  getById: function (building_id, next) {
    connection.query('SELECT * FROM buildings WHERE building_id = ?', building_id, next)
  },
  getByFloorId: function (floor_id, next) {
    connection.query(
      `
        SELECT buildings.* FROM buildings
          INNER JOIN floors ON buildings.building_id = floors.building_id
          WHERE floors.floor_id = ?
      `,
      floor_id,
      next
    )
  },
  getByRoomId: function (room_id, next) {
    connection.query(
      `
        SELECT buildings.* FROM buildings
          INNER JOIN floors ON buildings.building_id = floors.building_id
          INNER JOIN rooms ON floors.floor_id = rooms.floor_id
          WHERE rooms.room_id = ?
      `,
      room_id,
      next
    )
  },
  insert: function (building, next) {
    connection.query('INSERT INTO buildings SET ?', building, next)
  },
  update: function (building, next) {
    connection.query(
      'UPDATE buildings SET ? WHERE building_id = ?',
      [_.omit(building, 'building_id'), building.building_id],
      next
    )
  },
  deleteById: function (building_id, next) {
    connection.query('DELETE FROM buildings WHERE building_id = ?', building_id, next)
  },
  getFeatured: function (next) {
    connection.query('SELECT * FROM buildings WHERE picture_url IS NOT NULL', next)
  }
}
