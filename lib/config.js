var configLoader = require('./config-loader');

// the config required for most code to run, so we can afford to load it synchronously
// it makes everything simpler after that
module.exports = configLoader.load();
