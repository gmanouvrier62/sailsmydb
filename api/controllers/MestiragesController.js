var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {
	home : function (req,res) {
	   	logger.warn("mes tirages");
	   	//var tom = menu.toString();
		var tom ="zg";

		return res.render ('mestirages/container',{'nom': 'Manouvrius', 'prenom': 'Gillus','tplMenu': tom});
	},

	save : function (req, res) {
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

		logger.info("ok dans save");
		var datas = req.query.datas;
		logger.util(datas);

		var tbT = new Array("lundi", "mercredi", "samedi");
  		var jour = moment(datas.MTIR_DATE).locale('fr').format("dddd");
  		logger.log("joujour à sa mèmère : " + jour);
  		var offset = 0;
  		if(tbT.inArray(jour)) {
			if(datas.id == null || parseInt(datas.id) <= 0 || datas.id == '') {
				sails.models.mestirages.findOrCreate(datas,datas).exec(function creaStat(err,created){
					logger.warn(err);
					var retour = {err: err};

					return res.send(retour);
				});
			} else {
				// un id est présent il s'agit donc d'un update
				logger.warn("OK ca va updater : " , datas);
				var datasInitial = {id: datas.id};
				sails.models.mestirages.update(datasInitial,datas).exec(function creaStat(err,updated){
					logger.warn(err);
					var retour = {err: err};

					return res.send(retour);
				});
			}
  		} else {
  			var retour = {err: "Ce n'est pas un jour de tirages"};

			return res.send(retour);
  		}
		
	},

	list : function (req,res) {
		logger.info("ok dans mestirages/list");
		var datas = req.query.datas;
		var sql = "select * from myloto.mestirages order by mtir_date desc limit " + datas.limit;
		sails.models.mestirages.query(sql,function(err,rs){
			rs.map(function(obj,id){
				obj.MTIR_DATE = moment(obj.MTIR_DATE).format("YYYY-MM-DD");
				if(id == rs.length-1) {
					var retour = {err: err,result: rs};
					//logger.util(rs);
					return res.send(retour);
				}
			});
		});

	},
	delete : function (req,res) {
		
		var datas = req.query.datas;
		datas.id = parseInt(datas.id);
		logger.info("ok dans suppression mes tirages ", datas);
		var sql = "delete from myloto.mestirages where id=" + datas.id;
		if(datas.id != null) {
				sails.models.mestirages.query(sql, function creaStat(err,created){
					logger.warn(err);
					var retour = {err: err};

					return res.send(retour);
				});
		}
	}

};
