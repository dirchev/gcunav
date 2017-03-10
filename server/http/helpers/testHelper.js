module.exports = function (req, res, next) {
  console.log('test helper visited')
  next()
}
