//
// BASIC
//
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

var app = express();
var server = http.createServer(app);
var io = new Server(server);
var nicknames = [];

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.listen(3000);

// Use the public directory to access files
app.use("", express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    // This is just a test for menu, so it will redirect to menu immediately.
    res.redirect('/menu')
})

import vocab from './public/new.json' assert {type: 'json'}

function getRandom(min, max) {
    // Sample from [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
};


//
// MENU
//

app.get("/menu", function (req, res) {
    res.sendFile(__dirname + '/public/menu.html');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var player_category = "school", player_mode;

app.post("/menu_start", function (req, res) {
    console.log("receive start respose.");
    console.log(req.body);
    player_category = req.body.topic;
    player_mode = req.body.mode;
    res.redirect("/game");
});

//
// profile
//




// 
// GAME
//

// Handle the GET request with "/game" URL suffix
app.get('/game', function (req, res) {
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/game.html');

    // build new questions based on the category
    questions = build_questions(player_category, vocab);
});

var questions = build_questions(player_category, vocab), question_id = 0;
var squirrel_hp = 100, point_hp = 100;

function build_questions(category = "school", vocab) {
    let vocab_new = vocab.filter(word => word['category'].includes(category));
    vocab_new.sort(() => Math.random() - 0.5); // shuffle
    let chinese_to_english = {};

    /*
    for(i=0; i< 10; i++)
        console.log(vocab_new[i]);
    */
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
    cnt = 0;
    for (let [k, v] of Object.entries(chinese_to_english)) {
        console.log(k + ":" + v);
        cnt++;
        if (cnt >= 5) break;
    }
    */


    // console.log(vocab_new[0]);
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
    cnt = 0;f
    for (let q of questions) {
        console.log(q);
        cnt++;
        if (cnt >= 5) break;
    }
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

function send_question(socket) {
    let question = questions[question_id];
    socket.emit("new question", question["definition"], question["options"]);
}


io.sockets.on("connection", function (socket) {
    console.log("New user");
    squirrel_hp = 100, point_hp = 100;
    send_question(socket);

    socket.on("game clicked", function (data) {
        console.log(data);
        let res;
        // Determine whether the answer is correct or wrong.
        if (data == questions[question_id]["correct_option"]) res = "correct";
        else res = "wrong";
        console.log(res);
        socket.emit("question result", res);
        if (res == "correct") point_hp -= 10;
        else squirrel_hp -= 20;
        socket.emit("update hp", squirrel_hp, point_hp);
        if (squirrel_hp <= 0 || point_hp <= 0) socket.disconnect();

        question_id++;
        send_question(socket);
    });


});


//
// END
//

app.get('/end', function (req, res) {
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/end.html');

});


app.get('/end', function (req, res) {
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/end.html');


});
