import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AddGroupMember } from './AddGroupMember';
import './App.css';
import { Groups } from './Groups';
import { Home } from './Home';
import { Login } from './Login';
import { Navbar } from './Navbar';
import { NewGroup } from './NewGroup';
import { NewUser } from './NewUser';
import { Users } from './Users';
import { CheckSymptoms } from './CheckSymptoms';
import { PhrForm } from './PhrForm';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route path="/users/new" component={NewUser} />
        <Route exact path="/groups" component={Groups} />
        <Route path="/groups/new" component={NewGroup} />
        <Route path="/groups/:id/members/add" component={AddGroupMember} />
        <Route path="/login" component={Login} />
        <Route path="/diseases" component={CheckSymptoms} />
        <Route path="/phr" component={PhrForm} />
      </Switch>
    </Router>
  );
}

export default App;
