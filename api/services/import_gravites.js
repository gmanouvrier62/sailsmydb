var request = require('request');
var util = require("util");
var fs = require('fs');
module.exports = function(full_url,file_gravite,callback) {

 //tester si fichier existe dejà
 //attention valable pour tous sauf le mois du jour actuel (mis à jour des données du mois)
	
 var req=new request(full_url, function (error, response, body) {
            if(response != undefined)
            	console.log(" retour " + response.statusCode + "pour " + full_url);
            if (!error && response.statusCode == '200') {
              console.log("ok nav : " + full_url);
              console.log("va ecrire dans : " + "/home/gilles/node/git/sailsmydb/assets/gravites/" + file_gravite);
              fs.writeFile("/home/gilles/node/git/sailsmydb/assets/gravites/" + file_gravite, body, function (err) {
                  if (err) {
                    console.log("pas bon pour " + full_url);
                  } else {
                    console.log('It\'s saved!');
                  }
                 callback("ok");
              });
            }
            else
            {
                        console.log("erreur nav : " + full_url);
                 callback("err");
            }
          });


};

