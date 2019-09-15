import React, { Component } from 'react';
import classes from '../App1/App1.css';
import classes2 from './App2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFromDatabase, patchToDatabase } from '../../api/api2';

class App2 extends Component {
    state = {
        comments: {},
        selectedLink: '',
        editedCommment: '',
        true_message: ''
    };

    getDatabase = (id) => {
        (async () => {
            const data = await getFromDatabase(`/app2/${id}`);
            const comments = data.data;
            this.setState({ comments, selectedLink: comments.link_name});
            document.querySelector(`#${comments.link_name}`).value = comments.comment;
        })();
    };

    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({true_message: ''});
    };

    updateHandler = () => {
        let editedComment = '';
        if (this.state.editedCommment === '') {
            editedComment = this.state.comments.comment;
        } else {
            editedComment = this.state.editedCommment;
        }

        const newComment = {
            link_name: this.state.selectedLink,
            comment: editedComment
        };
        const app1_id = (this.state.selectedLink).slice(4);
        (async () => {
            await patchToDatabase('/app2', app1_id, newComment);
            this.getDatabase(app1_id);
        })();
        this.setState({true_message: '- Successfully updated! -'});
        this.setState({editedCommment: ''});
    };

    render() {
        let commentBox = (this.state.selectedLink !== '' ? 
            <div className={classes.Comment}>
                <div className={[classes.Title, classes2.Title2].join(' ')}>{this.state.selectedLink} - comments:</div>
                <textarea onChange={this.inputHandler} id={`${this.state.selectedLink}`} name="editedCommment"></textarea>
                <div className={classes.Message}>{this.state.true_message}</div>
                <button onClick={this.updateHandler}>Save to database</button>
            </div> : null);

        return (
            <React.Fragment>
                <div className={classes2.App2}>
                    <div onClick={() => this.getDatabase('1')} className={classes.AppLink}><div className={classes.icon}><FontAwesomeIcon icon="link" size='3x' /></div>App2Link1</div>
                    {
                        this.props.loggedUser !== 'user1' ? <div onClick={() => this.getDatabase('2')} className={classes.AppLink}><div className={classes.icon}><FontAwesomeIcon icon="link" size='3x' /></div>App2Link2</div> : null
                    }
                </div>
                { commentBox }
            </React.Fragment>
        );
    }
};

export default App2;