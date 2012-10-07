var url = require('url'),
    http = require('http'),
    resourceful = require('resourceful');

resourceful.Resource.webhooks = function (options) {
  var self = this;

  var parsed = url.parse(options.url);

  options.events.forEach(function (event) {
    self.before(event, function (obj, callback) {
      function onError(err) {
        callback(options.ignoreErrors ? null : err);
      }

      function onResponse(res) {
        var body;

        if (res.statusCode !== 200) {
          return callback(new Error('HTTP ' + res.statusCode));
        }

        //
        // TODO:
        // If response had a body, assume that the body contains modified
        // document.
        //
        return callback();
      }

      var req = http.request({
        host: parsed.hostname,
        port: parsed.port,
        method: 'POST',
        path: parsed.path + '?event=' + event
      }, onResponse).on('error', onError);

      req.write(JSON.stringify(obj));
      req.end();
    });
  });
};
