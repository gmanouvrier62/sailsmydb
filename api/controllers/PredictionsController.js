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
  sails.models.predictions.GetList(function(err, retour) {
    //res.send(JSON.stringify(result));    
     res.render('predictions/listes.ejs',{"err" : err, "list": retour, "moment":moment});

  });
                           
  },
  
};

