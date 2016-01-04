var devices = "Result";

module.exports = {
  /*
   * Returning DB result as JSON Object
   */
  returnResult: function(res, rows) {
    var data = {};
    data["error"] = 1;
    data[devices] = "";

    if (rows.length != 0) {
      data["error"] = 0;
      data[devices] = rows;
      res.json(data);
    } else {
      data[devices] = 'No devices Found..';
      res.json(data);
    }
  },

  checkPeriodQuery: function(startDate, endDate) {
    return typeof startDate !== 'undefined' && typeof endDate !== 'undefined';
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
  },
}
