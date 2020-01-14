/**
 * ProgressionController
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

module.exports = {
	
  construct: function (req,res) {
    var result = {
      err: '',
      status : 'KO',
      
    };
    console.log("brut : ", req.query.datas);
    
    sails.models.progression.construction(function(err, retour) {
      //res.send(JSON.stringify(result));    
      //res.render('predictions/listes.ejs',{"err" : err, "naverr": naverr, "list": retour, "moment":moment});
       if (err != null && err !="") {
         result.err = err;
       } else {
         result.status = "OK";
       }
       return res.send(JSON.stringify(result));       

    });
                           
  },
  getAllStats: function(req, res) {
    var result = {
      err: '',
      resultat : null,
      
    };
    sails.models.progression.getAll(function(err, retour) {
       if (err != null && err !="") {
         result.err = err;
       } else {
         result.resultat = retour;
       }
       logger.warn("retour depuis controller pour le 2019/05 15:" + result.resultat["y_2019"]["m_5"]["num_15"]);
       

      var moinsMax = moment().add(-2, "years");
      var maintenant = moment();
      var labels_month = new Array();
      var datas = new Array();
      while (moinsMax <= maintenant) {
        
        var currentYear = moinsMax.format('YYYY');
        var currentMonthNumber = moinsMax.format('M');
        var currentMonth = moinsMax.format('MMM');
        logger.warn("cherchera " + "retour['y_" + currentYear + "']['m_" + currentMonthNumber + "']['num_" + num + "']");

        labels_month.push(currentMonth);
        for(var num = 1; num <= 49; num++) {
          var currV = retour["y_" + currentYear]["m_" + currentMonthNumber]["num_" + num];
          if(datas["num_" + num] == null) datas["num_" + num] = new Array();
          datas["num_" + num].push(currV);
        }

        moinsMax = moinsMax.add(1,"month");
      }

      logger.warn("global retour : " + datas);
      var formateds = new Array();
      for (var t = 1 ; t <= 49; t++) {
        var formated = {
          labels : labels_month,
          datasets : [
            {
              label: "",
              fillColor : "rgba(0,255,255,0.8)",
              strokeColor : "rgba(220,220,220,1)",
              pointColor : "rgba(220,220,220,1)",
              pointStrokeColor : "#fff",
              pointHighlightFill : "#fff",
              pointHighlightStroke : "rgba(220,220,220,1)",
              data : datas["num_" + t]
            }
          ]

        };
        formated["label"] = "My " + t;
        formateds.push(formated);
      }
      logger.warn ("test : " + JSON.stringify(formateds[14]));

       return res.send(JSON.stringify(formateds));  

       //return res.send();   

    });


  }
  
};

