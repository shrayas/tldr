var fs     = require('fs');
var path   = require('path');
var sinon  = require('sinon');
var should = require('should');
var config = require('../lib/config');
var env    = require('../lib/env');

describe('Config', function() {

  describe('Paths', function() {

    beforeEach(function() {
      sinon.stub(fs, 'existsSync');
    });

    afterEach(function() {
      fs.existsSync.restore();
    });

    it('should load a default config', function() {
      env.test = false;
      fs.existsSync.returns(false);
      config.getPath().should.eql(path.resolve(__dirname + '/../config/config.json'));
    });

    it('should load a different config for local development', function() {
      env.test = true;
      config.getPath().should.eql(path.resolve(__dirname + '/../config/local.json'));
    });

    it('can override it with a dotfile in the home directory', function() {
      env.test = false;
      fs.existsSync.returns(true);
      config.getPath().should.eql('~/.tldr');
    });

  });

  describe('Validation', function() {

    beforeEach(function() {
      sinon.stub(config, 'getPath');
    });

    afterEach(function() {
      config.getPath.restore();
    });

    it('should validate ANSI colors', function() {
      config.color('foo').should.include('should be an ANSI color');
      should.not.exist(config.color('white'));
      should.not.exist(config.color('green'));
    });

    it('should load a valid config sucessfully', function(done) {
      config.getPath.returns(__dirname +'/config/valid.json');
      config.get(function(err, res) {
        should.not.exist(err);
        res.remote.cache.should.be.above(0);
        done();
      });
    });

    it('should returns errors loading an invalid config', function(done) {
      config.getPath.returns(__dirname +'/config/invalid.json');
      config.get(function(err, res) {
        err.should.include('invalid.json');
        err.should.include('remote.cache should be a number');
        err.should.include('colors.text should be an ANSI color');
        done();
      });
    });

  });

});
