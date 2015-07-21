function Poi(){
	this.direccion = null;
	this.coordenadas = {
		"longitud": null,
		"latitud": null
	};
	this.precision = null;
}

function Busqueda(){
	this.termino = null;
	this.candidatos = new Array();
	this.hasResults = function(){
		return this.candidatos.length > 0;
	}
}