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
    
  }
}
