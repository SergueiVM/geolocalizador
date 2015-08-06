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
	this.state = false;
}

var LocationTypeTranslation = {
	"ROOFTOP": "Exacta",
	"RANGE_INTERPOLATED": "Rango Interpolado",
	"GEOMETRIC_CENTER": "Centro Geom\u00E9trico",
	"APPROXIMATE": "Aproximado"
}
