# express
express application
# Installation
- Clone this app
- goto express folder
- hit `npm install`
- hit `npm run dev`
- Now goto localhost:4000

# Run app

- change your connection string in index.js
- goto `localhost:4000/users` -  It will fetch 10 users (authenticated)
- goto `localhost:4000/users/1` -  It will user with id 1 (authenticated)

# create table in postgres
`CREATE TABLE dummy_users(
  ID             SERIAL PRIMARY KEY     NOT NULL,
  NAME           TEXT    NOT NULL,
  PHONE_NUMBER   TEXT     NOT NULL,
  PASSWORD       VARCHAR(50) NOT NULL
);`

# post data to database
 - Hit `localhost:4000/create_user` with params `name,phone_number,password`
# sign in (use postman or any other http api client)
 - Hit `localhost:4000/sign_in` - you would get a token in response
 - use that token to access authenticated api's above

