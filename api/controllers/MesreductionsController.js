var fs = require('fs');
var util = require("util");
var moment = require('moment');

var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {
	

	save : function (req, res) {
	   Array.prototype.inArray = function (value)
	   {
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

		logger.info("ok dans save");
		var datas = req.query.datas;
		logger.util(datas);

		var tbT = new Array("lundi", "mercredi", "samedi");
  		var jour = moment(datas.RED_DATE).locale('fr').format("dddd");
  		logger.log("joujour à sa mèmère : " + jour);
  		var offset = 0;
  		if(tbT.inArray(jour)) {
 			//Process d'enregistrement ici
 			var sql = "select max(id_reduction) as lemax from myloto.reductions";
 			sails.models.reductions.query(sql,function(err,rs){

 				if(err != null) return res.send({err: "pb DB recuperation du dernier id reduction : " + err});
 				var id_reduction = 0;
 				logger.util(rs);
 				logger.warn("la val = " +  parseInt(rs[0]["lemax"]));
 				if(rs[0]._reduction == null && rs[0]["lemax"] <= 0) {
 					id_reduction = 1;
 					logger.error("ATTENTION si pas vide => error");
 				}
 				else {
 					id_reduction = rs[0]["lemax"];
 					id_reduction ++;
 					logger.warn("ok");
 				}
 				var mesreduc = {id_reduction: id_reduction,
 					RED_DATE: moment(datas.RED_DATE).locale('fr').format("YYYY-MM-DD") + " 20:00:00",
 					RED_NUM: null
 				};
 				logger.warn(mesreduc);
 				var idcpt = 0;
 				datas.RED_NUM.map(function(obj,id) {
 					mesreduc.RED_NUM = obj;
 					logger.warn("enr : ", mesreduc);
 					
 					sails.models.reductions.save_a_reduction(mesreduc,function(err,result){

 						if(id == datas.RED_NUM.length -1)
 							res.send("ok");


 					});


 				});

 			});


  		} else {
  			var retour = {err: "Ce n'est pas un jour de tirages"};
			return res.send(retour);
  		}
		
	},

	list : function (req,res) {
		logger.info("ok dans mesreductions/list");
		var datas = req.query.datas;
		var sql = "select * from myloto.reductions order by id_reduction desc";
		//obj.RED_DATE = moment(obj.RED_DATE).format("YYYY-MM-DD");
		var tbr = [];
		logger.info("rikette ", sql);
		sails.models.reductions.query(sql,function(err,rs){
			if(rs != undefined) {
				rs.map(function(obj,id){
					//logger.warn("src : ", obj);

					if(tbr[obj.id_reduction] == null || tbr[obj.id_reduction] == undefined ) {
						tbr[obj.id_reduction] = {
													NUMS: [],
					   								RED_DATE: '',
					   								id_reduction: obj.id_reduction
					   							};
					}
					tbr[obj.id_reduction].NUMS.push(obj.RED_NUM);
					tbr[obj.id_reduction].RED_DATE = moment(obj.RED_DATE).format("YYYY-MM-DD");
					//logger.util(tbr);
					if(id == rs.length-1) {	
						var tbr2 = [];
						tbr.map(function(obj,id){
							if(obj != null) tbr2.push(obj);
						});
						var retour = {err: err,result: tbr2};
						//logger.util(rs)["RED_DATE"] = ;
						

						return res.send(JSON.stringify(retour));
					}
				});
			} else {
				logger.error("pas de rs???");
				return res.send(JSON.stringify({err: err,result: null}));
			}
		});

	},
	delete : function (req,res) {
		
		var id = req.query.id;
		id = parseInt(id);
		logger.info("ok dans suppression mes reductions ");
		var sql = "delete from myloto.reductions where id_reduction=" + id;
		if(id != null) {
				sails.models.reductions.query(sql, function creaStat(err,created){
					logger.warn(err);
					var retour = {err: err};

					return res.send(retour);
				});
		}
	},
	compare: function(req,res) {

		var tirage = req.query.tirage;
		var sql = "select * from myloto.reductions where RED_DATE >='" + tirage.date + "' order by id_reduction";
		sails.models.reductions.query(sql, function creaStat(err,results){
			logger.warn(err);
			if(err != undefined) {
				var retour = {err: err};
				return res.send(retour);
			} else {
				if(results.length>0) {
					var tbResults = [];
					/*
					results.map(function(obj,id) {
						for(var i = 0; i< tbResults.length; i++) {
							if(tbResults[i] == undefined) {
								tbResults[obj.id_reduction] = 
							}	

						}
						

					});
					*/
				} else {
					var retour = {err: "pas de retour d'infos réduction"};

					return res.send(retour);
				}


			}
			
		});		
		

	},

	combinaisons: function(req,res) {

		var socket = req.socket;
		var io = sails.io;
		io.sockets.emit('/mesreductions/combinaisons', {thisIs: 'theMessage'});

		var ana = new analyse();
		var panel = req.query.panel.split(',');
		logger.warn(" panel : " , panel);	
		var allResults = [];

		// suite de 3 nums ds le meme tirage
		// période 36 mois ( 3 ans )
		// 2 foix 3 numéros sur cette période pour que ce soit OK
		var deno = new denombrement(panel);
		var ttlMax = deno.Count();
		var step = ttlMax/10;
		deno.List(function(result) {
			logger.warn("OK retour de deno");
			//logger.util(result);
			var ttt =0;
			ttlMax = result.length;
			var cptt = 0;
			result.map(function(obj,id) {

				//logger.warn("!!!!!!!!!un retour de denos : " + id + "= " , obj);
				var params = {
				    nums: obj.NUMS,
				    arrangement: 3,
				    seuil: 2,
				    date_min: moment().subtract(36,"month").format("YYYY-MM-DD HH:mm:ss"),
				    date_max: moment().format("YYYY-MM-DD HH:mm:ss")
				};
				 
				ana.GetOccurencesParams(params,function(err,retour){
				    
				    if(err == null) {
				        logger.warn("no errors degetoccparams");
				      	retour["nums"] = obj.NUMS;
				        if(retour["sorties"] != undefined) {
				        	logger.util("ok on ajoute ", retour);
				        	allResults.push(retour);
				        }
				    } else {
				      logger.error("une errorette : ", err);
				    }
				    logger.warn("numero id : "+id, "pour un compteur reel : " + ttt + " et un max de " + ttlMax );
				    cptt ++;
					if(cptt >= step) {
						io.sockets.emit('/mesreductions/combinaisons', {current: id,ttl:ttlMax});
						cptt = 0;	
					}
				    if(id == ttlMax-1) {
						logger.warn("byoiunet bayounet!!!");
						io.sockets.emit('/mesreductions/combinaisons', null);
						var menu = fs.readFileSync('/home/gilles/node/git/sailsmydb/views/tirages/menu.js');
				 	 	var tom = "";//menu.toString();
						logger.util("bon retours : ", allResults);
						var ana = new analyse();
						ana.GetDateNextTirage(function(err,result){
							ana.GetGlobalTotaux(function(err,resultat) {
								return res.render ('mesreductions/combinaisons',{'tplMenu' : tom, 'resultats': allResults,'nextDate': result,'totaux': JSON.stringify(resultat)});
							});
							
						});
					}	
					ttt ++;
				});

			});
			
		});
		




	}

};


/*

////recherche occurences
				//obj ={NUMS : [15,23,27,42,5]};
				//Je vais tester un panel de 5 chiffres pour tester ses occurences
				
				ana.GetOccurencesFilteredCombinaison(obj.NUMS,3,36,2,function(err,pertinents){
					var resultObj = {
						selection: obj,
						err: err,
						pertinents: pertinents
					}
					if(pertinents != null) allResults.push(resultObj);
					logger.warn("courrant : " + id + ", ttl: " + result.length + " sur max de : " + ttlMax);
					logger.util(resultObj);
					if(id == ttlMax-1) {
						return res.render ('mesreductions/combinaisons',{'resultats': allResults});
  
						return res.send(allResults);
					}
				});


				*/