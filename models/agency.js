var express = require('express');
var pg = require('pg')
var connectionString = "postgres://postgres:Besmellah@localhost:1234/Royal_Manta";
var app = express.app();

app.get('/', function (req, res, next) {    // getting all agencies 
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM Agency', [1],function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});