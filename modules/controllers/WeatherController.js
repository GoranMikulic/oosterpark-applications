var http = require('http');
var Weather = require('../db/Weather.js');
var Utils = require('../utils/Utils');

var apiKey = "5dab73ac8dee23d02aed003ea8b37bf3";

var options = {
  host: "api.openweathermap.org",
  path: "/data/2.5/forecast?q=Amsterdam,nll&units=metric&APPID=" + apiKey
}

module.exports = {
  fetchWeatherData: function() {
    http.request(options, callback).end();
  },
  getWeatherStatsForPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    var weatherAttribute = req.query.attr;

    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);
    if (isValidPeriodQuery) {

      Weather.getWeatherForPeriod(startDate, endDate, function(queryResult) {

        var dates = new Array();
        dates.push('x');

        var weatherInfo = new Array();
        weatherInfo.push(weatherAttribute);

        var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));

        for (date in datesBetween) {
          dates.push(datesBetween[date]);

          var dateToCompare = new Date(datesBetween[date].setHours(13, 0, 0, 0));
          var weatherAttributeToPush = undefined;

          for (element in queryResult) {
            var winfo = queryResult[element];

            if ((winfo.date.getHours() == 13) && dateToCompare.getTime() === winfo.date.getTime()) {
              weatherAttributeToPush = winfo[weatherAttribute];
            }
          }
          weatherInfo.push(weatherAttributeToPush);
        }

        var result = {
          dates: dates,
          weather: weatherInfo
        }

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  },
  getWeatherForDay: function(req, res) {
    var day = req.query.day;
    var weatherAttribute = req.query.attr;


    var startDate = day + ' 00:01:00';
    var endDate = day + ' 23:59:00';
    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);

    if (isValidPeriodQuery) {

      Weather.getWeatherForPeriod(startDate, endDate, function(queryResult) {

        var dates = new Array();
        dates.push('x');

        var weatherInfo = new Array();
        weatherInfo.push(weatherAttribute);

        var hours = Utils.getClockHours(day);

        for (hour in hours) {
          dates.push(hours[hour]);

          var weatherValueToPush = undefined;

          for(element in queryResult) {
            var winfo = queryResult[element];

            if(winfo.date.getHours() == hours[hour].getHours()) {
              weatherValueToPush = winfo[weatherAttribute];
            }
          }

          weatherInfo.push(weatherValueToPush);

        }

        var result = {
          dates: dates,
          weather: weatherInfo
        }

        Utils.returnResult(res, result);

      });
    } else {
      Utils.returnResult(res, {});
    }
  }

}

var callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function(chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function() {

    var weather = JSON.parse(str);
    parseWeatherInfo(weather.list);
  });
}

function parseWeatherInfo(weatherArray) {
  for (var i = 0; i < weatherArray.length; i++) {
    var wInfo = weatherArray[i];
    var weatherElementInfo = parseWeatherElement(wInfo);

    var tomorrow = new Date().getDate() + 1;
    if (weatherElementInfo.date.getDate() == tomorrow) {
      Weather.saveWeatherInfo(weatherElementInfo);
    }
  }

}

function parseWeatherElement(weatherElement) {

  var date = new Date(weatherElement.dt * 1000);
  var temp = weatherElement.main.temp;
  var windspeed = weatherElement.wind.speed;
  var rain = weatherElement.rain["3h"];
  var humidity = weatherElement.main.humidity;
  var clouds = weatherElement.clouds.all;

  var weatherInfo = {
    id: 0,
    date: date,
    temp: temp,
    windspeed: windspeed,
    rain: rain,
    humidity: humidity,
    clouds: clouds
  }

  return weatherInfo;
}
