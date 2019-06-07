import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';


export const Tasks = new Mongo.Collection("tasks");

Tasks.schema = new SimpleSchema({
    text: {type: String},
    checked: {type: Boolean, defaultValue: false},
    isPrivate: {type: Boolean, defaultValue: false},
    userId: {type: String, optional: true},
    createdAt: Date
});

Tasks.attachSchema(Tasks.schema);

if(Meteor.isServer)
{
    Meteor.publish("tasks", function () {
        return Tasks.find({
            $or: [
                { isPrivate: { $ne: true } },
                { userId: this.userId },
            ],
        });
    });
}

Meteor.methods({
    "tasks.insert"(text){
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Tasks.insert({
            text,
            createdAt: new Date(),
            userId: this.userId,
        });
    },

    "tasks.update"(taskId, text, checked){
        const task = Tasks.findOne(taskId);
        if(task.isPrivate && (!this.userId || this.userId != task.userId))
        {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(task._id,{
            $set:{text,checked}
        });
    },

    "tasks.setChecked"(taskId, checked){
        const task = Tasks.findOne(taskId);
        if(task.isPrivate && (!this.userId || this.userId != task.userId))
        {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(task._id,{
            $set:{checked}
        });
    },

    "tasks.setPrivate"(taskId, isPrivate)
    {
        const task = Tasks.findOne(taskId);
        if(task.isPrivate && (!this.userId || this.userId != task.userId))
        {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(task._id,{
            $set:{isPrivate}
        });
    },

    "tasks.remove"(taskId){
        const task = Tasks.findOne(taskId);
        if(task.isPrivate && (!this.userId || this.userId != task.userId))
        {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(task._id);
    },

    "tasks.forUser"(userId){
        return Tasks.find({userId}).fetch();
    }
});