// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'thamiko1',
// //   database : 'test'
// });
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

var express = require('express');
var app = express();
 
// app.use('/public', express.static('public'));
 
// app.get('/', function (req, res) {
//    res.send('Hello World');
// })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register.html');
});
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
 
})