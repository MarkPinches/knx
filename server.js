// Code for creating a server on port 3000

// Import required modules
var express = require('express');
var bodyParser = require('body-parser');

// Create express application and set port variable
var app = express();
var port = process.env.PORT || 3000;
  
// Assign middleware to app - in order
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//import routes and register
var routes = require('../api/routes/api_routes'); 
routes(app); 

// kick off process
app.listen(port);

// Console log to confirm has executed ok
console.log('KNX RESTful API server started on: ' + port);
