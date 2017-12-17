import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import LoginPage from './loginPage/LoginPage';
import OauthJumpPage from './oauthJumpPage/OauthJumpPage';

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/oauthJump" component={OauthJumpPage}/>
                    <Route path="/" component={LoginPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}