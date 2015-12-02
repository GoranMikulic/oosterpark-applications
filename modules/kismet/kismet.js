var net = require('net');
var config = require('./config.js');

//var devices = new Array();

module.exports = {
  connect: function(io) {
    connect();

    //setInterval(function(){console.log(devices.length);}, 5000);

    io.on('connection', function(socket) {
      console.log("Web client connected");
      socket.emit('kismetServerConnectionStatus', {
        isConnected: isConnected
      });
      socket.on('disconnect', function() {
        console.log('Web client disconnected');
      });
    });

    var kismetMessages = {
      /*BSSID: [
        'bssid', 'type',
        'llcpackets', 'datapackets', 'cryptpackets',
        'manuf', 'channel', 'firsttime', 'lasttime',
        'atype'

      ],*/
      CLIENT: [
        'bssid', 'mac', 'type', 'firsttime', 'lasttime','signal_dbm'
      ]
    };


    var isConnected = false,
      leftOver = '',
      kismetServerSocket;

    function onConnect() {
      console.log('Kismet Server socket connected');

      var index = 0,
        configString = '';

      setIsConnected(true);

      for (var messageType in kismetMessages) {
        if (kismetMessages.hasOwnProperty(messageType)) {
          configString += '!' + index + ' ENABLE ' + messageType + ' ' + kismetMessages[messageType].join() + '\r\n';
          console.log(configString);
          index++;
        }
      }
      kismetServerSocket.write(configString);
    }


    function onClose() {
      console.log('Kismet Server socket closed');
      setIsConnected(false);
      reconnect();
    }

    function onError(error) {
      console.log('Kismet Server socket error: ' + error.toString());
    }

    function onData(data) {
      var strData = leftOver + data.toString(),
        lines = strData.split('\n'),
        type = '',
        matches = [],
        message = {},
        messageType = '',
        messageValues = [];

      leftOver = lines.pop();
      lines.forEach(function(line) {
        //console.log(line);
        matches = line.match(/\*([A-Z]+):(.*)/);

        if (matches !== null) {
          try {
            messageType = matches[1];
            if (kismetMessages.hasOwnProperty(messageType)) {
              messageValues = matches[2].trim().split(' ');

              message = {};
              var index = 0;
              kismetMessages[messageType].forEach(function(fieldName) {
                message[fieldName] = messageValues[index];
                index++;
              });

              //devices.push(message);
              //devices.pushIfNotExist(message, function(e) {
              //    return e.bssid === message.bssid && e.bssid === message.bssid;
              //});
              io.sockets.emit('kismessage', message);
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          //io.sockets.emit('log', line);
        }
      });
    }

    function setIsConnected(value) {
      if (isConnected !== value) {
        isConnected = value;
        io.sockets.emit('kismetServerConnectionStatus', {
          isConnected: value
        });
      }
    }

    function connect() {
      kismetServerSocket = net.connect(config.kismetServer.port, config.kismetServer.address);
      kismetServerSocket
        .on('connect', onConnect)
        .on('close', onClose)
        .on('error', onError)
        .on('data', onData);
    }

    function reconnect() {
      kismetServerSocket.destroy();
      console.log('Kismet Server socket: reconnecting in 5 seconds');
      setTimeout(function() {
        console.log('Kismet Server socket: reconnecting');
        connect();
      }, 5000);
    }

    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    Array.prototype.inArray = function(comparer) {
      for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
      }
      return false;
    };

    // adds an element to the array if it does not already exist using a comparer
    // function
    Array.prototype.pushIfNotExist = function(element, comparer) {
      if (!this.inArray(comparer)) {
        this.push(element);
      }
    };

  }
}
