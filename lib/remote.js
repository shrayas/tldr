var os     = require('os');
var util   = require('util');
var config = require('./config');

exports.url = function(command) {
  return config.remote.url + '/' + osGroup() + '/' + command + '.md';
}

function osGroup() {
  if (os.platform() == 'darwin') {
    return 'osx';
  } else {
    return 'unsupported';
  }
}
