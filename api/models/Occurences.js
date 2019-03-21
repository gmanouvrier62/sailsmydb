/**
* Tirages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require("moment");
var logger = require('../services/logger.init.js').logger("tom.txt");
var util = require("util");
module.exports = {

  attributes: {

    id : { type: 'int' },

    tir_date : { type: 'datetime' },

    occ_1 : { type: 'int' },

    occ_2 : { type: 'int' },

    occ_3 : { type: 'int' },

    occ_4 : { type: 'int' },
	
	  occ_5 : { type: 'int' },


    occ_nb_tir_last : { type: 'int' },
    occ_ecc_date_last : { type: 'datetime'}
  },
 
   Actualise: function (callback){
    sql = "select * from  myloto.tirages where TIR_DATE not in (select tir_date from myloto.occurences) and TIR_DATE > '2016-01-01 00:00:00'";
    console.log("DANS MODEL : ", sql);
    var lyse = new analyse();
    this.query(sql,function creaStat(err,resultat) {
           

       if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
       } else {
       
          //traitement des résultats
              var cpt = 0;
              resultat.map(function(obj,id){
                //atention aux synchros
               cpt ++;
               var tb = [];
                tb.push(obj.TIR_1);
                tb.push(obj.TIR_2);
                tb.push(obj.TIR_3);
                tb.push(obj.TIR_4);
                tb.push(obj.TIR_5);
                lyse.GetOccurences(tb,function(err,resultat_occ){

                  if(err==null ||  err == 'null') {
                      //console.log(" ok : " + util.inspect(datas));
                      //GM occ 10:40 28/08/2018
                      //res.send(JSON.stringify(resultat_occ));
                      
                      for(var cc = 0; cc<resultat_occ.length;cc++) {
                        var datas_values = {
                            'tir_date' : resultat_occ[cc].stat_date,
                            'occ_nb' : resultat_occ[cc].occurence
                        };
                        //console.log("datas_values : " + util.inspect(datas_values) );
                        sails.models.occurences.findOrCreate(datas_values,datas_values).exec(function creaStat(err,created){
                          if(err==null || err=='null'){
                            console.log("CREATION STAT : " + util.inspect(created) );
                            
                          }
                          else {
                            console.log("CREATION STAT : " + util.inspect(err) );
                            throw new Error(err);
                          }
                          if((cpt == this.base.length) && (cpt == this.current_occ.length -1)) {
                            callback(null,"OK");
                          }

                        }.bind({'base': this.base,'current_occ': resultat_occ}));
                        //AJOUT OCC
                      }

                      // callback(null,result);
                  } else
                        console.log("err : " + datas);



                }.bind({'objRef': obj,'base': resultat}));

              });


       }



    });
  }

};

