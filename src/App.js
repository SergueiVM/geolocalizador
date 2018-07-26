import React, { Component } from 'react';
import './App.css';
import { get } from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Button, Table } from 'react-bootstrap';
import { Header } from './modules/header';
import { SearchForm } from './modules/searchform';

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
    const { busqueda, candidato } = this.state;
    return (
      <main className="container">
        <Header>Geolocalizador</Header><SearchForm />
        <div data-ng-repeat="busqueda in geoCtrl.listaResultados|filter:{state: true}" className="bs-callout" data-ng-className="busqueda.hasResults()?'bs-callout-success':'bs-callout-danger'">
          <button type="button" className="close" data-ng-click="geoCtrl.descartar($index, null)" title="Descartar">
            <span aria-hidden="true">&times;</span>
          </button>
          <h2>{busqueda.termino}</h2>
          <div className="table-responsive" data-ng-if="busqueda.hasResults()">
            <Table condensed>
              <tr>
                <th>Dirección</th>
                <th>Longitud (X)</th>
                <th>Latitud (Y)</th>
                <th>Precisión</th>
                <th />
              </tr>
              <tr data-ng-repeat="candidato in busqueda.candidatos">
                <td>{get(candidato, 'direccion')}</td>
                <td>{get(candidato, 'coordenadas.longitud')}</td>
                <td>{get(candidato, 'coordenadas.latitud')}</td>
                <td>{get(candidato, 'precision')}</td>
                <td><Button bsStyle="danger" bsSize="xsmall" data-ng-click="geoCtrl.descartar($parent.$index, $index)" title="Descartar">
                  <span className="glyphicon glyphicon-remove" />
                    </Button>
                </td>
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
