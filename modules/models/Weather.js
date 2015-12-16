var Utils = require('../utils/Utils');
var mysql = require('mysql');
var connection = require('../utils/MySql').connection();

module.exports = {
  saveWeatherInfo: function(weatherData) {
    console.log("WD " + weatherData);
    var query = connection.query('INSERT INTO weatherchart SET ?', weatherData, function(err, result){
      console.log("Inserted " + err);
    });

    console.log(query.sql);
  }
}
