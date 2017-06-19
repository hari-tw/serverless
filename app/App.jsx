import React from 'react'

// import './styles/App.css'
import './styles/app.styl'
import logo from './images/logo.svg';

//import { Provider } from 'react-redux';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header rio">

          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
      </div>
    )
  }
}

export default App
