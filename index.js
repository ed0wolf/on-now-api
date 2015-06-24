var restify = require('restify'),
    request = require('request'),

    repo = require('./src/repository'),
    sourcer = require('./src/sourcer');


var server = restify.createServer();
server.use(restify.bodyParser());

server.get('/:channel', function(req, res, next) {
    var channel = req.params.channel;
    repo.getChannelListings(channel).then(function(listings) {
        res.send(listings || 404);
        next();
    }).catch(function(e) {
        res.send(500);
        next();
    });
});

server.put('/:channel', function(req, res, next) {
    var channel = req.params.channel;
    sourcer.sourceListings(channel).then(function(listings) {
        repo.setChannelListings(channel, listings).then(function() {
            res.send(204);
            next();
        }).catch(function(e) {
            res.send(500);
            next();
        });
    });
});

var port = process.env.PORT || 12345;
server.listen(port, function() {
  console.log('Listening on %s', server.url);
});
