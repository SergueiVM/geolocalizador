import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";
import Candidato from "./Candidato";
import {get} from 'lodash';

class SeccionCandidatos extends Component {

  render() {

    const {candidatos, busqueda} = this.props;
    const candidatosItems = candidatos.map((candidato, index) => <Candidato key={index} candidato={candidato}/>);
    return ([<div className="bs-callout" key="resultados">
      <h2>{get(busqueda,"termino")}</h2>
      <div className="table-responsive" data-ng-if="busqueda.hasResults()">
        <Table condensed>
          <thead>
          <tr>
            <th>Dirección</th>
            <th>Longitud (X)</th>
            <th>Latitud (Y)</th>
            <th>Precisión</th>
            <th/>
          </tr>
          </thead>
          <tbody>{candidatosItems}</tbody>
        </Table>
      </div>
    </div>,
      <div key="noResultados" data-ng-if="!busqueda.hasResults()">No hay resultados para este término de búsqueda</div>]);

  }

}

export default SeccionCandidatos;