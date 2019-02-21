const TeleBot = require("telebot");

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
})

bot.on('/wiebenje', function (msg) {
    return bot.sendMessage(msg.from.id, "Hallo ik ben een Telegram bot gemaakt door de geniale Matthias Erselina. Ik ben zo geweldig omdat ik gemaakt ben door deze god der goden. AANBID HEM!!!!");
});
  

bot.start();
