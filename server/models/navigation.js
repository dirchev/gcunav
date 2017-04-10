var async = require('async')

var Room = require('./room')
var FloorLink = require('./floor-link')
var Floor = require('./floor')
var Building = require('./building')

module.exports = function (room1, room2, next) {
  getRawSteps(room1, room2, function (err, steps) {
    if (err) return next(err)

    async.mapSeries(steps, populateStep, function (err, steps) {
      if (err) return next(err)
      steps = steps.map(stepToHuman)
      return next(null, steps)
    })
  })
}

var stepToHuman = function (step) {
  var text = ''
  if (step.action === 'floor') {
    text = 'Go to ' + step.to.floor_name + ' floor in ' + step.to.building_name + '.'
  } else if (step.action === 'room') {
    text = 'Go to ' + step.to.name + '.'
  } else if (step.action === 'building') {
    text = 'Go to ' + step.to.name + ' building.'
  }
  step.text = text
  return step
}

var populateStep = function (step, next) {
  if (step.action === 'floor' && step.from) {
    Floor.getByIdPopulated(step.from, function (err, floors) {
      if (err) return next(err)
      step.from = floors[0]
      Floor.getByIdPopulated(step.to, function (err, floors) {
        if (err) return next(err)
        step.to = floors[0]
        next(null, step)
      })
    })
  } else if (step.action === 'floor' && !step.from) {
    Floor.getByIdPopulated(step.to, function (err, floors) {
      if (err) return next(err)
      step.to = floors[0]
      next(null, step)
    })
  } else if (step.action === 'room') {
    Room.getById(step.to, function (err, rooms) {
      if (err) return next(err)
      step.to = rooms[0]
      next(null, step)
    })
  } else if (step.action === 'building') {
    Building.getById(step.from, function (err, buildings) {
      if (err) return next(err)
      step.from = buildings[0]
      Building.getById(step.to, function (err, buildings) {
        if (err) return next(err)
        step.to = buildings[0]
        next(null, step)
      })
    })
  }
}

var getRawSteps = function (room1, room2, next) {
  var steps = []
  // get populate both rooms with buildings and floors
  populateRooms([room1, room2], function (err, rooms) {
    if (err) return next(err)
    var room1 = rooms[0]
    var room2 = rooms[1]

    if (room1.building_id === room2.building_id) {
      steps.push({
        action: 'floor',
        from: room1.floor_id,
        to: room2.floor_id
      })
      steps.push({
        action: 'room',
        to: room2.room_id
      })
      return next(null, steps)
    } else {
      getBuildingsLink(room1.building_id, room2.building_id, function (err, floorLink) {
        if (err) return next(err)
        if (!floorLink) {
          steps.push({
            action: 'building',
            from: room1.building_id,
            to: room2.building_id
          })
          steps.push({
            action: 'floor',
            to: room2.floor_id
          })
          steps.push({
            action: 'room',
            to: room2.room_id
          })
          return next(null, steps)
        }
        if (floorLink.leftbuilding_id === room1.building_id) {
          var leftFloor = floorLink.left_id
          var rightFloor = floorLink.right_id
        } else {
          var leftFloor = floorLink.right_id
          var rightFloor = floorLink.left_id
        }
        steps.push({
          action: 'floor',
          from: room1.floor_id,
          to: leftFloor
        })
        steps.push({
          action: 'building',
          from: room1.building_id,
          to: room2.building_id
        })
        steps.push({
          action: 'floor',
          from: rightFloor,
          to: room2.floor_id
        })
        steps.push({
          action: 'room',
          to: room2.room_id
        })
        return next(null, steps)
      })
    }
  })
}

var populateRooms = function (rooms, next) {
  async.mapSeries(
    rooms,
    Room.getByIdPopulated,
    next
  )
}

var getBuildingsLink = function (building1, building2, next) {
  FloorLink.getByBuildingIds(building1, building2, function (err, floorLinks) {
    if (err) return next(err)
    return next(null, floorLinks[0])
  })
}
