import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import classes from './Login.css';
import setAuthToken from '../../utils/setAuthToken';
import jwt from 'jsonwebtoken';

class Login extends Component {
  state = {
    username: '',
    password: '',
    feedback: ''
  };

  inputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  login = e => {
    const user = {
      username: this.state.username,
      password: this.state.password
    };
    e.preventDefault();

    if (!user.username || !user.password) {
      this.setState({ feedback: 'Username and password are required!' });
    }
    else {
      axios({
        method: 'post',
        url: 'http://localhost:3306/login',
        data: user,
        config: { headers: { 'Content-Type': 'application/json' } }
      })
        .then(res => {
          if (res.data.token) {
            const token = res.data.token;
            localStorage.setItem('jwtoken', token);
            setAuthToken(token);
            const loggedUser = jwt.decode(token);
            this.setState({ feedback: `Logged in as ${loggedUser.username}`, isLogged: true });
            this.props.loginStatus(true, loggedUser);
            this.props.history.push('/home');
          }
          else {
            this.setState({ feedback: 'no user with that credentials' });
          }
        })
        .catch(err => { console.log(err) });
    }
  };

  render() {
    if (localStorage.jwtoken) {
      return <Redirect to="/home" />
    }
    return (
      <div className={classes.LoginWrap} >
        <div className={classes.LogoTitle}>tcom
            <div className={classes.LogoTxt}>Master application</div>
        </div>
        <div className={classes.Login}>
          <form onSubmit={this.login} className={classes.Form}>
            <div className={classes.FormTitle}>Login to TCOM</div>
            <input onChange={this.inputHandler} className={classes.Input} type="text" name="username" placeholder="username" />
            <input onChange={this.inputHandler} className={classes.Input} type="password" name="password" placeholder="password" />
            <div className={classes.Feedback}>
              {this.state.feedback}
            </div>
            <button className={classes.Button}>Login</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;