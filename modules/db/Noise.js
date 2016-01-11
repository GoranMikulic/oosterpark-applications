var Utils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection();

module.exports = {
  queryDeivcesInPeriod: function(startDate, endDate, fn) {
      var query = "SELECT * FROM lora_decibel WHERE timestamp > ? && timestamp < ?";
      var params = [startDate, endDate];

      query = mysql.format(query,params);
      connection.query(query,function(err, rows, fields){
        fn(rows);
      });
  },
}
