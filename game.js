import express from 'express'
import session from 'express-session'
import http from 'http'
import { Server } from 'socket.io'
import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import vocab from './public/new.json' assert {type: 'json'}
import * as mysql from 'mysql2'

var new_userID = 0, new_roomID = 0;

///
/// SOME CLASSES
///

class UserProfile {
    constructor (userID, max_user, topic) {
        // userID   (int): the user's ID
        // max_user (int): the number of people the user wants to play 
        // topic    (str): the user's selected topic
        this.userID = userID;
        this.max_user = max_user;
        this.topic = topic;
        this.question_log = [];
    }
}

class RoomProfile {
    constructor (roomID, max_user, topic) {
        // roomID   (int): the room's ID
        // max_user (int): the maximum number of people when staring the game 
        // topic    (str): the room's topic
        this.roomID = roomID;
        this.max_user = max_user;
        this.topic = topic;
        this.users = new Object(); // users[userID] = userProfile

        this.questions = build_questions(topic);
        this.boss_hp = 10;
        this.user_hp = 100;
        if (this.max_user == 1){
            this.de_boss = 10;
            this.de_user = 20;
        }
        else{
            this.de_boss = 5;
            this.de_user = 10;
        }

        this.correct = 0;
        this.wrong = 0;
        this.question_id = 0;
        this.click_set = new Set();
        
        this.start_time = 0; // Date.now();
        this.end_time = 0;

        this.time_str = `99:99:99`;

        this.logFile = "log/log_" + this.roomID + ".html";
        this.htmlContent = '<html>\n<head>\n<title>Questions and Answers</title>\n</head>\n<body>\n';
        this.htmlContent += '<h1>Answer Logs</h1>\n';
    }

    get num_user() {
        return Object.keys(this.users).length;
    }

    get canStart() {
        return (this.num_user >= this.max_user);
    }

    start() {
        this.start_time = Date.now();
    }

    end() {
        this.end_time = Date.now();

        let total_time = Math.floor((this.end_time - this.start_time) / 10);
        let count = total_time % 100;
        total_time = Math.floor(total_time / 100)
        let second = total_time % 60;
        total_time = Math.floor(total_time / 60);
        let minute = total_time;

        let minString = minute;
        let secString = second;
        let countString = count;

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (count < 10) {
            countString = "0" + countString;
        }
        this.time_str = minString + ":" + secString + ":" + countString;

    }

    addUser(userID, max_user, topic) {
        this.users[userID] = new UserProfile(userID, max_user, topic);
    }

    removeUser(userID) {
        delete this.users[userID];
    }
}

class RoomManager {
    constructor() {
        this.pending_rooms = new Object(); // pending_rooms[topic] = roomID
        this.user2room = new Object();     // user2room[userID] = roomID
        this.rooms = new Object();         // rooms[roomID] = roomProfile
        this.users = new Set();            // the users in the room
        // this.users = new Object();         // users[userID] = userProfile
    }

    addUser(userID, max_user, topic) {
        let roomID = -1;
        if (max_user == 1 || !(topic in this.pending_rooms)) {
            if (max_user > 1) this.pending_rooms[topic] = new_roomID;
            this.rooms[new_roomID] = new RoomProfile(new_roomID, max_user, topic);
            roomID = new_roomID++;
        }
        else roomID = this.pending_rooms[topic];
        this.user2room[userID] = roomID;

        let room = this.rooms[roomID]; // reference(?
        room.addUser(userID, max_user, topic);

        if (room.num_user >= room.max_user) {
            // Delete the pending status
            if (max_user > 1) delete this.pending_rooms[topic];
        }

        return roomID;
    }

}


///
/// SOME FUNCTIONS
///

function getRandom(min, max) {
    // Sample from [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
};

function build_questions(category = "school") {
    let vocab_new = vocab.filter(word => word['category'].includes(category));
    vocab_new.sort(() => Math.random() - 0.5); // shuffle
    let chinese_to_english = {};

    for (let word of vocab_new) {
        for (let def of word["definition"]) {
            if (chinese_to_english[def] == undefined) chinese_to_english[def] = Array();
            chinese_to_english[def].push(word["word"]);
        }
    }
    /*
    chinese_to_english = {
        "作業": [assignment, homework],
        ...
    }
    */

    let questions = [];
    for (let word of vocab_new) {
        let definition = word["definition"][getRandom(0, word["definition"].length)];
        let correct_option = word["word"];
        let options = [word["word"]];
        while (options.length < 4) {
            let new_word = vocab_new[getRandom(0, vocab_new.length)]["word"];
            if (options.includes(new_word)) continue;
            if (chinese_to_english[definition].includes(new_word)) continue;
            options.push(new_word);
        }
        options.sort(() => Math.random() - 0.5); // shuffle
        questions.push({
            "definition": definition,
            "options": options,
            "correct_option": correct_option
        })
    }

    /*
    questions = [
        {
            definition: '功課',
            options: ['subject', 'homework', 'science', 'math']
            correct_option: 'homework'
        },
        ...
    ]
    */
    return questions;
}
function format_time_cmp(t1, t2) {
    console.log(`cmp ${t1} ${t2} ${typeof t1} ${typeof t2}`);
    if(t1>t2 || t1==null){
        return t2;
    }
    else{
        return t1;
    }

} 

///
/// SETUP
///

var app = express();
var server = http.createServer(app);
var io = new Server(server);
var manager = new RoomManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var connection_usr_game_record = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'USR_GAME_RECORD'
  });

var connection_global_rank = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Global_Ranking'
  });
server.listen(3000);

const sessionMiddleware = session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
});

// Use the public directory to access files
app.use("", express.static(__dirname + '/public'));
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
io.engine.use(sessionMiddleware);


app.get("/", function (req, res) {
    let debug = true;
    if (debug) {
        // If debug is true, it will redirect to the menu page.
        // The new userID will be new_userID.
        req.session.userID = new_userID++;
        res.redirect('/menu');
    }
    else {
        // If debug is false, it will ask the user to login first.
        res.redirect('/login');
    }
})


///
/// MENU
///

app.get("/menu", function (req, res) {
    console.log('Logged in users:', manager.users);
    if (req.session.userID == null) {
        res.redirect("/");
    }
    else {
        manager.users.add(req.session.userID);
        console.log(req.session.userID, 'goes to the menu.');
        res.sendFile(__dirname + '/public/menu.html');
    }
});

// handle input form
app.post("/menu_start", function (req, res) {
    console.log("receive start respose.");
    console.log(req.body);

    req.session.max_user = (req.body.mode == "single-player" ? 1 : 3);
    req.session.topic = req.body.topic;
    res.redirect("/game");
});

/// 
/// GAME
///

// Handle the GET request with "/game" URL suffix
app.get('/game', function (req, res) {
    if (req.session.userID == null){
        res.redirect("/");
    }
    let roomID = manager.addUser(req.session.userID, req.session.max_user, req.session.topic);
    req.session.roomID  = roomID;
    console.log(req.session);
    // Go to experimental game2
    res.sendFile(__dirname + '/public/game2.html');
});


function send_question(socket, room, userID, roomID) {
    let question = room.questions[room.question_id];
    io.to(roomID).emit("new question", question["definition"], question["options"], room.question_id);
}
function update_usr_db(mode,UID,room_total_time,topic){
    let sql_select=`SELECT ${topic.charAt(0).toUpperCase() + topic.slice(1)} FROM USR_GAME_RECORD.${mode} WHERE UID = "${UID}"`;
    console.log(`call update_usr_db UID=${UID}`);
    console.log(`${sql_select}`);
    connection_usr_game_record.query(
        sql_select, 
        function(err, results, fields) {
            //result_undefined=(typeof results === undefined);
            //console.log(`select single ${results} ${typeof Object.keys(results)} ${results[UID][topic.charAt(0).toUpperCase() + topic.slice(1)]}`);
            //console.log(results[UID][topic.charAt(0).toUpperCase() + topic.slice(1)]);
            if(`${results}`==`` || `${typeof results}`==undefined || `${typeof results}`==`undefined`){
                //result_str='empty';
                //result_undefined=true;
                let sql_insert=`insert into USR_GAME_RECORD.${mode} (UID, ${topic.charAt(0).toUpperCase() + topic.slice(1)}) values ("${UID}","${room_total_time}")`;
                console.log(`select single insert`);
                console.log(`${sql_insert}`);
                connection_usr_game_record.query( sql_insert,
                    function(err, rows) {
                        console.log(`insert single ${UID}`);
                    }
                );
            }
            else{
                console.log(`select single update`);
                let sql_update=`UPDATE USR_GAME_RECORD.${mode} set ${topic.charAt(0).toUpperCase() + topic.slice(1)} = "${format_time_cmp(room_total_time,results[0][topic.charAt(0).toUpperCase() + topic.slice(1)])}" where UID = "${UID}"`
                console.log(sql_update);
                connection_usr_game_record.query( sql_update,
                function(err, rows) {
                    console.log(`update single ${UID}`);
                }
            );
            }
            console.log(`select single ${results}`); // results contains rows returned by server
            //console.log(`select single result_str ${result_str}`);
            //console.log(fields); // fields contains extra meta data about results, if available
        }
    );
}
function update_global_db(mode,UID1,UID2,UID3,room_total_time,topic){
    let sql_select=`SELECT * FROM Global_Ranking.${mode} WHERE mode = "${topic.charAt(0).toUpperCase() + topic.slice(1)}"`;
    //console.log(`call update_usr_db UID=${UID}`);
    console.log(`${sql_select}`);
    connection_global_rank.query(
        sql_select, 
        function(err, results, fields) { 
            console.log(`select single update`);
            console.log(results);
            let columns=['1st','2nd','3rd','4th','5th'];
            let i = 0;
            let update_str=room_total_time+' '+UID1+','+UID2+','+UID3;
            let sql_update='';
            while (i < columns.length) {
                if(update_str<results[0][columns[i]]){
                    let j=3;
                    while(j>=i){
                        sql_update=`UPDATE Global_Ranking.${mode} set ${columns[j+1]} = "${results[0][columns[j]]}" where mode = "${topic.charAt(0).toUpperCase() + topic.slice(1)}"`
                        console.log(`${sql_update}`);
                        connection_usr_game_record.query( sql_update,
                            function(err, rows) {
                                console.log(`update ${mode}`);
                            }
                        );
                        j--;
                    }
                    sql_update=`UPDATE Global_Ranking.${mode} set ${columns[i]} = "${update_str}" where mode = "${topic.charAt(0).toUpperCase() + topic.slice(1)}"`
                    console.log(`${sql_update}`);
                    connection_usr_game_record.query( sql_update,
                        function(err, rows) {
                            console.log(`update ${mode}`);
                        }
                    );
                    break
                }
                else{
                    console.log(`cmp ${results[0][columns[i]]} ${update_str}`);
                }
                i++;
            }
            console.log(`select single ${results}`); // results contains rows returned by server
        }
    );
}
// function generateHTMLContent() {
//     let htmlContent = '<html>\n<head>\n<title>Questions and Answers</title>\n</head>\n<body>\n';
//     htmlContent += '<h1>Questions and Answers</h1>\n';
  
//     questions.forEach((question, index) => {
//       htmlContent += `<h2>Question ${index + 1}</h2>\n`;
//       htmlContent += `<p>${question.question}</p>\n`;
  
//       htmlContent += '<ul>\n';
//       question.answers.forEach((answer, answerIndex) => {
//         htmlContent += `<li>Option ${answerIndex + 1}: ${answer}</li>\n`;
//       });
//       htmlContent += '</ul>\n';
  
//       htmlContent += '<hr>\n'; // Add a horizontal line separator between questions
//     });
  
//     htmlContent += '</body>\n</html>';
//     return htmlContent;
//   }
  

// const fs = require("fs");
io.sockets.on("connection", function (socket) {

    // FOR PENDING:

    // handle new request
    console.log("socket session:", socket.request.session);
    console.log("New user");
    let roomID = socket.request.session.roomID, userID = socket.request.session.userID;
    let room = manager.rooms[roomID], user = room.users[userID];

    console.log(room.num_user, room.max_user);
    socket.join(roomID);
    io.to(roomID).emit("update num_user", room.num_user, room.max_user);

    if (room.canStart) {
      io.to(roomID).emit("game start");
      let question = room.questions[0];
      io.to(roomID).emit("new question", question["definition"], question["options"]);
      room.start();
    }


    // FOR GAMING:

    // let htmlContent = '<html>\n<head>\n<title>Questions and Answers</title>\n</head>\n<body>\n';
    // htmlContent += '<h1>Answer Logs</h1>\n'
    
    socket.on("game clicked", function (data) {
        console.log(data);
        let res;
        // let userID = socket.request.session.userID, roomID = socket.request.session.roomID;
        // let room = manager.rooms[roomID], user = room.users[userID];

        // Determine whether the answer is correct or wrong.

        if (data == room.questions[room.question_id]["correct_option"]) {    
            res = "correct";
            room.htmlContent += `<p> <span>&#10004;</span> ${room.question_id}. ${room.questions[room.question_id]["definition"]} You answered: ${data}, which is correct. &#8680 ${userID}</p>\n`;
        }
        else {
            res = "wrong";
            user.question_log.push(room.questions[room.question_id]);
            room.htmlContent += `<p> <span>&#10008;</span> ${room.question_id}. ${room.questions[room.question_id]["definition"]} You answered: ${data}. The correct answer was: ${room.questions[room.question_id]["correct_option"]} &#8680 ${userID}</p>\n`;
        }
        console.log(res, room.correct, room.wrong);
        // socket.emit("question result", res);
        
        if (!room.click_set.has(userID)){
            if(res == "wrong")
                room.wrong += 1;
            else
                room.correct += 1;
            room.click_set.add(userID);
            io.to(roomID).emit("update block state", room.click_set.size, room.max_user);
            console.log(room.click_set);
            console.log(userID);
            handle_stage();
        }
    });
        
    socket.on("timeout", function () {
        // let userID = socket.request.session.userID, roomID = socket.request.session.roomID;
        // let room = manager.rooms[roomID], user = room.users[userID];
        
        // room.user_hp -= 20;
        // socket.emit("update player hp", room.user_hp);
        room.wrong += 1;
        console.log(room.click_set.has(userID));
        if (!room.click_set.has(userID))
            room.click_set.add(userID);
        user.question_log.push(room.questions[room.question_id]);
        room.htmlContent += `<p> <span>&#10008;</span> ${room.question_id}. ${room.questions[room.question_id]["definition"]} Wake up!!! &#8680 ${userID}</p>\n`;
        handle_stage();
    });
    
    socket.on("disconnect", function (reason) {
        console.log("disconnect", reason);
        room.removeUser(userID);
        io.to(roomID).emit("update num_user", room.num_user, room.max_user);
    });

    function handle_stage(){
        if(room.click_set.size == room.max_user){
            room.end();
            room.boss_hp -= room.de_boss * room.correct;
            room.user_hp -= room.de_user * room.wrong;
            io.to(roomID).emit(
                "stage", 
                room.time_str, 
                room.boss_hp, 
                room.user_hp,
                room.de_boss * room.correct,
                room.de_user * room.wrong,
                room.questions[room.question_id]["correct_option"], 
                room.correct,
                room.wrong
            );
            room.correct = 0;
            room.wrong = 0;
            room.click_set = new Set();

            if (room.user_hp <= 0 || room.boss_hp <= 0) {

                let users=Object.keys(room.users);
                if(room.max_user==1){
                    update_global_db('single',users[0],-1,-1,room.time_str,room.topic);
                }
                else{
                    update_global_db('multi',users[0],users[1],users[2],room.time_str,room.topic);
                }
                console.log(users);

                for (const [for_userID, for_user] of Object.entries(room.users)) {
                    if(room.max_user==1){
                        update_usr_db('single',for_userID,room.time_str,room.topic);
                    }
                    else {
                        update_usr_db('multi',for_userID,room.time_str,room.topic);
                    }
                }

                fs.writeFile("public/" + room.logFile, room.htmlContent, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Questions and answers written to questions.html");
                        console.log(room.logFile);
                    }
                });
                var game_result = 0;
                if (room.user_hp <= 0)
                    game_result = 1;
                io.to(roomID).emit("game over", room.logFile, game_result);
                socket.disconnect();
                return;
            }

            room.question_id++;
            send_question(socket, room, userID, roomID);
        }
    }
});



///
/// END
///

app.get('/win_end', function (req, res) {
    if (req.session.userID == null) {
        res.redirect("/");
    }
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/win_end.html');

});


app.get('/lose_end', function (req, res) {
    if (req.session.userID == null) {
        res.redirect("/");
    }
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/lose_end.html');

});


///
/// LOGIN
///

app.set('view engine', 'ejs'); // Set EJS as the view engine
import { getUsername, getPassword, createUser } from './database.js';


///
/// LOGIN
///

// Route to Login Page
app.get('/login', (req, res) => {
  // res.sendFile(__dirname + '/public/login.html');
  if (req.session.userID) {
    res.redirect('/you_have_already_logged_in'); // already logged in
  } else {
    res.render('login', { error: null }); // Render the login.ejs view with no error
  }
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const fetchedUsername = await getUsername(username);
  const fetchedPassword = await getPassword(username);

  if (fetchedUsername && fetchedPassword === password) {
    // Redirect to port 3000
    req.session.userID = fetchedUsername;

    

    if (manager.users.has(fetchedUsername)) {
        res.render('login', { error: 'You have already logged in.' });
    }
    else {
        res.redirect('/menu');
    }

    // Execute game.js using the "node" command
    /*
    exec('node game.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing game.js: ${error}`);
        return;
      }
      console.log(`game.js executed successfully.`);
    });
    */
  } else {
    // res.redirect('/login');
    res.render('login', { error: 'Invalid username or password.' });
  }
    
});


///
/// REGISTER
///

// Route to Register Page
app.get('/register', (req, res) => {
  // res.sendFile(__dirname + '/public/register.html');
  res.render('register', { success: false, error: null }); // Render the register.ejs view
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.render('register', { success: false, error: 'password_mismatch' }); // Render the register.ejs view with the password mismatch error
    return;
  }

  const existingUser = await getUsername(username);
  if (existingUser) {
    res.render('register', { success: false, error: 'username_exists' }); // Render the register.ejs view with the username exists error
    return;
  }

  await createUser(username, password);
  res.render('register', { success: true, error: null }); // Render the register.ejs view with the success message
  
});


server.on('error', (error) => {
  console.error('Server failed to start:', error);
});


///
/// LOGOUT
///

app.get('/logout', (req, res) => {
  manager.users.delete(req.session.userID);
  req.session.userID = null;
  req.session.roomID = null;
  res.redirect('/login');
});

