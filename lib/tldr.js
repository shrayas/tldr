var util    = require('util');
var async   = require('async');
var config  = require('./config');
var request = require('./request');
var output  = require('./output');

exports.get = function(command) {
  async.waterfall([
    config.get,
    makeRequest(command),
    print
  ], finish);
};

function makeRequest(command) {
  return function(config, next) {
    request.get(command, next);
  }
}

function print(result, next) {
  util.puts(output.fromMarkdown(result));
  next(null);
}

function finish(err, res) {
  if (err) {
    util.error('ERROR: ' + err);
    process.exit(1);
  }
}
