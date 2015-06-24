var MongoClient = require('mongodb').MongoClient,
    R = require('ramda'),
    Promise = require('bluebird');

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/whats-on';
console.log('MongoUri='+mongoUri);


function __get(id, callback) {
    MongoClient.connect(mongoUri, function(err, db) {
        if(err) {
            console.error(err);
            return callback(err, null);
        }

        db.collection('listings').findOne({_id: id}, {}, function(err, doc) {
            if(err) {
                 callback(err, null);
            } else {
                callback(null, R.prop('data', doc || {}));
            }
        });
    });
};

function __set(id, data, callback) {
    MongoClient.connect(mongoUri, function(err, db) {
        if(err) {
            console.error(err);
            return callback(err, null);
        }

        db.collection('listings').save({_id: id, data: data}, {}, callback);
    });
};

exports.get = Promise.promisify(__get);
exports.set = Promise.promisify(__set);
