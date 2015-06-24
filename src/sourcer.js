var request = require('request'),
    Promise = require('bluebird'),
    xml2js = require('xml2js');

function __sourceListings(channel, callback) {
    request.get('http://bleb.org/tv/data/listings/0/'+channel+'.xml', function(err, res) {
        if(err)
            return callback(err, null);

        if(res.statusCode !== 200)
            return callback(new Error('While sourcing listings for '+channel+', got statusCode: '+res.statusCode), null);

        var parseXmlOptions = {
            attrkey: '__metadata__',
            explicitArray: false
        };
        xml2js.parseString(res.body, parseXmlOptions, function(err, listings) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, listings);
            }
        });
    });
};

exports.sourceListings = Promise.promisify(__sourceListings);
