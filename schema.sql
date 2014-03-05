drop database node_db;
create database node_db;
use node_db;
drop table if exists grocery;
create table grocery(
  id int not null auto_increment primary key,
  name varchar(255) not null,
  INDEX(id)
);

drop table if exists user;
create table user(
  id int not null auto_increment primary key,
  email varchar(255) not null,
  INDEX(id)
);

drop table if exists grocery_list;
create table grocery_list(
  user_id int not null,
  grocery_id int not null,
  FOREIGN KEY(grocery_id) REFERENCES grocery(id) ON DELETE Cascade ON UPDATE Cascade,
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE Cascade ON UPDATE Cascade,
  PRIMARY KEY(user_id,grocery_id),
  INDEX(user_id,grocery_id)
);

drop table if exists posts;
create table posts(
  id int not null auto_increment primary key,
  message varchar(255) not null,
  user_id int not null,
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE Cascade ON UPDATE Cascade,
  INDEX(id)
);

-- Insert data
INSERT INTO grocery(name) values("apples"),("oranges"),("beans"),("Prego Traditional Spaghetti Sauce"),("Prego Traditional Fettucine Sauce"),("Spaghetti Noodles"),("Rigatonni Noodles");
INSERT INTO user(email) values("ericroos13@gmail.com"),("zackeryathomas@gmail.com"),("kyle_wilkinson@baylor.edu"),("kmroos54@gmail.com");
INSERT INTO grocery_list(user_id,grocery_id) VALUES (1,1),(1,2),(1,3),(1,4),(2,5),(2,6),(3,1),(3,2),(4,1),(4,5),(4,7);
INSERT INTO posts(user_id,message) VALUES(1,"hello world"),(1,"Can you send me the recipe?"),(2,"This is my new recipe");
