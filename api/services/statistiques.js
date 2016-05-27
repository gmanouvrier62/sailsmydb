var events = require('events');
var request = require('request');
var util = require("util");
var fs = require('fs');
var Immutable=require("immutable");
var moment = require('moment');
var sleep = require('sleep');
function statistiques(){
      //this.pName="/dev/ttyACM0";   
      //this.Temperature="";    
      //this.rawTmp="";//stockage des infos entre les tags D et F
      events.EventEmitter.call(this);    
      //this.serialPort=undefined;
  }; 

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
statistiques.prototype.GetNumbersFromGraviteRange = function(grave1, grave2,callback) {

  var tbRet = new Array();
  var sql = "select count(*) as ttl ,stat_num from myloto.stats where ";
      sql += "stat_gravite_val>=" + grave1 + " and stat_gravite_val<=" + grave2 + " group by stat_num order by ttl desc";
  sails.models.stats.query(sql,function(err,rs){
    if(err!=null && err != undefined) {
      console.log("Erreur : " + err);
      callback(null);
      
    } else {
      console.log("donnees grv  : " + util.inspect(rs));
      for(var g =0 ;g<rs.length;g++) {
        var unite = {"stat_num": rs[g].stat_num,"ttl": rs[g].ttl};
        tbRet.push(unite);
      }

      callback(tbRet);
    }
  }); 

},
statistiques.prototype.GetNumbersFromGravite = function(gravite,callback){

  var tbRet = new Array();
  var sql = "select count(*) as ttl ,stat_num from myloto.stats where ";
      sql += "stat_gravite='" + gravite + "' group by stat_num order by ttl desc";
  sails.models.stats.query(sql,function(err,rs){
    if(err!=null && err != undefined) {
      console.log("Erreur : " + err);
      callback(null);

    } else {
      console.log("donnees grv  : " + util.inspect(rs));
      for(var g =0 ;g<rs.length;g++) {
        var unite = {"stat_num": rs[g].stat_num,"ttl": rs[g].ttl};
        tbRet.push(unite);
      }

      callback(tbRet);
    }
  });
},
statistiques.prototype.GetGravitesFromNumber = function(number,callback){

  var sql = "select count(*) as ttl ,stat_gravite from myloto.stats where ";
      sql += "stat_num=" + number + " group by stat_gravite order by ttl desc";
  sails.models.stats.query(sql,function(err,rs){
    if(err!=null && err != undefined) {
      callback(null,rs);
    } else {
      callback(err,null);
    }
  });

},

statistiques.prototype.PasDeTirages = function(panel,nbTirages,callback) {
  var tbExclus = new Array();
  var sql = "select TIR_DATE, TIR_1, TIR_2, TIR_3, TIR_4, TIR_5, TIR_C from myloto.tirages ";
      sql += " order by TIR_DATE desc limit " + nbTirages ;
  sails.models.tirages.query(sql,function(err, rs){
  	if(err==null || err=='null') {
  		var ttl = rs.length;
      var f = rs.map(function(obj,idx) {
        //mise en mémoire des num à checker
        var tb1 = new Array();
        tb1.push(obj["TIR_1"]);
        tb1.push(obj["TIR_2"]);
        tb1.push(obj["TIR_3"]);
        tb1.push(obj["TIR_4"]);
        tb1.push(obj["TIR_5"]);
        console.log("dadate " + obj["TIR_DATE"] + " vas differ sur ", util.inspect(tb1));
        panel = panel.diff(tb1);

        if(idx == (ttl-1))
          callback(null,panel);
        else
          console.log("on en est à ", idx + " pout un ttl de " + ttl);

      });
   	}
  	else {
  		callback(err,null);		
  	}
  });

};
statistiques.prototype.GetLastTiragesForNumber = function(num,nbT,callback) {
  //Je fais un +100 car j'ai besoin d'avoir les dates antérieurs précises des tirages 
  var sql = "select * from myloto.tirages where TIR_1=" + num + 
                                              " or TIR_2=" + num + 
                                              " or TIR_3=" + num + 
                                              " or TIR_4=" + num + 
                                              " or TIR_5=" + num + 
                                              " order by TIR_DATE desc limit " + nbT;
  sails.models.tirages.query(sql,function(err, rs){
    if(err==null || err=='null') {
      callback(null,rs);
    }
    else {
      callback(err,null);   
    }
  });

};

statistiques.prototype.GetEcartMoyenUntil = function(dt,ordre,callback) {
  var somme = 0;
  var moyenne = 0;
  var tbTous = new Array();
  var strSQL = "select count(*) as ttl from myloto.tirages where TIR_DATE<'" + moment(dt).format("YYYY-MM-DD")  + " 00:00:00'";
  sails.models.tirages.query(strSQL, function(err,rsCount) {
     if(err==null || err=='null'){
        var totalTirages = rsCount[0]["ttl"];
        console.log("nb Tirages : " + totalTirages);
        strSQL = "select * from myloto.stat_total where stat_date_total < '" + dt + "'order by stat_date_total desc limit 1";
        console.log("req liste_tir : " + strSQL);
          
          sails.models.stat_total.query(strSQL,function(err,rs){

            if(err==null || err=='null' && (rs[0] !=null || rs[0] != undefined)){
              
              var row = rs[0];
              var flds = Object.keys(row);
              flds.forEach(function(champs,id) {
                if(champs.substr(0,1)=='N')
                  somme += row[champs];
              });
              //console.log("somme : " + somme + ", ttl tirages : " + totalTirages);
              moyenne = parseInt(somme / 49);
              //maintenant on verifie par rapport à la moyenne et aux critères de contraintes
              flds.forEach(function(champs,id) {
                if(champs.substr(0,1)=='N') {
                  //console.log("moyenne : " + moyenne + " moy n." + champs + " = " + row[champs]);
                  var categorie = "";
                  if(row[champs] > moyenne) categorie = "fort_2";
                  if(row[champs] == moyenne) categorie = "moyen_2";
                  if(row[champs] < moyenne) categorie = "faible_2";
                   
                  tbTous.push({"num": champs.replace("N_",""),"ttl":row[champs], "moyenne": moyenne,"type": categorie,"ordre": ordre});

                }
              });
              //console.log("avant cb");
             // console.log(util.inspect(tbTous));
              callback(null,tbTous);
            } else {
              callback(err,null); 
            }

          });
      } else {
        callback(err,null);   
      }
  });


};
statistiques.prototype.GetEcartMoyen = function(nbTirages, contrainte, callback) {

  var tbOK = new Array();
  var tbKO = new Array();
  var tbTous = new Array();
  var somme = 0;
  var moyenne = 0;
  var strSQL = "select count(*) as ttl from myloto.tirages";
  sails.models.tirages.query(strSQL, function(err,rsCount) {

      if(err==null || err=='null'){
        var totalTirages = rsCount[0]["ttl"];
        console.log("nb Tirages : " + totalTirages);

        if (nbTirages>0) {
          //ecart sur periode
          //on retrouve la date à x tirage
          //on fait un calcul total entre cette date et maintenant
          //on applique la contrainte
          strSQL = "select TIR_DATE from myloto.tirages order by TIR_DATE desc limit " + nbTirages;
          sails.models.tirages.query(strSQL,function(err,rs){
            var dateX = moment(rs[rs.length-1]["TIR_DATE"]).format("YYYY-MM-DD") + " 00:00:00";
            var date1 = moment().format("YYYY-MM-DD 21:00:00");
            console.log("la recherche sur " + dateX + " au " + date1);
            var nalyse = new analyse();
            nalyse.GetTotaux(dateX, date1, function(err,rs){
                console.log("retret : " + util.inspect(rs));
                
               if(err==null || err=='null'){
              
                  var row = rs["TotalSort"];
                  var flds = Object.keys(row);
                  flds.forEach(function(champs,id) {
                    if(champs.substr(0,1)=='N')
                      somme += row[champs];
                  });
                  console.log("somme : " + somme + ", ttl tirages : " + totalTirages);
                  moyenne = parseInt(somme / 49);
                  //maintenant on verifie par rapport à la moyenne et aux critères de contraintes
                  flds.forEach(function(champs,id) {
                    if(champs.substr(0,1)=='N') {
                      console.log("moyenne : " + moyenne + " moy n." + champs + " = " + row[champs]);
                      if(contrainte == "=")
                      {
                        if (row[champs] == moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));

                      } else if (contrainte == ">") {

                        if (row[champs] > moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));

                      } else if (contrainte == "<") {

                        if (row[champs] < moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));
                      }

                    }
                  });
                  var retour = {"ecart_moyen_ok" : tbOK,"ecart_moyen_ko" : tbKO};
                  console.log("avant cb");
                  console.log(util.inspect(retour));
                  callback(null,retour);
               }
               else {
                callback(err,null);   
               }

            });

          });

        }
        else {
          //ecart global
          strSQL = "select * from myloto.stat_total order by stat_date_total desc limit 1";
          console.log("req liste_tir : " + strSQL);
          
          sails.models.stat_total.query(strSQL,function(err,rs){

            if(err==null || err=='null'){
              
              var row = rs[0];
              var flds = Object.keys(row);
              flds.forEach(function(champs,id) {
                if(champs.substr(0,1)=='N')
                  somme += row[champs];
              });
              console.log("somme : " + somme + ", ttl tirages : " + totalTirages);
              moyenne = parseInt(somme / 49);
              //maintenant on verifie par rapport à la moyenne et aux critères de contraintes
              flds.forEach(function(champs,id) {
                if(champs.substr(0,1)=='N') {
                  console.log("moyenne : " + moyenne + " moy n." + champs + " = " + row[champs]);
                  var categorie = "";
                  if(row[champs] > moyenne) categorie = "fort";
                  if(row[champs] == moyenne) categorie = "moyen";
                  if(row[champs] < moyenne) categorie = "faible";
                   
                  tbTous.push({"num": champs.replace("N_",""),"ttl":row[champs], "moyenne": moyenne,"type": categorie});
                  if(contrainte == "=")
                  {
                    if (row[champs] == moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));

                  } else if (contrainte == ">") {

                    if (row[champs] > moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));

                  } else if (contrainte == "<") {

                    if (row[champs] < moyenne) tbOK.push(champs.replace("N_","")); else tbKO.push(champs.replace("N_",""));
                  }

                }
              });
              var retour = {"ecart_global_ok" : tbOK,"ecart_global_ko" : tbKO,"ecart_tous" : tbTous};
              console.log("avant cb");
              console.log(util.inspect(retour));
              callback(null,retour);
            }
            else {
              callback(err,null);   
            }
          });
        }
 



      }
      else {
        callback(err,null);   
      }
  });
  
};


statistiques.prototype.__proto__ = events.EventEmitter.prototype;
module.exports=statistiques;

