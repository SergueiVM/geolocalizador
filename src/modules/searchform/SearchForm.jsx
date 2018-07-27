import React, { Component } from 'react';
import { Alert, Button, ButtonToolbar } from 'react-bootstrap';
import SearchProgress from './SearchProgress';

class SearchForm extends Component {
  render() {
    return ([
      <form key="formulario" name="formulario" noValidate>
        <div className="form-group">
          <label htmlFor="direcciones">Direcciones a buscar</label>
          <textarea
            key="direcciones"
            data-ng-model="geoCtrl.direcciones"
            className="form-control"
            placeholder="Introduzca una direcci&oacute;n por l&iacute;nea"
            required
          />
        </div>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            data-ng-disabled="formulario.$invalid"
            data-ng-hide="geoCtrl.state.running"
          >Buscar
          </Button>
          <Button
            bsStyle="danger"
            type="button"
            data-ng-show="geoCtrl.state.running"
            data-ng-click="geoCtrl.parar()"
          >Parar
          </Button>
          <Button
            type="reset"
            data-ng-disabled="geoCtrl.direcciones == null && geoCtrl.listaResultados.length == 0"
            data-ng-click="geoCtrl.limpiar()"
            data-ng-hide="geoCtrl.state.running"
          >Limpiar
          </Button>
        </ButtonToolbar>
      </form>,
      <SearchProgress key="progresoBusqueda" {...this.props}/>,

      <Alert key="avisoDuplicados" bsStyle="warning" data-ng-if="geoCtrl.state.duplicates">
        <strong>Atenci&oacute;n!</strong> Hemos visto que has introducido alguna direcci&oacute;n duplicada, solo la
                buscaremos una vez para optimizar nuestros recursos.
      </Alert>,

    ]);
  }
}

export default SearchForm;
