import React, { Component } from 'react';
import './App.css';
import {get} from 'lodash'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {PageHeader, ButtonToolbar, Button, ProgressBar, Alert, Table} from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoCtrl: {},
      busqueda: {},
      candidato: {},
      candidatos: []
    };
  }
  render() {
    
    const {geoCtrl, busqueda, candidato} = this.state;
    return (
      <main className="container">
        <PageHeader>Geolocalizador</PageHeader>
      <form name="formulario" novalidate data-ng-submit="geoCtrl.buscar()">
        <div className="form-group">
            <label for="direcciones">Direcciones a buscar</label>
            <textarea id="direcciones" data-ng-model="geoCtrl.direcciones" className="form-control" placeholder="Introduzca una direcci&oacute;n por l&iacute;nea" required></textarea>
        </div>
        <ButtonToolbar>
            <Button bsStyle="primary" data-ng-disabled="formulario.$invalid" data-ng-hide="geoCtrl.state.running">Buscar</Button>
            <Button bsStyle="danger" type="button" data-ng-show="geoCtrl.state.running" data-ng-click="geoCtrl.parar()">Parar</Button>
            <Button type="reset" data-ng-disabled="geoCtrl.direcciones == null && geoCtrl.listaResultados.length == 0" data-ng-click="geoCtrl.limpiar()"data-ng-hide="geoCtrl.state.running">Limpiar</Button>
        </ButtonToolbar>
      </form>
      <ProgressBar now={get(geoCtrl, "state.percent", 10)} />
      
      <Alert bsStyle="warning" data-ng-if="geoCtrl.state.duplicates">
          <strong>Atenci&oacute;n!</strong> Hemos visto que has introducido alguna direcci&oacute;n duplicada, solo la buscaremos una vez para optimizar nuestros recursos.
      </Alert >
      
      <div data-ng-repeat="busqueda in geoCtrl.listaResultados|filter:{state: true}" className="bs-callout" data-ng-className="busqueda.hasResults()?'bs-callout-success':'bs-callout-danger'">
          <button type="button" className="close" data-ng-click="geoCtrl.descartar($index, null)" title="Descartar">
              <span aria-hidden="true">&times;</span>
          </button>
          <h2>{busqueda.termino}</h2>
          <div className="table-responsive" data-ng-if="busqueda.hasResults()">
              <Table condensed={true}>
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
                      <td><Button bsStyle="danger" bsSize="xsmall" data-ng-click="geoCtrl.descartar($parent.$index, $index)" title="Descartar">
                              <span className="glyphicon glyphicon-remove"></span>
                          </Button></td>
                  </tr>
              </Table>
          </div>
      </div>
      <div data-ng-if="!busqueda.hasResults()">No hay resultados para este término de búsqueda</div>
        
    </main>
    );
  }
}

export default App;