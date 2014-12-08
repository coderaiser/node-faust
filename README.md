# Faust

Github authorization.
First things first: get key and secret from `https://github.com/settings/applications`.
Set url to yours in applications tab of settings `http://your-url`.
Start server and you ready to go.

## Install

```
npm i faust --save
```

## How to use?

```js
var url     = require('url'),
    http    = require('http'),
    faust   = require('faust'),
    KEY     = 'some key',
    SECRET  = 'some secret'
    auth    = faust(KEY, SECRET);

http.createServer(function (req, res) {
    auth(req, function(error, token) {
        res.end(token);
    };
}).listen(1337, '0.0.0.0');
```

## License

MIT
