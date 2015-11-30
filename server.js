#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var routes = require('./modules/routes.js');
var http = require('http');
var config = require('./modules/kismet/config.js');
var net = require('net');

/**
 *  Define the sample application.
 */
var App = function() {

  //  Scope.
  var self = this;


  /*  ================================================================  */
  /*  Helper functions.                                                 */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };



  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function() {
    //  Process on exit and signals.
    process.on('exit', function() {
      self.terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  };


  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.app = express();
    //initialize route for REST API
    self.app.use('/', routes);
  };


  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
  };


  /**
   *  Start the server.
   */
  self.start = function() {

    //set public html directory
    self.app.use('/', express.static(__dirname + '/public'));

    //  Start the app on the specific interface (and port).
    //self.app.listen(self.port, self.ipaddress, function() {
    //    console.log('%s: Node server started on %s:%d ...',
    //                Date(Date.now() ), self.ipaddress, self.port);
    //});

    self.httpServer = http.Server(self.app);
    self.httpServer.listen(self.port, function() {
      console.log("server listening on port", self.port);
    });
    self.io = require('socket.io').listen(app.httpServer);

    //self.io.use(sharedsession(session));


  };

};

/**
 *  main():  Main code.
 */
var app = new App();
app.initialize();
app.start();
connect();


var kismetMessages = {
  CLIENT: [
    'bssid', 'mac', 'type', 'firsttime', 'lasttime',
    'manuf'
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
          //console.log(messageValues);
          app.io.sockets.emit('kismessage', messageValues);
          message = {};
          var index = 0;
          kismetMessages[messageType].forEach(function(fieldName) {
            message[fieldName] = messageValues[index];
            index++;
          });
          app.io.sockets.emit(messageType, message);
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
    app.io.sockets.emit('kismetServerConnectionStatus', {
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


app.io.on('connection', function(socket) {
  console.log("Web client connected");
  socket.emit('kismetServerConnectionStatus', {
    isConnected: isConnected
  });
  socket.on('disconnect', function() {
    console.log('Web client disconnected');
  });
});
