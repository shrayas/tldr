var fs   = require('fs');
var path = require('path');
var jsm  = require('js-match');
var ms   = require('ms');
var env  = require('./env');

var DEFAULT  = path.join(__dirname, '..', 'config', 'config.json');
var LOCAL    = path.join(__dirname, '..', 'config', 'local.json');
var OVERRIDE = path.join('~', '.tldr');


exports.getPath = function() {
  if (env.test) return LOCAL;
  if (fs.existsSync(OVERRIDE)) return OVERRIDE;
  return DEFAULT;
};

exports.duration = function(val) {
  var valid = (typeof(val) === 'string') && (ms(val) !== undefined);
  return valid ? null : 'should be a duration, for example "1 second" or "30 days"';
};

exports.color = function(val) {
  var ansi = ['white','black','blue','cyan','green','magenta','red','yellow'];
  if (ansi.indexOf(val) != -1) {
    return null;
  } else {
    return 'should be an ANSI color: [' + ansi.join(',') + ']';
  }
};

jsm.matchers['duration'] = exports.duration;
jsm.matchers['color']    = exports.color;

exports.get = function(callback) {
  var configPath = exports.getPath();
  var contents = require(configPath);
  var errors = jsm.validate(contents, {
    'remote': {
   	  'url':                 { match: 'url'      },
   	  'cache':               { match: 'duration' }
    },
    'colors': {
      'text':                { match: 'color' },
      'description':         { match: 'color' },
      'example':             { match: 'color' },
      'example-background':  { match: 'color' },
      'example-token':       { match: 'color' }
    }
  });
  if (errors.length === 0) {
    callback(null, contents);
  } else {
    var errorText = errors.reduce(function(acc, e) {
      return acc + e.path + ' ' + e.error + '\n';
    }, '');
    callback('config ' + configPath + '\n' + errorText);
  }
}
