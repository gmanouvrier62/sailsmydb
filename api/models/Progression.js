/**
* Progression.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require('moment');
module.exports  = {

  attributes: {

    prog_num : { type: 'int'},
    prog_ttl: { type: 'int'},
    prog_month: { type: 'int'},
    prog_year: { type: 'int'},
    
    
  },
  construction: function(callback) {
  	var retour = new Array();
  	var strSQL_init = "truncate myloto.progression";
  	var strSQL_construction = "insert into myloto.progression (select stat_num, count(*) as ttl,  month(stat_date), year(stat_date), now(), now() from myloto.stats group by stat_num, year(stat_date), month(stat_date))";
  	var self = this;
  	this.query(strSQL_init,function creaStat(err,rows){
            if(err != null) {
              logger.error("ATTENTION ! ", err);
               return callback(err,null);
            } else {
			         //traitement de la constructrion
			         self.query(strSQL_construction,function creaStat(err, retour){
			  	        if(err != null) {
	                 logger.error("ATTENTION construction! ", err);
	                 return callback(err,null);
	                }
	                //Retour de construction je prépare un jazon
              	  return callback(null,JSON.parse(retour));
          	    });
            }
            
    });



  },
  getAll: function(callback) {
    var retour = new Array();
    var strSQL = "select * from myloto.progression where prog_year>2008 order by prog_year, prog_month, prog_num ";
    this.query(strSQL, function creaStat(err,rows){
       if(err != null) {
              logger.error("getAll progression, ATTENTION ! ", err);
              return callback(err,null);
        } else {
            //principe ok mais pas assez lisible, fair eun JSON
            for(var y = 2009; y <= moment().format("YYYY"); y++) {
              retour[y] = new Array();
              for (var m = 1; m <=12; m++) {
                retour[y][m] = new Array();
                for(var num = 1; num <= 49; num++) {
                  retour[y][m][num] = 0;
                }
              }
            }

           rows.map(function(obj,idx){
            retour[obj["PROG_YEAR"]][obj["PROG_MONTH"]][obj["PROG_NUM"]] = obj["PROG_TTL"];
           });
           return callback(null,retour);
        }

    });


  }
};
