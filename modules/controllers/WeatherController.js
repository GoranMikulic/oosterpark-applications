var http = require('http');
var Weather = require('../models/Weather.js');

var apiKey = "5dab73ac8dee23d02aed003ea8b37bf3";

var options = {
  host: "api.openweathermap.org",
  path: "/data/2.5/forecast?q=Amsterdam,nll&units=metric&APPID=" + apiKey
}

var callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {

    var weather = JSON.parse(str);
    parseWeatherInfo(weather.list);
  });
}

function parseWeatherInfo(weatherArray) {
  for(var i = 0; i < weatherArray.length; i++) {
    var wInfo = weatherArray[i];
    var weatherElementInfo = parseWeatherElement(wInfo);

    var tomorrow = new Date().getDate()+1;
    if(weatherElementInfo.date.getDate() == tomorrow) {
        Weather.saveWeatherInfo(weatherElementInfo);
    }
  }

}

function parseWeatherElement(weatherElement) {

  var date = new Date(weatherElement.dt*1000);
  var temp = weatherElement.main.temp;
  var windspeed = weatherElement.wind.speed;
  var rain = weatherElement.rain["3h"];

  var weatherInfo = {
    id: 0,
    date: date,
    temp: temp,
    windspeed: windspeed,
    rain: rain
  }

  return weatherInfo;
}

module.exports = {
  fetchWeatherData: function() {
    http.request(options, callback).end();
  },

}
