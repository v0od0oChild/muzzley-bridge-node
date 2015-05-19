var request = require('request');
var getmac = require('getmac');
var path = require('path');
var fs = require('fs');

var keyPath = path.resolve(__dirname, '..', '..', '..' , 'device.key');
exports = module.exports = {};

var urls = {
  registerDeviceUrl: 'https://global-manager.muzzley.com/deviceapp/register',
  replaceComponentsUrl: 'https://global-manager.muzzley.com/deviceapp/components'
};

exports.registerBridge = function (account, callback) {

  var bridgeCredentials = {
    profileId: account.profileId,
    serialNumber: account.serialNumber
  };

  getmac.getMac( function (err, macAddress) {

    if (macAddress) bridgeCredentials.macAddress = macAddress;
    fs.readFile(keyPath, 'utf8', function(err, data) {

      if (!err && data) bridgeCredentials.deviceKey = data;
      request.post(urls.registerDeviceUrl, { json: bridgeCredentials }, function (err, response, body) {
        if(err) return callback(err);

        if ((response.statusCode !== 200 && response.statusCode != 201) || !body.deviceKey) {
          return callback(new Error('Failed to obtain a valid device key'));
        }

        fs.writeFile(keyPath, body.deviceKey, function (err) {
          bridgeCredentials.deviceKey = body.deviceKey;
          return callback(err, bridgeCredentials);
        });
      });
    });
  });
};


exports.updateBridge = function (bridge, components, callback) {

  function requestDone(err, response, body) {
    return callback(err);
  }

  request.post(urls.replaceComponentsUrl, {
    headers: {
      SERIALNUMBER: bridge.serialNumber,
      DEVICEKEY: bridge.deviceKey
    },
    json: {components: components},
  }, requestDone);

};
