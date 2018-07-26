import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

class SearchProgress extends Component {
  render() {
    const { progress } = this.props;
    return <ProgressBar now={progress} />;
  }
}

export default SearchProgress;
