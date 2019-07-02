var express = require('express');
var pg = require('pg')
var connectionString = "postgres://postgres:Besmellah@localhost:1234/Royal_Manta";
var app = express();
const {Pool} = require("pg");

const pool = new Pool({
    connectionString: connectionString,
  })


app.post('/createAgency/:name', function (req, res, next) {    // creating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
      
        pool.query("insert into agency (name) values ($1)", [req.params.name]
        , function(err,result) {
            done();    // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result);
        });
    
 
    });
});

app.get('/getAllAgencies', function (req, res, next) {    // getting all agencies 
    
    //var pool = new pg.Pool()
    pool.connect(function(err,client,done) {
        console.log("mafeesh")
       if(err){
        console.log("tele3 fee")

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

app.delete('/deleteAgency/:name', function (req, res, next) {    // deleting agency 

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
      
       pool.query("delete from agency where name = ($1)" ,[req.params.name]
       , function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           console.log('deleted Successfully')
           res.status(200).send(result);
       });
    });
});

app.put('/updateAgency/:name', function (req, res, next) {    // updating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       console.log(req.body);
       
       pool.query("update agency set name = ($1) where name = ($2)" ,([req.body,req.params.name])
       , function(err,result) {
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