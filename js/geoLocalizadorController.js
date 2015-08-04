app.controller("geoLocalizadorController", function($scope, $timeout, $log){
	var ctrl = this;
	this.direcciones = null;
	this.listaResultados = new Array();
	this.terminos = new Array();
	this.state = {
		running: false,
		percent: function(){
			var resultado = 0;
			if (this.searched != 0 && this.initial != 0){
				resultado = (this.searched / this.initial) * 100;
			}
			return Math.ceil(resultado);
		},
		initial: 0,
		searched: 0
	}
	var seeker = null;
	geocoder = new google.maps.Geocoder();
	
	this.buscar = function(){
		this.listaResultados = new Array();
		this.state.running = true;
		this.terminos = this.direcciones.split("\n");
		if (this.terminos.length > 0){
			this.state.initial = ctrl.terminos.length;
			this.state.searched = 0;
			geoLocalizar();
		}
	}
	
	this.descartar = function( indexTermino, indexCandidato){
		if (indexCandidato != null){
			this.listaResultados[indexTermino].candidatos.splice(indexCandidato, 1);
		}else{
			this.listaResultados.splice(indexTermino, 1);
		}
	}

	
	this.parar = function(){
		$timeout.cancel(seeker);
		this.state.running = false;
	}
	
	this.limpiar = function(){
		this.direcciones = null;
		this.listaResultados = new Array();
	}
	//Funciones privadas
	function geoLocalizar(){
		var termino = ctrl.terminos.pop();
		geocoder.geocode( { 'address': termino}, function(results, status) {
			$scope.$apply(function(){
				procesarResultado(termino, results, status);
				ctrl.state.searched++;
			});
		});
	}
	function procesarResultado(termino, resultados, estado){
		if (estado == google.maps.GeocoderStatus.OK || estado == google.maps.GeocoderStatus.ZERO_RESULTS) {
			var busqueda = new Busqueda();
			busqueda.termino = termino;
			$log.debug("El termino: "+termino+ " tiene "+resultados.length+" candidatos");
			for(var i= 0; i < resultados.length; i++){
				var poi = new Poi();
				poi.direccion = resultados[i].formatted_address;
				poi.coordenadas.longitud = resultados[i].geometry.location.lng();
				poi.coordenadas.latitud = resultados[i].geometry.location.lat();
				poi.precision = translateLocationType(resultados[i].geometry.location_type);
				busqueda.candidatos.push(poi);
			}
			ctrl.listaResultados.push(busqueda);
			
		// }else if (status == google.maps.GeocoderStatus.ERROR) {
			// addResultado(addressObj.id, addressObj.address, results, "danger");
		// }else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
			// addResultado(addressObj.id, addressObj.address, results, "danger");
		// }else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			// addResultado(addressObj.id, addressObj.address, results, "danger");
		// }else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
			// addResultado(addressObj.id, addressObj.address, results, "danger");
		// }else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
			// addResultado(addressObj.id, addressObj.address, results, "danger");
		}else{
			alert("Error" + estado);
		}
		
		if (ctrl.terminos.length !== 0){
			seeker = $timeout(geoLocalizar, 2000);
		}else{
			ctrl.state.running = false;
		}
	}
	
	function translateLocationType(locationType){
		var resultado = "";
		if (typeof(locationType) != "undefined" && locationType != null){
			if (locationType == "ROOFTOP"){
				resultado = "Exacta";
			}else if (locationType == "RANGE_INTERPOLATED"){
				resultado = "Rango Interpolado";
			}else if (locationType == "GEOMETRIC_CENTER"){
				resultado = "Centro Geometrico";
			}else if (locationType == "APPROXIMATE"){
				resultado = "Aproximado";
			}
		}
		return resultado;
	}
});