<html>

<head>
<style type="text/css">.wifeo_pagemenu > a{color:#FFFFFF;text-decoration:none} .wifeo_pagemenu:hover > a{color:#FFFFFF;text-decoration:none;font-weight:bold} .wifeo_rubrique > a{color:#FFFFFF;text-decoration:none} .wifeo_rubrique:hover > a{color:#FFFFFF;font-weight:bold;text-decoration:none} .wifeo_pagesousmenu > a{color:#FFFFFF;text-decoration:none} .wifeo_conteneur_menu{border-spacing:0px} .wifeo_conteneur_menu{width:100%;display:table;border-radius:5px;height:50px;background:linear-gradient(top, #A39292 0%,#493838 100%);background:-moz-linear-gradient(top, #A39292 0%, #493838 100%);background:-webkit-linear-gradient(top, #A39292 0%,#493838 100%);background:-ms-linear-gradient(top, #A39292 0%, #493838 100%);background:-o-linear-gradient(top, #A39292 0%,#493838 100%)} .wifeo_conteneur_menu a{text-decoration:none;display:table-cell;vertical-align:middle;height:50px;padding:0 5px;text-align:center;-webkit-transition:all 0.25s ease;-moz-transition:all 0.25s ease;-ms-transition:all 0.25s ease;-o-transition:all 0.25s ease;transition:all 0.25s ease} .wifeo_pagemenu, .wifeo_rubrique{float:left;position:relative;width:25%;text-align:center;display:vtable} .wifeo_sousmenu{left:0;opacity:0;position:absolute;top:0;visibility:hidden;z-index:1;width:100%;background-color:#A39292;box-shadow:1px 1px 8px #333333} @media screen and (min-device-width:1024px){.wifeo_sousmenu{-webkit-transition:all 0.25s ease;-moz-transition:all 0.25s ease;-ms-transition:all 0.25s ease;-o-transition:all 0.25s ease;transition:all 0.25s ease}} .wifeo_pagesousmenu{border-top:1px solid #E9D8D8;border-bottom:1px solid #5D4C4C} .wifeo_rubrique:hover .wifeo_sousmenu{opacity:1;visibility:visible;top:50px} .wifeo_sousmenu a:hover{background-color:#D5C4C4} .wifeo_pagesousmenu{width:100%;text-align:center;display:table}</style>
<!--<link href="/styles/monitor.css" rel="stylesheet" type="text/css">-->
<link href="/js/dependencies/pnotify.custom.min.css" rel="stylesheet">
<link href="/js/dependencies/jquery_ui/jquery-ui.css" rel="stylesheet">

<link href="/styles/loto.css" rel="stylesheet">
<link href="/styles/highlight.css" rel="stylesheet">
<link rel="stylesheet" href="/styles/circle.css">

 <link rel="stylesheet" href="/js/dependencies/jQRangeSlider-5.7.2/css/iThing.css" type="text/css" />

<!--<script type="text/javascript" src="/js/dependencies/sails.io.js"></script>-->


 <!-- Bring in the socket.io client -->
    <script type="text/javascript" src="/js/socket.io.js"></script>
    <!-- then beef it up with some convenience logic for talking to Sails.js -->
    <script type="text/javascript" src="/js/sails.io.js"></script>

 <script type="text/javascript" src="/js/dependencies/chart/Chart.js"></script>



<script type="text/javascript" data-main="/js/dependencies/require.main.js"  src="/js/dependencies/require.js"></script>
<script type="text/javascript" src="/js/loto.mestirages.js"></script>
<script type="text/javascript" src="/js/dependencies/mesreductions.js"></script>

<script>

var currentMestiragesId = null;
var currentMesreductionsId = null;

Array.prototype.in_array = function(unite) {
	 var length = this.length;
    for(var i = 0; i < length; i++) {
    	//alert(this[i] + " : " + unite);
        if(this[i] == unite) return true;
    }
    return false;
    };

var memo=null;

function GestionAffichage(action) {

$("#container_numeros").html("");
	if(action == "totaux")
	{
		 $("#choix_dates").show();
		 $("#list_tirage").hide();
		 $("#dvPeriode").hide();
		 $("#dialog_numeros").hide();
	}
	if(action == 'occurence')
	{
		$("#choix_dates").hide();
		$("#list_tirage").hide();
		$("#dvPeriode").hide();
		$("#dialog_numeros").show();
	}
	if(action == "periode") {
		$("#choix_dates").hide();
		$("#list_tirage").hide();
		$("#dvPeriode").show();
		$("#dialog_numeros").hide();
	}
	if(action == "tirages") {
		$("#list_tirage").show();
		$("#choix_dates").hide();
		$("#dvPeriode").hide();
		$("#dialog_numeros").hide();
	}
	$("#dialog_nm").hide();
	$("#dialog_reduction").hide();

}
var lineChartDataStats = {
			labels : [],
			datasets : [
				{
					label: "My First dataset",
					fillColor : "rgba(0,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(0,20,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data :[]
				}]

};


require(['jquery-ui','pnotify','mesreductions'], function () {

	
	$("#progress").hide();
	//gojs section
	var mestirages = {
					  id: null,
					  MTIR_DATE: null,
					  MTIR_1: null,
					  MTIR_2: null,
					  MTIR_3: null,
					  MTIR_4: null,
					  MTIR_5: null,
					  MTIR_C: null,
					  MTIR_COUT: 0,
					  MTIR_GAIN: 0
					};
					
	var err_msg = "";

	PNotify.prototype.options.styling = "jqueryui";
      //fin de gojs
       var ctx2 = document.getElementById("canvas2").getContext("2d");
      				             window.myLine2 = new Chart(ctx2).Line(lineChartDataStats, {
      							 	responsive: true
      						     });	
      var date_depart;
      var date_fin;
      var allNums = new Array();
      //Pour le choix des occurences
      $("#dialog_numeros").on("click", '.case', function() {
       	var id = parseInt($(this).attr('id').replace('n_',''));
      	$(this).removeClass('case').addClass('casec');
      });
      $("#dialog_numeros").on("click", '.casec', function() {
        		var id = parseInt($(this).attr('id').replace('n_',''));
      		$(this).removeClass('casec').addClass('case');
      		
      });

      //Pour la crea de mes tirages
       $("#container1_nm").on("click", '.case', function() {
       	var nb = $("#container1_nm").find('.casec').length;
       	if(nb < 5) {
       		var id = parseInt($(this).attr('id').replace('n_',''));
      		$(this).removeClass('case').addClass('casec');
      	}
      });
      $("#container1_nm").on("click", '.casec', function() {
        		var id = parseInt($(this).attr('id').replace('n_',''));
      		$(this).removeClass('casec').addClass('case');
      		
      });

      $("#container2_nm").on("click", '.case', function() {
       	var nb = $("#container2_nm").find('.casec').length;
       	if(nb < 1) {
       		var id = parseInt($(this).attr('id').replace('c_',''));
      		$(this).removeClass('case').addClass('casec');
      	}
      });
      $("#container2_nm").on("click", '.casec', function() {
        		var id = parseInt($(this).attr('id').replace('c_',''));
      		$(this).removeClass('casec').addClass('case');
      		
      });
      $( "#dtCrea" ).datepicker({
	      defaultDate: "",
	      changeMonth: true,
	      changeYear: true,
	      dateFormat: "yy-mm-dd",
	      onClose: function( selectedDate ) {
	        $( "#dtCrea" ).datepicker( "option", "maxDate", selectedDate );
	      }
      });
      $( "#dtCreaReduction" ).datepicker({
	      defaultDate: "",
	      changeMonth: true,
	      changeYear: true,
	      dateFormat: "yy-mm-dd",
	      onClose: function( selectedDate ) {
	        $( "#dtCreaReduction" ).datepicker( "option", "maxDate", selectedDate );
	      }
      });
      //Pour les totaux par numéros
       $("#container_numeros").on("click", '.case', function() {

        	var id = parseInt($(this).attr('id').replace('n_',''));
         	var dts={
      		label: "boule " + id,
      		fillColor : "rgba(0,220,220,0.1)",
      		strokeColor : "rgba("+ id + ",220,220,1)",
      		pointColor : "rgba(0,20,220,1)",
      		pointStrokeColor : "#fff",
      		pointHighlightFill : "#fff",
      		pointHighlightStroke : "rgba(220,220,220,1)",
      		data :allNums[id]
      	};
      	lineChartDataStats.datasets.push(dts);
      	//alert(id);
      	window.myLine2 = new Chart(ctx2).Line(lineChartDataStats, {
      		responsive: true
      	});
      	$(this).removeClass('case').addClass('casec');

       });
       $("#container_numeros").on("click", '.casec', function() {
        		var id = parseInt($(this).attr('id').replace('n_',''));
      		$(this).removeClass('casec').addClass('case');
      		for(var v= 0 ;v<lineChartDataStats.datasets.length;v++)
      			if (lineChartDataStats.datasets[v].label == 'boule ' + id)
      				lineChartDataStats.datasets[v].data = null;
      									
      		window.myLine2 = new Chart(ctx2).Line(lineChartDataStats, {
      			responsive: true
      		});



 });

$("#lnkCreateR").click(function(){
		var div_nums = "";
		var div_comp = "";
		for(var nn = 1;nn<50;nn++) {
			div_nums = div_nums + "<div class='case' id='bouler_" + nn + "'>" +nn + "</div>";
		}
		$("#container1_reduction").html(div_nums);
		
		showNonModal_reduction("Mes reductions");
		
	});



function fct_occurence() {
	
	var objS = {};
	
	objS["nums"] = new Array();

	
	$(".casec").each(function(){
		//alert($(this).attr('id'));
		objS["nums"].push( $(this).attr('id').replace("n_","") );
	});
	var laclasse = "";
		var clO="";
		var tbN = objS.nums;
		$.get('tirages/find_occurences',{'datas':objS},function(datas) {
			var tbl = "<table id='tblOcc'>";
			var ligne ="";
			var retourJSON = JSON.parse(datas);
			retourJSON.forEach(function(o,idx){
				var tir = o.tirages[0];
				ligne += "<tr>";
				ligne +=   "<td class='occE1'>" + o.stat_date + "</td>";
				if(o.occurence > 2) clO = "dvct_blue"; else clO = "occE2";
				ligne +=   "<td class='" + clO + "'>" + o.occurence + "</td>";
				if(tbN.in_array(tir.TIR_1)) laclasse = "dvct_pink"; else laclasse = "";
				ligne +=   "<td class='" + laclasse + "'>" + tir.TIR_1 + "</td>";
				if(tbN.in_array(tir.TIR_2)) laclasse = "dvct_pink"; else laclasse = "";
				ligne +=   "<td class='" + laclasse + "'>" + tir.TIR_2 + "</td>";
				if(tbN.in_array(tir.TIR_3)) laclasse = "dvct_pink"; else laclasse = "";
				ligne +=   "<td class='" + laclasse + "'>" + tir.TIR_3 + "</td>";
				if(tbN.in_array(tir.TIR_4)) laclasse = "dvct_pink"; else laclasse = "";
				ligne +=   "<td class='" + laclasse + "'>" + tir.TIR_4 + "</td>";
				if(tbN.in_array(tir.TIR_5)) laclasse = "dvct_pink"; else laclasse = "";
				ligne +=   "<td class='" + laclasse + "'>" + tir.TIR_5 + "</td>";
				ligne +=   "<td>(" + tir.TIR_C + ")</td>";
				ligne += "</tr>";
			});
			tbl += ligne + "</table>";
			
			$("#container_base").html(tbl);
		});
						 
}
function fct_periode() {
	var objS = {};
	objS["periode"]=$("#txtPeriode").val();
	
	$.get('tirages/analyse_periode',{'datas':objS},function(datas) {
		$("#container_base").html(datas);	
	});

}
function fct_tirage() {
	
	var objS = {};
	
	objS["mois"] = $("#dvMois").val();
	objS["annee"] = $("#dvAnnee").val();

	
	
	$.get('tirages/liste_tirages',{'datas':objS},function(datas) {
			/*
			var tbl = "<table>";
			var ligne ="";
			var retourJSON = JSON.parse(datas);
			retourJSON.forEach(function(tir,idx){
				//var tir = o.tirages[0];
				ligne += "<tr><td>" + tir.TIR_DATE.substr(0,10) + "</td><td>" + tir.TIR_1 + " - " + tir.TIR_2 + " - " + tir.TIR_3 + " - " + tir.TIR_4 + " - " + tir.TIR_5 + " - (" + tir.TIR_C + ")</td></tr>";
			});
			tbl += ligne + "</table>";
			*/
			$("#container_base").html(datas);
	});
						 
}
function validate(action) {
	result = false;
	err_msg = "";
	if (action === 'mestirages') {
		var tbSave = new Array();
		var tbSaveC = new Array();
		//Récup de l'enregistrement de 'mestirages' a effectuer
		//Récup des numéros choisis
		$("#container1_nm").find(".casec").each(function(idx,obj){
			tbSave.push($(this).attr('id').replace('boule_',''));
		});
		//Récup du numéro complémentaire
		$("#container2_nm").find(".casec").each(function(){
			tbSaveC.push($(this).attr('id').replace('boule_c_',''));
		});
		if($("#dtCrea").val() !="")
			mestirages.MTIR_DATE = $( "#dtCrea" ).val() + ' 20:00:00';
		else err_msg += ' date manquante';
		if($("#chkJoue").is(":checked"))
			mestirages.MTIR_COUT = 2;
		if($("#txtGain").val() !="")
			mestirages.MTIR_GAIN = $("#txtGain").val();
		if(tbSave.length == 5 && tbSaveC.length == 1 && $("#dtCrea").val() !="") {
			if (tbSave.length < 5 ) err_msg += ' manque de numéro';
			if (tbSaveC.length < 1 ) err_msg += ' pas de complémentaire';
			//OK on va sauvegarder, je retorune true
			mestirages.MTIR_1 = tbSave[0];
			mestirages.MTIR_2 = tbSave[1];
			mestirages.MTIR_3 = tbSave[2];
			mestirages.MTIR_4 = tbSave[3];
			mestirages.MTIR_5 = tbSave[4];
			mestirages.MTIR_C = tbSaveC[0];
			mestirages.id = currentMestiragesId;
			result = true;
		}

		//post traitement penser à faire un remove class casec
	}
	
	return result;
}
function loadMestirages() {

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

var globalTbSub = new Array();
function showNonModal(title,action) {
	GestionAffichage(action);
	$( "#dialog_nm" ).dialog({
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
					currentMestiragesId = null;
					$("#dtCrea").val("");
					$("#txtGain").val("");
	      			for(var nn = 1;nn<50;nn++) {
						$("#boule_" + nn).removeClass("casec");
						if(nn <=10)
						$("#boule_c_" + nn).removeClass("casec");

					}
					$("#chkJoue").attr("checked",false);
				}
			},
			{
				text: "Save",
				click: function() {
					if(validate('mestirages')) {
						
							$.get('mestirages/save',{'datas':mestirages},function(retour) {
								if(retour.err == null) {
									var infos = new PNotify({
		    											title: 'OK',
		    											text: 'tirage perso enregistré',
		    											type: 'success',
		    											desktop: {
		        											desktop: true
		    											}
	    							});
	    							loadMestirages();
								} else
									new PNotify({
		    											title: 'Error',
		    											text: 'sauvegarde en échec : ' + retour.err,
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
	loadMestirages();

}
function showModal(title,action) {
	GestionAffichage(action);
	$( "#dialog" ).dialog({
		autoOpen: true,
		width: 780,
		position:['50','50'],
		title: title,
		modal: true,
		buttons: [
			{
				text: "Ok",
				click: function() {
					if(action == 'occurence')
					{
						fct_occurence();
					}
					if(action == "periode") {
						fct_periode();
					}
					if(action == 'tirages')
					{
						fct_tirage();
					}
					if(action == 'totaux') {
						//totaux par tranche de date
						
						 //alert('zarma');
						 var dtDebut=$('#dt1').val();
				         var dtFin=$('#dt2').val();
				        
						 $.get('tirages/find_totaux',{'date1':dtDebut,'date2':dtFin},function(data)
						 {
           					 //lineChartDataStats.datasets[0].data = new Array();
				             //lineChartDataStats.labels = new Array();
				              var chaine="";
				              
				              //retour contient entre autre un tb de retour datas
				              var retourJSON = JSON.parse(data);
				              data = retourJSON.datas;
				              classement = retourJSON.TotalSort;
				              var lastTirage = retourJSON.last;
				              
				              var nums = Object.keys(classement);
				              var div_nums = "";
				              var tmp = "";
							  var tbSub = new Array();
							  var max=0;
				              nums.forEach(function(obj_num,id){
					              	var ttl = classement[obj_num];
					              	var numero = obj_num.replace("N_","");
					              	max+=ttl;
					              	if(tmp!=ttl && tmp!="")
					              	{
					              		var el = {};
					              		el["html"] = div_nums;
					              		el["total"] = tmp;
					              		tbSub.push(el);
					        			div_nums = "<div title='" + ttl + "'class='case' id='n_" + numero + "'>" +numero + "</div>";
					              	}
					              	else
					              	{
					              		div_nums = div_nums + "<div title='" + ttl + "'class='case' id='n_" + numero + "'>" +numero + "</div>";
					              	}
					              	tmp = ttl;
				              });
				              if(div_nums!="")
				              	{
				              		var el = {};
				              		el["html"] = div_nums;
				              		el["total"] = tmp;
				              		tbSub.push(el);

				              	}
				              //slice
				              var ct="";
				              var ctTab = "";
				              
				              var moyenne_sortie = parseInt(max/tbSub.length); 
				              var cpt_c = 0;
				              globalTbSub = tbSub;
				              tbSub.forEach(function(dv,id){
				              	var dv_html = dv["html"];
				              	var dv_total = dv["total"];
				              	if(cpt_c==0)
				              		css = "dvct_red";
				              	else if(cpt_c==1)
				              		css = "dvct_pink";
				              	else if(cpt_c>1)
				              		css = "dvct_green";
				              	if (dv_total<=0)
				              		css = "dvct_blue";
				              	ctTab +="<tr class='" + css + "'><td>" + dv_total + "&nbsp;sorties pour les N°</td><td>" + dv_html +"</td></tr>";
				              	ct +="<font style='float:left'>" + dv_total + "&nbsp;sorties pour les N°</font><div id='ct_" + id + "' class='" + css + "'>" + dv_html + "</div>";
				              	cpt_c ++;
				              });
							  
				              
				              var contentLast =  lastTirage.TIR_1 + " - " + lastTirage.TIR_2 + " - " + lastTirage.TIR_3 + " - " + lastTirage.TIR_4 + " - " +
				              		lastTirage.TIR_5 + " - (" + lastTirage.TIR_C + ")";
				              ctTab +="<tr class='last_tirage'><td>" + lastTirage.TIR_DATE + "&nbsp;sorties pour les N°</td><td>" + contentLast +"</td></tr>";
							  $("#container_numeros").append("<table>" + ctTab + "</table>");
				              $("#container_numeros").dialog({width:'1000px',height:'300px'});



 							  var flag=false;
 							  for(var t=0;t<50;t++)allNums.push(new Array());
				              
				              data.forEach(function(cur){

				              	  var o = Object.keys(cur);
				              	  o.forEach(function(nom,id){
				              	 	  	
				              	  		if(nom == "stat_date_total") {
				              	  			lineChartDataStats.labels.push(cur[nom]);
				              	  			
				              	  		}
				              	  	
				              	  	if(nom.substr(0,2)=='N_')
				              	  	{
				              	  	allNums[nom.replace("N_","")].push(cur[nom]);
				              	  	
				              	  	
				              	  	}
				              	  });



				              });
	       				 });
					}
				$( this ).dialog( "close" );
					//en fct de action declenchement recherche en ajax
				}
			},
			{
				text: "Cancel",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});
	
}

//init des menus
//Tranche de date pour totaux
$("#lnkTotaux").click(function(){ showModal('Sélection d une tranche de date','totaux'); });
$("#lnkPeriode").click(function(){ showModal('Sélection d une période en mois','periode'); });
$("#lnkImportation").click(function(){

 	$.get('tirages/import',{tom:1},function(data){
           					$("#container").html(data);
           					alert("ok");
    });
});
$("#lnkOcc").click(function(){
	//non, charger un ejs avec un code a part special
	$("#dialog_numeros").html("");
	//Affichage de la liste des numéros dispos 1 à 49
	var div_nums = "";
	for(var nn = 1;nn<50;nn++)
		div_nums = div_nums + "<div class='case' id='n_" + nn + "'>" +nn + "</div>";
	$("#dialog_numeros").html(div_nums);
	showModal('Sélection de numéros et tranche de date','occurence');

 });

$("#lnkListTirages").click(function(){
	//non, charger un ejs avec un code a part special
	$("#dialog_numeros").html("");
	//Affichage de la liste des numéros dispos 1 à 49
	var div_nums = "";
	$("#dialog_numeros").html(div_nums);
	showModal('Tirages','tirages');

 });

function chargementMesTirages(datas) {

	var tb = datas.split(',');
	var cl = '';
	var div_nums = "";
	var div_comp = "";
	for(var nn = 1;nn<50;nn++) {
		if(tb.in_array(nn)) cl = 'casec'; else cl = 'case';
		div_nums = div_nums + "<div class='" + cl + "' id='boule_" + nn + "'>" +nn + "</div>";
		if (nn < 11) 
			div_comp = div_comp + "<div class='case' id='boule_c_" + nn + "'>" +nn + "</div>";
	}
	var dvSupp = "<br><br><div style='padding-top:20px'>grille jouée <input id='chkJoue' type='checkbox'></div>";
	dvSupp +=    "<div>Gains <input type='text' id='txtGain' style='width:80px' value =''></div>";
	div_nums += dvSupp;
	$("#container1_nm").html(div_nums);
	$("#container2_nm").html(div_comp);

		showNonModal("Mes tirages","crea");

}

$("#lnkCreateT").click(function(){

$.get('mestirages/home',{action:'create'},function(data){
           					
           				chargementMesTirages('');
    });
});




//Fin de menu

//showModal('Sélection d'une tranche de date','totaux');
 $("#menu").menu();  


   $( "#dt1" ).datepicker({
      defaultDate: "",
      changeMonth: true,
      changeYear:true,
      dateFormat: "yy-mm-dd",
      onClose: function( selectedDate ) {
        $( "#dt1" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#dt2" ).datepicker({
      defaultDate: "",
      changeMonth: true,
      changeYear: true,
      dateFormat: "yy-mm-dd",
      onClose: function( selectedDate ) {
        $( "#dt2" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
$("#dialog").hide();
$("#dvPeriode").hide();

 /*
 var socket = window.io.connect().on('coucou', function(data) {
        alert(data);

        socket.emit('welcome', {data: 'foo!'});
    });
*/
var socket = io.connect("localhost:800");

socket.on('connect', function socketConnected() {

  typeof console !== 'undefined' &&
  console.log(
    'Socket is now connected and globally accessible as `socket`.\n' +
    'e.g. to send a GET request to Sails via Socket.io, try: \n' +
    '`socket.get("/foo", function (response) { console.log(response); })`'
  );
	
  socket.on('/mesreductions/combinaisons', function newMessageFromSails ( message ) {

    typeof console !== 'undefined' &&
    console.log('New message received from Sails ::\n', message);
    if (message != null) {
    	var perc = parseInt((message.current * 100) / message.ttl);
    	$("#progress").show();
    	$("#progress").addClass(".c100 p" + perc + " dark small green");
    	$("#progress-span").html(perc + "%");
	} else
		$("#progress").hide();
  });
  socket.emit("tom", function(r){

  	alert('rr');
  });


});




  var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);

       
    


//fin connection socket
  
});
</script>


</head>

