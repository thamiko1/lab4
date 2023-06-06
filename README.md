# CNL Final Project
* Before you run `game.js`, please make a directory `log` in `public/`.
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
create table single (UID int,Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
create table multi (UID int,Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
create database Global_Ranking;
use Global_Ranking;
create table single (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into single (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Food","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("School","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Traffic","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Sport","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Nature","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Computer","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1");
create table multi (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into multi (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Food","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("School","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Traffic","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Sport","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Nature","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Computer","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1");
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

## Artwork References and Attribution
used picture sources:
https://www.myfreetextures.com/old-cut-wood-tree-background-photo/
https://www.myfreetextures.com/over-30-free-big-beautiful-and-seamless-wood-textures/
https://www.stickpng.com/img/memes/patrick-star/patrick-star-head
https://pixabay.com/illustrations/search/squirrel/
https://pixabay.com/illustrations/acorn-autumn-oak-cartoon-fall-7997077/
https://www.clipartmax.com/middle/m2i8G6N4N4Z5A0G6_patrick-star-clipart-patrick-star/
https://pixabay.com/vectors/bubble-speech-talk-words-thinking-157905/
