'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Member = require('../lib/model/member.js');
const member = new Member(-1);

describe('Player', function() {

  describe('#add()', function() {
    it('should', function() {
      const add = member.add({
        username: 'throyanec'
      }).then(function(res) {
        return res;
      });

      return expect(add).to.eventually.equal('1');
    });
  });

  describe('#best()', function() {
    it('should', function() {
      const best = member.best().then(function(res) {
        return res;
      });

      return expect(best).to.eventually.deep.equal(['throyanec', '1']);
    });
  });

});
