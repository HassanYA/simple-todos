import React, {Component} from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
// import {withTracker} from 'meteor/react-meteor-data';
import collect from 'collect.js';

// import {Tasks} from '../api/tasks';

export default class UserTasksSelect extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            tasks: []
        };

        //first render usually has a userId of null
        if (this.props.userId) {
            this.refreshTasks(this.props.userId);
        }
    }

    componentWillReceiveProps(newProps)
    {
        if (newProps.userId) {
            this.refreshTasks(newProps.userId);
        }
    }

    //fetch tasks
    refreshTasks(userId)
    {
        //the only reason why this is not a const is cuz it's funny this way
        let me = this;
        Meteor.call("tasks.forUser", userId, function (error, result) {
            const tasks = error ? []: result;
            me.setState({tasks});
        });
    }

    render()
    {
        return (
            <select>
                {this.state.tasks.map((task) =>
                    <option key={task._id} value={task._id}>
                        {task.text}
                    </option>
                )}
            </select>
        );
    }
}
//
//
// export default withTracker((props)=>{
//     let subscription = Meteor.subscribe('tasks',props.userId);
//     const tasks = subscription.ready() ? Tasks.find({}).fetch() : [];
//     return {
//         tasks,
//     };
// })(UserTasksSelect);