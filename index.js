var restify = require('restify');
var server = restify.createServer();

server.get('/', function(req, res, next) {
    res.send('hello world');
    return next()
});

var port = process.env.PORT || 12345;
server.listen(port, function() {
  console.log('Listening on %s', server.url);
});
