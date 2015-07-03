//var map;
var geocoder;
$(document).ready(function(){
	//var mapOptions = {
	//	zoom: 5,
	//	center: new google.maps.LatLng(40.416883, -3.703447),
	//	mapTypeId: google.maps.MapTypeId.ROADMAP,
	//	disableDefaultUI: true
	//};
	//map = new google.maps.Map($("#map")[0], mapOptions);
	var geocoder = new google.maps.Geocoder();
	$("#btnBuscar").click(function(event){
		cleanResultado();
		var addresses = $("#direcciones").val().split("\n");
		$("#resultados").removeClass( "hidden" );
		$.each(addresses, function(key, address) {
			if ($.trim(address) != ""){
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
							addResultado(key, address, results, "success");
					}else if (status == google.maps.GeocoderStatus.ERROR) {
						addResultado(key, address, results, "error");
					}else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
						addResultado(key, address, results, "error");
					}else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
						addResultado(key, address, results, "error");
					}else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
						addResultado(key, address, results, "error");
					}else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
						addResultado(key, address, results, "error");
					}else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
						addResultado(key, address, results, "error");
					}
					//ERROR	There was a problem contacting the Google servers.
					//INVALID_REQUEST	This GeocoderRequest was invalid.
					//OK	The response contains a valid GeocoderResponse.
					//OVER_QUERY_LIMIT	The webpage has gone over the requests limit in too short a period of time.
					//REQUEST_DENIED	The webpage is not allowed to use the geocoder.
					//UNKNOWN_ERROR	A geocoding request could not be processed due to a server error. The request may succeed if you try again.
					//ZERO_RESULTS
				});
			}
		
		});
	});
	$("#btnLimpiar").click(function(event){
		cleanResultado();
		$("#resultados").addClass("hidden");
	});
	
});

function addResultado(id, busqueda, resultado, estado){
	var $resultado = $("<tr></tr>");
	$resultado.addClass(estado);
//	$resultado.append("<td>"+id+"</td>"); //Id
	$resultado.append("<td>"+busqueda+"</td>"); //Busqueda
	if (resultado == null){
		$resultado.append("<td></td>"); //Direccion
//		$resultado.append("<td></td>"); //Precision
		$resultado.append("<td></td>"); //Longitud
		$resultado.append("<td></td>"); //Latitud

	}else{
		$resultado.append("<td>"+resultado[0].formatted_address+"</td>"); //Direccion
//		$resultado.append("<td>"+resultado[0].geometry.location_type+"</td>"); //Precision
		$resultado.append("<td>"+resultado[0].geometry.location.lng()+"</td>"); //Longitud
		$resultado.append("<td>"+resultado[0].geometry.location.lat()+"</td>"); //Latitud
	}
	$("#resultados > tbody").append($resultado);
	

}

function cleanResultado(){
	var $resultado = $("#resultados > tbody:last");
	$resultado.children().remove();
}