var Muzzley = require('muzzley-client');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Subscription (profileId, appToken) {
  EventEmitter.call(this);
  this.profileId = profileId;
  this.appToken = appToken;
  this.muzzley = new Muzzley();
  this.muzzley.initApp({
    token: this.appToken
  });
}

util.inherits(Subscription, EventEmitter);

Subscription.prototype.load = function (callback) {
  var self = this;

  this.muzzley.on('error', function(err) {
    return callback(err);
  });

  this.muzzley.on('connect', function (err) {
    var profileSubscription = self.muzzley.subscribe({
      namespace: 'iot',
      payload: {
        profile: self.profileId
      }
    });

    profileSubscription.on('error', function(err) {
      return callback(err);
    });

    profileSubscription.on('message', function (message, messageCallback) {

      var user = message.getUser();
      var payload = message.getPayload();

      if (payload.io === 'r') {
        self.emit('readRequest', user, {channelId: payload.channel, componentId: payload.component, property: payload.property}, messageCallback);
      }

      if (payload.io === 'w') {
        self.emit('readRequest', user, {channelId: payload.channel, componentId: payload.component, property: payload.property, value: value});
      }
    });
    callback();
  });


};

Subscription.prototype.publish = function (channelId, componentId, property, value) {

  var payload = {
    io: 'i',
    profile: this.profileId,
    channel: channelId,
    component: componentId,
    property: property,
    data: { value: value }
  };

  this.muzzley.publish({
    namespace: 'iot',
    payload  : payload
  });
};

module.exports = Subscription;
