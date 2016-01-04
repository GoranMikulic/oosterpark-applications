var Utils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection();

module.exports = {
  queryAllDevices: function(fn) {
    connection.query("SELECT * from beacon_sense",function(err, rows, fields){
      fn(rows);
    });
  },
  queryDeivcesInPeriod: function(startDate, endDate, fn) {
      var query = "SELECT * FROM beacon_sense WHERE Time > ? && Time < ?";
      var params = [startDate, endDate];

      query = mysql.format(query,params);
      connection.query(query,function(err, rows, fields){
        fn(rows);
      });
  },
}
