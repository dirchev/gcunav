var async = require('async')
var $require = require(process.cwd() + '/lib/require')
var FloorLink = $require('server/models/floor-link')
var Floor= $require('server/models/floor')
var Building= $require('server/models/building')

module.exports = function (helpers) {
  var getBuildings = function (req, res, next) {
    Building.getAll(function (err, buildings) {
      if (err) return next(err)
      async.mapSeries(
        buildings,
        populateBuilding,
        function (err, buildings) {
          if (err) return next(err)
          req.buildings = buildings
          next()
        }
      )
    })
  }

  var populateBuilding = function (building, next) {
    Floor.getByBuildingId(building.building_id, function (err, floors) {
      if (err) return next(err)
      building.floors = floors
      next(null, building)
    })
  }

  var populateFloorLink = function (floorLink, next) {
    Floor.getByIdPopulated(floorLink.left_id, function (err, floors) {
      if (err) return next(err)
      floorLink.left = floors[0]
      Floor.getByIdPopulated(floorLink.right_id, function (err, floors) {
        if (err) return next(err)
        floorLink.right = floors[0]
        next(null, floorLink)
      })
    })
  }

  var getLinks = function (req, res, next) {
    FloorLink.getAll(function (err, links) {
      if (err) return next(err)
      async.mapSeries(
        links,
        populateFloorLink,
        function (err, floorLinks) {
          if (err) return next(err)
          req.floorLinks = floorLinks
          next()
        }
      )
    })
  }

  return {
    'GET /': [
      helpers.allowAdmin,
      getLinks,
      getBuildings,
      function (req, res, next) {
        res.viewData = {
          floorLinks: req.floorLinks,
          buildings: req.buildings
        }
        res.view = 'admin/links'
        next()
      }
    ],
    'POST /': [
      helpers.allowAdmin,
      getLinks,
      getBuildings,
      function (req, res, next) {
        FloorLink.insert(req.body, function (err, floorLink) {
          if (err) return next(err)
          res.redirect('/admin/links')
          next()
        })
      }
    ]
  }
}
