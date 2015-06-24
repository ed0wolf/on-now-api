var moment = require('moment'),
    db = require('./database');


var getId = function(channel) {
    return channel+'_'+moment().format('YYYYMMDD');
};

module.exports.getChannelListings = function(channel) {
    return db.get(getId(channel));
};

module.exports.setChannelListings = function(channel, listings) {
    return db.set(getId(channel), listings);
};

