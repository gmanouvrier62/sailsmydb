var events = require('events');
var request = require('request');
var util = require("util");
var fs = require('fs');
var Immutable=require("immutable");
var moment = require('moment');
var sleep = require('sleep');
var getGravite = require ("../services/gravite.js");
var logger = require('../services/logger.init.js').logger("tom.txt");
function analyse(){
      //this.pName="/dev/ttyACM0";   
      //this.Temperature="";    
      //this.rawTmp="";//stockage des infos entre les tags D et F
      events.EventEmitter.call(this);    
      //this.serialPort=undefined;
  }; 
analyse.prototype.GetDateNextTirage = function(callback) {

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
  var retour = {"date": "",
                "gravite":""};
  
  var tbT = new Array("lundi", "mercredi", "samedi");
  var jour = moment().locale('fr').format("dddd");
  console.log("joujour à sa mèmère : " + jour);
  var offset = 0;
  if(tbT.inArray(jour))
   console.log(moment().format("YYYY-MM-DD") + " 20:00:00");
  else {
   for(var cpt=1;cpt<4;cpt++) {
    jourx = moment().add(cpt,"days").locale('fr').format("dddd");
    if(tbT.inArray(jourx))
      if(offset == 0) offset=cpt;
   }
  
  }
  var jour_next = moment().add(offset,"days").locale('fr').format("YYYY-MM-DD") + " 20:00:00";
  getGravite(jour_next,function(err,alors){
                                   
      if(err == null || err == undefined)                                
      {
        retour["date"] = jour_next;
        retour["gravite"] = alors;
        callback(null,retour);
      } else {
        callback(err,null);
      }
  });
  



}
//Retrouver le premier tirage aprés
analyse.prototype.GetNextTirageAfter = function(tir_date,callback) {

	var sql = "select * from tirages where tir_date >'" + tir_date + "' order by tir_date asc limit 1";
	console.log(sql);
	sails.models.tirages.query(sql,function creaStat(err,results) {
  
    	if(err==null || err=='null'){
    		console.log(err);
    		console.log("ttl last : " +  results.length);
    		if (results.length > 0)
              callback(null,results[0]);
          	else	
          	  callback(null,null);
    	}
    	else {
            console.log("Err!!! : " + err + "utl=" + util.inspect(results));
            callback(err + util.inspect(results),null);
          }

	});

};
//Retrouve le tirage le plus proche (date du jour, jour suivant et le cas echeant le dernier tirage avant date indiquée)
analyse.prototype.GetTirage = function(tir_date,callback) {

  var sql  = "select * from tirages where tir_date='" + tir_date + "'";
  var sql2 = "select * from tirages where tir_date>'" + tir_date + "' order by tir_date asc limit 1";
  var sql3 = " select * from tirages where tir_date<'" + tir_date + "' order by tir_date desc limit 1";
 
  sails.models.tirages.query(sql,function creaStat(err,results) {
  
    if(err==null || err=='null'){
            //console.log("CREATION STAT : " + util.inspect(created) );
            if (results.length > 0)
              callback(null,results[0]);
            else {
              console.log(sql2);
              sails.models.tirages.query(sql2,function creaStat(err,results) {
                if (results.length > 0)
                   callback(null,results[0]);
                else {
                  console.log(sql3);
                   sails.models.tirages.query(sql3,function creaStat(err,results) {
                      if (results.length > 0)
                        callback(null,results[0]);
                      else
                        callback("Aucun tirage",null);
                   });

                }

              });

            }

          }
          else {
            console.log("Err!!! : " + err + "utl=" + util.inspect(results));
            callback(err + util.inspect(results),null);
          }

  });

};

//je regarde ligne par ligne avec mise en tempon de la ligne précédente
// si ligne courrante a des totaux par num > aux precedent => j'incremente de 1
// les champs non comptabilisable (date) sont simplement rajoutés
// Je retourne un tableau de tableau
analyse.prototype.private_comptage =function(results2,callback) {
 var ttl;
 var tbRetour = new Array();
 var tbBefore;
 var cpt_ligne =0;
 //console.log(util.inspect(results2));
 var results2_prim=results2.map(function(obj){
 				ttl = new Array();
 				if(cpt_ligne <= 0) {

  					  tbBefore = new Array();
                      var tb_bef = Object.keys(obj);
                    
                      tb_bef.forEach(function(objf,id){
                          //console.log("1 ch bef :" + objf);
                          tbBefore[objf] = obj[objf];
                          //tbBefore.push(obj[objf]);
                      });
                      console.log("before : " + util.inspect(tbBefore));
                }
                else {
		             
		             tb_cur = Object.keys(obj);
		             tb_cur.forEach(function(champs,id){
		             	 if(champs == 'stat_date_total')
			                ttl[champs] = moment(obj[champs]).format("YYYY-MM-DD HH:mm:ss");
			             else
			             	if (champs != 'id' && champs != 'createdAt' && champs != 'updatedAt') {
			             		ttl[champs] = parseInt(obj[champs]) - parseInt(tbBefore[champs]);

			                }
			                else
			                	ttl[champs] = obj[champs];

			             if(id>=52)
			             {
				             // console.log("dans private comptage avant callback : " + util.inspect(tbRetour));
				             tbRetour.push(ttl);
				             if (cpt_ligne >= results2.length -1)
				             	callback(null,tbRetour);

			             } 

		             });     
		             
		             
                 
                }
                 
   cpt_ligne++; 
                
   });
 
};
analyse.prototype.private_getTirageByDate = function(dt,callback) {
	var sql = "select * from tirages where tir_date='" + dt + "'";
	logger.warn("req get tirage : ", sql);
 			sails.models.tirages.query(sql,function(err,rsTir){
				if(err==null || err=='null'){

				 				callback(null,rsTir);
				}
				//else
					//callback(err,null);
 			});


};
analyse.prototype.ListeDatesLastTirages = function(nbT,callback) {
  //Je fais un +100 car j'ai besoin d'avoir les dates antérieurs précises des tirages 
  var sql = "select TIR_DATE from myloto.tirages order by TIR_DATE desc limit " + (nbT + 100);
  sails.models.tirages.query(sql,function(err, rs){
  	if(err==null || err=='null') {
  		callback(null,rs);
  	}
  	else {
  		callback(err,null);		
  	}
  });

};
analyse.prototype.GetLastTirages = function(nbT,callback) {
  
  var sql = "select * from myloto.tirages order by TIR_DATE desc limit " + nbT;
  sails.models.tirages.query(sql,function(err, rs){
    if(err==null || err=='null') {
      callback(null,rs);
    }
    else {
      callback(err,null);   
    }
  });

};
analyse.prototype.ListeTirages = function(mois,annee,callback) {
	var strSQL = "";

	if ((mois == 0) || (annee == 0))
		strSQL = "select * from myloto.tirages order by TIR_DATE desc";
	else
		strSQL = "select * from myloto.tirages where month(TIR_DATE)=" + mois  + " and year(TIR_DATE)=" + annee + " order by TIR_DATE desc";

	console.log("req liste_tir : " + strSQL);
	sails.models.tirages.query(strSQL,function(err,rs){

		if(err==null || err=='null'){
			callback(null,rs);
		}
		else {
			callback(err,null);		
		}
		
	});


};

//Occurences de sortie de quelques numéros
analyse.prototype.GetOccurences = function(nums,callback) {
	var self = this;
	var tbCriteres = new Array();
	var strSQL = "SELECT stat_date, count( stat_date ) AS ttl FROM myloto.stats " +
			" WHERE stat_num IN ( " + nums.join(",") +") GROUP BY stat_date HAVING ttl >=2 order by stat_date desc";
 	logger.error(strSQL);
   
 	sails.models.tirages.query(strSQL,function(err,rs){
 		var tbRetour = new Array();
 		var cpt = 0;
 		console.log("rs count : " + rs.length);
 		var resultat = rs.map(function(obj){
 			var flds = Object.keys(obj);
 			//console.log(obj["stat_date"]);
      var retour = {};
      retour["stat_date"] = moment(obj["stat_date"]).format("YYYY-MM-DD HH:mm:ss");
      retour["occurence"] = obj["ttl"]; 
 			self.private_getTirageByDate(retour["stat_date"], function(err,rows){
			   cpt++;
			   if(err==null || err=='null'){
 				   this.bRet["tirages"] = rows;
 				   tbRetour.push(this.bRet);
     			 if(cpt == rs.length) {
     					//console.log("pret pour rendre la main");
     					callback(err,tbRetour);
     			 }
    	 	 } else {
    	 			console.log(err);
    	 	 }
 			}.bind({'bRet': retour}));//un bind sur retour car "retour" externe à private_... lié avec celui à l'interieur(bRet) 
 		  
 		});
 	});
},
analyse.prototype.GetOccurencesParams = function(params,callback) {
  var self = this;
  var nums = params.nums;
  var arrangement = params.arrangement;
  var date_min = params.date_min;
  var date_max = params.date_max;
  
  var tbCriteres = new Array();

  var strSQL = "SELECT stat_date, count( stat_date ) AS ttl, tir_1, tir_2, tir_3, tir_4, tir_5, tir_c FROM myloto.stats inner join myloto.tirages on " +
      " stat_date=tir_date " +
      " WHERE stat_date between '" +  date_min  + "' and '" + date_max  +"' and stat_num IN ( " + nums.join(",") +") GROUP BY stat_date HAVING ttl >=" + arrangement + " order by stat_date desc";


  logger.warn("REQ : ",strSQL);
   
  sails.models.tirages.query(strSQL,function(err,rs){
    
    if(err != null) {
      logger.error(err);
      callback(err,null);
    } else {
        
        var cpt = 0;
        //logger.log("rs count : " + rs.length);
        if(rs.length < params.seuil) {
           var retour = {};
           return callback("pas assez de tirages de 3",null);
        } else {
          var retour = {};
          retour["sorties"] = [];
          rs.map(function(obj,id){
            console.log(obj["stat_date"]);
            var sretour = {};
            sretour["stat_date"] = moment(obj["stat_date"]).format("YYYY-MM-DD HH:mm:ss");
            sretour["occurence"] = obj["ttl"];
            sretour["tirages"] = [ obj["tir_1"], obj["tir_2"], obj["tir_3"], obj["tir_4"], obj["tir_5"] ];
            retour["sorties"].push(sretour);
            if(id == rs.length-1) {
              return callback(null,retour);
            }
            
          });
        }
    }

  });
    
   

},
analyse.prototype.GetGlobalTotaux = function(callback) {
   var ttlm = 0;
   var sql = "select * from myloto.stat_total order by id desc limit 1";
   sails.models.stat_total.query(sql, function(err,rows){

      if(err != undefined) {
        callback(err,null);
      } else {
        var rs = rows[0];
        var tb = Object.keys(rs);
        var retour = {};
        tb.map(function(obj, id) {

          if(id > 1 && id < 51) {
            retour[obj.replace("N_","")] = {'ttl' : rs[obj], 'class': ''};
            ttlm += rs[obj];
          }
          if(id == 50) {
            console.warn("alors : ", retour);
            console.warn("moy : " + (ttlm/49));
            for(var f = 1;f <= 49; f++) {
              var current = retour[f];
              if(current.ttl > (ttlm/49)) 
                current.class = 'fo';
              else if (current.ttl < (ttlm/49))
                  current.class = 'fa';

            }
            callback(null,retour);
          }
        });
      }

   });

},
//Reprise des totaux num par num d'une date à une autre
analyse.prototype.GetTotaux = function(date_depart,date_fin,callback) {
  self = this;
  var tbBefore = new Array();
  var tbMax = new Array();//tableau qui va accueuillir les valeurs max
  //date_depart += " 00:00:00";
  //date_fin += " 00:00:00";
  var tir_depart;
  var tir_fin;
  console.log("dep : " + date_depart + ", fin : " + date_fin);
  //sleep.sleep(5);
  this.GetTirage(date_depart,function(err,rs){
    console.log(util.inspect(rs));
    //console.log(util.inspect(mut));

    tir_depart = moment(rs.TIR_DATE).format("YYYY-MM-DD HH:mm:ss");
    var depart_moins1="select * from tirages where TIR_DATE<'" + tir_depart + "' order by TIR_DATE desc limit 1";
    console.log("req < à date depart : " + depart_moins1);
    sails.models.tirages.query(depart_moins1,function(err,ms1){
          console.log("err : " + err);
          console.log("ms1 : " + util.inspect(ms1));
          if(err == '' || err == undefined) {
              console.log("la dt moins 1 brut : " + ms1[0].TIR_DATE);
              var date_moins = moment(ms1[0].TIR_DATE).format("YYYY-MM-DD HH:mm:ss");
              console.log("la date_moins = " + date_moins);
              self.GetTirage(date_fin,function(err,rs){
              tir_fin = moment(rs.TIR_DATE).format("YYYY-MM-DD HH:mm:ss");
              
              //recherche des tirages entre ces 2 dates
              var sql = "select * from stat_total where stat_date_total >='" + date_moins + "' and stat_date_total <='" + tir_fin + "' order by stat_date_total asc";
              //scann des totaux de tirages
              console.log(sql);
              //sleep.sleep(5);
              sails.models.stat_total.query(sql,function(err,results2){
                           
                //Je map toutes les rows
                //pour rappel j'ai placé en tb les valeur de debut -1 dans tbBefore
                //les valeurs de max dates dans tbMax
                //obj contiendra les valeurs courrantes
                self.private_comptage(results2,function(err,retour){
                  
                 // console.log ("retour : " + "ok " + util.inspect(retour));
                  //insertion

 
                  var tb = new Array();
                  var ttlLigne = retour.length;
                  var tbRetour = new Array();
                  var tbSubI = new Array();
                  var retourJSON={};
                  var dernier_tirage = "";
                  var cpt = 0;
                  retour.map(function(obj){
       
                    var fld = Object.keys(obj);
        
                    var item = {};
                    fld.forEach(function(champs,id) {
                      //node n'accepte pas que l'on utilise un nom de variable comme nom de champs de manière literale, 
                       
                      item[champs] = obj[champs];
                      if(cpt == ttlLigne-1) {
                        if(champs.substr(0,1)=='N') {
                          var subI={};
                          subI[champs]=obj[champs];
                          tbSubI.push(subI);
                        }

                      }
                    });//fin de foreach
                  
                    tbRetour.push(item);
                    cpt++;
                    if(cpt == retour.length)
                    dernier_tirage = item.stat_date_total;

                });//fin de map
                //tri sur un tableau avec tri de la valeur, tri decroissant
                //afin de retourner un tableau de totaux de sorties par numéro
                tbSubI.sort(function(x,y){
                  var x1 = Object.keys(x);
                  var y1 = Object.keys(y);
                  return y[y1[0]] - x[x1[0]];

                });
                //mise en forme du json de retour pour le classement
                var retourClassement = {};
                tbSubI.map(function(obj){
                    var x = Object.keys(obj);
                    retourClassement[x[0]] = obj[x[0]];
                });


                  //récupération d'un éventuel tirage suivant la date de fin d'analyse
                  var itemLast = {};
                  self.GetNextTirageAfter(dernier_tirage,function(err,last_tirage) {
                   if (last_tirage != null)
                   {
                    
                     var fld = Object.keys(last_tirage);
                     fld.forEach(function(champs,id) {
                        if(champs == 'TIR_DATE')
                          itemLast[champs] = moment(last_tirage[champs]).format("YYYY-MM-DD");
                        else
                           itemLast[champs] = last_tirage[champs];
                        console.log(last_tirage[champs]);
                     });
                     
                   }        
                  retourJSON["datas"] = tbRetour;;
                  retourJSON["TotalSort"] = retourClassement;
                  retourJSON["last"] = itemLast;



                  //fin insertion
                  callback(null,retourJSON);
                  });
              });

               
              });      


             
            });
        }
        else {
          console.log("err : " + err);
              callback(err,null);
        }
        

    });//dt depart moins 1

    
   


  });
  
  
 


};

//appelera GetTotaux mais avec un parametrage genre analyse sur 60 jours arrieres
//si date tirage suivante on la retourne, donc prevoir un objet de retour complet
analyse.prototype.GetPeriode = function(date_analyse,periode,callback) {

 

};



analyse.prototype.__proto__ = events.EventEmitter.prototype;
module.exports=analyse;

