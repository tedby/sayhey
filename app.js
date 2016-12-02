'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true
});

const play = require('./lib/play.js')(bot);

// Play
bot.onText(/\/hey/, play.checkPlayer);
// Exit
bot.onText(/\/nohey/, play.quit);
// Matches "/say [whatever]"
bot.onText(/\/say (.+)/, play.highlight);
// Start game old way
bot.onText(/\/pidor/, play.checkGame);
// Register game old way
bot.onText(/\/pidoreg/, play.checkPlayer);
//

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', function(msg) {
//   // const chatId = msg.chat.id;
//
//   game.play(msg);
// // send a message to the chat acknowledging receipt of their message
// // bot.sendMessage(chatId, 'Received your message');
// });
