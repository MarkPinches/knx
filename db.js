// As we are going to performing switching from a client that is not aware of the current
// states of the knx bus objects (actuators etc), then we need some method for capturing
// the current states of all the bus objects. nedb to the rescue.

// Check the great documents at 
// https://github.com/louischatriot/nedb


// Require nedb and create a Datastore object
var Datastore  	= require('nedb');
var knx = require('knx_eibd').knx_event;

// Create our first db - a database to capture the current states of the knx bus group
// addresses. In this case we are persisting the db to a file called knx_db.db
// Although this is not 100% necessary

var db = new Datastore({filename : 'knx_db.db', autoload:true})
db.persistence.setAutocompactionInterval(1800000) // this just compresses the db object every 30mins

// Now whenever there is a bus event, either update the db entry, or create one if
// it doesn't exist. So easy!

knx.on('bus_event', function(data){
	db.update ( {destination : data.destination }, data , {upsert : true} , function (err, numReplaced){
	});
});

/*
 Create our second db. This stores a mapping between the group address 
 and the group address string name.
 First we load a .json file that contains the info from a group address export from ETS5
 This csv can be easily converted to .json using online tools.
 You need to replace the spaces with underscores and force to lower case
 The object should look like...
[
 {
   "area": "ground floor",
   "room": "lounge",
   "description": "lounge_all_lights",
   "destination": "0/0/1"
 },
 {
   "area": "ground floor",
   "room": "lounge",
   "description": "switch",
   "destination": "0/0/2"
 },
]
*/

// Create the new database and require the .json file
var objects_db = new Datastore()
var knx_objects = require('../../data_files/grp_add.json')

// Load the json items into objects_db by iterating over them and inserting each
for (var i in knx_objects) {
		objects_db.insert (  knx_objects[i] , function (err, new_doc) {
	});
  };

// Make the databases available to other modules with the magic of exports
exports.db  = db
exports.objects_db = objects_db
