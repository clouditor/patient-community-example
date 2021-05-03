import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Home } from './Home';
import { Login } from './Login';
import { Navbar } from './Navbar';
import { NewUser } from './NewUser';
import { Users } from './Users';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route path="/users/new" component={NewUser} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
