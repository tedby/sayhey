'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Player = require('../lib/model/player.js');
const player = new Player(-1);

describe('Player', function() {

  describe('#add()', function() {
    it('should', function() {
      const add = player.add({
        username: 'throyanec'
      }).then(function(res) {
        return res;
      });

      return expect(add).to.eventually.equal(1);
    });
  });

  describe('#is()', function() {
    it('should', function() {
      const is = player.is({
        username: 'throyanec'
      }).then(function(res) {
        return res;
      });

      return expect(is).to.eventually.equal(1);
    });
  });

  describe('#random()', function() {
    it('should', function() {
      const random = player.random({
        username: 'throyanec'
      }).then(function(res) {
        return res;
      });

      return expect(random).to.eventually.equal('throyanec');
    });
  });

  describe('#del()', function() {
    it('should', function() {
      const del = player.del({
        username: 'throyanec'
      }).then(function(res) {
        return res;
      });

      return expect(del).to.eventually.equal(1);
    });
  });
});
