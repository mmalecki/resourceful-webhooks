var http = require('http'),
    assert = require('assert'),
    cb = require('assert-called'),
    resourceful = require('resourceful');

require('../');

var PORT = 8123,
    gotCallbacks = 0;

function maybeEnd() {
  if (++gotCallbacks === 2) {
    server.close();
  }
}

var server = http.createServer(function (req, res) {
  assert.equal(req.url, '/?event=create');
  assert.equal(req.headers['content-type'], 'application/json');

  var data = '';

  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    data = JSON.parse(data);

    if (data.hello === 'world') {
      res.writeHead(200);
      res.end();
    }
    else if (data.hello === 'universe') {
      res.writeHead(400);
      res.end();
    }
    else {
      assert(false);
    }

    maybeEnd();
  });
}).listen(PORT);

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:' + PORT.toString(),
    events: ['create']
  });
});

Resource.create({
  id: 'resource/good',
  hello: 'world'
}, cb(function goodCb(err) {
  assert(!err);
}));

Resource.create({
  id: 'resource/bad',
  hello: 'universe'
}, cb(function badCb(err) {
  assert(err);
}));
