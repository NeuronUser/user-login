import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './loginPage/LoginPage';
import OauthJumpPage from './oauthJumpPage/OauthJumpPage';

export default class App extends React.Component {
    public render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={process.env.PUBLIC_URL + '/oauthJump'} component={OauthJumpPage}/>
                    <Route path="/" component={LoginPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}