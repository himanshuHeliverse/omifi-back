CREATE DATABASE omifiback

CREATE TABLE users(
    user_id SERIAL PRIMARY
)
CREATE TABLE customer (user_id serial PRIMARY KEY, firstname VARCHAR ( 25 ), lasttname VARCHAR ( 25 ),password VARCHAR ( 225 ) ,email VARCHAR ( 255 ) ,UNIQUE (email) );