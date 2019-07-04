var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const agency = require('./routes/api/agency');
const user = require('./routes/api/user');
const port = process.env.PORT || 4000;
app.use('/agency',agency);
app.use('/user',user);
app.use(express.json());




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
// Handling 404
app.use((req, res) => {
    res.status(404).send({err: 'We can not find what you are looking for'});
 })
app.listen(port, function () {
    console.log(`Server is running.. on Port ${port}`);
});