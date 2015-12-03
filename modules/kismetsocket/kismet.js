var net = require('net');
var config = require('./config.js');
var WifiDeviceController = require('../controllers/WifiDeviceController');

module.exports = {
  connect: function(io) {
    connect();

    var devices = new Array();

    setInterval(function() {
      WifiDeviceController.saveWifiDevices(devices);
      devices = new Array();
    }, 600000);

    setInterval(function() {
      console.log(devices.length);
    }, 1000);

    setTimeout(function() {
      devices = new Array();
    }, 600);

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
        'bssid', 'mac', 'type', 'firsttime', 'lasttime', 'signal_dbm'
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

              io.sockets.emit('kismessage', message);
              checkAndAdd(message);
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

    function checkAndAdd(message) {
      var fd = new Date(message['firsttime'] * 1000);
      var ld = new Date(message['lasttime'] * 1000);

      var device = new WifiDevice(message['bssid'], message['mac'], fd, ld, message['signal_dbm']);
      var found = devices.some(function(el) {
        return el.mac === device.mac;
      });
      if (!found) {
        devices.push(device);
      }
    }

    function WifiDevice(bssid, mac, firsttime, lasttime, signal_dbm) {
      this.bssid = bssid;
      this.mac = mac;
      this.firsttime = firsttime;
      this.lasttime = lasttime;
      this.signal_dbm = signal_dbm;
    }
  }
}
