//////////////////////////////////////////////////////////
// **********************************************************
// KNX LOGGER and basic KNX jobs scheduler
// 
// This application uses a raspberry pi running node v 0.12.6
//
// Essential packages include npm, pm2, eibd, 
// eibd daemon must be installed - details can be found here....
// http://michlstechblog.info/blog/raspberry-pi-eibd-with-a-knx-usb-interface/
//
// and the usbmount package for auto mounting the usb
// - sometimes this can cause errors with the eibd daemon getting confused where to find the 
// knx usb connection. This may be resolved by making the dhcp static
// again follow michls excellent instructions
// http://michlstechblog.info/blog/raspberry-pi-eibd-with-a-knx-usb-interface/
//
//
// This application runs at startup or reboot
//
// This functionality is achieved using the pm2 package
// details can be found here ....
// https://www.npmjs.com/package/pm2
// If installed new, the pm2 will not respawn the application at reboot until the init.d 
// file is altered
// Details of the issue can be found here...
// https://github.com/Unitech/PM2/issues/1140
// The issue is with the PM2_HOME variable. This needs to be set to PM2_HOME="/home/pi/.pm2"
// if the pi user is being used. (Also USER=pi) in the script
//
// It utilises a crontab script details can be found here...
// http://www.linuxcircle.com/2013/12/30/run-nodejs-server-on-boot-with-forever-on-raspberry-pi/
//  
// If the application is not functioning then the most common error is a formatting error
// in the knx_jobs.txt file where the /t is miss placed
// - This causes an args error
//
//
// TO EDIT FILES
// First stop the program, use:
//
// $ pm2 stop 0 
// This stops the application
//
// reboot to start again or use  $ node app.js from the knx folder to test
//
// *********************************************************
////////////////////////////////////////////////////////////





console.log('Hello welcome to the knx bus monitor package')

//***** This is a node application designed to act as a core
var knx  	= require('knx_eibd');

// import usb logger
//var usb_logger = require('./node_modules/utilities/usb_logger');

// import send message to bus
//var sendMsg = require('./node_modules/utilities/send_msg_to_bus').sendMsg; 
// example use of sendMsg
//sendMsg("0/2/40", "write", "DPT1", 0);

// import timed jobs for knx. This auto reads from a csv file to make jobs
// The file with cron jobs is on the usb in knx_jobs folder 
//var jobs = require('./node_modules/utilities/knx_cron_jobs');


//This runs a bluetooth connection to a sensortag that monitors humidity
// when humidity runs high the towel rails come on for 30mins
//var sensortag_bath = require('./node_modules/utilities/sensortag_bath');


//This initiates a set of scenes associated with a number of group addresses
//var scenes = require('./node_modules/utilities/scenes');

// This sets up the door monitor
//var doors = require('./node_modules/utilities/doors');

// This sets up the tank monitor
//require('./node_modules/utilities/ultrasound');

//This sets up the main area average generator
//var temp =require('./node_modules/utilities/main_temp_avg');