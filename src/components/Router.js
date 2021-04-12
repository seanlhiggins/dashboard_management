import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import NotFound from './NotFound';
import StorePicker from './StorePicker';

const Router = ({ route, routeState }) => (
            <Switch>
                <Route exact path='/' render={props=><StorePicker/>}/>
                {/* <Route path='/store/:storeId' render={props=><App/>}/>
                <Route component={NotFound}/> */}
            </Switch>
);

export default Router;