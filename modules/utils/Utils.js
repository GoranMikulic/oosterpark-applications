var wifiDevices = "Wifi-Devices";

module.exports = {
  /*
  * Returning DB result as JSON Object
  */
  returnResult: function(res, rows) {
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
  }
}
