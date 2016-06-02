var mesreductions = {
  id: null,
  RED_DATE: null,
  RED_NUM: []
};



require(['jquery-ui','pnotify'], function () { 	  


 	  $("#container1_reduction").on("click", '.case', function() {
       	var nb = $("#container1_reduction").find('.casec').length;
       	
       	var id = parseInt($(this).attr('id').replace('n_',''));
      	$(this).removeClass('case').addClass('casec');
      	
      });
      $("#container1_reduction").on("click", '.casec', function() {
        	var id = parseInt($(this).attr('id').replace('n_',''));
      		$(this).removeClass('casec').addClass('case');
      		
      });
      $("#tblReduction").on("click", '.trash', function() {
        	var id = $(this).attr('datas');
      		$.get('mesreductions/delete',{'id': id},function(retour) {
      			loadMesreductions();
      		});
      		
      });
	  $("#tblReduction").on("click", '.radiation', function() {
        	var panel = $(this).attr('datas');
      		$.get('mesreductions/combinaisons',{'panel': panel},function(retour) {
				//sera le fruit d'un render dans le controller combinaison      			
      			alert('ok');
      			$("#container_base").html(retour);
     		});
      		
      });

       $("#tblReduction").on("click", '.gettir', function() {
        	var id = $(this).html();
      		var completeDT = id + ' 20:00:00';
      		$.get('tirages/find_tirage',{'dt': completeDT},function(retour) {
      			if(retour.err != null) {
					var infos = new PNotify({
			    		title: 'Error',
			    		text: 'Erreur lors de la récupération du tirage<br>' +retour.err,
						type: 'error',
						desktop: {
			     		desktop: true
			    		}
		    		});	
      			}
      			if(retour.resultat.length <=0) {
					var infos = new PNotify({
			    		title: 'Vide',
			    		text: 'Pas de tirage en date du <b>' + completeDT + '</b> <br>',
						type: 'error',
						desktop: {
			     		desktop: true
			    		}
		    		});	

      			} else {
      				//exploitation du retour
      				

      			}
      		});
      		
      });
      
 });
function loadMesreductions() {

	$.get('mesreductions/list',{'datas':{limit: 100}},function(retour) {
		
		if(retour.err != null)
			var infos = new PNotify({
	    		title: 'Error',
	    		text: 'Erreur lors de la récupération de la liste mesreductions<br>' +retour.err,
				type: 'error',
				desktop: {
	     		desktop: true
	    		}
    		});	
		else {
			//Affichage dans le tableau
			$("#tblReduction").html("<tr id='trHead'><td>Date</td><td>Numéros</td><td></td><td></td></tr>");
			
			console.log(retour);
			console.log("la suite es parsée");
			var jso = JSON.parse(retour);
			console.log(" le retour : ",jso.result);
			
			
			jso.result.map(function(obj,id){
			//alert(obj);
			var nums = "";
			obj.NUMS.map(function(obj,id) {
				nums += "<div class='case'>" + obj + "</div>";
			});	

			var rows = $("<tr datas='" + obj.id_reduction + "' class='id_mesreductions' id='mesreducs' ><td style='width:80px' id='recupt' class='gettir'>" + obj.RED_DATE + "</td><td>" + nums + "</td><td><div class='trash' datas='" +  obj.id_reduction  + "'></div></td><td><div class='radiation' datas='" +  obj.NUMS  + "'></div></td></tr>");
			//alert(JSON.stringify(obj));
			$("#tblReduction").append(rows);		
			});
			
		}


	});

}

function validate_reduction() {
	result = false;
	err_msg = "";
	
	//Récup des numéros choisis
	$("#container1_reduction").find(".casec").each(function(idx,obj){
		mesreductions.RED_NUM.push($(this).attr('id').replace('bouler_',''));
	});
	
	if($("#dtCreaReduction").val() !="")
		mesreductions.RED_DATE = $( "#dtCreaReduction" ).val() + ' 20:00:00';
	else err_msg += ' date manquante';
		if(mesreductions.RED_NUM.length > 5 && $("#dtCreaReduction").val() !="") {
		//OK on va sauvegarder, je retorune true
		mesreductions.id = currentMesreductionsId;
		result = true;
	}

	return result;
}

function showNonModal_reduction(title) {
	$( "#dialog_reduction" ).dialog({
		autoOpen: true,
		width: 980,
		height: 480,
		position:['50','50'],
		title: title,
		modal: false,
		buttons: [
			{
				text: "New",
				click: function() {
					currentMesreductionsId = null;
					$("#dtCreaReduction").val("");
					for(var nn = 1;nn<50;nn++) {
						$("#bouler_" + nn).removeClass("casec");
						if(nn <=10)
						$("#bouler_c_" + nn).removeClass("casec");

					}
					
				}
			},
			{
				text: "Save",
				click: function() {
					if(validate_reduction()) {
						
							$.get('mesreductions/save',{'datas':mesreductions},function(retour) {
								if(retour.err == null) {
									var infos = new PNotify({
		    											title: 'OK',
		    											text: 'reduction enregistrée',
		    											type: 'success',
		    											desktop: {
		        											desktop: true
		    											}
	    							});
	    							mesreductions.RED_NUM = [];
	    							loadMesreductions();
								} else
									new PNotify({
		    											title: 'Error',
		    											text: 'sauvegarde réduction en échec : ' + retour.err,
		    											type: 'error',
		    											desktop: {
		        											desktop: true
		    											}
	    							});

							});
						 

					} else {
						var infos = new PNotify({
	    											title: 'Error',
	    											text: 'infos manquantes pour un enregistrement valable<br>' + err_msg,
	    											type: 'error',
	    											desktop: {
	        											desktop: true
	    											}
    											});
					}
				}
			},

			{
				text: "Close",
				click: function() {
					$(this).hide();
				}

			}
			
		]
	});
	loadMesreductions();

}


