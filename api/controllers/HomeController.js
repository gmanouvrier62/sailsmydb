var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {
	

home : function (req,res){
		var socket = req.socket;
		var io = sails.io;
		io.sockets.emit('messageName', {thisIs: 'thebeuebuebuessage'});
 	var menu = fs.readFileSync('/home/gilles/node/sailsmydb/views/tirages/menu.ejs');
 	
   	logger.warn("coucouroucoucou");
   	var tom = menu.toString();
	return res.render ('home/container',{'nom': 'Manouvrius', 'prenom': 'Gillus','tplMenu': tom});
  

    

},


 

};
