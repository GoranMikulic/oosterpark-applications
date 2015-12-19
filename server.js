#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var routes = require('./modules/routes.js');
var http = require('http');
var kismet = require('./modules/kismetsocket/kismet.js');
var serverconfig = require('./modules/utils/serverconfig.js');
var weather = require('./modules/controllers/WeatherController.js');
var CronJob = require('cron').CronJob;


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

    serverconfig.setServerData(self.ipaddress, self.port);
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
    self.httpServer.listen(self.port, self.ipaddress, function() {
      console.log("server listening on port", self.port);
    });
    //Setup listener for socket on port
    self.io = require('socket.io').listen(app.httpServer);
  };

};

/**
 *  main():  Main code.
 */
var app = new App();
app.initialize();
app.start();
kismet.connect(app.io);

new CronJob('* * * * * *', function() {
  //weather.fetchWeatherData();
}, null, true, 'Europe/Amsterdam');
