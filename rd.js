var import_gravites = require("./api/services/import_gravites.js");
var moment = require ("moment");
var getGravite = require("./api/services/gravite.js");
var down = require("./api/services/download_file.js");



getGravite("2008-11-01 20:00:00",function(err,alors){
	

	console.log("et ben alors c : ", alors);
})


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
jour1 = moment().add(offset,"days").locale('fr').format("YYYY-MM-DD") + " 20:00:00";
console.log("ddd : " + jour1);

////http://www.calendrier-365.fr/calendrier-lunaire/2008/d%C3%A9cembre.html

/*
var mois = new Array("","janvier","février","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","décembre");
for(var y = 2008 ; y<=2018;y++)
{
	if(y == 2008) 
		b = 10; 
	else 
		b = 1;
	for(var m = b;m<=12;m++)
	{
		var fullUrl = "http://www.calendrier-365.fr/calendrier-lunaire/" + y + "/" + mois[m] + ".html";
		var nomFile = mois[m] + "_" + y + ".html";
		console.log("va voir pour : " + fullUrl);
		import_gravites(fullUrl, nomFile,function(msg){
			console.log(msg);

		});


	}


}
*/


function pad(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}



//Téléchargement d'images par extrapolation du nom
// http://www.calendrier-365.fr/images/lune/lune_th_-0_32.jpg
//de 0 à 1

//de 0 à 1
/*
var ttl =0;
for(var c = 0 ;c<100;c++) {
	
	
	if(c/10 != parseInt(c/10))
		var fn  = "lune_th_-0_" + pad('00',c,true) + ".jpg";
	else
		var fn = "lune_th_-0_" + (c/10) + ".jpg";
	fullUrl = "http://www.calendrier-365.fr/images/lune/" + fn;
	//fullUrl2 = "http://www.calendrier-365.fr/images/lune/lune_th_-0_" + t + ".jpg";

	console.log(fullUrl);
	down(fullUrl,"/home/gilles/node/sailsmydb/assets/images/gravite/"+fn,function(){
		ttl++;
		if(ttl>=99)
			console.log("finito");

	});

}
*/
//fullUrl = "http://www.calendrier-365.fr/images/lune/lune_th_0_" + t + ".jpg";

var fn  = "lune_th_0.jpg";
fullUrl = "http://www.calendrier-365.fr/images/lune/" + fn;
down(fullUrl,"/home/gilles/node/sailsmydb/assets/images/gravite/"+fn,function(){
		ttl++;
		if(ttl>=99)
			console.log("finito");

	});

var fn  = "lune_th_1.jpg";
down(fullUrl,"/home/gilles/node/sailsmydb/assets/images/gravite/"+fn,function(){
		ttl++;
		if(ttl>=99)
			console.log("finito");

	});