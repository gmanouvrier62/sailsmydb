/**
 * TiragesController
 *
 * @description :: Server-side logic for managing Tirages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var cheerio = require('cheerio');
var Immutable = require('immutable');
var ejs = require('ejs');
var logger = require('../services/logger.init.js').logger("tom.txt");
var getGravite = require ("../services/gravite.js");
module.exports = {
	
  traitement: function (req, res) {
    var uncochon = new importation();
    uncochon.setGraviteAttr(function(re) {

      console.log("de retour : " + re);
    });
  },

  /**
   * `TiragesController.import()`
   */
  import: function (req, res) {
  
  //Arranger le code pour qu'il continue les curl aprés la fin du precedent
  //faire une fonction genre ds service 
   //console.log("avec util : " + util.inspect(twig,false,null));
  
   var tbMois = new Array("janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre");
   var annee_actuelle = moment().year();
  // var date_min = moment({year:2008, month: 9, day:30});
  var date_min = moment({year:2016, month: 1, day:30});
   for (var annee = 2016; annee <= annee_actuelle; annee++) {
      for(var mois = 0; mois <=11;mois++) {
        var file_loto = "tirages-" + tbMois[mois] + "-" + annee + ".htm"; 
        var full_url = "http://www.lesbonsnumeros.com/loto/resultats/" + file_loto;
         console.log(full_url); // Show the HTML for the Google homepage. 

          //mettre dans u n export + call back
          var chemin_local="/home/gilles/node/git/sailsmydb/assets/datas/" + file_loto;
          //Attention je reload qd meme pour lemois courrant pour faire les mises à jour courrantes du mois
          var date_relative = moment({year: annee,month: mois +1, day:1});
          var date_courrante = moment();

          console.log("date relative courrante : " + date_relative);
          //!!! Les mois sont indéxés à 0
          if (fs.existsSync(chemin_local) && moment().month() != mois) {
    
              console.log("le fichier existe déjà : " + file_loto);
         
          }
          else {
              if(((date_relative <= date_courrante) && (date_relative > date_min)) ||  moment().month()==mois  )
              {
                console.log("!!!!!!!attention reload de : " + file_loto);
                if(moment().month() == mois) console.log("mise à jour du mois courrant");
                var imp= new importation();
                imp.launch(full_url,file_loto, function(err){

                  console.log(err);

                });
             }
             else {
                console.log("date hors champs");
             }
          }

       if((annee == annee_actuelle) && (mois == 11))
       {
                   res.redirect("/tirages/synchronise");
                  
      }

      }
   }
   


  },
  liste_tirages: function (req,res) {
    var params = req.query.datas;
    console.log(params);
    var mois = params.mois;
    var annee = params.annee;
    var lyse = new analyse();
    var stic = new statistiques();
    var retourResultat = new Array();
    var retourEcart = new Array();
    console.log("an : " + annee + ", mois : " + mois);

    lyse.ListeTirages(mois,annee,function(err, resultat){
     
      //console.log(util.inspect(resultat));
      if(err == null) {
        resultat.map(function(obj,id){
          if(id<=100)
          {

            obj.TIR_DATE = moment(obj.TIR_DATE).format("YYYY-MM-DD");
            stic.GetEcartMoyenUntil(obj.TIR_DATE,id,function(err,ec){
              
              if(err == null || err == undefined) {
                for(var c =0;c<ec.length;c++){

                  console.log("ligne ec" + util.inspect(ec[c]) + "pour num1 " + obj.TIR_1);
                  if(ec[c]["num"] == obj.TIR_1) {
                    console.log("il est trouvé car " + ec[c]["num"] + " = " + obj.TIR_1);
                    obj["CLASS_1"] = ec[c]["type"];
                    obj["RAPPORT_1"] = ec[c]["ttl"] + "/ moy = " + ec[c]["moyenne"];
                  }
                  else
                    if(ec[c]["num"] == obj.TIR_2) {
                      obj["CLASS_2"] = ec[c]["type"];
                      obj["RAPPORT_2"] = ec[c]["ttl"] + "/ moy = " + ec[c]["moyenne"];
                    }
                    else
                      if(ec[c]["num"] == obj.TIR_3) {
                        obj["CLASS_3"] = ec[c]["type"];
                        obj["RAPPORT_3"] = ec[c]["ttl"] + "/ moy = " + ec[c]["moyenne"];
                       }
                        else
                          if(ec[c]["num"] == obj.TIR_4) {
                            obj["CLASS_4"] = ec[c]["type"];
                            obj["RAPPORT_4"] = ec[c]["ttl"] + "/ moy = " + ec[c]["moyenne"]; 
                          }
                          else 
                            if(ec[c]["num"] == obj.TIR_5) {
                                  obj["CLASS_5"] = ec[c]["type"];
                                  obj["RAPPORT_5"] = ec[c]["ttl"] + "/ moy = " + ec[c]["moyenne"];
                            }
                          
                         
                                    
                }
                  
                  
                console.log("avec rajout de classe css ds obj: ", util.inspect(obj));   
                console.log("<à 20 donc, ecart à calculer");
                var un_tirage = {};
                //console.log(util.inspect(ec));
                un_tirage["TIR_DATE"] = obj.TIR_DATE;
                un_tirage["CPT"] = ec[0]["ordre"];
                
                un_tirage["NUMS"] = new Array();
                var num = {"NUMERO" : obj.TIR_1, "CLASS" : "case " + obj.CLASS_1,"TITLE" : obj.RAPPORT_1};
                un_tirage["NUMS"].push(num);
                var num = {"NUMERO" : obj.TIR_2, "CLASS" : "case " + obj.CLASS_2,"TITLE" : obj.RAPPORT_2};
                un_tirage["NUMS"].push(num);
                var num = {"NUMERO" : obj.TIR_3, "CLASS" : "case " + obj.CLASS_3,"TITLE" : obj.RAPPORT_3};
                un_tirage["NUMS"].push(num);
                var num = {"NUMERO" : obj.TIR_4, "CLASS" : "case " + obj.CLASS_4,"TITLE" : obj.RAPPORT_4};
                un_tirage["NUMS"].push(num);
                var num = {"NUMERO" : obj.TIR_5, "CLASS" : "case " + obj.CLASS_5,"TITLE" : obj.RAPPORT_5};
                un_tirage["NUMS"].push(num);
                var num = {"NUMERO" : obj.TIR_C, "CLASS" : ""};
                un_tirage["NUMS"].push(num);
                console.log("var un_tirage, val retournée ", util.inspect(un_tirage));

                retourResultat.push(un_tirage);

                if (id == 100 ) {
                  //TRI SUR OBJETS
                  retourResultat.sort(function (a,b){
                      var v1 = parseInt(a["CPT"]);
                      var v2 = parseInt(b["CPT"]);
                      if (v1<v2) return -1;
                      if (v1>v2) return 1;
                      return 0;
                  });

                  sails.models.reductions.find().exec(function(err,records) {
                    var tbRetour = [];
                    records.map(function(obj,id) {
                      if(tbRetour[obj["RED_DATE"]] == undefined) {
                          tbRetour[obj["RED_DATE"]] = [];
                      }
                      logger.info("bouboubou : " , obj["RED_DATE"]);
                      tbRetour[obj["RED_DATE"]].push(obj.RED_NUM);
                      if(id == records.length -1)
                        res.render('tirages/listTirages.ejs',{"datas":retourResultat,"reductions": tbRetour});
                      

                    });
                   

                  });
                  


                }

              } else {
                 function sortInt(a,b,field){
                    var v1 = parseInt(a[field]);
                    var v2 = parseInt(b[field]);
                    if (v1<v2) return -1;
                    if (v1>v2) return 1;
                    return 0;
                } 
                console.log("bourdiel de bourricot");
                  res.send("errored nanani");
              }

            });
            
           
          } 
        });//fin de map
      } else
          res.send("ERREUR : " + err);

    });




  },
  find_tirage: function (req,res) {

    //var debug='2015-11-18 20:00:00';
    var lyse = new analyse();
    var result = {
      err: '',
      resultat : null
    };
    sails.models.tirages.GetTirage(req.query.dt,function(err,resultat){
       
      if(err==null ||  err == 'null') {
        result.resultat = resultat; 
        console.log(" ok : " + util.inspect(result));
      } else {
        result.err = err;
        console.log("err : " + util.inspect(result));
      }
      res.send(JSON.stringify(result));       

    });

  },
  find_occurences: function(req,res) {
    var datas=req.query.datas;
    console.log("LES Nums : ",datas);
    var lyse = new analyse();
    lyse.GetOccurences(datas.nums,function(err,resultat){

      if(err==null ||  err == 'null') {
            console.log(" ok : " + util.inspect(datas));
          
           res.send(JSON.stringify(resultat));

            }
            else
              console.log("err : " + datas);



    });

  },
  analyse_periode: function(req,res) {
    //liste des tirages
    //verif si num existe dans la tbl des occurences
    //sinon, enregistrement du resultat de find_occurence pour chaque tirages
    var flagSent = false;
    console.log(util.inspect(req.query));
    var datas = req.query.datas;
    console.log(datas.periode);
    var le_step = datas.periode * 4 * 3; // 1 mois = 4 semaines de 3 tirages
    //récupération des 2 derniers tirages
    var lyse = new analyse();
    var allRetour = new Array();
    var cpt = 1;
    var nbTirages = 10;
    //principe : 
    /*
      récup des dates de tirages sur les 10 derniers tirages
      pour chaque tirage faire une analyse de gettotaux entre la date et date-step
      stocker les resultats en tableau et restituer un json au client
    */
    lyse.ListeDatesLastTirages(nbTirages,function(err,rs){

       if(err==null ||  err == 'null') {
            //console.log(" ok : " + util.inspect(resultat));
            }
            else
              console.log("err : " + err);
        
       var date_will_be = "resultat";
       var dt_resultat = "";
       var dt_fin = "";
       var dt_debut = "";
       cpt2=0;
       console.log("r " + rs[10].TIR_DATE);
       var json_retour = {};
       var tbRetour = new Array();
       tbRetour.push({});
             
       rs.map(function(obj){
          
          var currentDT = null;
          var endDT = null;
          var debutDT = null;
              if(cpt == 1)
              {
                //Affichage de la première date qui ne tient pas compte du future tirage(car pas encore produit
                currentDT = moment(obj.TIR_DATE).format("YYYY-MM-DD");
                debutDT = moment(rs[cpt+le_step].TIR_DATE).format("YYYY-MM-DD");
                endDT = moment(rs[cpt].TIR_DATE).format("YYYY-MM-DD");
               
                lyse.GetTotaux(debutDT,currentDT,function(err,resultat){
                          section = {};
                           section["date"] = currentDT;
                           section["debut"] = debutDT;
                           section["fin"] = currentDT;
                           section["datas"] = resultat;                      
                           tbRetour[0] = section;//enregistrement d'un set d'info complet pour une date
                           
                });   

              }        
              
              console.log("---------------------");
              //on traite
               if(cpt<=nbTirages)
               {
                   currentDT = moment(obj.TIR_DATE).format("YYYY-MM-DD");
                   debutDT = moment(rs[cpt+le_step].TIR_DATE).format("YYYY-MM-DD");
                   endDT = moment(rs[cpt].TIR_DATE).format("YYYY-MM-DD")
                   
                      console.log("pédiode-------------- " + cpt);
                      console.log("date courrante " + currentDT);
                      console.log("analyse du " + debutDT);
                      console.log(" au : " + endDT);
                   lyse.GetTotaux(debutDT,endDT,function(err,resultat){
                          section = {};
                           section["date"] = currentDT;
                           section["debut"] = debutDT;
                           section["fin"] = endDT;
                           section["datas"] = resultat;                      
                           tbRetour.push(section);//enregistrement d'un set d'info complet pour une date
                           cpt2++;
                           if(cpt2 == nbTirages)
                           {
                              //tri desc
                             tbRetour.sort(function (a, b) {
                                  if (a.date < b.date)
                                    return 1;
                                  if (a.date > b.date)
                                    return -1;
                                  // a doit être égale à b
                                  return 0;
                             });

                              var stats = new statistiques();
                              stats.GetEcartMoyen(0, "<", function(err,ecResult) {
                                var retourEcart = ecResult["ecart_tous"];
                                lyse.GetDateNextTirage(function(err,next_tirage){
                                  stats.GetNumbersFromGravite(next_tirage.gravite,function(rsGr) {

                                    console.log("prochain T : " + util.inspect(next_tirage));
                                    console.log("nfg : " + util.inspect(rsGr));
                                    if(rsGr == null)rsGr = new Array();
                                    //a voir pour faire un render
                                    //res.render fait penser à un objet EFJS 'greffé' à express donc sails
                                    var range = fs.readFileSync('/home/gilles/node/git/sailsmydb/views/tirages/range.ejs');
                                    var rangeEJS = range.toString();

                                    res.render('tirages/debug.ejs',{"nfg" : rsGr,"ntirage":next_tirage,"periode":datas.periode,"datas":tbRetour,"ecarts": retourEcart,"rangeEJS":rangeEJS});
                           

                                  });
                                     //res.send(JSON.stringify(next_tirage)); 
                                });
                                //
                              });


                             
                           }
                   });   
                  
                 if(cpt == nbTirages){
                    
                                  
                 }

                 cpt++;
               }
               else {
                 console.log("fini");
                  
               }

         

        }); 

      
    });





  },

  find_totaux: function (req,res) {

    var debut = req.query.date1 + " 20:00:00";
    var fin = req.query.date2 + " 20:00:00";
    console.log("debut : " + debut);
    console.log("fin : " + fin);
   
    var lyse = new analyse();
    //tout cela doit partir en amont dans GetTotaux pour pouvoir être réutilisé
    lyse.GetTotaux(debut,fin,function(err,resultat){

      if(err==null ||  err == 'null') {
            //console.log(" ok : " + util.inspect(resultat));
            }
            else
              console.log("err : " + err);

     
        res.send(JSON.stringify(resultat));

      });
    

  },
  
  debug_stat: function (req,res) {

    /*
    var debug='2008-10-15 22:00:00';
    var imp = new importation();
    imp.AddTotaux(debug,function(err){

      if(err==null ||  err == 'null') {

            }
            else
              console.log("err : " + err);

    });
  */
    console.log(req.query.date1);


  },
  /**
   * `TiragesController.synchronise()`
   */
  synchronise: function (req, res) {
    
    var imp= new importation();
    //lecture des fichiers du repertoire
    fs.readdir("/home/gilles/node/git/sailsmydb/assets/datas", function(err, files) { 
      //console.log(files);
      var cpt=0;
      files.forEach(function(file,index,array){
           
           if(file !='.' && file != '..' && file != '/') {
                    console.log("fichier " + file);
                    var contentHtml = fs.readFileSync("/home/gilles/node/git/sailsmydb/assets/datas/" + file);
                    $ = cheerio.load(contentHtml);
                    //Traitement du parsing html
                    //console.log(contentHtml.toString());
                    var tb=$('.hoverTable').each(function(i,elem){
                      console.log("trouve 1 hoverTable : " + elem);
                      $(this).find('tr').each(function (i,elem){
                        var date=$(this).find("td").eq(2).find("a").html();
                         if(date === null || date === 'null')
                          console.log("putain de nul");
                         else {
                                  //15/09/1970
                                  console.log("date=" + date);
                                  date=date.substr(-10);
                                  var y=date.substr(6,4) + "-" + date.substr(3,2) + "-" + date.substr(0,2);
                                  var sortie = new Array();
                                  //sortie.push(y);
                                  //var tir = new Tirages();
                                  y = y + " 20:00:00";
                                  var boules=$(this).find("td").eq(1).find("ul");
                                  boules.find("li").each(function()
                                  {
                                    if($(this).html()!="")
                                    sortie.push($(this).html());
                                  
                                  });
                                  if (sortie.length == 6) {

                                  
                                   cpt++;
                                   
                                   var data_values={TIR_DATE:y,
                                                    TIR_1:sortie[0],
                                                    TIR_2:sortie[1],
                                                    TIR_3:sortie[2],
                                                    TIR_4: sortie[3],
                                                    TIR_5: sortie[4],
                                                    TIR_C: sortie[5]};
                                   getGravite(y,function(err,alors){
                                   
                                      imp.AddTirages(data_values,alors,function(err){

                                          //voir pour mettre des trucs
                                          if(err != null) {
                                            console.log("ERRRRRRRRRRRREURRRRRRR " + err);
                                            //sleep.sleep(10);
                                          }
                                      });

                                   });
                                  }

                                  //penser à faire le total stat a fur et à mesure 
                                  console.log("sortie : " + sortie);
                         }




                      });//fin de scann tr

                    if (index == (files.length-1) ) {
                      console.log("HIT!");
                       var menu = fs.readFileSync('/home/gilles/node/git/sailsmydb/views/tirages/menu.ejs');
                       var main = "<div id='container'>-OK import et synchro-</div>";
                       console.log("txt : " + menu);
                       var tom = menu.toString();
                       return res.render ('home/container',{'nom': 'Manouvrius', 'prenom': 'Gillus','tplMenu': tom,'tplMain':main});
                    }

                    });
           }


      });
     
    });

    
  }
};

