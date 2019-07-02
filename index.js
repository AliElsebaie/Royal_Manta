var express = require('express');
var pg = require('pg')
var connectionString = "postgres://postgres:Besmellah@localhost:1234/Royal_Manta";
var app = express();
const {Pool} = require("pg");

const pool = new Pool({
    connectionString: connectionString,
  })

app.get('/', function (req, res, next) {    // getting all agencies 
    
    //var pool = new pg.Pool()
    pool.connect(function(err,client,done) {
        console.log("Connect to pg")
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM Agency', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result);
       });
    });
});

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});