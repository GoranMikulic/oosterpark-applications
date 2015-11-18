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
  ** Returns all Wifi-Devices
  */
  getWifiDevices: function(req, res) {
    connection.query("SELECT * from piwifi",function(err, rows, fields){
      returnResult(res, rows);
    });

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

  },

  /**
  * Returns all Wifi-Devices captured in that period
  */
  getWifiDevicesInPeriod: function(req, res) {
    var query = "SELECT * FROM piwifi WHERE first_time_seen > DATE(FROM_UNIXTIME(?)) && first_time_seen < DATE(FROM_UNIXTIME(?))";
    var params = [req.params.start_time, req.params.end_time];
    query = mysql.format(query,params);

    connection.query(query,function(err, rows, fields){
      returnResult(res, rows);
    });

  }

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
