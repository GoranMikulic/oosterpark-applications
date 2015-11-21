var WifiDevice = require('../models/WifiDevice');
var MyUtils = require('../utils/Utils');

module.exports = {

  getWifiDeviceById: function(req, res) {
    WifiDevice.getWifiDeviceById(req.params.device_id, function(rows){
        MyUtils.returnResult(res, rows);
    });
  },

  /**
  * Returns all Wifi-Devices
  * If a period is set, it returns all devices between the dates
  */
  getWifiDevices: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = MyUtils.checkPeriodQuery(startDate, endDate);

    if(!isValidPeriodQuery) {
      WifiDevice.queryAllDevices(function(rows){
          MyUtils.returnResult(res, rows)
      });
    } else {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(rows){
          MyUtils.returnResult(res, rows);
      });
    }

  },
  /**
  *  Returns the amount of devices for every day in the given period
  */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = MyUtils.checkPeriodQuery(startDate, endDate);

    if(isValidPeriodQuery) {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(rows){

        var dateArray = MyUtils.getDatesBetween(new Date(startDate), new Date(endDate));
        //var result = new Array();
        //array for date values
        var dates = new Array();
        dates.push('x');
        //array for amount of devices
        var counts = new Array();
        counts.push('Amount of Wifi-Devices');

        for(var date in dateArray) {

          var day = dateArray[date].getUTCDate();
          var counter = 0;


          for(var row in rows) {
            var dayCaptured = rows[row]['first_time_seen'].getUTCDate();

            if(dayCaptured == day) {
              counter++;
            }

          }
          dates.push(dateArray[date]);
          counts.push(counter);

        }
        var result = {
          x: dates,
          counts: counts
        }


        MyUtils.returnResult(res, result);
      });
    } else {
      MyUtils.returnResult(res, {});
    }

  },
}
