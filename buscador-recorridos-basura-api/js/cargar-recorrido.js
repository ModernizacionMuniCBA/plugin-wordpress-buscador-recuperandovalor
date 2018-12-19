const duerme = (milliseconds) => {

  return new Promise(resolve => setTimeout(resolve, milliseconds))

}

function repetido(lista,id,tipo,desde,hasta)
{
	for(z=0;z<=lista.length-1;z++)
	{
		if(lista[z].tipos.id==tipo && lista[z].turno[0].desde==desde && lista[z].turno[0].hasta==hasta && lista[z].id!=id)
		{
			return true;
		}
	}
}


function renderlista(lista,empresa)
{
	//console.log(lista);

	var tarjeta="";
	var barrio=document.getElementById("barrios");
	tarjeta+='<div class="resultado__cabecera"><span class="resultado__nombre">'+barrio.options[barrio.selectedIndex].innerHTML+'</span>';
	tarjeta+='<span class="resultado__estado">';
	switch(empresa) {
	    case "URBA":
	    	img="https://recuperandovalor.cordoba.gob.ar/wp-content/uploads/sites/33/2018/11/urbacor.png";
	        tarjeta+='<img class="empresa_img" alt='+empresa+' src='+img+'></span></div>';
	        break;
	    case "LAM":
	    	img="https://recuperandovalor.cordoba.gob.ar/wp-content/uploads/sites/33/2018/11/lam.jpg";
	        tarjeta+='<img class="empresa_img" alt='+empresa+' src='+img+'></span></div>';
	        break;
	    case "LUSA":
	    	img="https://recuperandovalor.cordoba.gob.ar/wp-content/uploads/sites/33/2018/11/lusa.jpg";
	        tarjeta+='<img class="empresa_img" alt='+empresa+' src='+img+'></span></div>';
	        break;
	    default:
	        tarjeta+='</span></div>';
	}

	for(i=0;i<=lista.length-1;i++)
	{

		
		tarjeta+='<div class="resultado__info" style="display:inline-block">';
		tarjeta+='<div class="grupo"><ul>';

		
		tarjeta+='<p style="margin-bottom:10px;"><b style="color:#00ac65">'+lista[i].tipos.nombre+'</b></p>';
		//console.log(lista[i].dia);
		
		var diasstr="";
		for(x=0;x<=lista[i].dia.length-1;x++)
		{
			diasstr+=lista[i].dia[x].dia+",";
		}	
		tarjeta+='<li><b>Dias: </b>'+diasstr+'</li>';
		
		tarjeta+='<li><b>Turno: </b>'+lista[i].turno[0].desde+' - '+lista[i].turno[0].hasta+'</li>';
		if(lista[i].calles){
			tarjeta+='<li><b>Recorrido: </b>'+lista[i].calles+'</li>';
		}else{
			tarjeta+='<li><b>Recorrido: </b></li>';
		}
		tarjeta+='</ul></div>';
		
		tarjeta+='</div>';
		/*if(repetido(lista,lista[i].id,lista[i].tipos.id,lista[i].turno[0].desde,lista[i].turno[0].hasta))
		{
			tarjeta="";
		}*/

	}
	document.getElementById("resultados").innerHTML+=tarjeta;

}


function inicia_recorrido(listainicial)

{

	var clase="";


	var img="";

	//var tarjeta='<table width="100%" style="font-family:Arial;" cellpadding="0" cellspacing="0">';

	document.getElementById("resultados").innerHTML="";

	//console.log(listainicial);
	var e = document.getElementById("barrios");
	var barriostr = e.options[e.selectedIndex].text;

	//console.log(listainicial);
	var urba=listainicial.filter(filtrourba);
	var lam=listainicial.filter(filtrolam);
	var lusa=listainicial.filter(filtrolusa);
	
	
	
	if (urba.length>0)
	{
		renderlista(urba,"URBA");
	}

	if (lam.length>0)
	{
		renderlista(lam,"LAM");
	}

	if (lusa.length>0)
	{
		renderlista(lusa,"LUSA");
	}


	

	

	
	

	

}





function filtrobarrio(arr) {

	
	

	if (document.getElementById("barrios").value!="")

	{

		var band=false;
		for (var i = 0; i<=arr.barrio.length-1; i++) {
			
			if(arr.barrio[i].id==document.getElementById("barrios").value)
			{
				
				band=true;
			}
		}

		return band;
	}

    

}

function filtrourba(arr) {
		
		var band=false;
		
			
			if(arr.empresa.id==4)
			{
				
				band=true;
			}
		

		return band;
}

function filtrolam(arr) {
		var band=false;
		if(arr.empresa.id==5)
			{
				
				band=true;
			}

		return band;
}

function filtrolusa(arr) {
		
		var band=false;
		if(arr.empresa.id==6)
			{
				
				band=true;
			}
		return band;
}







function filtra_recorrido()

{

	//console.log(lista[0].barrio);

	data_filter =lista;

	if (document.getElementById("barrios").value!="")

	{

		data_filter = data_filter.filter(filtrobarrio);

		document.getElementById("loading").style.display="block";

		duerme(1000).then(() => {

		  	document.getElementById("loading").style.display="none";	

		  	inicia_recorrido(data_filter);
	  	});


	}else{

	  	document.getElementById("loading").style.display="none";	
		document.getElementById("resultados").innerHTML="<h2 style='text-align:center;'>Seleccione su barrio</h2>"
	}

	

	

	

	
	  

	



	

}