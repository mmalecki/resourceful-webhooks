var http = require('http'),
    assert = require('assert'),
    cb = require('assert-called'),
    resourceful = require('resourceful');

require('../lib/resourceful-webhooks');

var PORT = 8123,
    gotCallbacks = 0;

function maybeEnd() {
  if (++gotCallbacks === 2) {
    server.close();
  }
}

var server = http.createServer(function (req, res) {
  var data = '';

  assert.equal(req.url, '/?event=create');

  res.writeHead(200, { 'content-type': 'application/json' });

  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    res.end(JSON.stringify({ ok: JSON.parse(data).ok }));

    maybeEnd();
  });
}).listen(PORT);

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:' + PORT.toString(),
    events: ['create'],
    after: function (res, body, callback) {
      assert.equal(res.headers['content-type'], 'application/json');
      callback(JSON.parse(body).ok ? null : new Error('Resource not OK'));
    }
  });
});

Resource.create({
  id: 'resource/ok',
  ok: true
}, cb(function okCb(err) {
  assert(!err);
}));

Resource.create({
  id: 'resource/not-ok',
  ok: false
}, cb(function notOkCb(err) {
  assert(err);
  assert.equal(err.message, 'Resource not OK');
}));
