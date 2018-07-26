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

// Habria que hacer una clase de utilidades pero utilizamos esta de momento.
function getArrayWithoutDuplicates(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}