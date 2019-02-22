const TeleBot = require("telebot");

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
});


bot.on('/start', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het /start commando gegeven.`);
    return bot.sendMessage(msg.from.id, "Hello world!");
});

bot.on('/wiebenje', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft gevraagd naar mijn naam.`);
    return bot.sendMessage(msg.from.id, "Ik ben een geniale memebot. AANBID MIJ!!! \nOok btw, ik ben gecreëerd door Nemisorg... Je zou hem ook zeker moeten aanbidden $)");
});

bot.on('/foto', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft een foto opgevraagd.`);
    return bot.sendPhoto(msg.from.id, "images/meme.jpg");
});

bot.on('/versie', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft mijn versienummer opgevraagd.`);
    return bot.sendPhoto(msg.from.id, "images/java_version.png", {replyToMessage: msg.message_id})
});

bot.on("/pino", (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft een foto van Pino opgevraagd.`);
    return bot.sendPhoto(msg.from.id, "images/pino_dead.jpg")
});


bot.start();
