import React, {Component} from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import collect from 'collect.js';

import {Users} from '../api/users';

import UserTasksSelect from './UserTasksSelect';

class UserTasksForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
          selectedUser: this.users().first()
        };

        this.changeSelectedUser = this.changeSelectedUser.bind(this);
    }

    users()
    {
        return collect(this.props.users).keyBy("_id");
    }

    changeSelectedUser(event) {
        this.setState({
            selectedUser: this.users().all()[event.target.value],
        });
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props;
        if(oldProps.users !== newProps.users) {
            this.setState({
                selectedUser: collect(newProps.users).first()
            });
        }
    }

    render(){
        return (
            <form>
                <select value={this.state.selectedUser ? this.state.selectedUser._id: ''} onChange={this.changeSelectedUser}>
                    {this.props.users.map((user) =>
                        <option value={user._id} key={user._id}>
                            {user.username}
                        </option>
                    )}
                </select>

                <UserTasksSelect userId={this.state.selectedUser ? this.state.selectedUser._id : null}/>
            </form>
        );
    }
}


export default withTracker((props)=>{
    let subscription = Meteor.subscribe('users');
    const users = subscription.ready() ? Users.find({}).fetch() : [];
    return {
        users,
    };
})(UserTasksForm);