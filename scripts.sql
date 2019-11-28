CREATE TABLE users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,
gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),
datecreated timestamp,updatedAt timestamp);