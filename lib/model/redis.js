'use strict';

const Redis = require('ioredis');
const d = require('denv')();

const conString = 'redis://' + d.env('redis_user', '') +
    ':' + d.env('redis_password', '') +
    '@' + d.addr('127.0.0.1') +
    ':' + d.port('6379') +
    '/' + d.env('db', 0);

module.exports = new Redis(conString);
