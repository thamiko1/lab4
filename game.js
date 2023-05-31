import express from "express";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vocab from "./public/new.json" assert { type: "json" };
import cookieParser from "cookie-parser";
var new_userID = 0,
  new_roomID = 0;

//
// SOME CLASSES
//

class UserProfile {
  constructor(userID, max_user, topic) {
    // userID   (int): the user's ID
    // max_user (int): the number of people the user wants to play
    // topic    (str): the user's selected topic
    this.userID = userID;
    this.max_user = max_user;
    this.topic = topic;
    this.hp = 100;
    this.question_id = 0;
  }
}

class RoomProfile {
  constructor(roomID, max_user, topic) {
    // roomID   (int): the room's ID
    // max_user (int): the maximum number of people when staring the game
    // topic    (str): the room's topic
    this.roomID = roomID;
    this.max_user = max_user;
    this.topic = topic;
    this.users = new Object(); // users[userID] = userProfile

    this.questions = build_questions(topic);
    this.boss_hp = 100;
    this.start_time = 0; // Date.now();
    this.end_time = 0;
  }

  get num_user() {
    return Object.keys(this.users).length;
  }

  get canStart() {
    return this.num_user >= this.max_user;
  }

  start() {
    this.start_time = Date.now();
  }

  end() {
    this.end_time = Date.now();

    let total_time = Math.floor((this.end_time - this.start_time) / 10);
    let count = total_time % 100;
    total_time = Math.floor(total_time / 100);
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
  }

  addUser(userID, max_user, topic) {
    this.users[userID] = new UserProfile(userID, max_user, topic);
  }
}

class RoomManager {
  constructor() {
    this.pending_rooms = new Object(); // pending_rooms[topic] = roomID
    this.user2room = new Object(); // user2room[userID] = roomID
    this.rooms = new Object(); // rooms[roomID] = roomProfile
    // this.users = new Object();         // users[userID] = userProfile
  }

  addUser(userID, max_user, topic) {
    let roomID = -1;
    if (max_user == 1 || !(topic in this.pending_rooms)) {
      if (max_user > 1) this.pending_rooms[topic] = new_roomID;
      this.rooms[new_roomID] = new RoomProfile(new_roomID, max_user, topic);
      roomID = new_roomID++;
    } else roomID = this.pending_rooms[topic];
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

//
// SOME FUNCTIONS
//

function getRandom(min, max) {
  // Sample from [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
}

function build_questions(category = "school") {
  let vocab_new = vocab.filter((word) => word["category"].includes(category));
  vocab_new.sort(() => Math.random() - 0.5); // shuffle
  let chinese_to_english = {};

  for (let word of vocab_new) {
    for (let def of word["definition"]) {
      if (chinese_to_english[def] == undefined)
        chinese_to_english[def] = Array();
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
    let definition =
      word["definition"][getRandom(0, word["definition"].length)];
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
      definition: definition,
      options: options,
      correct_option: correct_option,
    });
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

//
// SETUP
//

var app = express();
var server = http.createServer(app);
var io = new Server(server);
var manager = new RoomManager();

// import * as mysql from 'mysql2'

// var connection_usr_game_record = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'USR_GAME_RECORD',
// });

// var connection_global_rank = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'Global_Ranking'
// });

// connection_usr_game_record.connect(function(err){
//     if (err) throw err;
//     console.log("Connected!");
// });

// connection_global_rank.connect(function(err){
//     if (err) throw err;
//     console.log("Connected!");
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.listen(3333);

// Configure express-session middleware
const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

// Use the public directory to access files
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cookieParser());
io.engine.use(sessionMiddleware);

app.get("/", function (req, res) {
  // This is just a test for menu, so it will redirect to menu immediately.
  // req.session.userID = new_userID++;
  //   const username = req.cookies.username;
  res.redirect("/menu");
  //   res.send(`Username: ${username}, after:${req.sessionID}`);
});

//
// MENU
//

app.get("/menu", function (req, res) {
  const username = req.cookies.username;
  res.render("menu", { username: username });
});

app.post("/menu_start", function (req, res) {
  const username = req.cookies.username;
  res.redirect("/game");
});

app.get("/profile", (req, res) => {
  res.render("profile", { username: req.cookies.username }); // Render the profile.ejs view and pass the username
});

//
// pending
//

app.get("/pending", function (req, res) {
  console.log(req.session.userID);
  res.sendFile(__dirname + "/public/pending.html");
});

//
// GAME
//

// Handle the GET request with "/game" URL suffix
app.get("/game", function (req, res) {
  let roomID = manager.addUser(
    req.session.userID,
    req.session.max_user,
    req.session.topic
  );
  req.session.roomID = roomID;
  console.log(req.session);
  // Go to experimental game2
  res.sendFile(__dirname + "/public/game2.html");
});


function send_question(socket, room, userID, roomID) {
    let question = room.questions[room.question_id];
    io.to(roomID).emit("new question", question["definition"], question["options"], room.question_id);
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
  let roomID = socket.request.session.roomID,
    userID = socket.request.session.userID;
  let room = manager.rooms[roomID];

  console.log(room.num_user, room.max_user);
  socket.join(roomID);
  io.to(roomID).emit("update num_user", room.num_user, room.max_user);

    if (room.canStart) {
        io.to(roomID).emit("game start");
        let question = room.questions[0];
        io.to(roomID).emit("new question", question["definition"], question["options"], room.question_id);
        room.start();
    }

  // FOR GAMING:

  // send_question(socket);
  let htmlContent =
    "<html>\n<head>\n<title>Questions and Answers</title>\n</head>\n<body>\n";
  htmlContent += "<h1>Answer Logs</h1>\n";

  socket.on("game clicked", function (data) {
    console.log(data);
    let res;
    let userID = socket.request.session.userID,
      roomID = socket.request.session.roomID;
    let room = manager.rooms[roomID],
      user = room.users[userID];

    // Determine whether the answer is correct or wrong.

        if (data == room.questions[room.question_id]["correct_option"]) {    
            res = "correct";
            // htmlContent += `<p> <span>&#10004;</span> ${question_id}. ${questions[question_id]["definition"]} You answered: ${data}, which is correct.</p>\n`;
        }
        else {
            res = "wrong";
            // htmlContent += `<p> <span>&#10008;</span> ${question_id}. ${questions[question_id]["definition"]} You answered: ${data}. The correct answer was: ${questions[question_id]["correct_option"]}</p>\n`;
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
        
        // if (res == "correct") {
        //     room.end();
        //     io.to(roomID).emit("game end", room.time_str);
        //     room.boss_hp -= 10;
        //     io.to(roomID).emit("update boss hp", room.boss_hp);
        // }
        // else {
        //     room.end();
        //     io.to(roomID).emit("game end", room.time_str);
        //     room.user_hp -= 20;
        //     socket.emit("update player hp", room.user_hp);
        // }
        
        
        if (room.user_hp <= 0 || room.boss_hp <= 0) {
            socket.disconnect();
            return;
            // Write questions and answers to a new HTML file
            /*
            fs.writeFile("./public/wrong_answer.html", htmlContent, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Questions and answers written to questions.html");
                }
            });
            */
    }
    user.question_id++;
    send_question(socket, room, userID);
  });

  socket.on("timeout", function () {
    let userID = socket.request.session.userID,
      roomID = socket.request.session.roomID;
    let room = manager.rooms[roomID],
      user = room.users[userID];

    user.hp -= 20;
    socket.emit("update player hp", user.hp);
    user.question_id++;
    send_question(socket, room, userID);
    // squirrel_hp -= 20;
    // socket.emit("update hp", squirrel_hp, point_hp);
    // question_id++;
    // send_question(socket);
  });
});

//
// END
//

app.get("/win_end", function (req, res) {
  // Send gaming.html to client
  res.sendFile(__dirname + "/public/win_end.html");
});

app.get("/lose_end", function (req, res) {
  // Send gaming.html to client
  res.sendFile(__dirname + "/public/lose_end.html");
});
