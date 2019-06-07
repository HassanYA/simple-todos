export const Users = Meteor.users;

if(Meteor.isServer)
{
    Meteor.publish("users", function usersPublication() {
        return Users.find({},{fields:{_id:1,username:1}});
    })
}

Meteor.methods({
    "users.username"(id)
    {
        return Users.findOne(id);
    },

    "users.get"(ids)
    {
        return Users.find({_id:{$in:ids}}).fetch();
    }
});