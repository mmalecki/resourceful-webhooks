var http = require('http'),
    assert = require('assert'),
    cb = require('assert-called'),
    resourceful = require('resourceful');

require('../lib/resourceful-webhooks');

var PORT = 8124;

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:' + PORT.toString(),
    events: ['create'],
    ignoreErrors: true
  });
});

Resource.create({
  id: 'resource/any',
  hello: 'world'
}, cb(function goodCb(err) {
  assert(!err);
}));
