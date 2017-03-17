var mysql = require('mysql')

var mysqlConfig = require('../../secret/mysql.json')

var connection = mysql.createConnection(mysqlConfig)
connection.connect()
// connection.end()

module.exports = connection
