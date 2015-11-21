var Utils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection()

module.exports = {
  queryAllDevices: function(fn) {
    connection.query("SELECT * from beacon_sense",function(err, rows, fields){
      fn(rows);
    });
  }
}
