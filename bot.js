/* eslint-disable no-console */

/* jshint esversion: 6 */

const TeleBot = require("telebot");
const mongo = require("mongodb").MongoClient;
const os = require("os");
const { exec } = require("child_process");

const greetings = ["Hallo!", "Hoi!", "Hey!", "Goedendag!", "Hoe gaat ie!"];
const hostname = os.hostname();
const user = os.userInfo().username;
const url = "mongodb://localhost/";
let spawnDir = require("path").dirname(require.main.filename);
let TeleID;
let userObject;


console.log(user);
console.log(hostname);
console.log(spawnDir);

function grepRandomResponse(responseList) {
    return responseList[Math.floor(Math.random() * responseList.length)];
}

function teleExec(workingDirectory, command, sendID) {
    exec(`cd ${workingDirectory} ; ${command}`, (_err, stdout, stderr) => {
        let userSign;
        if (user != "root") {
            userSign = "$";
        }
        else {
            userSign = "#";
        }

        addCommand(sendID, `${user}@${hostname}:${workingDirectory}${userSign} ${command}`, `${stdout}\n${stderr}`)

        console.log(`${user}@${hostname}:${workingDirectory}${userSign} ${command}\n\n${stdout}\n${stderr}`);
        return bot.sendMessage(sendID, `${user}@${hostname}:${workingDirectory}${userSign} ${command}\n\n${stdout}\n${stderr}`);
    });
}

function checkDir(newSpawnDir, sendID, receivedText) {
    exec(`cd ${newSpawnDir}`, (err, stdout, stderr) => {
        let message;
        
        if (err == null) {
            spawnDir = newSpawnDir;
            message = `Er is geswitcht naar ${spawnDir}`;
        }
        else {
            message = `${stdout}\n${stderr}`;
        }

        addCommand(sendID, receivedText, message)

        console.log(message);
        return bot.sendMessage(sendID, message);
    });
}

function addUserDB(ID, name) {
    mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;

        let dbo = db.db("TeleBotDB");
        dbo.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;

            let userExists;
            for (let i = 0; i < result.length; i++) {
                TeleID = result[i].ID;
                if (TeleID == ID) {
                    userExists = true;
                    userObject = result[i].commands;
                    break;
                }
            }

            if (userExists != true) {
                console.log(`Nieuwe gebruiker toegevoegd: ${name}, ${ID}`);

                let newUser = { name: name, ID: ID, commands: {} };
                userObject = newUser.commands;
                dbo.collection("users").insertOne(newUser, function(err, _res) {
                    if (err) throw err;
                    db.close();
                });
            }
        });
    });
}

function addCommand(ID, command, stdout) {
    let date = new Date();
    let current_hour = date;
    console.log(current_hour);
    mongo.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;

        let dbo = db.db("TeleBotDB");

        let date = getDateTime();

        let myQuery = { ID: ID };
        userObject[date] = { [command]: stdout };
        let newValues = { $set: { commands: userObject } };
        dbo.collection("users").updateOne(myQuery, newValues, function(err, _res) {
            if (err) throw err;
            db.close();
        });
    });
}

function getDateTime() {
    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
});

bot.on(/.+/, (msg) => {
    addUserDB(msg.from.id, `${msg.from.first_name} ${msg.from.last_name}`);
});

bot.on("/start", (msg) => {
    let receivedText = "/start";
    let response = "Hello world!";

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendMessage(msg.from.id, response);
});

bot.on("/wiebenje", (msg) => {
    let receivedText = "/wiebenje";
    let response = "Ik ben qwerty, een multifunctionele Telegram bot. Ik antwoord op commando's en maak Shell access mogelijk. Veel plezier!";    

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendMessage(msg.from.id, response);
});

bot.on("/foto", (msg) => {
    let receivedText = "/foto";
    let response = "images/meme.jpg";

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendPhoto(msg.from.id, response);
});

bot.on("/versie", (msg) => {
    let receivedText = "/versie";
    let response = "images/java_version.png";

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendPhoto(msg.from.id, response, {replyToMessage: msg.message_id});
});

bot.on("/pino", (msg) => {
    let receivedText = "/pino";
    let response = "images/pino_dead.jpg";

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendPhoto(msg.from.id, response);
});

bot.on(/^([hH]o+i+)+|^([hH]e+y*)+|^([hH]a+l{2,}o+)+|^([gG]oedendag)+/, (msg, props) => {
    let receivedText = Object.keys(props.match).map(function(key) {
        return props.match[key];
    });
    receivedText = receivedText[receivedText.length - 1];
    let response = grepRandomResponse(greetings);

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendMessage(msg.from.id, response);
});

bot.on(/^([dD]o+e+i+)+/, (msg, props) => {
    let receivedText = Object.keys(props.match).map(function(key) {
        return props.match[key];
    });
    receivedText = receivedText[receivedText.length - 1];
    let response = "Fijne dag nog!"

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${receivedText}\n${response}`);
    return bot.sendMessage(msg.from.id, response);
});

bot.on(/^\/cd( (.+))?/, (msg, props) => {
    let newSpawnDir;
    
    if (typeof(props.match[2]) == "undefined") {
        newSpawnDir = "~";
    }
    else if (props.match[2].includes(";")) {
        newSpawnDir = props.match[2];
        var command = newSpawnDir.split(/; ?/)[1];
        newSpawnDir = newSpawnDir.replace(/ ?;.*/, "");

        if (newSpawnDir == "") {
            newSpawnDir = "~";
        }
    }
    else {
        newSpawnDir = props.match[2];
    }

    if (/^\//.test(newSpawnDir) == false && newSpawnDir != "~") {
        if (spawnDir != "/") {
            newSpawnDir = spawnDir + "/" + newSpawnDir;
        }
        else {
            newSpawnDir = "/" + newSpawnDir;
        }
    } 

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${props[{}]}`);
    
    let receivedText = Object.keys(props.match).map(function(key) {
        return props.match[key];
    });

    receivedText = receivedText[receivedText.length - 1];

    checkDir(newSpawnDir, msg.from.id, receivedText);
    
    if (typeof(command) != "undefined") {
        teleExec(newSpawnDir, command, msg.from.id);
    }
});

bot.on(/^\/cmd (.+)/, (msg, props) => {
    teleExec(spawnDir, props.match[1], msg.from.id);
});

bot.on(/.+(\?+)$/, (msg, props) => {
    let response = "Weet ik veel!";
    let receivedText = Object.keys(props.match).map(function(key) {
        return props.match[key];
    });

    receivedText = receivedText[receivedText.length - 1];

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${props}\n${response}`);
    return bot.sendMessage(msg.from.id, response);
});

bot.on(/^\/postcode [1-9][0-9]{3} ?[a-zA-Z]{2}/, (msg, props) => {
    let response = "Bedankt voor het doorgeven van een goede postcode!";
    let receivedText = Object.keys(props.match).map(function(key) {
        return props.match[key];
    });

    receivedText = receivedText[receivedText.length - 1];

    addCommand(msg.from.id, receivedText, response);

    console.log(`${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}): ${props[{}]}`);
    return bot.sendMessage(msg.from.id, response);
});


bot.start();