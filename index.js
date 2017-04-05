var express    = require('express');
var app        = express();
var connection = require('./db');
var pgp        = require('pg-promise')();
var bodyParser = require('body-parser');
var jwt        = require('jsonwebtoken');
// secretKey to sign jwt token
var secretKey  = 'khuljasimsim';

// get connection variable from your connection file db.js
// create file db.js and add the below code with your credentials in it

// module.exports.cn = {
//   host: 'localhost',
//   port: 5432,
//   database: 'db_name',
//   user: 'username',
//   password: 'password'
// };

var cn = connection.cn;
var db = pgp(cn);

// we need bodyParser to get params from post request
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

 // Authenticate user
 function authenticate(req,res,next){
   var token = req.headers['x-access-token'];
    if(!token){
      res.json({
        data:{
          success:false,
          message: 'user unauthorized'
        }
      });
    }
    else{
      jwt.verify(token, new Buffer(secretKey, 'base64'), function(err, decoded) {
        if(err){
          res.send(err);
        }
        else{
          next();
        }
      });

    }
 }

app.get('/',function(req,res){
  res.send('Welcome to express')
})

app.get('/users',authenticate,function(req,res){
  db.any("select * from dummy_users  order by id limit 10")
    .then(data => {
        // success;
        res.json(data);
    })
    .catch(error => {
        res.json(error);
    });
})

app.get('/users/:id',authenticate,function(req,res){
  db.any("select * from dummy_users where id=$1", [req.params.id])
    .then(data => {
        // success;
        res.json(data);
    })
    .catch(error => {
        res.json(error);
    });
})
// create user post request
app.post('/create_user', function(req, res) {
    var name          = req.body.name;
    var phone_number  = req.body.phone_number;
    var password      = req.body.password;

    db.none('insert into dummy_users(name,phone_number,password) values($1, $2, $3)', [name, phone_number, password])
     .then(() => {
          res.json({
            data:{
              success:true
            }
          });
     })
     .catch(error => {
         // error;
         res.json({
          data:{
            success:false,
            error:error.message
          }
         });
     });
});
// user sign in
app.post('/sign_in',function(req,res){
  var phone_number  = req.body.phone_number;
  var password      = req.body.password;

  db.result("select * from dummy_users where phone_number=$1 AND password=$2", [phone_number,password])
    .then(data => {
      if(data.rowCount>0){
        // generate token
        var token = jwt.sign({
            phone_number: phone_number
        }, new Buffer(secretKey, 'base64'), { expiresIn: '24h' });

        res.json({
          data:{
            success:true,
            message: "User logged in successfully",
            token:token
          }
        });
      }
      else{
        res.json({
          data:{
            success:false,
            message: "Phone number or Password is wrong!"
          }
        });
      }
    })
    .catch(error => {
        res.json(error.message);
    });

})

var server = app.listen('4000',function(){
  console.log('Server runing at http://localhost:'+server.address().port);
});