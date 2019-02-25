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
    exec(`cd ${newSpawnDir}`, (err, stdout, stderr) => {
        console.log(`${stdout}\n${stderr}`);
        if (user != "root") {
            bot.sendMessage(sendID, `${user}@${hostname}:${spawnDir}$ cd ${newSpawnDir}\n${stdout}\n${stderr}`);
        } else {
            bot.sendMessage(sendID, `${user}@${hostname}:${spawnDir}# cd ${newSpawnDir}\n${stdout}\n${stderr}`);
        }
        if (err == false) {
            spawnDir = newSpawnDir;
        }
    });
}


bot.on('/start', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het /start commando gegeven.`);
    return bot.sendMessage(msg.from.id, "Hello world!");
});

bot.on('/wiebenje', (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft gevraagd naar mijn naam.`);
    return bot.sendMessage(msg.from.id, "Ik ben qwerty een multifunctionele Telegram bot. Ik antwoord op commando's en maak Shell access mogelijk. Veel plezier!");
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

bot.on(/^\/cd( (.+))?/, (msg, props) => {
    if (typeof(props.match[2]) == "undefined") {
        var newSpawnDir = "~";
    } else {
        var newSpawnDir = props.match[2];
    }
    if (newSpawnDir.includes(";")) {
        var command = newSpawnDir.split(/; ?/)[1];
        newSpawnDir = newSpawnDir.replace(/ ?;.*/, "");
    }
    if (/^\//.test(newSpawnDir) == false && newSpawnDir != "~") {
        newSpawnDir = spawnDir + "/" + newSpawnDir;
    } 
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) wilt switchen naar ${newSpawnDir}.`);
    checkDir(newSpawnDir, msg.from.id);
    if (typeof(command) != "undefined") {
        teleExec(spawnDir, command, msg.from.id);
    }
});

bot.on(/^\/cmd (.+)/, (msg, props) => {
    var command = props.match[1];
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het commando ${command} uitgevoerd als user ${user}.`);
    teleExec(spawnDir, command, msg.from.id);
});

bot.on(/.+(\?+)$/, (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft iets gevraagd waar ik geen antwoord op heb.`);
    return bot.sendMessage(msg.from.id, "Weet ik veel!");
});


bot.start();