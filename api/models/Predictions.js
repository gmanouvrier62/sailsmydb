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

    PRE_C : { type: 'int' },

    PRE_SELECTED : { type: 'int' }
  },
  
  GetList: function(callback) {
    var sql = "select distinct PRE_DATE from myloto.predictions order by PRE_DATE desc limit 10";
    this.query(sql,function creaStat(err,resultat) {
           

       if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
       } else {
              callback(null, resultat);
       }
    });

  },
 
  delet: function(idx, callback) {
    var sql = "delete from myloto.predictions where PRE_DATE='" + idx +"'";
    this.query(sql,function creaStat(err,resultat) {
           

       if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
       } else {
              callback(null, resultat);
       }
    });


  },
  loadPrediction: function(idx, callback) {
    var sql = "select * from myloto.predictions where PRE_DATE='" + idx +"'";
    logger.warn("query load : ", sql);
    this.query(sql,function creaStat(err,resultat) {
           

       if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
       } else {
              callback(null, resultat);
       }
    });


  }
  

};

