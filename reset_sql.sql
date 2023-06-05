# Drop all related databases.

SELECT 'Deleting databases...' as "";
DROP DATABASE IF EXISTS ACCOUNTS;
DROP DATABASE IF EXISTS USR_GAME_RECORD;
DROP DATABASE IF EXISTS Global_Ranking;


# For SQL account setup.
SELECT 'Updating ACCOUNTS...' as "";
CREATE DATABASE ACCOUNTS;
USE ACCOUNTS;
CREATE TABLE account(username varchar(255), password varchar(255));
INSERT INTO account (username, password) VALUES ("test", "test"); 
CREATE USER IF NOT EXISTS 'lab4'@'localhost' IDENTIFIED BY 'Squirrel1.';
GRANT ALL PRIVILEGES ON *.* TO 'lab4'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;


# For user game record setup.
SELECT 'Updating USR_GAME_RECORD...' as "";
create database USR_GAME_RECORD;
use USR_GAME_RECORD;
create table single (UID varchar(255),Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
alter table single add column GRE varchar(255) after Computer; # For GRE
create table multi (UID varchar(255),Common varchar(255),Food varchar(255),School varchar(255),Traffic varchar(255),Sport varchar(255),Nature varchar(255),Computer varchar(255));
alter table multi add column GRE varchar(255) after Computer; # For GRE


# For global game setup.
SELECT 'Updating Global_Ranking...' as "";

create database Global_Ranking;
use Global_Ranking;
create table single (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into single (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("Food","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("School","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("Traffic","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("Sport","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("Nature","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"),("Computer","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1");
insert into single (mode,1st,2nd,3rd,4th,5th) values ("GRE","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1","99:99:99 -1"); # For GRE

create table multi (mode varchar(255), 1st varchar(255), 2nd varchar(255), 3rd varchar(255), 4th varchar(255), 5th varchar(255));
insert into multi (mode,1st,2nd,3rd,4th,5th) values ("Common","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("Food","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("School","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("Traffic","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("Sport","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("Nature","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"),("Computer","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1");
insert into multi (mode,1st,2nd,3rd,4th,5th) values ("GRE", "99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1","99:99:99 -1, -1, -1"); # For GRE


# sudo mysql < reset_sql.sql