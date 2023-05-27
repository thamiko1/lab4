```
npm install
npm i dotenv ejs
nodemon app.js
NEED .env TO SET YOUR DATABASE.
sample .env:
MYSQL_HOST='127.0.0.1'
MYSQL_USER='lab4'
MYSQL_PASSWORD='Squirrel1.'
MYSQL_DATABASE='ACCOUNTS'
```
Some other settings for SQL:
```
CREATE DATABASE ACCOUNTS;
USE ACCOUNTS;
CREATE TABLE account(username varchar(255), password varchar(255));
INSERT INTO account (username, password) VALUES ("test", "test"); 
CREATE USER 'lab4'@'localhost' IDENTIFIED BY 'Squirrel1.';
GRANT ALL PRIVILEGES ON *.* TO 'lab4'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```


## For game.js
```sh
npm install # install modules in package.json
node game.js
# node --version
# v18.16.0
```
Then you can connect to `localhost:3000` with your browser.
