const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
var database = require('../../config/db');
var connectionString = "postgres://postgres:123456@localhost:5432/Royal";
const pool = new Pool({
    connectionString: connectionString,
  })

router.get('/', function (req, res, next) {    // getting all ageencies 
    
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




module.exports = router;
