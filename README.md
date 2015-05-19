# Muzzley Devices Bridge (Node.js)
Enables you to connect your own devices to the Muzzley IoT ecosystem. Build your own devices, control them from any place with Internet connection using the Muzzley app. Use Muzzley workers to make your devices work together with connected devices available in the market.
Can be used in development boards such as Intel Galileo/Edison and Raspberry Pi.

![alt tag](https://muzzley.com/imgs/device2cloud.png)

This is an unofficial connector.


### Install
Run `npm install muzzley-bridge-node`


### Requirements

* Visit [Muzzley website](https://www.muzzley.com) and create a developer account.
* Create a Muzzley App, selecting the Device to Cloud integration.
* Take note of your profileId and appToken after saving your Muzzley Profile.
* Define your device spec, triggers and actions so you can make your device work together with other ones and also take part in the Muzzley behavioral analysis system, which will sugests you actions based on your devices usage.
* Create your device interaction interface on the Muzzley Widgets page.


### Usage

```
var muzzleyBridge = require('muzzley-bridge-node');

// Define all the required account vars
var accountData = {
  profileId: '', // Get it at www.muzzley.com
  serialNumber: '', // Generate one
  appToken: '' // Get it at www.muzzley.com
};

// Create an array of components. Each component identifies an object you want to control. A lock, a bulb..
var bridgeComponents = [
  {
    id: 'lock1', // Define an id for your object
    type: 'lock', // Needs to match the type you defined in the Muzzley website
    label: 'Building Lock' // A name
  }
];

// Connect your device to Muzzley
muzzleyBridge.connect(accountData, bridgeComponents, function (err, channel) {
  console.log('Connected..');

  // when a mobile app does a read request
  channel.on('readRequest', function (user, request, callback) {
    console.log(message);
    callback(true, 'success', value);
  });

  // when a mobile app does a write request
  channel.on('writeRequest', function (user, request) {
    console.log(message);
    channel.publish(request.componentId, request.property, myNewValue);
  });

});
```
