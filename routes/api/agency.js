const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
var database = require('../../config/db');
var connectionString = "postgres://postgres:123456@localhost:5432/Royal";
const pool = new Pool({
    connectionString: connectionString,
  })
  app.post('/createAgency/:name', function (req, res, next) {    // creating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
      
        pool.query("insert into agency.agency(agency_name) values ($1)", [req.params.name]
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

router.get('/', function (req, res, next) {    // getting all ageencies 
    
    pool.connect(function(err,client,done) {
        console.log("Connect to pg")
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM agency.agency ORDER BY id ASC', function(err,result) {
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
      
       pool.query("delete from agency.agency where agency_name = ($1)" ,[req.params.name]
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
       
       pool.query("update agency.agency set agency_name = ($1) where agency_name = ($2)" ,([req.body,req.params.name])
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




module.exports = router;
