import React, { Component } from 'react';
import classes from './App.css';
import jwt from 'jsonwebtoken';
import Login from './components/Login/Login';
import Main from './components/Main';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faComments } from '@fortawesome/free-solid-svg-icons';

library.add(faUsers, faComments);

class App extends Component {
  state = {
    isLogged: false,
    loggedUser: {}
  };

  componentDidMount() {
    const token = localStorage.jwtoken;
    if (token) {
      const exp = jwt.decode(token).exp * 1000;
      const now = new Date().getTime();
      if (now > exp) {
        localStorage.removeItem('jwtoken');
        this.LoginStatus(false, {});
      } else { this.LoginStatus(true, jwt.decode(token)); }
    } else { this.LoginStatus(false, {}); }
  };

  LoginStatus = (isLogged, loggedUser) => {
    this.setState({ isLogged, loggedUser });
  };

  render() {
    console.log(this.state.loggedUser);
    const user = {...this.state.loggedUser};
    return (
      <div className={classes.App}>
        <Router>
          <Switch>
            <Route exact path="/" render={
              (props) => <Login {...props} loginStatus={this.LoginStatus} loggedUser={this.loggedUser}/>
            }/>
            <Route path="/home" render={
              () => <Main loginStatus={this.LoginStatus} {...user}/>
            }/>
            <Route path="*" component={() => ':( Error 404, page not found'}/>
          </Switch>
        </Router>
      </div>
    );
  }
};

export default App;