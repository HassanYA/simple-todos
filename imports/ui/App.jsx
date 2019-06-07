import React, {Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import collect from 'collect.js';

import {Tasks} from '../api/tasks';
import {Users} from '../api/users';

import UserTasksForm from './UserTasksForm';
import Task from './Task';
import AccountWrapper from './AccountWrapper';

// App component - represents the whole app
class App extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            newTask: "",
            hideCompleted: false,
        };

        this.submitForm = this.submitForm.bind(this);
        this.newTaskChangeListener = this.newTaskChangeListener.bind(this);
        this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    }

    submitForm()
    {
        event.preventDefault();
        Meteor.call('tasks.insert', this.state.newTask);
        this.setState({newTask: ""});
    }

    newTaskChangeListener(event)
    {
        this.setState({
            newTask: event.target.value,
        });
    }

    toggleHideCompleted()
    {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks()
    {
        let tasks = this.props.tasks;
        if (this.state.hideCompleted) {
            tasks = tasks.filter((task) => !task.checked);
        }

        return tasks.map((task) => {
            const userId = this.props.currentUser ? this.props.currentUser._id : null;
            const showPrivateButton = userId === task.userId;
            const user = collect(this.props.users)
                .where("_id",task.userId)
                .first();
            return (
                <Task key={task._id} task={task} user={user} showPrivateButton={showPrivateButton}/>
            );
        });
    }

    render()
    {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>
                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountWrapper/>

                    <form onSubmit={this.submitForm}>
                        <input type="text" ref="newTask" value={this.state.newTask}
                               onChange={this.newTaskChangeListener} placeholder="Add a New Task"/>
                    </form>
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>

                <UserTasksForm/>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("tasks");
    Meteor.subscribe("users");
    const tasks = Tasks.find({}, {sort: {createdAt: -1}}).fetch();
    const users = Users.find({_id:{$in: collect(tasks).pluck("userId").toArray()}}).fetch();
    return {
        tasks,
        users,
        incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
        currentUser: Meteor.user()
    };
})(App);