import React, { Component } from 'react';
import classes from './Main.css';
import {Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav/Nav';
import Users from './Users/Users';
import App1 from './App1/App1';
import App2 from './App2/App2';

class Main extends Component {
    state = {
        adminToggle: false,
        app: ''
    };

    clickHandler = (app) => {
        this.setState({app});
    };

    render() {
        if (!localStorage.jwtoken) {
            return <Redirect to="/" />
          }
        
        const user = {...this.props};

        return (
            <div className={classes.Main}>
                <Nav {...user} loginStatus={this.props.loginStatus}/>
                <div className={classes.AppsContainer}>
                    {
                        this.props.user_type === 'admin' ? <div onClick={() => this.clickHandler('admin')} className={classes.AppLinks}><div className={classes.icon}><FontAwesomeIcon icon="users" size='3x' /></div>Admin</div> : null
                    }
                    {
                        this.props.user_type === ('admin') || this.props.user_type === ('user1') ? <div onClick={() => this.clickHandler('user1')} className={classes.AppLinks}><div className={classes.icon}><FontAwesomeIcon icon="comments" size='3x' /></div>Application 1</div> : null
                    }
                    {
                        this.props.user_type === 'admin' || 'user1' || 'user2' ? <div onClick={() => this.clickHandler('user2')} className={classes.AppLinks}><div className={classes.icon}><FontAwesomeIcon icon="comments" size='3x' /></div>Application 2</div> : null
                    }
                </div>
                <div className={classes.Apps}>
                    {this.state.app === 'admin' ? <Users /> : null}
                    {this.state.app === 'user1' ? <App1 /> : null}
                    {this.state.app === 'user2' ? <App2 loggedUser={this.props.user_type}/> : null}
                </div>
            </div>
        );
    }
}

export default Main;