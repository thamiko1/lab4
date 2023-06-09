# CNL Final Project
Please run the following command to access the final version.
```sh
git checkout v3.0
```
## Warning
* Before running `game.js`, please build a directory `log` in `public`
* Since we apply sha256 to the password, the account set up before will be invalid.

## Setup
```sh
npm install
# node --version
# v18.16.0
sudo mysql < reset_sql.sql # Update SQL settings
bash dir.sh # mkdir for history
```
<!--
## App.js
```sh
npm install
npm i dotenv ejs
sudo mysql < reset_sql.sql
nodemon app.js
```
-->

## Run game.js
```sh
node game.js
```

Then you can connect to `localhost:3000` with your browser.

<!-- 
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
sudo mysql -u lab4 -p # Squirrel1.
show databases;
create DATABASE USR_GAME_RECORD;
use USR_GAME_RECORD;
create table single (UID varchar(255),Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
alter table single add column GRE varchar(255) after Computer; # For GRE
create table multi (UID varchar(255),Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
alter table multi add column GRE varchar(255) after Computer; # For GRE

create database Global_Ranking;
use Global_Ranking;
create table single (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into single (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Food","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("School","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Traffic","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Sport","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Nature","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Computer","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1");
insert into single (mode,1st,2nd,3rd,4th,5th) values ("GRE","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"); # For GRE

create table multi (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into multi (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Food","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("School","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Traffic","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Sport","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Nature","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"),("Computer","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1");
insert into multi (mode,1st,2nd,3rd,4th,5th) values ("GRE", "99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1","99:99:99 -1,-1,-1"); # For GRE
```
-->

* If you have some exist table, please drop it with the following command.
```sh
DROP table $i;
```

## Artwork References and Attribution
used picture sources:
https://www.myfreetextures.com/old-cut-wood-tree-background-photo/
https://www.myfreetextures.com/over-30-free-big-beautiful-and-seamless-wood-textures/
https://www.stickpng.com/img/memes/patrick-star/patrick-star-head
https://pixabay.com/illustrations/search/squirrel/
https://pixabay.com/illustrations/acorn-autumn-oak-cartoon-fall-7997077/
https://www.clipartmax.com/middle/m2i8G6N4N4Z5A0G6_patrick-star-clipart-patrick-star/
https://pixabay.com/vectors/bubble-speech-talk-words-thinking-157905/
