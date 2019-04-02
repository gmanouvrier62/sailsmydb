/**
* Tirages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require("moment");
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id : { type: 'int' },

    PRE_DATE : { type: 'datetime' },

    PRE_1 : { type: 'int' },

    PRE_2 : { type: 'int' },

    PRE_3 : { type: 'int' },

    PRE_4 : { type: 'int' },
	
	PRE_5 : { type: 'int' },


    PRE_C : { type: 'int' }
  },
  
  
 
 
  

};

