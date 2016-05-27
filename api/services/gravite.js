var util = require("util");
var fs = require('fs');
var moment = require('moment');
var sleep = require('sleep');
var cheerio = require('cheerio');
var Immutable = require('immutable');

module.exports = function(dt,callback){

	var mois = moment(dt).locale('fr').format("MMMM").replace("û","u");
	var jour = parseInt(moment(dt).format("DD"));
	var fichier = mois + "_" + moment(dt).format("YYYY") + ".html";
	var retour = {"fichier": fichier};
	var contentHtml = fs.readFileSync("/home/gilles/node/sailsmydb/assets/gravites/" + fichier);
	$ = cheerio.load(contentHtml);
	var tbl = $(".calendar-moon");
	
	tbl.find("td").each(function(idx,el){
		var img = $(this).find("img");
		if(img.attr('src') != undefined) {
			if(jour == parseInt($(this).text())) {
				var tbs = img.attr('src').split("/");

				callback(null,tbs[tbs.length-1]);
			}
			
		}
	});


	
};
