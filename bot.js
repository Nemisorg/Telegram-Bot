/* eslint-disable max-lines-per-function */
/* eslint-disable multiline-comment-style */
/* eslint-disable capitalized-comments */
/* eslint-disable no-console */
const TeleBot = require("telebot");
const mongo = require("mongodb").MongoClient;
const os = require("os");
const { exec } = require("child_process");

const greetings = ["Hallo!", "Hoi!", "Hey!", "Goedendag!", "Hoe gaat ie!"];
const hostname = os.hostname();
const user = os.userInfo().username;
var spawnDir = require("path").dirname(require.main.filename);
var url = "mongodb://localhost/";
var TeleID;


console.log(user);
console.log(hostname);
console.log(spawnDir);

function grepRandomResponse(responseList) {
    return responseList[Math.floor(Math.random() * responseList.length)];
}

function teleExec(workingDirectory, command, sendID) {
    exec(`cd ${workingDirectory} ; ${command}`, (_err, stdout, stderr) => {
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
        if (err == null) {
            spawnDir = newSpawnDir;

            console.log(`Er is geswitcht naar ${spawnDir}`);
            return bot.sendMessage(sendID, `Er is geswitcht naar ${spawnDir}`);
        } else {
            console.log(`${stdout}\n${stderr}`);
            return bot.sendMessage(sendID, `${stdout}\n${stderr}`);
        }
    });
}

function addUserDB(ID, name) {
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TeleBotDB");
        dbo.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            var userExists;
            for (var i = 0; i < result.length; i++) {
                TeleID = result[i].ID;
                if (TeleID == ID) {
                    userExists = true;
                    break;
                } else {
                    userExists = false;
                }
            }
            if (userExists == true) {
                console.log("a");
                var myquery = { ID: TeleID };
                var newvalues = { $set: { test: "iets???" } };
                dbo.collection("users").updateOne(myquery, newvalues, function(err, _res) {
                    if (err) throw err;
                    db.close();
                });
            } else {
                console.log("b");
                var newUser = { name: name, ID: ID };
                dbo.collection("users").insertOne(newUser, function(err, _res) {
                    if (err) throw err;
                    db.close();
                });
            }
        });
    });

    /* mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TeleBotDB");
        if (userExists == true) {
            console.log("a");
            var myquery = { ID: TeleID };
            var newvalues = { $set: {test: "iets???" } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                db.close();
            });
        } else {
            console.log("b");
            var newUser = { name: name, ID: ID };
            dbo.collection("users").insertOne(newUser, function(err, res) {
                if (err) throw err;
                db.close();
            });
        }
        userExists = false;
    }); */
}

const bot = new TeleBot({
    token: "762616559:AAExFjyOjKP9zM3_LazkpVYnViv9aC8bHog"
});

bot.on("/start", (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het /start commando gegeven.`);
    return bot.sendMessage(msg.from.id, "Hello world!");
});

bot.on("/wiebenje", (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft gevraagd naar mijn naam.`);
    return bot.sendMessage(msg.from.id, "Ik ben qwerty een multifunctionele Telegram bot. Ik antwoord op commando's en maak Shell access mogelijk. Veel plezier!");
});

bot.on("/foto", (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft een foto opgevraagd.`);
    return bot.sendPhoto(msg.from.id, "images/meme.jpg");
});

bot.on("/versie", (msg) => {
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
    var newSpawnDir;
    if (typeof(props.match[2]) == "undefined") {
        newSpawnDir = "~";
    } else if (props.match[2].includes(";")) {
        newSpawnDir = props.match[2];
        var command = newSpawnDir.split(/; ?/)[1];
        newSpawnDir = newSpawnDir.replace(/ ?;.*/, "");

        if (newSpawnDir == "") {
            newSpawnDir = "~";
        }
    } else {
        newSpawnDir = props.match[2];
    }

    if (/^\//.test(newSpawnDir) == false && newSpawnDir != "~") {
        if (spawnDir != "/") {
            newSpawnDir = spawnDir + "/" + newSpawnDir;
        } else {
            newSpawnDir = "/" + newSpawnDir;
        }
    } 

    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) wilt switchen naar ${newSpawnDir}.`);
    
    checkDir(newSpawnDir, msg.from.id);
    if (typeof(command) != "undefined") {
        teleExec(newSpawnDir, command, msg.from.id);
    }
});

bot.on(/^\/cmd (.+)/, (msg, props) => {
    var command = props.match[1];

    addUserDB(msg.from.id, `${msg.from.first_name} ${msg.from.last_name}`)

    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft het commando ${command} uitgevoerd als user ${user}.`);
    teleExec(spawnDir, command, msg.from.id);
});

bot.on(/.+(\?+)$/, (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft iets gevraagd waar ik geen antwoord op heb.`);
    return bot.sendMessage(msg.from.id, "Weet ik veel!");
});

bot.on(/^\/postcode [1-9][0-9]{3} ?[a-zA-Z]{2}/, (msg) => {
    console.log(`Gebruiker ${msg.from.id} (${msg.from.first_name} ${msg.from.last_name}) heeft een juiste postcode ingevuld.`);
    return bot.sendMessage(msg.from.id, "Bedankt voor het doorgeven van een goede postcode!");
});


bot.start();