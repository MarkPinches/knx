//This module establishes a connection with the eibd/knx bus
// In addition it creates a event emitter/listener object called knx_event
// and provides a simple method for sending requests to the bus called WriteToBus

var eibd    = require("eibd")
var opts    = { host: "localhost", port: 6720 }
var EventEmitter = require('events').EventEmitter;
var knx_emitter = new EventEmitter();



//This function initialises a connection to the eibd/knx bus
function initializeEibdSocket (handler) {
  console.log('connecting to eibd server at %s:%d', opts.host, opts.port);
  var eibdconn = new eibd.Connection();
  eibdconn.socketRemote({ host: opts.host, port: opts.port }, function(err) {
    if (err) {
      console.log('eibd.socketRemote error: %s', err.code);
					
    } else {
      console.log('EIBD: successfully connected to %s:%d', opts.host, opts.port);
        if (handler && (typeof handler === 'function')) {
          handler(eibdconn);
        }
    }
  });
  return (eibdconn);
};

// This function listens to the bus and packages every bus event as a node event with
// the bus data packaged as a json object
function groupsocketlisten(opts, callback) {
  var conn = initializeEibdSocket();
  console.log('opening conn');
  conn.openGroupSocket(0, function(parser) {
	 parser.on('write', function(src, dest, dpt, val){
     // uncomment the line below to see bus events in the console
      console.log('Write from '+src+' to '+dest+': '+val);	
      var date = new Date().toJSON();
      var knx_json_obj ={'source': src, 'destination': dest, 'type': dpt, 'value': val, 'time':date };
	  knx_emitter.emit('bus_event', knx_json_obj)
    });
  }); 
}

// This function sends a message to the bus. An example use of WriteToBus...
// WriteToBus("0/2/40", "DPT1", 0, callback);
function sendToBus(dest, dpt, value, callback) { 
  var opts    ={ host: "localhost", port: 6720 }
  , conn   = new eibd.Connection();
//  console.log('sending.....' +  dest, dpt, value);
  conn.socketRemote(opts, function() {
    var address = eibd.str2addr(dest);
    conn.openTGroup(address, 0, function (err) {
      if(err) {
        callback(err);
      } else {
        var msg = eibd.createMessage('write', dpt, parseFloat(value));
        conn.sendAPDU(msg, callback);
      }  
    });
  });
}



groupsocketlisten();

exports.WriteToBus = sendToBus
exports.knx_event = knx_emitter