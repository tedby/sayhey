'use strict';

const getName = require('../utils.js').getName;
const prefix = 'kotd:m:';
const redisClient = require('./redis.js');

function Member(chatId) {
  this.chatId = chatId;
  this.client = redisClient;
}

Member.prototype.add = function(member) {
  return this.client.zincrby(prefix + this.chatId, 1, getName(member));
};

Member.prototype.best = function() {
  return this.client.zrevrange(prefix + this.chatId, 0, 10, 'WITHSCORES');
};

module.exports = Member;
