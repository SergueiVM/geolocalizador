import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {Header} from './modules/header';
import {SearchForm} from './modules/searchform';
import SeccionCandidatos from "./modules/seccion-candidatos/SeccionCandidatos";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      busqueda: {},
      candidato: {},
      candidatos: []
    };
  }

  render() {
    const {busqueda, candidatos} = this.state;
    return (
      <main className="container">
        <Header>Geolocalizador</Header>
        <SearchForm busqueda={busqueda}/>
        <SeccionCandidatos candidatos={candidatos}/>
      </main>
    );
  }
}

export default App;
