/**
 * StatsController
 *
 * @description :: Server-side logic for managing Tirages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var util = require("util");
var logger = require("../services/logger.init.js");
var moment = require('moment');
var sleep = require('sleep');
//var cheerio = require('cheerio');
var Immutable = require('immutable');
var ejs = require('ejs');
var Promise = require('promise');
module.exports = {
	
/*

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
},



*/



  /**
   * `StatsController.Reduction`
   */
  reduction: function (req, res) {
    
    /*

    paramss :  { 
                contraintes: 
                '{"contraintes":
                      {
                        "groups":["2"],
                        "numeros":"3",
                        "no_sortie":"2",
                        "ecart_global":null,
                        "ecart_moyen":null,
                        "parentId":"gs_4"
                      }
                  }' 
               }




    */
    Array.prototype.diff = function(a) {
      console.log("ZOBBI LA MOUKA");
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
        console.log("paramss : ",util.inspect(req.query));
        var restitution = JSON.parse(req.query.contraintes);
        
            var contraintes = restitution.contraintes;
            
                console.log("contrainte : ",util.inspect(contraintes));
                
                var nb_a_choisir = contraintes.numeros;
                var grps = contraintes.groups;
                var no_sortie = contraintes.no_sortie;
                var ecart_global = contraintes.ecart_global;
                var parentId = contraintes.parentId;
                if(contraintes.ecart_moyen != null)
                {
                  var ecart_moyen_directive = contraintes.ecart_moyen.directive;
                  var ecart_moyen_tirages = contraintes.ecart_moyen.tirages;
                }
              
                var collection = restitution.collection;
                var tbChoix = new Array();
                
                for(var cpt = 0; cpt < grps.length; cpt++) {
                  for(var g = 0 ;g< collection[grps[cpt]].length;g++) tbChoix.push(collection[grps[cpt]][g]);
                }
                
                for (t=0;t<tbChoix.length;t++)tbChoix[t] = parseInt(tbChoix[t].replace("N_",""));
                console.log("le tbChoix primal " + util.inspect(tbChoix));
                var stats = new statistiques();
                var tr = 0;
                if (no_sortie != null) tr+=1;
                if(ecart_global != null) tr +=1;
                console.log("tr " + tr);
                restitution[parentId] = {};
                restitution[parentId]["echantillon"] = tbChoix;
                /*
                il y a une eventuelle suite de taches à accomplir, je ne sais pas quand il faudra redonner la  main
                aussi, j'utilise promise pour synchroniser les actions
                je place les fct dans un tb d'obet promise
                promise se 'resolvera' qd necessaire et rendra la main                
                
                on peut aussi imaginer un systeme de fct callback comme le fait promise mais en mode simplifié(a la mano)

                */
                var tbSync = new Array();
                if(no_sortie != null) {
                  var p = new Promise(function(resolve,reject) {
                      stats.PasDeTirages(tbChoix, no_sortie, function(err,datas) {
                        if(err != undefined || undefined != null) reject(err);
                        var retour = {};
                        restitution[parentId]["no_sortie_ok"] = datas;
                        if(datas !=null)
                        {
                          console.log("tbChoix : " + util.inspect(tbChoix));
                          console.log("datas : " + util.inspect(datas));
                          console.log("le diff : " + util.inspect(tbChoix.diff(datas)));
                          restitution[parentId]["no_sortie_ko"] = tbChoix.diff(datas);
                        }
                        else
                          restitution[parentId]["no_sortie_ko"] = null;
                        console.log("retour " ,util.inspect(restitution));
                        resolve(restitution);
                          //  res.send(JSON.stringify(restitution));
                      });
                    });
                    tbSync.push(p);
                }
                if (ecart_global != null)
                {
                    var p = new Promise(function(resolve,reject) {
                        stats.GetEcartMoyen(0, ecart_global, function(err,ecResult) {
                          if(err != undefined || undefined != null) reject(err);
                          console.log("ecr : " + util.inspect(ecResult));
                          restitution[parentId]["ecart_global_ok"] = {};
                          restitution[parentId]["ecart_global_ko"] = {};
                          restitution[parentId]["ecart_global_ok"] = ecResult["ecart_global_ok"];
                          restitution[parentId]["ecart_global_ko"] = ecResult["ecart_global_ko"];
                          resolve(restitution);
                        });
                    });
                    tbSync.push(p);
                }
                if (contraintes.ecart_moyen != null)
                {
                    var p = new Promise(function(resolve,reject) {
                        stats.GetEcartMoyen(ecart_moyen_tirages, ecart_moyen_directive, function(err,ecResult) {
                          if(err != undefined || undefined != null) reject(err);
                          console.log("ecr : " + util.inspect(ecResult));
                          restitution[parentId]["ecart_moyen_ok"] = {};
                          restitution[parentId]["ecart_moyen_ko"] = {};
                          restitution[parentId]["ecart_moyen_ok"] = ecResult["ecart_moyen_ok"];
                          restitution[parentId]["ecart_moyen_ko"] = ecResult["ecart_moyen_ko"];
                          resolve(restitution);
                        });
                    });
                    tbSync.push(p);
                } 
                var sck = 0;
                tbSync.forEach(function(obj){
                  obj.then(function() {
                    sck +=1;
                    if(sck == tbSync.length) {
                    
                     res.send(JSON.stringify(restitution));

                    }
                  });

                })
     

  },
  generation: function (req,res) {
   


  },
  find_ecarts: function (req,res) {

   

  },
  list_ecarts: function(req,res) {
    var stats = new statistiques();
    stats.GetEcartMoyen(0, "<", function(err,ecResult) {
      var retour = ecResult["ecart_tous"];
      console.log(util.inspect(ecResult));
      res.send(JSON.stringify(retour));
    });

  },
  info_numero: function(req,res) {

    var stats = new statistiques();
    var numero = req.query.numero;
    var retour = {};
    var chaine_ecart="";
    var chaine_tir = "";
    var tbTir = new Array();

    //les 10 derniers tirages
    //nb tir / tirages ttl
    //même choses sur les x derniers tir (200 ou 300)
     stats.GetEcartMoyen(0, "<", function(err,ecResult) {
      if(err != undefined || undefined != null) res.send(err);
      var tbEc = ecResult["ecart_tous"];
      for(var t=0;t<tbEc.length;t++)if(tbEc[t]["num"] == numero) chaine_ecart = tbEc[t]["ttl"] + " sorties / " + tbEc[t]["moyenne"] + " de moyenne";

      retour["ecart"] = chaine_ecart;
      stats.GetLastTiragesForNumber(numero,8,function(err,rs){
        
        rs.map(function(obj,idx){
          chaine_tir = moment(obj["TIR_DATE"]).format("YYYY-MM-DD") + " : " + obj["TIR_1"] + "-" + obj["TIR_2"] + "-" + obj["TIR_3"] + "-" + obj["TIR_4"] + "-" + obj["TIR_5"] + "  (" + obj["TIR_C"] + ")";
          tbTir.push(chaine_tir);

          if(idx == rs.length-1){
            retour["tirages"] = tbTir;
            res.send(JSON.stringify(retour));
          } 
        });
        if(rs.length<=0)res.send(JSON.stringify(retour));

      })
      
    });






  },  
  debug: function (req,res) {

    console.log(req.query.date1);
    
  }
};

