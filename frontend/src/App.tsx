import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Home } from './Home';
import { Login } from './Login';
import { Navbar } from './Navbar';
import { Users } from './Users';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
