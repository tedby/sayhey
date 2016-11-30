'use strict';

const prefix = 'kotd:p:';
const getName = require('../utils.js').getName;
const redisClient = require('./redis.js');


function Player(chatId) {
  this.chatId = chatId;
  this.client = redisClient;
}

Player.prototype.add = function(player) {
  return this.client.sadd(prefix + this.chatId, getName(player));
};

Player.prototype.del = function(player) {
  return this.client.srem(prefix + this.chatId, getName(player));
};

Player.prototype.is = function(player) {
  return this.client.sismember(prefix + this.chatId, getName(player));
};

Player.prototype.random = function() {
  return this.client.srandmember(prefix + this.chatId);
};

module.exports = Player;
