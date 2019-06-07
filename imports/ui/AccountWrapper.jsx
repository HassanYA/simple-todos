import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Blaze} from 'meteor/blaze';
import {Template} from 'meteor/templating';

export default class AccountWrapper extends Component
{
    componentDidMount()
    {
        // Use Meteor Blaze to render login buttons
        this.view = Blaze.render(Template.loginButtons,
            ReactDOM.findDOMNode(this.refs.container));
    }

    componentWillUnmount()
    {
        Blaze.remove(this.view);
    }

    render()
    {
        return (
            <span ref="container"/>
        );
    }
}
