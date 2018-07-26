import React, { Component } from 'react';
import './App.css';
import {get} from 'lodash'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoCtrl: {},
      busqueda: {},
      candidato: {}
    };
  }
  render() {
    
    const {geoCtrl, busqueda, candidato} = this.state;
    return (
      <main className="container">
<form name="formulario" novalidate data-ng-submit="geoCtrl.buscar()">
        <div className="form-group">
            <label for="direcciones">Direcciones a buscar</label>
            <textarea id="direcciones" data-ng-model="geoCtrl.direcciones" className="form-control" placeholder="Introduzca una direcci&oacute;n por l&iacute;nea" required></textarea>
        </div>
        <div className="form-group">
            <button type="submit" className="btn btn-primary" data-ng-disabled="formulario.$invalid" data-ng-hide="geoCtrl.state.running">Buscar</button>
            <button type="button" className="btn btn-danger" data-ng-show="geoCtrl.state.running" data-ng-click="geoCtrl.parar()">Parar</button>
            <button type="reset" className="btn btn-default" data-ng-disabled="geoCtrl.direcciones == null && geoCtrl.listaResultados.length == 0" data-ng-click="geoCtrl.limpiar()"
                data-ng-hide="geoCtrl.state.running"
            >Limpiar</button>
        </div>
    </form>
    <div className="progress" data-ng-if="geoCtrl.state.running">
        <div className="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">{get(geoCtrl, "state.percent")}%</div>
    </div>
    <div className="alert alert-warning" data-ng-if="geoCtrl.state.duplicates">
        <strong>Atenci&oacute;n!</strong> Hemos visto que has introducido alguna direcci&oacute;n duplicada, solo la buscaremos una vez para optimizar nuestros recursos.
    </div>
    <div data-ng-repeat="busqueda in geoCtrl.listaResultados|filter:{state: true}" className="bs-callout" data-ng-className="busqueda.hasResults()?'bs-callout-success':'bs-callout-danger'">
        <button type="button" className="close" data-ng-click="geoCtrl.descartar($index, null)" title="Descartar">
            <span aria-hidden="true">&times;</span>
        </button>
        <h2>{busqueda.termino}</h2>
        <div className="table-responsive" data-ng-if="busqueda.hasResults()">
            <table className="table table-condensed">
                <tr>
                    <th>Dirección</th>
                    <th>Longitud (X)</th>
                    <th>Latitud (Y)</th>
                    <th>Precisión</th>
                    <th></th>
                </tr>
                <tr data-ng-repeat="candidato in busqueda.candidatos">
                    <td>{get(candidato,"direccion")}</td>
                    <td>{get(candidato,"coordenadas.longitud")}</td>
                    <td>{get(candidato,"coordenadas.latitud")}</td>
                    <td>{get(candidato,"precision")}</td>
                    <td><button className="btn btn-danger btn-xs" data-ng-click="geoCtrl.descartar($parent.$index, $index)" title="Descartar">
                            <span className="glyphicon glyphicon-remove"></span>
                        </button></td>
                </tr>
            </table>
        </div>
        <div data-ng-if="!busqueda.hasResults()">No hay resultados para este término de búsqueda</div>
    </div>
    <div className="push"></div>
      </main>
    );
  }
}

export default App;