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

    TIR_DATE : { type: 'datetime' },

    TIR_1 : { type: 'int' },

    TIR_2 : { type: 'int' },

    TIR_3 : { type: 'int' },

    TIR_4 : { type: 'int' },
	
	  TIR_5 : { type: 'int' },


    TIR_C : { type: 'int' }
  },
  GetTirage: function (dt,callback){
    sql = "select * from  myloto.tirages where TIR_DATE='" + dt + "'";
    console.log("DANS MODEL : ", sql);
    
    this.query(sql,function creaStat(err,result){
            if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
            } else {

              callback(null,result);
            }
            
    });
  },
  
  GetTirageDateMoinsUn: function(dt, callback) {

    sql = "select TIR_DATE from myloto.tirages where TIR_DATE<'" + dt + "' order by TIR_DATE desc limit 1";
    this.query(sql,function creaStat(err,result){
            if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
            } else {

              dt_moins = moment(result[0].TIR_DATE).format("YYYY-MM-DD HH:mm:ss");
              logger.warn(dt_moins);
              sails.models.tirages.GetTirage(dt_moins, function(err,retour) {
                if (err !== null && err !== undefined) return callback(err,null);
                return callback(null, retour);

              });
            }
            
    });


  },
  GetPanelNumbers: function(d1, distance, cb) {

    var sql = "select TIR_DATE, TIR_1, TIR_2, TIR_3, TIR_4, TIR_5 from myloto.tirages where TIR_DATE <= '" + d1 + "' order by TIR_DATE desc limit " + (distance);
    logger.warn(sql);
    this.query(sql,function (err,result){
      logger.warn("bou : ", result);
      if(err !== null && err !== undefined) return cb(err,null);
      return cb(null, result);
    });


  },
  processmoins: function(numero_reference, ladate, cb) {
    Array.prototype.inArray = function (value)
    {
     // Returns true if the passed value is found in the
     // array. Returns false if it is not.
     var i;
     for (i=0; i < this.length; i++)
     {
       if (this[i] == value)
       {
        return true;
       }
     }
     return false;
    };
    sails.models.tirages.GetTirageDateMoinsUn(ladate, function(err, retour, panel) {
        if (err !== null & err !== undefined) return cb("Erreur : " + err, null, null);
        logger.warn(retour);
        if (numero_reference.inArray(retour.TIR_1))
          delete numero_reference(retour.TIR_1);
        if (numero_reference.inArray(retour.TIR_2))
          delete numero_reference(retour.TIR_2);
        if (numero_reference.inArray(retour.TIR_3))
          delete numero_reference(retour.TIR_3);
        if (numero_reference.inArray(retour.TIR_4))
          delete numero_reference(retour.TIR_4);
        if (numero_reference.inArray(retour.TIR_5))
          delete numero_reference(retour.TIR_5);
        ladate = retour.TIR_DATE;
       /*
        if (!panel.inArray(retour.TIR_1)) panel.push(retour.TIR_1);
        if (!panel.inArray(retour.TIR_2)) panel.push(retour.TIR_2);
        if (!panel.inArray(retour.TIR_3)) panel.push(retour.TIR_3);
        if (!panel.inArray(retour.TIR_4)) panel.push(retour.TIR_4);
        if (!panel.inArray(retour.TIR_5)) panel.push(retour.TIR_5);
        */
        cb(null,numero_reference, ladate, panel);
    });
  },

  getLastDateForNumber: function(num, ladate, cb) {
   
    var bigRetour = {
      'retour_date' : '',
      'ecart': 0
    }
    var sql = "select TIR_DATE from myloto.tirages where (TIR_1=" + num + " or TIR_2=" + num + " or TIR_3=" + num + " or TIR_4=" + num + " or TIR_5=" + num + ") and TIR_DATE <'" + moment(ladate).format("YYYY-MM-DD HH:mm:ss") + "' order by TIR_DATE desc limit 1";
    //logger.warn("getlastmachin avant : " + sql);
    self = this;
    this.query(sql,function (err,result){
      if(err !== null && err !== undefined) return cb(err,null);
      var sql2 = "select count(*) as ttl from myloto.tirages where TIR_DATE between '" + moment(result[0].TIR_DATE).format("YYYY-MM-DD HH:mm:ss") + "' and '" + ladate + " 20:00:00'";
      logger.warn("sql count : ", sql2);
      bigRetour.retour_date = moment(result[0].TIR_DATE);
      self.query(sql2, function(err, result2) {
        bigRetour.ecart = result2[0].ttl - 2;
        logger.warn("va retourner : ", bigRetour, " result2=", result2);
        return cb(null, bigRetour);  
      });      
      
    });

  },
  

};

