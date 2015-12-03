var ip;
var port;
module.exports = {

  setServerData: function(sip, sport) {
    ip = sip;
    port = sport;
  },

  getConfigJsonResponse: function(req, res) {
    var data = {};
    data["error"] = 1;
    data["connection"] = {ipaddress: ip, port: port};
      res.json(data);
  }

}
