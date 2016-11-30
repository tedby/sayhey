'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Game = require('../lib/model/game.js');
const game = new Game(-1);

describe('Game', function() {

  describe('#new()', function() {
    it('should', function() {
      const newGame = game.new().then(function(res) {
        return res;
      });

      return expect(newGame).to.eventually.equal('1');
    });
  });

  describe('#winner()', function() {
    it('should', function() {
      const winner = game.winner().then(function(res) {
        return res;
      });

      return expect(winner).to.eventually.deep.equal(['throyanec']);
    });
  });

});
