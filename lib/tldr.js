var util    = require('util');
var async   = require('async');
var config  = require('./config');
var request = require('./request');
var output  = require('./output');

exports.get = function(command) {
  request.get(command, function(err, body) {
    if (err) {
      throw new Error(err);
    } else {
      util.puts(output.fromMarkdown(body));
    }
  });
};
