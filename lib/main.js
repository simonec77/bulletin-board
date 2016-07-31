'use babel';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
  render () {
    return (
      <div>
        <h1>Hello, World!</h1>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
