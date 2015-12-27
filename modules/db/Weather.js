var Utils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection();

module.exports = {
  saveWeatherInfo: function(weatherData) {

    var query = connection.query('INSERT INTO weatherchart SET ?', weatherData, function(err, result){
      if(!err) {
          console.log("Inserted weather data for " + weatherData.date);
      }
    });

  },

  getWeatherForPeriod: function(startDate, endDate, fn) {
    var query = "SELECT * FROM weatherchart WHERE date > ? && date < ?";
    var params = [startDate, endDate];
    query = mysql.format(query, params);
    connection.query(query, function(err, rows, fields) {
      fn(rows);
    });
  }

}
