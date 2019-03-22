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

	denombrement_predictif: function(req, res) {
		
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
		var panel = req.query.datas;
		var ecart_param = req.query.ecart_mois_param;
		ecart_param = moment().subtract(1,'months');
		var ana = new analyse();
		var le_retour_ok = [];
		//ATTENTION AU 22 MARS 2019 il faut encore definir obj_panel en amont comme ceci
		/*
			obj_panel["nb_49"].score = pct de chance de sortir (qui doit être à 100 au départ ou au max que l'on conscent)
			obj_panel["nb_49"].poids = fort moyen ou faible sortie


		*/
		var choix_unit = function(panel, obj_panel, deja_choisi) {

			var nb = panel.length;
			var idx = Math.floor(Math.random() * Math.floor(nb));
			var nb_choisi = panel[idx];
			if(!deja_choisi.inArray(nb_choisi)) {
				//on recherche le pédigré du num dans le tb de control
				var pct_autor = obj_panel["nb_" + nb_choisi].scrore;
				var prob = Math.floor(Math.random() * Math.floor(100)) + 1;
				if (prob < pct_autor) {
					return nb_choisi;
				} else 
				{
					choix_unit(panel, obj_panel, deja_choisi);
				}
			} else {
				choix_unit(panel, obj_panel, deja_choisi);
			}
		};
		var choix = function(panel, obj_panel, couples) {
			var tb_jeux = [];
			for (var jeux = 0; jeux < 1; jeux++) {
				tb_un_tirage = [];
				for (var n = 0; n<5; n++) {
					var nn = choix_unit(panel, obj_panel, tb_un_tirage);
					
					tb_un_tirage.push(nn);
					obj_panel["nb_" + nn].scrore -= 10; 


				}
			}

			return tb_jeux;
		};




		//on utilisera getOccurence
		//ecart_param représentera la date seuil ecart mini devant être respecté pour être valable
		//
		var deno = new denombrement(panel);
		deno.NparmisK(2,function(err, result){
			//ici on aura result comme array de array de 2 
			//pour chacune des entrées je vais devoir lancer un getOccurence et traiter en fct de la contrainte param
			//pour valider ou invalider la présente combi de 2
			if(err == null || err == undefined) {

			} 
			if(result.length<1) {

			}

			for(var cc = 0; cc < result.length; cc++) {
				logger.warn("debut d'histo pour une combi : ", result[cc]);
				ana.GetOccurences(result[cc], function(err, currCombi) {
					//ici on a currCombi de result[cc], c'est l'historique de cette combi
					var bad = "valide";
					logger.warn("currecombi : ", currCombi);
					/*
						currCombi est un array de 
						{ stat_date: '2016-04-18 20:00:00',
					    occurence: 2,
					    tirages: [ [Object] ] }
					*/
					var why = [];
					var why_good = [];
					for (var cpt = 0; cpt < currCombi.length; cpt++) {
						var obj = currCombi[cpt];
						if(moment(obj.stat_date) > ecart_param) {
							bad = "invalide";
							why.push(obj);
						} else {
							logger.warn("me dit : ", obj.stat_date, " < ", ecart_param);
							why_good.push(obj);
						}
					}	
					
					//la combi est OK ou pas
					var oRet = {};
					logger.warn("la combi est ", this.combi);
					oRet["combi"] = this.combi;
					oRet["datas"] = currCombi;
					oRet["scoring"] = bad;
					oRet["why"] = why;
					oRet["why_good"] = why_good;
					le_retour_ok.push(oRet);
					
					if(this.leCompteur == result.length - 1) {
						//faire un res avec le_retour_ok
						
						logger.warn('nbOcc : ', result.length);
						logger.error("OKOKOK");
						var objFullRetour = {'nbOccurences': result.length,
											 'allDatas': le_retour_ok};
						logger.util("RETOUR : ", objFullRetour);					 
						return res.render ('mesreductions/predictif',{'combis' : objFullRetour});
					}

				}.bind({combi:result[cc],leCompteur:cc}));
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