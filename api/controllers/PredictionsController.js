/**
 * PredictionsController
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
	
  listPredictions: function (req,res) {
    var result = {
      err: '',
      resultat : null,
      datas: null
    };
    console.log("brut : ", req.query.datas);
    var naverr = req.query.err;// si erreur vient de deleteprediction
  sails.models.predictions.GetList(function(err, retour) {
    //res.send(JSON.stringify(result));    
     res.render('predictions/listes.ejs',{"err" : err, "naverr": naverr, "list": retour, "moment":moment});

  });
                           
  },
  deletePrediction: function(req, res) {
    var result = {
      err: '',
      resultat : null,
      datas: null
    };
    var idx = req.query.ladate;
    sails.models.predictions.delet(idx, function(err, retour) {
     //res.send(JSON.stringify(result));    
      var suff = "";
       if(err != null) {
          suff = "?err=err";

       } 
       var target = '/predictions/home' + suff;
       res.redirect(target);

    });


  },

  loadPrediction: function(req, res) {
    var resultat_html = "";
    var idx = req.query.ladate;
    sails.models.predictions.loadPrediction(idx, function(err, retours) {
     //res.send(JSON.stringify(result));    
      
      
      //construction d'un tb html
      var hd = "<table id='table_pr'>";
      var ct = "";
      var ft = "</table><br>";
      var dv = '<div id="estimations" style="font-size: 14px"></div>';
      for (var t = 0; t < retours.length; t++) {
        var val_sel = "";
        if(retours[t].PRE_SELECTED > 0) val_sel = "checked";
        ct += "<tr><td class='case'>" + retours[t].PRE_1 + "</td><td class='case'>" + retours[t].PRE_2 + "</td><td class='case'>"+ retours[t].PRE_3 + "</td><td class='case'>" + retours[t].PRE_4 + "</td><td class='case'>" + retours[t].PRE_5 + "</td><td class='case_comp'>" + retours[t].PRE_C + "</td><td class = 'debrief'></td><td class = 'debrief_c'></td><td><div class='noeil'></div></td><td><input id='presel_" + t + "' type='checkbox' " + val_sel + "></td><tr>";

      } 
      //pb de retour ici
      resultat_html = hd + ct + ft + dv;
      
      return res.send(resultat_html);

    });

    

   
  }
  
};

