var mysql = require('mysql');
var connection;

exports.connection = function() {

  if(connection == null) {
    connection = mysql.createConnection({
        host     : 'oege.ie.hva.nl',
        user     : 'serdijj001',
        password : 'N75gUB9lki0wcM',
        database : 'zserdijj001'
    });
  }

  return connection;

}
