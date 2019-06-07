import React, {Component} from 'react';
import {Tasks} from '../api/tasks';
import classnames from 'classnames';

export default class Task extends Component
{
    constructor(props)
    {
        super(props);

        this.toggleCheck = this.toggleCheck.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.togglePrivate = this.togglePrivate.bind(this);
    }

    toggleCheck(event)
    {
        Meteor.call('tasks.setChecked', this.props.task._id, event.target.checked);
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.isPrivate);
    }

    deleteTask()
    {
        Meteor.call('tasks.remove', this.props.task._id, event.target.checked);
    }

    render()
    {
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.isPrivate,
        });

        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteTask}>
                    &times;
                </button>

                <input type="checkbox" onChange={this.toggleCheck}
                       checked={!!this.props.task.checked}/>

                { this.props.showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate}>
                        { this.props.task.isPrivate ? 'Private' : 'Public' }
                    </button>
                ) : ''}

                <span className="text">

                   {this.props.user &&
                   <strong>
                       {this.props.user.username}: &emsp;
                   </strong>
                   }

                    {this.props.task.text}
                </span>
            </li>
        );
    }
}

