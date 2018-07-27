import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import {get} from 'lodash';

class Candidato extends Component {

  render(){
    const {candidato} = this.props;

    return (<tr data-ng-repeat="candidato in busqueda.candidatos">
            <td>{get(candidato, 'direccion')}</td>
            <td>{get(candidato, 'coordenadas.longitud')}</td>
            <td>{get(candidato, 'coordenadas.latitud')}</td>
            <td>{get(candidato, 'precision')}</td>
            <td><Button bsStyle="danger" bsSize="xsmall" data-ng-click="geoCtrl.descartar($parent.$index, $index)" title="Descartar">
              <span className="glyphicon glyphicon-remove" />
            </Button>
            </td>
          </tr>);
  }

}

export default Candidato;