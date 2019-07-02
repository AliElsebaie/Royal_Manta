const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
const bodyParser = require('body-parser');

var database = require('../../config/db');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({//to solve the problem of null value problem where the req.body can read normally the input
  extended: true
}))
var connectionString = "postgres://postgres:123456@localhost:5432/Royal";
const pool = new Pool({
    connectionString: connectionString,
  })
  router.post('/createAgency/:name', function (req, res, next) {    // creating agency

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
router.get('/getAllAgenciesWithEmployees', function (req, res, next) {    // getting all Agencies with their employees 
    
    pool.connect(function(err,client,done) {
        console.log("Connected to Server")
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM agency.agency a , agency.employee e where a.id = e.agency_id', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result);
       });
    });
});

router.get('/getAllAgencies', function (req, res, next) {    // getting all ageencies 
    
    pool.connect(function(err,client,done) {
        console.log("Connected to Server")
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
router.get('/getAllEmployees', function (req, res, next) {    // getting all Employees 
    
    pool.connect(function(err,client,done) {
        console.log("Connected to Server")
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM agency.employee ORDER BY employee.employee_id ASC', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result);
       });
    });
});
router.delete('/deleteAgency/:name', function (req, res, next) {    // deleting agency 

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

router.put('/updateAgency/:id', function (req, res, next) {    // updating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 

       pool.query("update agency.agency set agency_name = ($1) where id = ($2)" ,([req.body.agency_name,req.params.id])
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


router.put('/assignAgencyToEmployee/:id', function (req, res, next) {    // assigning employee to an agency
    
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       pool.query("update agency.employee set agency_id = ($1) where employee_id = ($2)" ,([req.body.agency_id,req.params.id])
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
