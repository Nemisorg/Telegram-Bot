const TeleBot = require("telebot");

const os = require("os");

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
});

const greetings = ["Hallo!", "Hoi!", "Hey!", "Goedendag!", "Hoe gaat ie!"];

const { exec } = require('child_process');

var spawnDir = require('path').dirname(require.main.filename);

const hostname = os.hostname();

const user = os.userInfo().username;

console.log(user);

console.log(hostname);

console.log(spawnDir);

function grepRandomResponse(responseList) {
    return responseList[Math.floor(Math.random() * responseList.length)];
}

function teleExec(workingDirectory, command, sendID) {
    exec(`cd ${workingDirectory} ; ${command}`, (err, stdout, stderr) => {
        console.log(`${stdout}\n${stderr}`);
        if (user != "root") {
            return bot.sendMessage(sendID, `${user}@${hostname}:${workingDirectory}$ ${command}\n${stdout}\n${stderr}`);
        } else {
            return bot.sendMessage(sendID, `${user}@${hostname}:${workingDirectory}# ${command}\n${stdout}\n${stderr}`);
        }
    });
}

function checkDir(newSpawnDir, sendID) {
    exec(`cd ${newSpawnDir}`, (err) => {
        if (err) {
            console.log(`Er kon niet geswitcht worden naar ${newSpawnDir}.`);
            return bot.sendMessage(sendID, `Er kon niet geswitcht worden naar ${newSpawnDir}.`);
        }
        spawnDir = newSpawnDir;
        console.log(`Er is geswitcht naar ${spawnDir}`);
        return bot.sendMessage(sendID, `Er is geswitcht naar ${spawnDir}`);
    });
}


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
    return bot.sendPhoto(msg.from.id, "images/java_version.png", {replyToMessage: msg.message_id});
});

bot.on("/pino", (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft een foto van Pino opgevraagd.`);
    return bot.sendPhoto(msg.from.id, "images/pino_dead.jpg");
});

bot.on(/^([hH]o+i+)+|^([hH]e+y*)+|^([hH]a+l{2,}o+)+|^([gG]oedendag)+/, (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft hoi gezegd.`);
    return bot.sendMessage(msg.from.id, grepRandomResponse(greetings));
});

bot.on(/^([dD]o+e+i+)+/, (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft doei gezegd.`);
    return bot.sendMessage(msg.from.id, "Fijne dag nog!");
});

bot.on(/^\/cd/, (msg) => {
    var newSpawnDir = msg.text.replace(/\/cd ?/, "");
    if (newSpawnDir.includes(";")) {
        var command = newSpawnDir.split(/; ?/)[1];
        newSpawnDir = newSpawnDir.replace(/ ?;.*/, "");
    }
    if (newSpawnDir == "" | newSpawnDir == "~") {
        newSpawnDir = "~";
    } else if (/^\//.test(newSpawnDir) == false) {
        newSpawnDir = spawnDir + "/" + newSpawnDir;
    } 
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) wilt switchen naar ${newSpawnDir}.`);
    checkDir(newSpawnDir, msg.from.id);
    if (typeof(command) != "undefined") {
        teleExec(spawnDir, command, msg.from.id);
    }
});

bot.on(/^\/cmd /, (msg) => {
    var command = msg.text.replace("/cmd ", "");
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het commando ${command} uitgevoerd.`);
    teleExec(spawnDir, command, msg.from.id);
});


bot.start();