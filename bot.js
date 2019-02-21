const TeleBot = require("telebot");

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
})

bot.on('/start', function (msg) {
    return bot.sendMessage(msg.from.id, "Hello world!");
});
  

bot.start();
