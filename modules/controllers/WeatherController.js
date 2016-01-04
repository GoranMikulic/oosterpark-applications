var http = require('http');
var Weather = require('../db/Weather.js');
var Utils = require('../utils/Utils');

var apiKey = "5dab73ac8dee23d02aed003ea8b37bf3";

var options = {
  host: "api.openweathermap.org",
  path: "/data/2.5/forecast?q=Amsterdam,nll&units=metric&APPID=" + apiKey
}

module.exports = {
  /**
   * Requests weather data
   * @param {String - host, String - path} options - API options
   * @param {function} callback - Callback function
   */
  fetchWeatherData: function() {
    http.request(options, weatherApiCallback).end();
  },
  /**
   * Returns time-value-series for the given time-period and weather attribute
   * @param {String} startdate - Start date for period in format yyyy-mm-dd (provided through requst)
   * @param {String} enddate - End date for period in format yyyy-mm-dd (provided through requst)
   * @param {String} attr - Weather attribtue to load (provided through requst)
   * @returns Time-value-series for the given time-period and weather attribute
   */
  getWeatherStatsForPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    var weatherAttribute = req.query.attr;

    if (Utils.checkPeriodQuery(startDate, endDate)) {

      Weather.getWeatherForPeriod(startDate, endDate, function(queryResult) {

        var dates = new Array();
        dates.push('x');

        var weatherInfo = new Array();
        weatherInfo.push(weatherAttribute);

        var weatherStats = getWeatherDataForTimePeriod(startDate, endDate, weatherAttribute, queryResult);
        dates.push.apply(dates, weatherStats.dates);
        weatherInfo.push.apply(weatherInfo, weatherStats.weatherData);

        var result = {
          x: dates,
          counts: weatherInfo
        }

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  },
  /**
   * Returns time-value-series for the given day and weather attribute
   * @param {String} day - Selected day in format yyyy-mm-dd (provided through requst)
   * @param {String} attr - Weather attribtue to load (provided through requst)
   * @returns Time-value-series for the given day and weather attribute
   */
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

          for (element in queryResult) {
            var winfo = queryResult[element];

            if (winfo.date.getHours() == hours[hour].getHours()) {
              weatherValueToPush = winfo[weatherAttribute];
            }
          }

          weatherInfo.push(weatherValueToPush);

        }

        var result = {
          x: dates,
          counts: weatherInfo
        }

        Utils.returnResult(res, result);

      });
    } else {
      Utils.returnResult(res, {});
    }
  }

}

function getWeatherDataForTimePeriod(startDate, endDate, weatherAttribute, queryResult) {
  var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));
  var dates = new Array();
  var weatherData = new Array();

  for (date in datesBetween) {
    //setting hours to 00:00:00 for period data
    dates.push(datesBetween[date].setHours(0, 0, 0, 0));

    var dateToCompare = new Date(datesBetween[date].setHours(13, 0, 0, 0));

    weatherData.push(getWeatherValueForDate(dateToCompare, weatherAttribute, queryResult));
  }

  return {
    dates: dates,
    weatherData: weatherData
  }
}

function getWeatherValueForDate(dateToCompare, weatherAttribute,queryResult) {
  for (element in queryResult) {
    var winfo = queryResult[element];

    if (dateToCompare.getTime() === winfo.date.getTime()) {
      return winfo[weatherAttribute];
    }
  }
  return null;
}

/**
* Callback function for weather response, parses JSON object
*/
var weatherApiCallback = function(response) {
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

/**
* Parses weather result object array from request
* @param {Object[]} object array
*/
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

/**
* Parses one particular weather element
* @param {Object} weather result object
* @returns {weatherInfo} weather info object
*/
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
