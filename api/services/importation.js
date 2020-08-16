var events = require('events');
var request = require('request');
var util = require("util");
var fs = require('fs');
var cheerio = require('cheerio');

function importation(){
      //this.pName="/dev/ttyACM0";   
      //this.Temperature="";    
      //this.rawTmp="";//stockage des infos entre les tags D et F
      events.EventEmitter.call(this);    
      //this.serialPort=undefined;
  };

importation.prototype.nav2second_prep = function(contentHtml, callback) {
    $ = cheerio.load(contentHtml);
    //Traitement du parsing html
    //console.log(contentHtml.toString());
    var tbL = [];
    var tb=$('a').each(function(i,elem){
      //si href commence par /loto/resultats/rapports_tirage alors telechargement
       var lien_href = $(this).attr('href');
       //je recherche tous les liens contenant le terme 'rapports' car ce lien pointera sur une info sur le tirage 2

       if(lien_href.substring(24,0) == '/loto/resultats/rapports') {
          tbL.push(lien_href);
       }

    });
    var idd = 0;
    console.log("les liens : " + tbL.length);
    console.log("les datas du tb lien : " + util.inspect(tbL));


    for(var ttl = 0; ttl < tbL.length; ttl++) {

          var tbPath = tbL[ttl].split('/');
          var nom_fichier = tbPath[tbPath.length-1];
          
          //ok à télécharger
          idd++;
          //je navigue sur chaque lien rapports à la recherche du tirage 2
          this.nav2second(tbL[ttl],nom_fichier, function(err, l_rs) {

            if(this.cpt == tbL.length-1) {
              callback(null,'OK');
            }

          }.bind({cpt:idd}));





    }



},

importation.prototype.nav2second = function(full_url, file_loto, callback) {
  full_url = "https://www.lesbonsnumeros.com" + full_url;
  var req=new request(full_url, function (error, response, body) {
            if(response != undefined)
              console.log(" retour " + response.statusCode + "pour " + full_url);
            if (!error && response.statusCode == '200') {
              console.log("ok nav : " + full_url);
              console.log("va ecrire dans : " + "/home/gilles/node/git/sailsmydb/assets/datas2/" + file_loto);
              fs.writeFile("/home/gilles/node/git/sailsmydb/assets/datas2/" + file_loto, body, function (err) {
                  if (err) {
                    console.log("pas bon pour " + full_url);
                    
                  } else {
                    console.log('It\'s saved! seconde for ' + "/home/gilles/node/git/sailsmydb/assets/datas/" + file_loto);
                    
                  }

                  if(err==null || err=='null') {
                    console.log("ok ça wait");
                   
                    callback(null,"OK");
                    
                  }
                  else {

                    console.log("ko ça wait");
                    callback(err,null);   
                   

                  }


              });
            } else {
              console.log("ko nav : " + full_url);
              callback(response.statusCode,null);
              
            }
          });

//
  

},
importation.prototype.synchronizeSecond = function(callback) {

  fs.readdir("/home/gilles/node/git/sailsmydb/assets/datas", function(err, files) { 
      //console.log(files);
      var cpt=0;
      files.forEach(function(file,index,array){
           
           if(file !='.' && file != '..' && file != '/') {
                    console.log("fichier " + file);
                    var contentHtml = fs.readFileSync("/home/gilles/node/git/sailsmydb/assets/datas/" + file);
                    $ = cheerio.load(contentHtml);
                   var labase = $("ul").find(".secondTirage");
                   var chaine = "";
                   var tb=labase.find("li");
                   chaine = tb[0].html() + "-" + tb[1].html() + "-" + tb[2].html() + "-" + tb[3].html() + "-" + tb[4].html() + "-" + tb[5].html() + "-" + tb[7].html();
                   
                   console.log(chaine);

           }

      });


  });


},
importation.prototype.launch = function(full_url, file_loto, callback) {

 //tester si fichier existe dejà
 //attention valable pour tous sauf le mois du jour actuel (mis à jour des données du mois)
 var self = this;
 var req=new request(full_url, function (error, response, body) {
            if(response != undefined)
            	console.log(" retour " + response.statusCode + "pour " + full_url);
            if (!error && response.statusCode == '200') {
              console.log("ok nav : " + full_url);
              console.log("va ecrire dans : " + "/home/gilles/node/git/sailsmydb/assets/datas/" + file_loto);
              fs.writeFile("/home/gilles/node/git/sailsmydb/assets/datas/" + file_loto, body, function (err) {
                  if (err) {
                    console.log("pas bon pour " + full_url);
                  } else {
                    console.log('It\'s saved!');
                    //touca en cb
                      var contentHtml = fs.readFileSync("/home/gilles/node/git/sailsmydb/assets/datas/" + file_loto);
                     //ok, je sais que le lien vers le tirage 2 se trouvera dans le contentHTML 
                     self.nav2second_prep(contentHtml, function(err, l_rs) {
                         callback("ok");

                     });

                    


                  }
                
              });
            }
            else
            {
                 console.log("erreur nav : " + full_url);
                 callback("err");
            }
          });


};
importation.prototype.AddStat = function(data_values,callback) {
	console.log("ajout stat de " + util.inspect(data_values));

	sails.models.stats.findOrCreate(data_values,data_values).exec(function creaStat(err,created){
					if(err==null || err=='null'){
						//console.log("CREATION STAT : " + util.inspect(created) );
						callback();
					}
					else {
						console.log("Err!!! : " + err + "utl=" + util.inspect(data_values));
						callback(err + util.inspect(data_values));
					}
					
				});
};

importation.prototype.AddUnTotal = function(data_values,callback) {

sails.models.stat_total.findOrCreate(data_values,data_values).exec(function creatotaux(err, created){
          
          if(err==null ||  err == 'null') {
              console.log("ajout du total ok ");
              callback("");
          }
          else
          {
            
            callback(err);
          }

        });//findorcreated

};

importation.prototype.AddTotaux = function(dt_analyse,callback) {
	var self = this;
  var totaux = new Array();
	for(var a=0;a<50;a++)totaux[a]=0;
  //pb : semble prendre ts les enr. il faut prendre la date unique la plus récente
//puis faire un enr uniq par rapport à cette date reprenant le ttl des 49 num
//  sails.models.tirages.find({where:{tir_date:{'<=':dt_analyse}},limit:1,sort:' tir_date DESC'}).exec(function recup(err,items){

//remplacer par requete tradi query
	var sql = "select * from tirages where tir_date <='" + dt_analyse + "' order by tir_date asc";
  sails.models.tirages.query(sql,function(err,results){
   var items = results;
		//console.log(" nb de ligness : " + util.inspect(items));
    
    for (var c=0;c<items.length;c++) {
			 console.log(" item :" + items[c].TIR_DATE);
      

      totaux[items[c].TIR_1] += 1;
			totaux[items[c].TIR_2] += 1;
			totaux[items[c].TIR_3] += 1;
			totaux[items[c].TIR_4] += 1;
			totaux[items[c].TIR_5] += 1;
      if( c == (items.length-1) ) {
        //Toutes les lignes ont ete traites
        //preparation de la ligne de total
          
          var data_values={stat_date_total: dt_analyse, N_1:totaux[1], N_2:totaux[2], N_3:totaux[3],
            N_4:totaux[4], N_5:totaux[5], N_6:totaux[6],
            N_7:totaux[7], N_8:totaux[8], N_9:totaux[9], N_10:totaux[10], N_11:totaux[11], N_12:totaux[12],
            N_13:totaux[13], N_14:totaux[14], N_15:totaux[15], N_16:totaux[16], N_17:totaux[17], N_18:totaux[18],
            N_19:totaux[19], N_20:totaux[20], N_21:totaux[21], N_22:totaux[22], N_23:totaux[23], N_24:totaux[24],
            N_25:totaux[25], N_26:totaux[26], N_27:totaux[27], N_28:totaux[28], N_29:totaux[29], N_30:totaux[30],
            N_31:totaux[31], N_32:totaux[32], N_33:totaux[33], N_34:totaux[34], N_35:totaux[35], N_36:totaux[36],
            N_37:totaux[37], N_38:totaux[38], N_39:totaux[39], N_40:totaux[40], N_41:totaux[41], N_42:totaux[42],
            N_43:totaux[43], N_44:totaux[44], N_45:totaux[45], N_46:totaux[46], N_47:totaux[47], N_48:totaux[48],
            N_49:totaux[49]};
          console.log("dtv : " + util.inspect(data_values));
         console.log(" pour dd : " + items[c].TIR_DATE);                 };
        //ne devrait s 'exectuer que 1 fois mais passe 5 fois pour 5 tirage => pas normal'
        //si je mets le code ici il s execute 5 fois
       
      }
      
		 self.AddUnTotal(data_values,function(err){
          if(err!="")
            console.log("err ajout de totaux : " + err);
          else
            console.log("ok pour " + dt_analyse);
        });
		//console.log(totaux);
	});	

};

importation.prototype.AddTirages = function(data_values,gravite,callback){
	self=this;
  //lune_th_0_75.jpg
  var gravite_dir = 0;
  var gravite_val = 0;
  var grav1 = gravite.replace("lune_th_","");
  var grav2 = grav1.replace(".jpg","");
  var gravite_val = parseFloat(grav2.replace("_","."));
  gravite =0;
  gravite_val = 0;
  
  if(gravite_val>0) 
      gravite_dir=1;
  else
      gravite_dir=-1;
 	sails.models.tirages.findOrCreate(data_values,data_values).exec(function creation(err, created){

       // console.log(" crée avec id : " + created.id);
        if(err === null || err==='null') {
           	//enregistrement des X numéros dans la 2ieme table
           	var tbStats= new Array();

           	tbStats.push({stat_date: data_values.TIR_DATE, stat_num:data_values.TIR_1, stat_c:0, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       tbStats.push({stat_date: data_values.TIR_DATE, stat_num:data_values.TIR_2, stat_c:0, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       tbStats.push({stat_date: data_values.TIR_DATE, stat_num:data_values.TIR_3, stat_c:0, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       tbStats.push({stat_date: data_values.TIR_DATE, stat_num:data_values.TIR_4, stat_c:0, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       tbStats.push({stat_date: data_values.TIR_DATE, stat_num:data_values.TIR_5, stat_c:0, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       tbStats.push({stat_date: data_values.TIR_DATE, stat_num:0, stat_c:data_values.TIR_C, stat_gravite: gravite,stat_gravite_dir:gravite_dir, stat_gravite_val:gravite_val});
			       //passer en for et faire fct pour synchrone puis faire les stat totales
        			for(var c=0;c<tbStats.length;c++)
        			{
                  //console.log("Dans ADDTIRAGE avant ADDSTAT " + util.inspect(tbStats[c]));
          				self.AddStat(tbStats[c],function(err){
          					if(err==null ||  err == 'null') {

          					}
          					else
          						console.log("err ajout de stats : " + err);

          				});

        			}
			
        			self.AddTotaux(data_values.TIR_DATE,function(err){
        					if(err==null ||  err == 'null') {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!totalok");
        					}
        					else
        						console.log("err ajout de totaux : " + err);

                  callback();
        			});

           	
        }
        else
           	callback(err);
    });

};

importation.prototype.__proto__ = events.EventEmitter.prototype;
module.exports=importation;

/*
CREATE TABLE `stat_total` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stat_date_total` datetime NOT NULL,
  `N_1` int(10) unsigned NOT NULL,
  `N_2` int(10) unsigned NOT NULL,
  `N_3` int(10) unsigned NOT NULL,
  `N_4` int(10) unsigned NOT NULL,
  `N_5` int(10) unsigned NOT NULL,
  `N_6` int(10) unsigned NOT NULL,
  `N_7` int(10) unsigned NOT NULL,
  `N_8` int(10) unsigned NOT NULL,
  `N_9` int(10) unsigned NOT NULL,
  `N_10` int(10) unsigned NOT NULL,
  `N_11` int(10) unsigned NOT NULL,
  `N_12` int(10) unsigned NOT NULL,
  `N_13` int(10) unsigned NOT NULL,
  `N_14` int(10) unsigned NOT NULL,
  `N_15` int(10) unsigned NOT NULL,
  `N_16` int(10) unsigned NOT NULL,
  `N_17` int(10) unsigned NOT NULL,
  `N_18` int(10) unsigned NOT NULL,
  `N_19` int(10) unsigned NOT NULL,
  `N_20` int(10) unsigned NOT NULL,
  `N_21` int(10) unsigned NOT NULL,
  `N_22` int(10) unsigned NOT NULL,
  `N_23` int(10) unsigned NOT NULL,
  `N_24` int(10) unsigned NOT NULL,
  `N_25` int(10) unsigned NOT NULL,
  `N_26` int(10) unsigned NOT NULL,
  `N_27` int(10) unsigned NOT NULL,
  `N_28` int(10) unsigned NOT NULL,
  `N_29` int(10) unsigned NOT NULL,
  `N_30` int(10) unsigned NOT NULL,
  `N_31` int(10) unsigned NOT NULL,
  `N_32` int(10) unsigned NOT NULL,
  `N_33` int(10) unsigned NOT NULL,
  `N_34` int(10) unsigned NOT NULL,
  `N_35` int(10) unsigned NOT NULL,
  `N_36` int(10) unsigned NOT NULL,
  `N_37` int(10) unsigned NOT NULL,
  `N_38` int(10) unsigned NOT NULL,
  `N_39` int(10) unsigned NOT NULL,
  `N_40` int(10) unsigned NOT NULL,
  `N_41` int(10) unsigned NOT NULL,
  `N_42` int(10) unsigned NOT NULL,
  `N_43` int(10) unsigned NOT NULL,
  `N_44` int(10) unsigned NOT NULL,
  `N_45` int(10) unsigned NOT NULL,
  `N_46` int(10) unsigned NOT NULL,
  `N_47` int(10) unsigned NOT NULL,
  `N_48` int(10) unsigned NOT NULL,
  `N_49` int(10) unsigned NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1106 DEFAULT CHARSET=latin1

*/