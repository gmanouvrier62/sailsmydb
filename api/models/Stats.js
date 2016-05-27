/**
* Stats.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports  = {

  attributes: {

    id : { type: 'int' },

    stat_date : { type: 'datetime' },
    stat_num : { type: 'int'},
    stat_gravite: { type: 'string'},
    stat_gravite_dir: { type: 'int'},
    stat_gravite_val: { type: 'float'},
    
    stat_c : { type: 'int' }
  }
};
