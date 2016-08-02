//usb logger module

// *************************************************************************
// This module records every knx bus data transaction and ends it to the IFTTT Maker  
// channel.
// **************************************************************************


//import required modules
var knx  	= require('knx_eibd').knx_event;
var request = require('request');


knx.on('bus_event', function(data){
	request({
		url : 'https://maker.ifttt.com/trigger/knx_event/with/key/*****YOURKEYHERE*******',
		method : 'POST',
		form : {
			"value1": "S" + data.source.toString(),
			"value2": "D" + data.destination.toString(),
			"value3": data.value
		}
	},
		function(error, response, body){
  			if(error) {
        		console.log(error);
    		} else {
 //       		console.log(response.statusCode, body);
		};
	});
})

