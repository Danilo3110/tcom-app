import React, { Component } from 'react';
import {getFromDatabase , patchToDatabase, postToDatabase, deleteFromDatabase} from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Users.css';

class Users extends Component {
    state = {
        name: '',
        username: '',
        password: '',
        user_type: '',
        photo_url: 'assets/profiles/defaultPhoto.jpg',
        usersAll: [],
        users_onePage: [],
        showAll: false,
        updateId: '',
        userEdit: '',
        regEx_message: '',
        true_message: ''
    };

    getDatabase = () => {
        (async () => {
            const data = await getFromDatabase(`/users`);
            const usersAll = [];
            data.data.map(user => (
                usersAll.push({ id: user.id, name: user.name, username: user.username, password: user.password, user_type: user.user_type, photo_url: user.photo_url })
            ));
            
            const users_onePage = usersAll.slice(0, 10);
            (this.state.showAll) ? this.setState({ usersAll, users_onePage: usersAll }) : this.setState({ usersAll, users_onePage });
        })();
    };

    inputHandler = (e) => {
        if (e.target.name === 'photo_url') {
            const photoName = e.target.value.slice(12);
            const photo_url = `assets/profiles/${photoName}`;
            this.setState({ photo_url });
        } else { this.setState({ [e.target.name]: e.target.value }); }
    };

    saveHandler = () => {
        const newUser = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            user_type: this.state.user_type,
            photo_url: this.state.photo_url,
        };
        const isEmpty = Object.values(newUser).every(input => (input !== ''));
        if (isEmpty) {
            // this.setState(prevState=>({ users: [newUser, ...prevState.users]}));
            (async () => {
                await postToDatabase('/users', newUser);
                this.setState({ showAll: true });
                this.getDatabase();
            })();
            this.setState({true_message: '- Successfully aded new user -'});
            document.querySelector('#addUser').reset();
        } else { this.setState({regEx_message: 'Please complete all fields to add new user!'}); }
    };

    updateHandler = () => {
        let photo = '';
        if (this.state.photo_url !== 'assets/profiles/defaultPhoto.jpg') {
            photo = this.state.photo_url;
        } else {
            photo = this.state.userEdit.photo_url;
        }

        const editedUser = {
            name: document.querySelector('#name').value,
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
            user_type: document.querySelector('input[name=user_type]:checked').value,
            photo_url: photo,
        };
        (async () => {
            await patchToDatabase('/users', this.state.updateId, editedUser);
            this.getDatabase();
        })();
        this.setState({true_message: '- Successfully updated! -'});
        this.setState({updateId: ''});
        document.querySelector('#addUser').reset();
    };

    getUserForUpdate = (id) => {
        const selectedUser = this.state.usersAll.find(user => user.id === id);
        this.setState({updateId: id, userEdit: selectedUser});
        
        document.querySelector('#name').value = selectedUser.name;
        document.querySelector('#username').value = selectedUser.username;
        document.querySelector('#password').value = selectedUser.password;
        document.querySelector(`#${selectedUser.user_type}`).checked = true;
    };

    deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            (async () => {
                await deleteFromDatabase('/users', id);
                this.getDatabase();
            })();
            this.setState({true_message: '- Successfully deleted user -'});
        }
    };

    showAllUsers = () => {
        if (this.state.showAll) {
            const users_onePage = this.state.usersAll.slice(0, 10);
            this.setState({ showAll: false, users_onePage });
        } else {
            this.setState({showAll: true, users_onePage: this.state.usersAll});
        }
    };

    componentDidMount() {
        this.getDatabase();
    };

    render() {
        const users = this.state.users_onePage.map(user => {
            return (
                <div key={user.id} className={classes.UsersDetailsFlex}>
                    <div className={classes.UsersImg}><img src={require(`../../${user.photo_url}`)} alt="avatar" /> </div>
                    <div>{user.name}</div>
                    <div>username: {user.username}</div>
                    <div>password: {user.password}</div>
                    <span>{user.user_type}
                    <FontAwesomeIcon onClick={() => this.deleteHandler(user.id)} icon="trash-alt" size="lg" style={{color: "red", cursor: "pointer", paddingLeft: "1vw"}}/>
                    <FontAwesomeIcon onClick={() => { this.getUserForUpdate(user.id); this.myInp.focus();}} icon={['fas', 'edit']} size="lg" style={{color: "lightgreen", cursor: "pointer", paddingLeft: "1vw"}}/>
                    </span>
                </div>
            )
        });

        return (
            <div className={classes.Users}>
                <h2>Create new user</h2>
                <form id="addUser">
                    <input ref={(ip) => this.myInp = ip} className={classes.UsersInputText} onBlur={this.inputHandler} type="text" name="name" id="name" placeholder="Enter name" />
                    <input className={classes.UsersInputText} onBlur={this.inputHandler} type="text" name="username" id="username" placeholder="Enter username" />
                    <input className={classes.UsersInputText} onBlur={this.inputHandler} type="password" name="password" id="password" placeholder="Enter password" />
                    <h4>Administrator privileges:</h4>
                    <div className={classes.AdminToggleYes}><label htmlFor="admin">Admin</label>
                    <input onClick={this.inputHandler} type="radio" name="user_type" value="admin" id="admin" />
                    <label htmlFor="user1">User1</label>
                    <input onClick={this.inputHandler} type="radio" name="user_type" value="user1" id="user1" />
                    <label htmlFor="user2">User2</label>
                    <input onClick={this.inputHandler} type="radio" name="user_type" value="user2" id="user2" /></div>
                    <div className={classes.UsersPhotoInput}><input onChange={this.inputHandler} type="file" name="photo_url" id="photo_url"/></div>
                </form>
                {
                    (this.state.regEx_message !== '' && this.state.true_message === '') ? 
                    <p className={classes.Message}>{this.state.regEx_message}</p> :
                    <p className={classes.MessageTrue}>{this.state.true_message}</p>
                }
                { 
                    (this.state.updateId === '') ?
                    <button onClick={this.saveHandler}>Save to database</button> : 
                    <button onClick={this.updateHandler}>Update user</button> 
                }
                <h2>All users:</h2>
                <div className={classes.UsersFlex}>
                    {users}
                </div>
                <button onClick={this.showAllUsers}>{this.state.showAll ? 'Hide' : 'Show All'}</button>
            </div>
        )
    }
}

export default Users;