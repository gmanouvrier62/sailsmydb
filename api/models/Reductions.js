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
  compare_a_with_tirage: function (tirage,callback) {
    sql = "SELECT id_reduction, count( red_date ) AS ttl FROM myloto.reductions WHERE " +
          "red_num IN ( " +  tirage.joint(',')   + " ) GROUP BY id_reduction HAVING ttl >=0 order by red_date desc";

    this.query(sql,function creaStat(err,rows){
            if(err != null) {
              logger.error("ATTENTION ! ", err);
              callback(err,null);
            } else {
              //faire des recup de reduction et renvouer les reductions trouvées
              callback(null,rows);
            }
            
    });
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

