import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Identity from './Identity';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Login}/>
          <Route path='/home' exact={true} component={Home}/>
          <Route path='/identity/:id' component={Identity}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
