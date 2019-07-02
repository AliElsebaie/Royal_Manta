var express = require('express');
var pg = require('pg')
var app = express();
var router = express.Router();
const bodyParser = require('body-parser');
var database = require('./config/db');
const agency = require('./routes/api/agency')
app.use('/agency',agency)

app.use(express.json())

var conString = database.conString;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
// Handling 404
app.use((req, res) => {
    res.status(404).send({err: 'We can not find what you are looking for'});
 })
app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});