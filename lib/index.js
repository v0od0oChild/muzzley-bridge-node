var Subscription = require('./Subscription');
var api = require('./api');

exports = module.exports = {};

function validateAccount(account) {
  if (!account) throw new Error('Muzzley account details must be present!');
  if (!account.appToken) throw new Error('appToken is not defined!');
  if (!account.profileId) throw new Error('profileId is not defined!');
  if (!account.serialNumber) throw new Error('serialNumber is not defined!');
}

function validateComponents(components) {
  if (!components || components.length === 0) throw new Error('Bridge components must be defined!');

  for (var i = 0; i != components.length; ++i) {
    if(!components[i].id) throw new Error('Missing component id!');
    if (!components[i].type) throw new Error('Missing component type!');
    if (!components[i].label) throw new Error('Missing component label!');
  }
}

exports.connect = function (account, components, callback) {

  validateAccount(account);
  validateComponents(components);

  api.registerBridge(account, function (err, bridge) {
    if (err) return callback(err);

    api.updateBridge(bridge, components, function (err) {
      if (err) return callback(err);

      var subscription = new Subscription(bridge.profileId, bridge.appToken);
      subscription.load(function (err) {
        return callback(err, subscription);
      });
    });
  });
};


