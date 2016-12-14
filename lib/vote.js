/**
 * Created by sulitsky on 05/12/2016.
 */
'use strict';

const Poll = require('./model/poll.js');
const defaultOptions = {'1' : 'Да', '2' : 'Нет', '3' : 'Иди нахуй'};
const defaultQuestion = "Ты меня уважаешь?";

module.exports = function (bot) {

    //serialize pollling options to inline keyboard
    function options2buttons(options) {
        const buttons = {inline_keyboard: []};
        for (let key of Object.keys(options)){
            let k = {};
            k.text = options[key];
            k.callback_data = key;
            buttons.inline_keyboard.push([k]);
        }
        return buttons;
    }

    //create polling according to request, expects input in match as: /poll question? answer1, answer2, ...

    function createPoll(msg, match) {
        const chatId = msg.chat.id;
        //default options needed to create fun poll.
        let question = defaultQuestion;
        let options = defaultOptions;

        let input = match['input'].replace("/poll", "").trim();
        console.log(input);
        if (input.length > 0) {
            //check if any question in request
            if (input.indexOf('?') < 0) {
                bot.sendMessage(msg.chat.id, "Нет вопроса - нет голосувания!");
                return;
            }

            //getting question from request

            question = input.substr(0, input.indexOf('?') + 1);
            let strOpts = input.substr(input.indexOf('?') + 1);

            while (strOpts.charAt(0) === '?') {
                strOpts = strOpts.substr(1);
            }

            //getting options of polling from request

            if(strOpts.length > 0) {
                let optionsData = strOpts.split(/,/).filter(function(el) {
                    return el.trim().length != 0;
                });

                if (optionsData.length > 0) {
                    options = {};
                    optionsData.forEach(function (element, index) {
                        options[index.toString()] = element.trim();
                    });
                    console.log(options);
                }
            }
        }

        const msgOptions = {
            parse_mode: "HTML",
            reply_markup: JSON.stringify(options2buttons(options))
        };

        //send message with results and buttons

        bot.sendMessage(msg.chat.id, getFormattedResult(question, options, []), msgOptions).then(function (sended) {
            const voteId = sended.message_id;
            const poll = new Poll(chatId, voteId);
            poll.create(question, options);
        });
    }

    // format message with results to look fine.

    function getFormattedResult(question, options, results)
    {
        return `<strong>${question}</strong>${generateResults(options, results)}`;
    }

    // get marked up results with percentage and poo bars.

    function generateResults(options, results){
        let resultStr = '\n';
        let total = 0;

        //get total votes count

        for (let key of Object.keys(results))
        {
            total = total + parseInt(results[key]);
        }

        let pooBarItem = String.fromCodePoint(0x0001F4A9);

        for (let key of Object.keys(options)){

            let result = isNaN(results[key])  ? 0 : parseInt(results[key]);
            let percentage = total > 0  ? ((result / total) * 100).toFixed(0) : 0;
            let pooCount = ((percentage/10) + 1).toFixed(0);
            let bar = pooBarItem.repeat(pooCount);

            resultStr = resultStr.concat(`\n<b>${options[key]}</b> - ${result}\n ${bar} <b>${percentage} %</b>\n` );
        }
        resultStr = resultStr.concat(`\nВсего бездельников: ${total}.`);

        return resultStr;
    }

    // Update message after user vote

    function updateMessage(msg)
    {
        const chatId = msg.message.chat.id;
        const voteId = msg.message.message_id;

        const poll = new Poll(chatId, voteId);
        const resultsPromise = [];
        resultsPromise.push(poll.getOptions());
        resultsPromise.push(poll.getResults());
        resultsPromise.push(poll.getQuestion());
        Promise.all(resultsPromise).then(function(data){
            const options = data[0];
            const results = data[1];
            const question = data[2];

            let msgOptions = {
                message_id: voteId,
                chat_id: chatId,
                parse_mode: "HTML",
                reply_markup: JSON.stringify(options2buttons(options))
            };

            bot.editMessageText(getFormattedResult(question, options, results), msgOptions).catch(function(e){
                console.log("no changes");
            });
        });
    }

    // voting handler,

    function makeChoice(msg) {
        const chatId = msg.message.chat.id;
        const voteId = msg.message.message_id;
        const userId = msg.from.id;
        const choiceId = msg.data;

        const poll = new Poll(chatId, voteId);
        // check if this is our voting
        poll.known().then( function (known) {
            if(parseInt(known) > 0) {

                // check if user already voted

                poll.getUserResult(userId).then(
                    function (opt) {
                        const optionId = parseInt(opt);
                        if (isNaN(optionId)) {

                            // ok processing vote

                            poll.vote(choiceId, userId).then(function () {
                                return poll.getOption(parseInt(choiceId));
                            }).then(function (res) {
                                bot.answerCallbackQuery(msg.id, `Поздравляю! Ты успешно голосунул за \"${res}\"`);
                                updateMessage(msg);
                            });
                        } else {

                            // no user already voted, no changing mind allowed!

                            poll.getOption(optionId).then(function (res) {
                                    bot.answerCallbackQuery(msg.id, `Так не пойдет, переголосунуть нельзя, живи с ответом \"${res}\"`);
                                    updateMessage(msg);
                                }
                            );
                        }
                    });
            }
        });
    }


    return {
        createPoll: createPoll,
        makeChoice: makeChoice,
        updateMessage: updateMessage
    };
};