//var map;
var geocoder;
var searchStack = new Array();
var searchStackSize = 0;
var seeker = null;
$(document).ready(function(){
	//var mapOptions = {
	//	zoom: 5,
	//	center: new google.maps.LatLng(40.416883, -3.703447),
	//	mapTypeId: google.maps.MapTypeId.ROADMAP,
	//	disableDefaultUI: true
	//};
	//map = new google.maps.Map($("#map")[0], mapOptions);
	$('.hidden').hide().removeClass('hidden');
	geocoder = new google.maps.Geocoder();
	$("#btnBuscar").click(function(event){
		cleanResultado();
		var addresses = $("#direcciones").val().split("\n");
		$.each(addresses, function(key, address) {
			if ($.trim(address) != ""){
				var addressObj = {};
				addressObj.id = key;
				addressObj.address = address;
				searchStack.push(addressObj);
			}
		});
		if (searchStack.length>0){
			searchStackSize = searchStack.length;
			cleanProgress();
			$("#resultados").show();
			$(".progress").show();
			$("#btnStop").show();
			$("#btnBuscar").hide();
			geoCodeAddress();
		}
	});
	$("#btnLimpiar").click(function(event){
		cleanResultado();
		$("#resultados").hide();
	});
	$("#btnStop").click(function(event){
		finishGeoCode();
		$("#resultados").hide();
	});

});

function finishGeoCode(){
	if (seeker != null){
		clearTimeout(seeker);
	}
	searchStack = new Array();
	$(".progress").hide();
	$("#btnStop").hide();
	$("#btnBuscar").show();
}

function geoCodeAddress(){
	var addressObj = searchStack.pop();
	geocoder.geocode( { 'address': addressObj.address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
				addResultado(addressObj.id, addressObj.address, results, "success");
		}else if (status == google.maps.GeocoderStatus.ERROR) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
			addResultado(addressObj.id, addressObj.address, results, "danger");
		}
		//ERROR	There was a problem contacting the Google servers.
		//INVALID_REQUEST	This GeocoderRequest was invalid.
		//OK	The response contains a valid GeocoderResponse.
		//OVER_QUERY_LIMIT	The webpage has gone over the requests limit in too short a period of time.
		//REQUEST_DENIED	The webpage is not allowed to use the geocoder.
		//UNKNOWN_ERROR	A geocoding request could not be processed due to a server error. The request may succeed if you try again.
		//ZERO_RESULTS
		setProgress();
		if (searchStack.length == 0){
			finishGeoCode();
		}else{
			seeker = setTimeout(geoCodeAddress, 2000);
		}
	});

}

function cleanProgress(){
	var $progress = $(".progress > .progress-bar");
	var percent = "0%";
	$progress.css("width", percent);
	$progress.text(percent);
}


function setProgress(){
	var $progress = $(".progress > .progress-bar");
	var percent = Math.ceil(( (searchStackSize - searchStack.length)/searchStackSize)*100) + "%";
	$progress.css("width", percent);
	$progress.text(percent);
}

function addResultado(id, busqueda, resultado, estado){
	if (resultado == null || resultado.length == 0){
		var $fila = $("<tr></tr>");
		$fila.addClass(estado);
		$fila.append("<td></td>");
		$fila.append($("<td></td>").append(busqueda)); //Busqueda
		$fila.append("<td></td>"); //Direccion
		$fila.append("<td></td>"); //Longitud
		$fila.append("<td></td>"); //Latitud
		$fila.append("<td></td>"); //Precision
		$("#resultados > tbody").append($fila);
	}else{
			for(var i= 0; i < resultado.length; i++){
				var $fila = $("<tr></tr>");
				$fila.addClass(estado);
				$fila.append($("<td></td>").append((i+1)+" / "+resultado.length));
				$fila.append($("<td></td>").append(busqueda)); //Busqueda
				$fila.append($("<td></td>").append(resultado[i].formatted_address)); //Direccion Formateada

				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.DIRECCION))); //Direccion
				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.COD_POSTAL))); //Codigo Postal
				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.POBLACION))); //Poblacion
				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.MUNICIPIO))); //Municipio
				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.REGION))); //Región
				//$fila.append($("<td></td>").append(getAddressComponent(resultado[i], ADDRESS.PAIS))); //Pais
				$fila.append($("<td></td>").append(resultado[i].geometry.location.lng())); //Longitud
				$fila.append($("<td></td>").append(resultado[i].geometry.location.lat())); //Latitud
				var precision = translateLocationType(resultado[i].geometry.location_type);
				$fila.append($("<td></td>",{
					"title":tooltipLocationType(resultado[i].geometry.location_type)
				}).append(precision)); //Precision
				$("#resultados > tbody").append($fila);
			}
	}
}

var ADDRESS = {
	DIRECCION: 0,
	POBLACION: 1,
	MUNICIPIO: 2,
	REGION: 3,
	PAIS: 4,
	COD_POSTAL: 5,
	FORMATEADA: -1
};
function getAddressComponent(localizacion, component){
	var resultado = "";
	if (localizacion != null && typeof(localizacion.address_components) != "undefined"){
		if (component == ADDRESS.FORMATEADA){
			resultado = localizacion.formatted_address;
		}else if (localizacion.address_components.length > component){
			resultado = localizacion.address_components[component].long_name;
		}
	}
	return resultado;
}

function cleanResultado(){
	var $resultado = $("#resultados > tbody:last");
	$resultado.empty();
}

function translateLocationType(locationType){
	var resultado = "";
	if (typeof(locationType) != "undefined" && locationType != null){
		if (locationType == "ROOFTOP"){
			resultado = "Exacta";
		}else if (locationType == "RANGE_INTERPOLATED"){
			resultado = "Rango Interpolado";
		}else if (locationType == "GEOMETRIC_CENTER"){
			resultado = "Centro Geom&eacute;trico";
		}else if (locationType == "APPROXIMATE"){
			resultado = "Aproximado";
		}
	}
	return resultado;
}
function tooltipLocationType(locationType){
	var resultado = null;
	if (locationType == "ROOFTOP"){
		resultado = "Indica que el resultado devuelto es una codificación geográfica precisa para los que tenemos información sobre la ubicación exacta hasta la calle Dirección de precisión";
	}else if (locationType == "RANGE_INTERPOLATED"){
		resultado = "Indica que el resultado devuelto refleja una aproximación (por lo general en una carretera) interpolado entre dos puntos precisos (tales como intersecciones). Resultados interpolados se devuelven generalmente cuando la codificación geográfica de la azotea no están disponibles para una dirección de calle.";
	}else if (locationType == "GEOMETRIC_CENTER"){
		resultado = "Indica que el resultado devuelto es el centro geométrico de un resultado tal como una polilínea (por ejemplo, una calle) o polígono (región)";
	}else if (locationType == "APPROXIMATE"){
		resultado = "Indica que el resultado devuelto es aproximada.";
	}
	return resultado;
}
