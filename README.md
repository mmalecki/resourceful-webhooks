# resourceful-webhooks [![Build Status](https://secure.travis-ci.org/mmalecki/resourceful-webhooks.png)](http://travis-ci.org/mmalecki/resourceful-webhooks)
Webhooks for `resourceful`!

`resourceful-webhooks` requests an URL every time an event happens on a
resource.

If webhook responds with an HTTP error, error is returned, thus blocking event
from happening.

## Installation

    npm install resourceful-webhooks

## Usage
Following example will request `127.0.0.1:8000` when `Resource` is created.

```js
var resourceful = require('resourceful');
require('resourceful-webhooks');

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:8000'
    events: ['create']
  });
});

Resource.create({
  id: 'resource/hello',
  hello: 'world'
}, function (err) {
  if (err) {
    console.error(err.message);
  }
});
```
