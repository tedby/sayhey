'use strict';

const prefix = 'kotd:g:';
// const getName = require('../utils.js').getName;
const redisClient = require('./redis.js');
const moment = require('moment');
const Player = require('./player');

function Game(chatId) {
  this.chatId = chatId;
  this.client = redisClient;
}

Game.prototype.is = function() {
  const formatDate = moment(new Date()).format('YYYYMMDD');
  return this.client.exists(prefix + this.chatId + ':' + formatDate);
};

Game.prototype.new = function() {
  const formatDate = moment(new Date()).format('YYYYMMDD');
  const client = this.client;
  const chatId = this.chatId;
  const player = new Player(this.chatId);

  return player.random().then(function(result) {
    return client.zincrby(prefix + chatId + ':' + formatDate, 1, result);
  });
};

Game.prototype.winner = function() {
  const formatDate = moment(new Date()).format('YYYYMMDD');

  return this.client.zrevrange(prefix + this.chatId + ':' + formatDate, 0, 0);
};

module.exports = Game;
