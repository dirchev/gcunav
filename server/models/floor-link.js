var connection = require('./connection')

module.exports = {
  getAll: function (next) {
    connection.query(`
        SELECT * FROM floorlinks
    `, next)
  },
  getByFloorId: function (floor_id, next) {
    connection.query('SELECT * FROM floorlinks WHERE left_id = ? OR right_id = ?', [floor_id, floor_id], next)
  },
  getByBuildingIds: function (building1_id, building2_id, next) {
    connection.query(
      `
      SELECT
        floorlinks.*,
        leftbuildings.building_id as leftbuilding_id,
        rightbuildings.building_id as rightbuilding_id
      FROM floorlinks
        INNER JOIN floors leftfloors
          ON leftfloors.floor_id = floorlinks.left_id
        INNER JOIN buildings leftbuildings
          ON leftfloors.building_id = leftbuildings.building_id
        INNER JOIN floors rightfloors
          ON rightfloors.floor_id = floorlinks.right_id
        INNER JOIN buildings rightbuildings
          ON rightfloors.building_id = rightbuildings.building_id
        WHERE
          (leftfloors.building_id = ? AND rightfloors.building_id = ?)
          OR
          (leftfloors.building_id = ? AND rightfloors.building_id = ?)
      `,
			[building1_id, building2_id, building2_id, building1_id],
			next
    )
  },
  insert: function (floorlink, next) {
    connection.query('INSERT INTO floorlinks SET ?', floorlink, next)
  },
  update: function (floorlink, next) {
    connection.query(
      'UPDATE floorlinks SET ? WHERE floorlink_id = ?',
      [_.omit(floorlink, 'floorlink_id'), floorlink.floorlink_id],
      next
    )
  },
  deleteById: function (floorlink_id, next) {
    connection.query('DELETE FROM floorlinks WHERE floorlink_id = ?', floorlink_id, next)
  }
}
