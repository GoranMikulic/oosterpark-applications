var MyUtils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection();

module.exports = {

  queryAllDevices: function(fn) {
    connection.query("SELECT * from piwifi", function(err, rows, fields) {
      fn(rows);
    });
  },
  queryDeivcesInPeriod: function(startDate, endDate, fn) {
    var query = "SELECT * FROM piwifi WHERE first_time_seen > ? && first_time_seen < ?";

    var params = [startDate, endDate];
    query = mysql.format(query, params);
    connection.query(query, function(err, rows, fields) {
      fn(rows);
    });
  },
  /**
   * Returns Wifi-Devices with the given ID
   */
  getWifiDeviceById: function(id, fn) {
    var query = "SELECT * FROM piwifi WHERE id=?";
    query = mysql.format(query, id);

    connection.query(query, function(err, rows, fields) {
      fn(rows);
    });


  },

  insertDevice: function(address, firstTime, lastTime, power) {
    var query = "INSERT INTO piwifi (address, first_time_seen, last_time_seen, power) VALUES (?,?,?,?)";
    var params = [address, firstTime, lastTime, power];
    query = mysql.format(query, params);
    connection.query(query);
  }
}
