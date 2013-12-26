var fs     = require('fs');
var path   = require('path');
var sinon  = require('sinon');
var should = require('should');
var loader = require('../lib/config-loader');
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
      loader.getPath().should.eql(path.resolve(__dirname + '/../config/config.json'));
    });

    it('should load a different config for local development', function() {
      env.test = true;
      loader.getPath().should.eql(path.resolve(__dirname + '/../config/local.json'));
    });

    it('can override it with a dotfile in the home directory', function() {
      env.test = false;
      fs.existsSync.returns(true);
      loader.getPath().should.eql('~/.tldr');
    });

  });

  describe('Validation', function() {

    beforeEach(function() {
      sinon.stub(loader, 'getPath');
    });

    afterEach(function() {
      loader.getPath.restore();
    });

    it('should validate durations', function() {
      loader.duration('foo').should.include('should be a duration');
      should.not.exist(loader.duration('1s'));
      should.not.exist(loader.duration('5 days'));
    });

    it('should validate ANSI colors', function() {
      loader.color('foo').should.include('should be an ANSI color');
      should.not.exist(loader.color('white'));
      should.not.exist(loader.color('green'));
    });

    it('should load a valid config sucessfully', function() {
      loader.getPath.returns(__dirname +'/config/valid.json');
      var config = loader.load();
      config.remote.cache.should.eql('1 minute');
    });

    it('should returns errors loading an invalid config', function() {
      loader.getPath.returns(__dirname +'/config/invalid.json');
      try {
        loader.load();
      } catch (ex) {
        ex.toString().should.include('invalid.json');
        ex.toString().should.include('remote.cache should be a duration');
        ex.toString().should.include('colors.list should be an ANSI color');
      }
    });

  });

});
