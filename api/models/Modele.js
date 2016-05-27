/**
* Modele.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'int' },

    PERIODE : { type: 'int' },

    TTL_N1 : { type: 'int' },

    TTL_N2 : { type: 'int' },

    TTL_N3 : { type: 'int' },

    TTL_N4 : { type: 'int' },
	
	  TTL_N5 : { type: 'int' },

    ECART_N1 : { type: 'int' },

    ECART_N2 : { type: 'int' },

    ECART_N3 : { type: 'int' },

    ECART_N4 : { type: 'int' },
  
    ECART_N5 : { type: 'int' },

    OCCURENCE_5 : {type: 'varchar'},
    OCCURENCE_4 : {type: 'varchar'},
    OCCURENCE_3 : {type: 'varchar'}

  }
};
