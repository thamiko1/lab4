//
// BASIC
//

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(3000);

// Use the public directory to access files
app.use("", express.static(__dirname + '/public'));

app.get("/", function(req, res) {
	// This is just a test for game, so it will redirect to game immediately.
	res.redirect('/game')
})

var vocab = require(__dirname + "/public/new.json");

function getRandom(min, max){
	// Sample from [min, max)
    return Math.floor(Math.random()*(max-min)) + min;
};


// 
// GAME
//

// Handle the GET request with "/game" URL suffix
app.get('/game', function(req, res) {
    // Send gaming.html to client
    res.sendFile(__dirname + '/public/game.html');
})

var questions = build_questions("school"), question_id = 0;

function build_questions(category) {
	let vocab_new = vocab.filter(word => word['category'].includes(category));
	vocab_new.sort(() => Math.random() - 0.5); // shuffle
	let chinese_to_english = {};
	/*
		{
			"作業": [assignment, homework],
			...
		}
	*/
	for(i=0; i< 10; i++)
		console.log(vocab_new[i]);
	for (let word of vocab_new) {
		for (let def of word["definition"]) {
			if (chinese_to_english[def] == undefined) chinese_to_english[def] = Array();
			chinese_to_english[def].push(word["word"]);
		}
	}

	cnt = 0;
	for (let [k, v] of Object.entries(chinese_to_english)) {
		console.log(k + ":" + v);
		cnt++;
		if (cnt >= 5) break;
	}
		
	
	console.log(vocab_new[0]);
	let questions = [];
	for (let word of vocab_new) {
		definition = word["definition"][getRandom(0, word["definition"].length)];
		correct_option = word["word"];
		options = [word["word"]];
		while (options.length < 4) {
			new_word = vocab_new[getRandom(0, vocab_new.length)]["word"];
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

	cnt = 0;
	for (let q of questions) {
		console.log(q);
		cnt++;
		if (cnt >= 5) break;
	}
	/*
	question = [
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


io.sockets.on("connection", function(socket) {
	console.log("New user");
	send_question(socket);

	socket.on("game clicked", function (data) {
		console.log(data);
		let res;
		if (data == questions[question_id]["correct_option"]) res = "correct";
		else res = "wrong";
		console.log(res);
		socket.emit("question result", res);
		question_id++;
		send_question(socket);
	})

});