# resourceful-webhooks [![Build Status](https://secure.travis-ci.org/mmalecki/resourceful-webhooks.png)](http://travis-ci.org/mmalecki/resourceful-webhooks)
Webhooks for `resourceful`!

`resourceful-webhooks` requests a URL every time an event happens on a
resource.

If the webhook responds with an HTTP error, an error is returned, thus
blocking the event from happening.

## Installation

    npm install resourceful-webhooks

## Usage
The following example will `POST` to `127.0.0.1:8000/?event=create` when
a `Resource` is created.

The request body is the created document.

```js
var resourceful = require('resourceful');
require('resourceful-webhooks');

var Resource = resourceful.define('Resource', function () {
  this.webhooks({
    url: 'http://127.0.0.1:8000',
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
