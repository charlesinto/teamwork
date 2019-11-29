CREATE TABLE users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,
gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),role VARCHAR(50),
datecreated timestamp,updatedAt timestamp);

CREATE TABLE article(id serial primary key,title varchar(255) not null,article varchar(255) not null,userid INTEGER not null,
datecreated timestamp,updatedAt timestamp);
-- Create this table
CREATE TABLE comments(id serial primary key,comment varchar(255) not null,articleId varchar(255) not null,
userid INTEGER not null,
datecreated timestamp,updatedAt timestamp);
-- create super admin for test
insert into users(firstname, lastname, email, password, gender,jobrole, department, address, role, datecreated)
VALUES (
    'charles', 'chibuike', 'admin@ex.com', '$2b$10$q0aG/D1/wTrF3q.WYQrrce.SSWOASpOz3i22vdV/O5H5qOnIyv71K', 'male', 'writer' ,'logistics' ,'123cvb ','admin', '2019-11-29 07:30:58.600097'
);

insert into article(title, article, userid, datecreated)
VALUES('o', 'i', 1, 'NOW()'),
('o', 'i', 1, 'NOW()'),
('o', 'i', 1, 'NOW()');