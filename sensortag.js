/*

*/

'use strict';
var async = require('async');
var SensorTag = require('sensortag');
//var WriteToBus  = require('knx_eibd').WriteToBus;


// Timeout Variables
// Discovering is limited to timeoutVar
var timeoutVar = 60000;
var timeoutID;
var timeoutCleared = true;

// Duplicates allowed -> Reconnect possible
SensorTag.SCAN_DUPLICATES = true;

// To prevent multiple fires and timeouts
var towelRailsOn = false;


// For each discovered Tag
function onDiscover(sensorTag) {
  console.log('discovered: ' + sensorTag.uuid + ', type = ' + sensorTag.type);
  stopTimed();

  sensorTag.once('disconnect', function () {
    console.log('Disconnected.');
    if (timeoutCleared) {
      scanTimed();
    }
  });

  sensorTag.connectAndSetup(function () {
    console.log('Connect and setup');
    sensorTag.readDeviceName(function (error, deviceName) {
      console.log('\tDevice Name = ' + deviceName);
      console.log('\tType = ' + sensorTag.type);
      console.log('\tUUID = ' + sensorTag.uuid)
    });
    
    sensorTag.readSerialNumber(enableHumidity)
    
    function enableHumidity(error, serialNumber){
    	console.log('\serialNumber =' + serialNumber);
    	sensorTag.enableHumidity(notifyMe)
    }
        

    function notifyMe() {
	sensorTag.notifyHumidity(MakeHumidityReading);  
	}
	
    function MakeHumidityReading() {		
     sensorTag.on('humidityChange' ,function( temperature, humidity, serialNumber){
 	     if (humidity.toFixed(1)>99 & towelRailsOn == false){
 	     	FireUpTowelRails();
 	     	};
//  Uncomment below if you want to see the Humidity readings in real time	     	
 	     console.log(' \tHumidity = %d %', humidity.toFixed(1));     
     });
     
     
	function FireUpTowelRails () {
		towelRailsOn = true
		console.log('Firing  up towel rails');
//		WriteToBus("3/1/4", "write", "DPT1", 0),
		setTimeout(FireDownTowelRails, 18000);
	}

	function FireDownTowelRails () {
		console.log('Turning off towel rails');
		towelRailsOn = false;
	//	WriteToBus("3/1/4", "write", "DPT1", 0),
	}   
     
     
   }  
    scanTimed();
  });
}

// Start timed discovering
function scanTimed() {
  console.log('Start discovering');
  timeoutCleared = false;
  SensorTag.discoverAll(onDiscover);
  timeoutID = setTimeout(function () {
    stopTimed();
  }, timeoutVar);
}

//Stop timer and discovering
function stopTimed() {
  SensorTag.stopDiscoverAll(onDiscover);
  timeoutCleared = true;
  console.log('Stop discovering');
  clearTimeout(timeoutID);
}

// Start discovering
scanTimed();
