// This module listens for specific group addresses then when one is matched it
//  executes a series of further commands that sets a lighting scene 



//////////////////////////////////////////////////////////////////
//Load in required modules and log starting

var WriteToBus  = require('knx_eibd').WriteToBus;
var knx = require('knx_eibd').knx_event

//set local variables

var Gpio = require('onoff').Gpio;

var garage_door = new Gpio(24, 'out');

// console log alert that module is running
console.log('starting garage door');

///////////////////////////////////

///////////////////////////////////////////////////////////////////
//create helper functions

function openGarageDoor(){
	garage_door.writeSync(1)
	setTimeout(function () {
  		garage_door.writeSync(0);
	}, 250);
};


process.on('SIGINT', function () {
  garage_door.unexport();
});

//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
	// Now that you've defined all the functions and scenes, start the process:

knx.on('bus_event', function(data){
	if (data.destination == '3/2/0'){
		console.log('garage door pressed');
 		openGarageDoor();
 	};
});
