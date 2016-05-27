/**
* Mestirages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'int' },

    id_reduction : { type: 'int' },

    RED_DATE : { type: 'datetime' },

    RED_NUM : { type: 'int' }
    
  },
  save_a_reduction: function (mesreduc,callback){
  	sql = "insert into myloto.reductions (id_reduction, RED_DATE, RED_NUM) values " +
  			" (" + mesreduc.id_reduction + ",'" + mesreduc.RED_DATE + "'," + mesreduc.RED_NUM + ")";
  	console.log("DANS MODEL : ", sql);
  	
  	this.query(sql,function creaStat(err,created){
 						if(err != null) {
 							logger.error("ATTENTION ! ", err);
 							callback(err,null);
 						} else {

 							callback(null,"ok");
 						}
 						
 	});
  }
};

