import React, { Component } from 'react';
import classes from './App1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFromDatabase, patchToDatabase } from '../../api/api1';

class App1 extends Component {
    state = {
        comments: {},
        selectedLink: '',
        editedCommment: '',
        true_message: ''
    };

    getDatabase = (id) => {
        (async () => {
            const data = await getFromDatabase(`/app1/${id}`);
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
            await patchToDatabase('/app1', app1_id, newComment);
            this.getDatabase(app1_id);
        })();
        this.setState({true_message: '- Successfully updated! -'});
        this.setState({editedCommment: ''});
    };

    render() {
        let commentBox = (this.state.selectedLink !== '' ? 
            <div className={classes.Comment}>
                <div className={classes.Title}>{this.state.selectedLink} - comments:</div>
                <textarea onChange={this.inputHandler} id={`${this.state.selectedLink}`} name="editedCommment"></textarea>
                <div className={classes.Message}>{this.state.true_message}</div>
                <button onClick={this.updateHandler}>Save to database</button>
            </div> : null);

        return (
            <React.Fragment>
                <div className={classes.App1}>
                    <div onClick={() => this.getDatabase('1')} className={classes.AppLink}><div className={classes.icon}><FontAwesomeIcon icon="link" size='3x' /></div>App1Link1</div>
                    <div onClick={() => this.getDatabase('2')} className={classes.AppLink}><div className={classes.icon}><FontAwesomeIcon icon="link" size='3x' /></div>App1Link2</div>
                    <div onClick={() => this.getDatabase('3')} className={classes.AppLink}><div className={classes.icon}><FontAwesomeIcon icon="link" size='3x' /></div>App1Link3</div>
                </div>
                { commentBox }
            </React.Fragment>
        );
    }
};

export default App1;