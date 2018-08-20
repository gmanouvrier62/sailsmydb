var logger = require('../services/logger.init.js').logger("tom.txt");
var events = require("events");
var f = [];
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
function denombrement(p_panel) {
	
	this.panel = p_panel;
	
	
};
denombrement.panel = [];

denombrement.prototype.Count = function() {
	if(this.panel.length <=0 )
		return new Error("parametre incorrecte");
	else {

		//c(x;y) = x! / (x-y)! * y!
		return this.factoriel(this.panel.length) / (this.factoriel( this.panel.length-5 ) * this.factoriel(5));


	}
};
denombrement.prototype.factoriel = function (n) {
	 if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = this.factoriel(n-1) * n;
}

denombrement.prototype.List = function(callback) {
	logger.info("OK dans denombrement.List ", this.panel);
	var result = [];
	for( a=0;a<this.panel.length;a++)
	    for( b=a+1;b<this.panel.length;b++)
	        for( c=b+1;c<this.panel.length;c++)
	        	for( d=c+1;d<this.panel.length;d++)
	        		for( e=d+1;e<this.panel.length;e++) {
						var o = {NUMS: []};
						o.NUMS.push(this.panel[a]);
						o.NUMS.push(this.panel[b]);
						o.NUMS.push(this.panel[c]);
						o.NUMS.push(this.panel[d]);
						o.NUMS.push(this.panel[e]);
						   
						result.push(o);           		
	            		//console.log(this.panel[a]+","+this.panel[b]+","+ this.panel[c] + ","+ this.panel[d] + ","+ this.panel[e]);
	        		}

	callback(result);
denombrement.prototype.NparmisK = function(n, cb) {
	this.resultat = [];
	var passage = function(self, tbE,n) {
		var cpt = 1;
		var currentN = 1;
		var tbR = [];
		var tmp = [];
		while(cpt < tbE.length)
		{
			tmp.push(tbE[0]);
			for (var nn = 1; nn<n;nn++){
				tmp.push(tbE[cpt]);
				cpt++;
			}
			self.resultat.push(tmp);
			
			tmp = [];
		}
		var tbEN = [];
		for(var x = 1;x < tbE.length;x++)tbEN.push(tbE[x]);
		
		return tbEN;
	};

	var tbR = [];
	var t = [];
	var k = this.panel.length;
	console.log("k=" + k);
	
	var tt = passage(this, this.panel,n);
	while (tt.length>1){
		tt = passage(this, tt,n);
	}
	cb(null, this.resultat);


};
};
denombrement.prototype.NparmisK = function(n, cb) {
	this.resultat = [];
	var passage = function(self, tbE,n) {
		var cpt = 1;
		var currentN = 1;
		var tbR = [];
		var tmp = [];
		while(cpt < tbE.length)
		{
			tmp.push(tbE[0]);
			for (var nn = 1; nn<n;nn++){
				tmp.push(tbE[cpt]);
				cpt++;
			}
			self.resultat.push(tmp);
			
			tmp = [];
		}
		var tbEN = [];
		for(var x = 1;x < tbE.length;x++)tbEN.push(tbE[x]);
		
		return tbEN;
	};

	var tbR = [];
	var t = [];
	var k = this.panel.length;
	console.log("k=" + k);
	
	var tt = passage(this, this.panel,n);
	while (tt.length>1){
		tt = passage(this, tt,n);
	}
	cb(null, this.resultat);


};
module.exports = denombrement;

/*
1 2 3 4 5

3

123
124
125


111
112
113
114
115




*/