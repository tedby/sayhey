'use strict';

const _ = require('lodash');
const util = require('util');

const Player = require('./model/player.js');
const Member = require('./model/member.js');
const Game = require('./model/game.js');

const getName = require('./utils.js').getName;

module.exports = function(bot) {

  // const text = require('../text/prison.json');
  const text = require('../text/callme.json');
  const invite = text.phrases.invite.shift();
  const welcome = text.phrases.welcome.shift();
  const cheat = text.phrases.cheat.shift();
  const playHeader = text.phrases.play.shift();
  const playResults = text.phrases.play.shift();
  const topPlayer = text.phrases.top.shift();
  const allPlayers = text.phrases.heroes.shift();
  const farewell = text.phrases.farewell.shift();

  function checkPlayer(msg) {
    const chatId = msg.chat.id;
    const player = new Player(chatId);

    player.is(msg.from).then(
      function(result) {
        if (parseInt(result, 10) > 0) {
          return checkGame(msg);
        } else {
          return start(msg);
        }
      });

  }

  function checkGame(msg) {
    const chatId = msg.chat.id;
    const game = new Game(chatId);

    game.is().then(
      function(result) {
        if (parseInt(result, 10) > 0) {
          return showResult(msg);
        } else {
          return play(msg);
        }
      });
  }

  function highlight(msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    // highlight
    let input = match['input'];
    input = input.split(' ');
    input.shift();

    const usernames = _.filter(input, function(str) {
      return /@/.test(str);
    });

    const words = _.filter(input, function(str) {
      return !/@/.test(str);
    });

    let text = invite;

    if (usernames.length > 0) {
      if (words.length > 0) {
        words.push('%s');
        text = words.join(' ');
      }
      text = util.format(text, usernames.join(' '));
    } else {
      text = cheat;
    }

    bot.sendMessage(chatId, text);
  }

  function updateGame(msg) {
    const chatId = msg.chat.id;
    const member = new Member(chatId);

    member.add(msg.from).then(function(result) {
      bot.sendMessage(chatId, util.format(playResults, getName(msg.from)));
    });
  }

  function play(msg) {
    const chatId = msg.chat.id;
    const game = new Game(chatId);
    const b = bot;
    const ph = playHeader;
    const m = msg;

    game.new().then(function(result) {
      if (parseInt(result, 10) > 0) {
        game.winner().then(function(result) {
          const winner = result.shift();
          b.sendMessage(chatId, ph);
          setTimeout(function() {
            m.from.username = winner;
            return updateGame(m);
          }, 2500);
        });
      }
    });
  }

  function quit(msg) {
    const chatId = msg.chat.id;
    const player = new Player(chatId);

    player.del(msg.from).then(function(result) {
      if (parseInt(result, 10) > 0) {
        bot.sendMessage(chatId, util.format(farewell, getName(msg.from)));
      }
    });
  }

  function showResult(msg) {
    const chatId = msg.chat.id;
    const member = new Member(chatId);

    member.best().then(function(members) {
      const leader = util.format(topPlayer, members.shift(), members.shift());
      const result = [];

      members.forEach(function(val, i, arr) {
        if (i % 2 != 0 && i != 0) {
          result.push(arr[i - 1] + ' ' + val);
        }
      });

      bot.sendMessage(chatId, leader);

      if (result.length > 0) {
        const all = util.format(allPlayers, result.join('\n'));
        bot.sendMessage(chatId, all);
      }
    });
  }

  function start(msg) {
    const chatId = msg.chat.id;
    const player = new Player(chatId);

    let text = welcome;
    text = util.format(text, getName(msg.from));

    player.add(msg.from).then(function(res) {
      if (parseInt(res, 10) > 0) {
        bot.sendMessage(chatId, text);
      }
    });
  }

  return {
    checkGame: checkGame,
    checkPlayer: checkPlayer,
    highlight: highlight,
    quit: quit,
    play: play,
    showResult: showResult,
    start: start
  };
};
