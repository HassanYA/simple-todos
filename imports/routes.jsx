import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import {render} from 'react-dom';
import App from './ui/App';

Meteor.startup(()=>{
    render(
        <BrowserRouter>
            <Route path="/" component={App} />
        </BrowserRouter>,
        document.getElementById("render-target")
    );
});