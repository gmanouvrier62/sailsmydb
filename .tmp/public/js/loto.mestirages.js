require(['jquery-ui','pnotify'], function () {
	
	//gojs section
	function loadMestirages2(){
		$.get('mestirages/list',{'datas':{limit: 100}},function(retour) {
			if(retour.err != null)
				var infos = new PNotify({
		    		title: 'Error',
		    		text: 'Erreur lors de la récupération de la liste mestirages<br>' +retour.err,
					type: 'error',
					desktop: {
		     		desktop: true
		    		}
	    		});	
			else {
				//Affichage dans le tableau
				$("#tblMT").html("<tr id='trHead'><td>Date</td><td>N1</td><td>N2</td><td>N3</td><td>N4</td><td>N5</td><td>NC</td><td>Cout</td><td>Gain</td></tr>");
				retour.result.map(function(obj,id){
					var row = $("<tr datas='" + obj.id + "' class='id_mestirages'><td>" + obj.MTIR_DATE + "</td><td>" + obj.MTIR_1 + "</td><td>" + obj.MTIR_2 + "</td><td>" + obj.MTIR_3 +
							"</td><td>" + obj.MTIR_4 +  "</td><td>" + obj.MTIR_5 + "</td><td>" + obj.MTIR_C +
							"</td><td>" + obj.MTIR_COUT + "</td><td>" + obj.MTIR_GAIN + "</td><td datas='" + obj.id + "'><div class='trash' ></div></td></tr>");
				 	$("#tblMT").append(row);	
				});
			}


		});
	}



	 $("#tblMT").on("click", '.id_mestirages', function() {
	       	var id = parseInt($(this).attr('datas'));
	       	currentMestiragesId = id;
	      	var p_date = $(this).find("td").eq(0).html();
	      	var p_1 = $(this).find("td").eq(1).html();
	      	var p_2 = $(this).find("td").eq(2).html();
	      	var p_3 = $(this).find("td").eq(3).html();
	      	var p_4 = $(this).find("td").eq(4).html();
	      	var p_5 = $(this).find("td").eq(5).html();
	      	var p_c = $(this).find("td").eq(6).html();
	      	var p_cout = $(this).find("td").eq(7).html();
	      	var p_gain = $(this).find("td").eq(8).html();
	      	//vidage des valeurs existantes
	      	$("#dtCrea").val(p_date);
	      	for(var nn = 1;nn<50;nn++) {
				$("#boule_" + nn).removeClass("casec");
				if(nn <=10)
					$("#boule_c_" + nn).removeClass("casec");
			}
			
			$("#txtGain").val(p_gain);
			
			if(parseInt(p_cout) > 0 )
				$("#chkJoue").attr("checked",true);
			else
				$("#chkJoue").attr("checked",false);
			
			//fin de vidage
			//affectation
			$("#boule_" + p_1).addClass("casec");
			$("#boule_" + p_2).addClass("casec");
			$("#boule_" + p_3).addClass("casec");
			$("#boule_" + p_4).addClass("casec");
			$("#boule_" + p_5).addClass("casec");
			$("#boule_c_" + p_c).addClass("casec");

			$(this).find("td").eq(9).find("div").click(function(){
				$.get('mestirages/delete',{'datas':{id: id}},function(retour) {
					if(retour.err == null) {
						var infos = new PNotify({
											title: 'OK',
											text: 'tirage perso supprimé',
											type: 'success',
											desktop: {
    											desktop: true
											}
						});
						loadMestirages2();
					} else {
						new PNotify({
											title: 'Error',
											text: 'suppression en échec : ' + retour.err,
											type: 'error',
											desktop: {
    											desktop: true
											}
						});
					  }
				});
			});
	 });
});