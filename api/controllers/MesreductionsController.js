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
	}

};