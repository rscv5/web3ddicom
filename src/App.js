import React from 'react';
import { connect } from 'react-redux';

import UiApp from './ui/UiApp';

// import Test from './features/read/testdemo';

// import './App.css';

class App extends React.Component {
  render() {
    return <UiApp />
    // return <Test />
  }
}

export default connect(store => store)(App);