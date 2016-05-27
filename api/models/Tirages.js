/**
* Tirages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'int' },

    TIR_DATE : { type: 'datetime' },

    TIR_1 : { type: 'int' },

    TIR_2 : { type: 'int' },

    TIR_3 : { type: 'int' },

    TIR_4 : { type: 'int' },
	
	  TIR_5 : { type: 'int' },


    TIR_C : { type: 'int' }
  },
  GetTirage: function (dt,callback){
    sql = "select * from  myloto.tirages where TIR_DATE='" + dt + "'";
    console.log("DANS MODEL : ", sql);
    
    this.query(sql,function creaStat(err,result){
            if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
            } else {

              callback(null,result);
            }
            
  });
  }
};

