// 'use strict' this is a header that forces the javascript engine to apply a stricter 
// interpretation of your code. For more details take a look at
// https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
'use strict';

// Require the modules we need 
var knx  	= require('knx_eibd').knx_event;
var WriteToBus  = require('knx_eibd').WriteToBus;

// Here we are requiring two databases
var db = require('../../node_modules/utilities/db').db
var objects_db = require('../../node_modules/utilities/db').objects_db

// This function receives a http request, then finds the current state of the "1/4/21"
// knx group address (stored in the db), then passes that value in the call back 
// to the switch_lights function. Then ends/sends a response to the client to say that 
// light has been switched

// Test function
exports.test = function(req, res) {
  // You can inspect the request (req) object - ie. the http request that was sent to
  // the server with ...
  //console.log(req.headers);
  //console.log(req.body);
  db.find( { destination : "1/4/21" } , function (err, docs) {
		var current_state = docs[0].value;
		switch_lights(current_state);
		res.end('The light was switched!');
  })
};

// Support function to switch the lights. It takes the current state, finds the opposite
// and send that to the bus
function switch_lights(current_state){
  var on_off = 1 - current_state;
  WriteToBus("1/4/20", "DPT1", on_off);
};

// Here is a more complex function
// This takes the request parameter from the url, which for the following url... 
// http://192.168.0.101:3000/api/knx/info/bed_1_actual_temperature_val 
// is ... bed_1_actual_temperature_val and is found in the req.params.id object.
// It then looks this up in the objects_db and returns the current value as a response to 
// the client.

// This is an example of nested callbacks. The first is the initial response to 
// searching for the group address - called destination in the objects_db, by searching for the 
// text name (the req.params.id - object) The second is the response to finding the 
// value of this group address. As you can see nested callbacks start to get confusing. 
// Anymore than two then consider using the async library that has some useful methods 
// such as async.parallel, async.series and async.waterfall to keep things clearer

exports.get_id_info = function(req,res){
	//console.log(req.params.id)
	objects_db.find ( { 'description' : req.params.id} , function (err, docs) {
		if (err) {
			console.log(err);
		};
  		db.find( {'destination' : docs[0].destination}, function (err, docs){
  			if (err) {
				console.log(err);
			};
			var current_value = docs[0].value;
			res.json(docs[0].value) ;
  		});
	}); 
};
