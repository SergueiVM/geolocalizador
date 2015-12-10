app.controller("geoLocalizadorController", ["$scope","$timeout", "$log", function($scope, $timeout, $log){
	var ctrl = this;
	this.direcciones = null;
	this.listaResultados = new Array();
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
		searched: 0,
		duplicates: false
	}
	var seeker = null;
	geocoder = new google.maps.Geocoder();
	
	this.buscar = function(){
		this.listaResultados = new Array();
		this.state.running = true;
		var dirArray = this.direcciones.split("\n");
		var terminos = getArrayWithoutDuplicates(dirArray);
		if (terminos.length > 0){
			for(var i=0; i< terminos.length; i++){
				var busqueda = new Busqueda();
				busqueda.termino = terminos[i];
				this.listaResultados.push(busqueda);
			}
			this.state.initial = terminos.length;
			this.state.searched = 0;
			this.state.duplicates = (terminos.length != dirArray.length);
			geoLocalizar();
		}
		ga('send', 'event', 'buscar', 'clicked');
	}
	
	this.descartar = function( indexTermino, indexCandidato){
		if (indexCandidato != null){
			this.listaResultados[indexTermino].candidatos.splice(indexCandidato, 1);
		}else{
			this.listaResultados.splice(indexTermino, 1);
		}
		ga('send', 'event', 'descartar', 'clicked');
	}

	
	this.parar = function(){
		$timeout.cancel(seeker);
		this.state.running = false;
		ga('send', 'event', 'parar', 'clicked');
	}
	
	this.limpiar = function(){
		this.direcciones = null;
		this.listaResultados = new Array();
		ga('send', 'event', 'limpiar', 'clicked');
	}
	//Funciones privadas
	function getPendientes(){
		var pendientes = ctrl.listaResultados.filter(function(elemento){
			return !elemento.state;
		});
		return pendientes;
	}
	
	function geoLocalizar(){
		var pendientes = getPendientes();
		
		if (pendientes.length > 0){
			var busqueda = pendientes[0];
			geocoder.geocode( { 'address': busqueda.termino}, function(results, status) {
				$scope.$apply(function(){
					procesarResultado(busqueda, results, status);
					ctrl.state.searched++;
				});
			});
		}
	}
	function procesarResultado(busqueda, resultados, estado){
		if (estado == google.maps.GeocoderStatus.OK || estado == google.maps.GeocoderStatus.ZERO_RESULTS) {
			$log.debug("El termino: "+busqueda.termino+ " tiene "+resultados.length+" candidatos");
			for(var i= 0; i < resultados.length; i++){
				var poi = new Poi();
				poi.direccion = resultados[i].formatted_address;
				poi.coordenadas.longitud = resultados[i].geometry.location.lng();
				poi.coordenadas.latitud = resultados[i].geometry.location.lat();
				poi.precision = translateLocationType(resultados[i].geometry.location_type);
				busqueda.candidatos.push(poi);
			}
			busqueda.state = true;			
		}else{
			alert("Error" + estado);
		}
		
		if (getPendientes().length > 0){
			seeker = $timeout(geoLocalizar, 2000);
		}else{
			ctrl.state.running = false;
		}
	}
	
	function translateLocationType(locationType){
		var resultado = "";
		if (typeof(locationType) != "undefined" && locationType != null){
			resultado = LocationTypeTranslation[locationType];
		}
		return resultado;
	}
}]);