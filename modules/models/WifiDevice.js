var mysql   = require('mysql');
var connection = mysql.createConnection({
    host     : 'oege.ie.hva.nl',
    user     : 'serdijj001',
    password : 'N75gUB9lki0wcM',
    database : 'zserdijj001'
});
var wifiDevices = "Wifi-Devices";

module.exports = {

  /**
  * Returns all Wifi-Devices
  * If a period is set, it returns all devices between the dates
  */
  getWifiDevices: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = checkPeriodQuery(startDate, endDate);

    if(!isValidPeriodQuery) {
      queryAllDevices(function(rows){
          returnResult(res, rows)
      });
    } else {
      queryDeivcesInPeriod(startDate, endDate, function(rows){
          returnResult(res, rows);
      });
    }

  },

  /**
  *  Returns the amount of devices for every day in the given period
  */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = checkPeriodQuery(startDate, endDate);

    if(isValidPeriodQuery) {
      queryDeivcesInPeriod(startDate, endDate, function(rows){

        var dateArray = getDatesBetween(new Date(startDate), new Date(endDate));
        var result = new Array();

        for(var date in dateArray) {

          var day = dateArray[date].getUTCDate();
          var counter = 0;


          for(var row in rows) {
            var dayCaptured = rows[row]['first_time_seen'].getUTCDate();

            if(dayCaptured == day) {
              counter++;
            }

          }
          result.push({date: dateArray[date], count: counter});
        }

        returnResult(res, result);
      });
    } else {
      returnResult(res, {});
    }

  },

  /**
  * Returns Wifi-Devices with the given ID
  */
  getWifiDeviceById: function(req, res) {
    var query = "SELECT * FROM piwifi WHERE id=?";
    query = mysql.format(query,req.params.device_id);

    connection.query(query,function(err, rows, fields){
      returnResult(res, rows);
    });

  }
}

function queryAllDevices(fn) {
  connection.query("SELECT * from piwifi",function(err, rows, fields){
    fn(rows);
  });
}

function queryDeivcesInPeriod(startDate, endDate, fn) {
    var query = "SELECT * FROM piwifi WHERE first_time_seen > ? && first_time_seen < ? GROUP BY address";

    var params = [startDate, endDate];
    query = mysql.format(query,params);
    
    connection.query(query,function(err, rows, fields){
      fn(rows);
    });
}

function getDatesBetween(d1, d2){
  var oneDay = 24*3600*1000;
  for (var d=[],ms=d1*1,last=d2*1;ms<last;ms+=oneDay){
    d.push( new Date(ms) );
  }
  return d;
}


/*
* Returning DB result as JSON Object
*/
function returnResult(res, rows) {
  var data = {};
  data["error"] = 1;
  data[wifiDevices] = "";

  if(rows.length != 0){
      data["error"] = 0;
      data[wifiDevices] = rows;
      res.json(data);
  }else{
      data["Devices"] = 'No devices Found..';
      res.json(data);
  }
}

function checkPeriodQuery(startDate, endDate) {
  return typeof startDate !== 'undefined'
  && typeof endDate !== 'undefined';
}

Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

function getDatesBetween(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate)
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}
