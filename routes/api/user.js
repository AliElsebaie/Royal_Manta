const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenKey = require('../../config/keys').secretOrKey;
const conn = require('../../config/keys').pg;
const bcrypt = require('bcrypt');
const checkAuth = require('../../middleware/check-auth'); 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({//to solve the problem of null value problem where the req.body can read normally the input
  extended: true
}))
const pool = new Pool({
    connectionString: conn,
  })
  router.post("/SignUp",(req,res,next)=>{
      bcrypt.hash(req.body.password,10,(err,hash)=>{
          if(err){
            res.status(400).send(err);

          }else{
            pool.connect(function(err,client,done) {
                if(err){
                    console.log("not able to get connection "+ err);
                    res.status(400).send(err);
                } 
               
                pool.query("insert into employee (first_name,last_name,email,password) values ($1,$2,$3,$4)", ([req.body.firstname,req.body.lastname,req.body.email,hash])
                ,  function (err,result,) {
                     done();    // closing the connection;
                     if(err){
                         console.log(err);
                         res.status(200).json({
                            message: 'An Error Occured while Signing Up',
                
                        });
                     }
                    
                    
                       
                        
                         res.status(200).send(result);
                 
                                  
                         
                 });
         
             });
          }
      })
  })
  router.delete("/deleteAccount",checkAuth,(req,res,next)=>{
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        } 
       
        pool.query("delete from employee where id = ($1) " ,[req.userdata.id]
        , function(err,result) {
            done();    // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            if(result.rowCount === 0){
            
            res.status(400).send(err);
             res.status(200).json({
                 message: 'Authentication failed, It seems to be having a problem deleting your account right now',
     
             });
            }
            else{
             res.status(200).send(result);
     
            }         
        });
     });
  })
  router.post("/login",(req,res,next)=>{
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        } 
     pool.query("select password from employee where email = ($1)",[req.body.email],async  function (err,result) {
        console.log(result.rows[0])
        if(result.rows[0].password!==req.body.password){
         bcrypt.compare(req.body.password,result.rows[0].password,(err,comp)=>{
            if(err){
                res.status(401).json({
                    message: "Authentication Failed, Couldn't find this email"
                })  
            }if(comp){
         pool.query("SELECT * FROM employee WHERE email = ($1) and password = ($2)", [req.body.email,result.rows[0].password]
         , function(err,result) {
             done();    // closing the connection;
             if(err){
                 console.log(err);
                 res.status(400).send(err);
             }else{
                
             if(result.rowCount === 1){
                 const payload = {
                     id: result.rows[0].id,
                     email: req.body.email
                 }
                 const token = jwt.sign(payload,tokenKey, { expiresIn: '1h' })
             console.log(result.rowCount + ' user.js') 
             res.status(200).json({
                 message: 'Authentication Successful',
                 token: token

             });
            }
            else{
                res.status(400).json({
                    message: "Authentication Failed"
                })
            }
            }
         });
        }
        
    });
}
else{
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        } 
       
         pool.query("SELECT * FROM employee WHERE email = ($1) and password = ($2)", [req.body.email,req.body.password]
         , function(err,result) {
             done();    // closing the connection;
             if(err){
                 console.log(err);
                 res.status(400).send(err);
             }else{
                 console.log(result.rows[0].id);
             if(result.rowCount === 1){
                 const payload = {
                     id: result.rows[0].id,
                     email: req.body.email
                 }
                 const token = jwt.sign(payload,tokenKey, { expiresIn: '1h' })
             console.log(result.rowCount + ' user.js') 
             res.status(200).json({
                 message: 'Authentication Successful',
                 token: token

             });
            }
            else{
                res.status(401).json({
                    message: "Authentication Failed"
                })
            }
            }
         });
     
  
     });
}
    
});
     });

  })
  module.exports = router;
