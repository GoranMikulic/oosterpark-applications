var devices = "Devices";

module.exports = {
  /*
  * Returning DB result as JSON Object
  */
  returnResult: function(res, rows) {
    var data = {};
    data["error"] = 1;
    data[devices] = "";

    if(rows.length != 0){
        data["error"] = 0;
        data[devices] = rows;
        res.json(data);
    }else{
        data[devices] = 'No devices Found..';
        res.json(data);
    }
  },

  checkPeriodQuery: function(startDate, endDate) {
    return typeof startDate !== 'undefined'
    && typeof endDate !== 'undefined';
  },

  getDatesBetween: function(startDate, stopDate) {
    Date.prototype.addDays = function(days) {
       var dat = new Date(this.valueOf())
       dat.setDate(dat.getDate() + days);
       return dat;
    }

    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate)
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  },

  /**
   * Returns the amounts of devices for a period of days
   */
  getDevicesCountsForTimeRange: function(timeRange, devicesArray, datePropertyName, comparator, dataLabel) {
    //array for date values
    var dates = new Array();
    dates.push('x');
    //array for amount of devices
    var counts = new Array();
    counts.push(dataLabel);

    for (var time in timeRange) {
      var counter = getDevicesCount(timeRange[time], devicesArray, datePropertyName, comparator);
      dates.push(timeRange[time]);
      counts.push(counter);
    }

    return {
      x: dates,
      counts: counts
    };
  },
  /**
   * Returns true if the hour matches
   */
  isHourEqual: function(deviceCaptureTime, timeToCompare) {
    if (deviceCaptureTime.getHours() == timeToCompare.getHours()) {
      return true;
    }
    return false;
  },
  /**
   * Compares true if the day matches
   */
  isDayEqual: function(deviceCaptureTime, timeToCompare) {
    //Set time to 00:00:00 to compare days only
    deviceCaptureTime.setHours(0, 0, 0, 0);
    timeToCompare.setHours(0, 0, 0, 0);

    if (deviceCaptureTime.getTime() == timeToCompare.getTime()) {
      return true;
    }

    return false;
  },
  /**
   * Returns an array of date objects of
   * the given day with hours set from 0 to 23
   */
  getClockHours: function(day) {
    var hours = new Array();
    for (var i = 0; i < 24; i++) {
      var date = new Date(day);
      date.setHours(i);
      date.setMinutes(0, 0, 0);
      hours.push(date);
    }
    return hours;
  }
}

/**
 * Returns amount of devices for a particular date,
 * values are compared with the comparator function
 */
var getDevicesCount = function(time, devicesArray, datePropertyName, comparator) {
  var counter = 0;

  for (var device in devicesArray) {
    var compareResult = comparator(devicesArray[device][datePropertyName], time);
    if (compareResult) {
      counter++;
    }
  }
  return counter;
}
