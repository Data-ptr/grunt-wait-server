/*
 * grunt-wait-server
 * https://github.com/imyelo/grunt-wait-server
 *
 * Copyright (c) 2013 yelo
 * Licensed under the MIT license.
 */

'use strict';

var net = require('net');
var request = require('request');
var once = require('once');

module.exports = function (grunt) {

  var waitServer = function () {
    var taskName = this.nameArgs;
    var options = this.options({
      fail: function (done) { if (done) { return done(options.isForce); } },
      timeout: 10 * 1000,
      isforce: false,
      interval: 800,
      print: true,
      asyncFail: false
    });

    // check options.url for backwards compatibility
    if (!options.req && options.url) {
      options.req = options.url;
    }

    if (!options.req && !options.net) {
      grunt.fail.fatal('The ' + taskName + ' task requires the req or net option' +
        '\nSee: https://github.com/imyelo/grunt-wait-server#options');
    }

    var client;
    var intervalTimeout;
    var done = this.async();
    var callback = once(function (isTimeout) {
      if (intervalTimeout) {
        clearTimeout(intervalTimeout);
      }
      if (isTimeout) {
        grunt.log.warn('timeout.');
        if (options.asyncFail) {
          return options.fail(function(success, retry) {
            if (retry) {
              switch(typeof retry) {
                case 'boolean':
                  if(retry) {
                    return start();
                  }
                break;
                case 'object':
                  options = extend(options, retry);
                  return start();
                break;
              };
            }
            return done(options.isForce || success);
          });
        } else {
            options.fail();
            return done(options.isforce);
        }
      }
      grunt.log.ok(taskName + ' server is ready.');
      done();
    });
    var wait = function (callback) {
      var tryConnection = function () {
        intervalTimeout = null;
        if (options.print) {
          grunt.log.writeln(taskName + ' waiting for the server ...');
        }
        if (options.req) {
          // if options.req use request
          request(options.req, function (err, resp, body) {
            if (!err) {
              return callback();
            }
            intervalTimeout = setTimeout(tryConnection, options.interval);
          });
        } else if (options.net) {
          // if options.net use net.connect
          client = net.connect(options.net, function () {
            client.destroy();
            callback();
          });
          client.on('error', function () {
            client.destroy();
            intervalTimeout = setTimeout(tryConnection, options.interval);
          });
        }
      };

      tryConnection();
    };
    wait(callback);
    if (options.timeout > 0) {
      setTimeout(callback.bind(null, true), options.timeout);
    }
  };

  grunt.registerMultiTask('wait_server', 'wait for server start', waitServer);
  grunt.registerMultiTask('waitServer', 'wait for server start', waitServer);

};
