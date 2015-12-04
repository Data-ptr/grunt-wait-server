# grunt-wait-server

> make grunt wait for server start

[![NPM version](https://badge.fury.io/js/grunt-wait-server.png)](http://badge.fury.io/js/grunt-wait-server)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-wait-server --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-wait-server');
```

## The "waitServer" task

### Overview
In your project's Gruntfile, add a section named `waitServer` or `wait-server` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  waitServer: {
    options: {
      req: 'http://localhost:8080',
      fail: function (done) { if (done) done(); }
      timeout: 10 * 1000,
      isforce: false,
      interval: 800,
      print: true,
      asyncFail: false
    },

    server: {
      options: {
        req: {
          url: 'http://localhost:8080',
          method: 'HEAD'
        }
      }
    },

    remoteServer: {
      options: {
        req: 'http://example.com',
        print: false
      }
    },

    db: {
      options: {
        net: {
          port: 3306
        },
        timeout: 0
      }
    }
  }
});
```

### Options

#### options.req
Type: `string` or an options `object`  
Default value: `undefined`

For backwards compatibility `options.url` is maintained as an alias to this
option.

See [request#options](https://github.com/request/request#requestoptions-callback) for available options.


#### options.net
Type: options `object`  
Default value: `undefined`  

See [net.connect#options](https://nodejs.org/api/net.html#net_net_connect_options_connectlistener) for available options.


##### You *must* supply either `options.req` or `options.net`.


#### options.fail  
Type: `function`  
Default value: `function (done) { if (done) done(); }`  


#### options.timeout  
Type: `number`  
Default value: `10 * 1000`

The time (in milliseconds) after which to "timeout."
* If `options.asyncFail` is false: Giving up on checking if the server has
started and ends the task with `options.isforce`.
* If `options.asyncFail` is true:

`0` disables the timeout, the task will continue checking the server forever.


#### options.isforce  
Type: `boolean`  
Default value: `false`

When `options.isforce` is true, the task will complete as if it had succeeded
after the timeout occurs. (see: `options.timeout`) Therefore the next Grunt
task will be run, and so on.


#### options.interval  
Type: `number`  
Default value: `800`

The interval in milliseconds to check if the server has started.


#### options.print  
Type: `boolean`  
Default value: `true`

Wether or not to include the `#taskName# waiting for the server ...` message
each time the task checks if the server has started. Currently does not apply
to the `#taskName# server is ready.` message.


#### options.asyncFail
Type: `boolean`
Default value: `false`

Wether or not to call the `options.fail` function with the `done` callback.

* If `false`: Does not call with the `done` callback. Once the function ends
the task ends with `options.isforce`.
   * You should *not* be using any kind of async functionality in
   `options.fail` with this option set to `false`. The function (and the entire
   task) will likely end before the functionality has a chance to finish.

* If `true`: The function is called with a `done` callback. `done()` *must* be
called in order to continue with the task.
   * Use async functionality in `options.fail` with this set to `true`. Call
   `done()` when everything has completed.

##### `done` callback
Prototype: `done([success, retry])`
The `done` callback has two optional arguments:

* success   
   * If `retry` is not set or otherwise equates to `false` and
   `options.isForce` is not `true` the the value passed into success is used to determine if the task should end
with success or failure.

* retry   
   * If `retry` is set to boolean `true` the timeout will be cancelled and the
   task will restart operation. (`success` is ignored)
   * If `retry` is set to an `object` the object will extend the *current* task
   options. Effectively adding or overwriting the task options. Then the
   timeout will be cancelled and the task will restart operation. (`success` is
   ignored)
   * If `retry` is anything other than a boolean `true` or an `object` the task
   will be completed. `success` argument behavior will be maintained.
   `options.isForce` option behavior will be maintained.


### Usage Examples  

#### Default Options  
In this example, the `waitServer` task will wait for the server start with the least options.  

```js
grunt.initConfig({
  waitServer: {
    server: {
      options: {
        req: 'http://localhost:8080'
      }
    },
  },
});
```

#### Custom Options  

```js
grunt.initConfig({
  waitServer: {
    server: {
      options: {
        req: 'http://localhost:8080',
        fail: function () {
          console.error('the server had not start');
        },
        timeout: 20 * 1000,
        isforce: true,
        interval: 200,
        print: false
      }
    }
  },
});
```

#### Async `options.fail`, update the options.

```js
grunt.initConfig({
  waitServer: {
    server: {
      options: {
        req: 'http://localhost:8080',
        fail: function(done) {
          var updateOptions = {
            timeout: 40 * 1000,
            interval: 400
          };

          done(false, updateOptions);
        },
        asyncFail: true
      }
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/imyelo/grunt-wait-server/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
