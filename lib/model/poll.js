/**
 * Created by sulitsky on 05/12/2016.
 */

'use strict';

const prefix = 'kotd:v:';
const captionPostfix = ':caption';
const optionsPostfix = ':options';
const usersRoot = ':users:';
const votesRoot = ':votes:';

const getName = require('../utils.js').getName;
const Redis = require('ioredis');
const redisClient = require('./redis.js');


function Poll(chatId, voteId) {
    this.chatId = chatId;
    this.voteId = voteId;
    this.client = redisClient;
    this.votePrefix = prefix + chatId + ':' + voteId;
}

Poll.prototype.create = function (voteQuestion, voteOptions) {
    return this.client.multi().set(this.votePrefix + captionPostfix, voteQuestion).hmset(this.votePrefix + optionsPostfix, voteOptions).exec();
};

Poll.prototype.known = function () {
    return this.client.exists(this.votePrefix + optionsPostfix);
};

Poll.prototype.vote = function (optionId, userId) {
    return this.client.multi().hincrby(`${this.votePrefix}${votesRoot}`, optionId, 1).set(`${this.votePrefix}${usersRoot}${userId}`, optionId).exec();
};

Poll.prototype.getQuestion = function()
{
    return this.client.get(this.votePrefix + captionPostfix);
};

Poll.prototype.getOption = function (optionId) {
    return this.client.hget(this.votePrefix + optionsPostfix, optionId);
};

Poll.prototype.getOptions = function (){
    return this.client.hgetall(this.votePrefix + optionsPostfix);
};

Poll.prototype.getUserResult = function (userId) {
    return this.client.get(`${this.votePrefix}${usersRoot}${userId}`);
};

Poll.prototype.getResults = function (){
    return this.client.hgetall(`${this.votePrefix}${votesRoot}`);
};


module.exports = Poll;
