var util = require('util'),
    http = require('http'),
    resourceful = require('resourceful');

require('../');

var server = http.createServer(function (req, res) {
  var data = '';

  console.log('url: ' + req.url);

  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    console.log(util.inspect(JSON.parse(data), false, null, true));
    console.log();

    res.writeHead(200);
    res.end();
  });
}).listen(8000);

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:8000',
    events: ['create', 'update']
  });
});

Resource.create({
  id: 'resource/hello',
  hello: 'world',
  foo: 'bar'
}, function (err) {
  if (err) throw err;

  Resource.update(
    'hello',
    { hello: 'resourceful' },
    function (err) {
      if (err) throw err;
      server.close();
    }
  );
});
