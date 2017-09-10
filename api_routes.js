// 'use strict' this is a header that forces the javascript engine to apply a stricter 
// interpretation of your code. For more details take a look at
// https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
'use strict';

// Define routes and export them
// We need to require the controller functions. These are in a
// separate file so as to keep the code cleaner.

// The route path will be appended to the host address, for example on my LAN the full 
// url reads as...
// http://192.168.0.101:3000/api/knx/test 

// Here we define two rotes a post and a get. On receiving an appropriate request (post 
// or get) to the correct route, it will call the controller function (either test 
// or get_id_info )

// You can easily add more routes, but in order for the code to run you will need also 
// to define the controller function too.

module.exports = function(app) {
  var test_controller = require('../controllers/api_controllers');

  // KNX Routes
  app.route('/api/knx/test')
    .post(test_controller.test);
    
  app.route('/api/knx/info/:id')
  	.get(test_controller.get_id_info);

};


