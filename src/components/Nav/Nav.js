import React, { Component } from 'react';
import classes from './Nav.css';
import { Link } from 'react-router-dom';

class Nav extends Component {
    state = {
        toggleLogout: false
    };

    logout = () => {
        this.props.loginStatus(false, {});
        localStorage.removeItem('jwtoken');
    };

    render() {
        return (
            <div className={classes.Container}>
                <Link to="/home">
                    <div className={classes.Logo}>
                        <span>tcom master aplication</span>
                    </div>
                </Link>
                <div className={classes.Logged}>Logged as:</div>
                <div className={classes.UserName}>{this.props.name}</div>
                <div className={classes.UserType}>- {this.props.user_type}</div>
                <div className={classes.UserPhoto}>
                    {
                        (this.props.photo_url) ? (<img src={require(`../../${this.props.photo_url}`)} alt="avatar" />) : null
                    }
                </div>
                <Link to="/" onClick={this.logout} className={classes.Logout}>Logout</Link>
            </div>
        );
    }
}

export default Nav;