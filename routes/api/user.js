const express = require('express');
const router = express.Router();
const {Pool} = require("pg");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenKey = require('../../config/keys').secretOrKey;
const conn = require('../../config/keys').pg;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({//to solve the problem of null value problem where the req.body can read normally the input
  extended: true
}))
const pool = new Pool({
    connectionString: conn,
  })

  router.post("/login",(req,res,next)=>{
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
  })
  module.exports = router;
