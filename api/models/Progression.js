/**
* Progression.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports  = {

  attributes: {
    id: { type: 'string'},
    prog_num : { type: 'int'},
    prog_ttl: { type: 'int'},
    prog_month: { type: 'int'},
    prog_year: { type: 'int'},
    
    
  },
  construction: function(callback) {
  	var retour = new Array();
  	var strSQL_init = "truncate myloto.progression";
    //var strSQL_intermediaire = "select stat_num, count(*) as ttl,  month(stat_date), year(stat_date), now(), now() from myloto.stats group by stat_num, year(stat_date), month(stat_date)";
  	var strSQL_construction = "insert into myloto.progression (select uuid(), stat_num, count(*) as ttl,  month(stat_date), year(stat_date), now(), now() from myloto.stats group by stat_num, year(stat_date), month(stat_date))";
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
    var result = new Array();
    var retour = new Array();
    var strSQL = "select * from myloto.progression where prog_year>2008 order by prog_year, prog_month, prog_num ";
    this.query(strSQL, function creaStat(err,rows){
       if(err != null) {
              logger.error("getAll progression, ATTENTION ! ", err);
              return callback(err,null);
        } else {
            //principe ok mais pas assez lisible, fair eun JSON
            //jouer avec les push
/*
{
  "y_2009": {
    "m_1": {
      "num_1": 1,
      "num_2": 0,
      "num_3": 4
    },
    "m_2": {
      "num_1": 0,
      "num_2": 3,
      "num_3": 1
    }
  },
}

*/

            for(var y = 2009; y <= moment().format("YYYY"); y++) {
              logger.warn("devrait remplir : " + "y_" + y);
              
              result.push("y_" + y);//Je push un label
              result["y_" + y] = new Array();//je set ce label comme un array!!!!!!!
              for (var m = 1; m <= 12; m++) {
                
                result["y_" + y].push("m_"+ m);
                result["y_" + y]["m_" + m] = new Array();
                for (var num = 1; num <= 49; num++) {
                  result["y_" + y]["m_" + m].push("num_" + num);
                  result["y_" + y]["m_" + m]["num_" + num] = 0;
                }
              }
              
            }
            logger.warn("vide : " + JSON.stringify(result));
            logger.warn("juste pour voir : " + result["y_2012"]["m_4"]["num_15"]);
           
           for (var ccc = 0; ccc < rows.length;ccc++) {
             var obj = rows[ccc];
             logger.warn(rows[ccc]);
             //return 0;
             result["y_" + obj["PROG_YEAR"]]["m_" + obj["PROG_MONTH"]]["num_" + obj["PROG_NUM"]] = obj["PROG_TTL"];
             logger.warn(result["y_" + obj["PROG_YEAR"]]["m_" + obj["PROG_MONTH"]]["num_" + obj["PROG_NUM"]]);
             //logger.warn("=" + obj["PROG_TTL"]);
             //return 0;
           }
           
          // rows.map(function(obj,idx){
          //  retour["y_" + obj["PROG_YEAR"]][obj["PROG_MONTH"]][obj["PROG_NUM"]] = obj["PROG_TTL"];
          // });
           logger.warn("le ret ret : " + result);
           return callback(null,result);
        }

    });


  }
};
