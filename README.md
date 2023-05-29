# CNL Final Project
## login page setup
```sh
npm install
npm i dotenv ejs
nodemon app.js
```
* NEED .env TO SET YOUR DATABASE. Here is a sample for .env.
```
MYSQL_HOST='127.0.0.1'
MYSQL_USER='lab4'
MYSQL_PASSWORD='Squirrel1.'
MYSQL_DATABASE='ACCOUNTS'
```
* Some other settings for SQL:
```sh
CREATE DATABASE ACCOUNTS;
USE ACCOUNTS;
CREATE TABLE account(username varchar(255), password varchar(255));
INSERT INTO account (username, password) VALUES ("test", "test"); 
CREATE USER 'lab4'@'localhost' IDENTIFIED BY 'Squirrel1.';
GRANT ALL PRIVILEGES ON *.* TO 'lab4'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
## User & Ranking database setup
```sh
sudo mysql
show databases;
create DATABASE USR_GAME_RECORD;
use USR_GAME_RECORD;
create table single (UID int,Common float(2),Food float(2),School float(2),Traffic float(2),Sport float(2),Nature float(2),Computer float(2));
create table multi (UID int,Common float(2),Food float(2),School float(2),Traffic float(2),Sport float(2),Nature float(2),Computer float(2));
create database Global_Ranking;
use Global_Ranking;
create table single (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into single (mode) values ("Common"),("Food"),("School"),("Traffic"),("Sport"),("Nature"),("Computer");
create table multi (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into multi (mode) values ("Common"),("Food"),("School"),("Traffic"),("Sport"),("Nature"),("Computer");
```

## Write json in game.js example
```js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
var fs = require('fs');

var person = {
  "name": "林品翰",
  "want to say": "感謝各位大神carry我!",
};

var jsonString = JSON.stringify(person);

fs.writeFile('person.json', jsonString, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('檔案已成功寫入！');
  }
});

output : a new file named person.json
{"name":"林品翰","want to say":"感謝各位大神carry我!"}
```
## For game.js
```sh
npm install # install modules in package.json
node game.js
# node --version
# v18.16.0
```
Then you can connect to `localhost:3000` with your browser.
