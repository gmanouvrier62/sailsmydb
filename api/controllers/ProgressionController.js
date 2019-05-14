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
      status : KO,
      
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
       return res.send(JSON.stringify(result));   

    });


  }
  
};

