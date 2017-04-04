var express = require('express');
var app  = express();
var pgp = require('pg-promise')();

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'kulcare_search',
    user: 'sarbjeetsingh',
    password: ''
};
var db = pgp(cn);

app.get('/',function(req,res){
  res.send('Welcome to express')
})
app.get('/users',function(req,res){
  db.any("select * from users  order by id limit 10", [true])
    .then(data => {
        // success;
        res.json(data);
    })
    .catch(error => {
        res.json(error);
    });
})
app.get('/users/:id',function(req,res){
  db.any("select * from users where id="+req.params.id, [true])
    .then(data => {
        // success;
        res.json(data);
    })
    .catch(error => {
        res.json(error);
    });
})

var server = app.listen('4000',function(){
  console.log('Server runing at http://localhost:'+server.address().port);
});