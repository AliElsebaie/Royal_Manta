const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
const bodyParser = require('body-parser');
const checkAuth = require('../../middleware/check-auth'); 

const conn = require('../../config/keys').pg
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({//to solve the problem of null value problem where the req.body can read normally the input
  extended: true
}))
const pool = new Pool({
    connectionString: conn,
  })
  router.post('/createAgency',checkAuth ,function (req, res, next) {    // creating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
      
        pool.query("insert into agency (agency_name,created_by) values ($1,$2)", ([req.body.name,req.userdata.id])
        ,async  function (err,result,) {
            await pool.query("insert into employee_type (employee_id,agency_id,type_id) values ($1,(select id from agency where agency_name =($2)),1)", ([req.userdata.id,req.body.name])
        , function(err,result) {
            done();    // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
           
            if(result.rowCount === 0){
           
                res.status(200).json({
                    message: 'Authentication failed',
        
                });
               }
               else{
                res.status(200).send(result);
        
               }              
            });
                
        });

    });
});
router.get('/getAllAgenciesWithEmployees', function (req, res, next) {    // getting all Agencies with their employees 
    
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM agency a , employee e where a.id = e.agency_id', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result);
       });
    });
});

router.get('/getAllAgencies',checkAuth,function (req, res, next) {    // getting all ageencies 
    
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM agency ORDER BY id ASC', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           console.log(result.rows[0].id)//returns the id
           res.status(200).send(result);
       });
    });
});
router.get('/getAllEmployees', function (req, res, next) {    // getting all Employees 
    
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       
       pool.query('SELECT * FROM employee ORDER BY employee_id ASC', function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result);
       });
    });
});
router.delete('/deleteAgency',checkAuth, function (req, res, next) {    // deleting agency 

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
      
       pool.query("delete from agency where id = ($1) and created_by = ($2)" ,[req.body.id,req.userdata.id]
       , function(err,result) {
           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           if(result.rowCount === 1){
           
            res.status(200).json({
                message: 'Authentication failed',
    
            });
           }
           else{
            res.status(200).send(result);
    
           }         
       });
    });
});

router.put('/updateAgency/:id',checkAuth, function (req, res, next) {    // updating agency

    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 

       pool.query("update agency set agency_name = ($1) where id = ($2) and created_by = ($3)" ,([req.body.agency_name,req.params.id,req.userdata.id])
       , function(err,result) {// if the id wasnt the creator it will give updated rows = 0 not unauthenticated.

           done();    // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           if(result.rowCount === 0){
           
        res.status(200).json({
            message: 'Authentication failed',

        });
       }
       else{
        res.status(200).send(result);

       }
       });
    });
});


router.post('/assignAgencyToEmployee',checkAuth, function (req, res, next) {    // assigning employee to an agency
    
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       pool.query("insert into enrolled(employee_id,agency_id) select $1,$2 from agency where id = ($2) and created_by = ($3)" ,([req.body.employee_id,req.body.agency_id,req.userdata.id])
       , function(err,result) {
           done();    // closing the connection;
           if(err){ 
               console.log(err);
               res.status(400).send(err);
           }
           if(result.rowCount === 0){
           
            res.status(200).json({
                message: 'Authentication failed',
    
            });
        }else{
           res.status(200).send(result);
        }
       });
    });
});

module.exports = router;
// pool.query("insert into agency (agency_name,created_by) values ($1,$2)", ([req.params.name,req.params.id])
//         ,async  function (err,result,) {
//             await pool.query("insert into employee_type (employee_id,agency_id,type_id) values ($1,(select id from agency where name =($2)),(select id from type where role = ($3)))", ([req.params.id,req.params.name,'admin'])
//         , function(err,result) {
//             done();    // closing the connection;
//             if(err){
//                 console.log(err);
//                 res.status(400).send(err);
//             }
           
//             res.status(200).send(result);
//         });
                
//         });