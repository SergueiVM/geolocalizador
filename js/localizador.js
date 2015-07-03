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
			addResultado(addressObj.id, addressObj.address, results, "error");
		}else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
			addResultado(addressObj.id, addressObj.address, results, "error");
		}else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			addResultado(addressObj.id, addressObj.address, results, "error");
		}else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
			addResultado(addressObj.id, addressObj.address, results, "error");
		}else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
			addResultado(addressObj.id, addressObj.address, results, "error");
		}else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
			addResultado(addressObj.id, addressObj.address, results, "error");
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
	var $resultado = $("<tr></tr>");
	$resultado.addClass(estado);
//	$resultado.append("<td>"+id+"</td>"); //Id
	$resultado.append("<td>"+busqueda+"</td>"); //Busqueda
	if (resultado == null){
		$resultado.append("<td></td>"); //Direccion
		$resultado.append("<td></td>"); //Longitud
		$resultado.append("<td></td>"); //Latitud
		//		$resultado.append("<td></td>"); //Precision

	}else{
		$resultado.append("<td>"+resultado[0].formatted_address+"</td>"); //Direccion
		$resultado.append("<td>"+resultado[0].geometry.location.lng()+"</td>"); //Longitud
		$resultado.append("<td>"+resultado[0].geometry.location.lat()+"</td>"); //Latitud
		//		$resultado.append("<td>"+resultado[0].geometry.location_type+"</td>"); //Precision
	}
	$("#resultados > tbody").append($resultado);
}

function cleanResultado(){
	var $resultado = $("#resultados > tbody:last");
	$resultado.empty();
}
