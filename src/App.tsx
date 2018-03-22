import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { env } from './env';
import LoginPage from './loginPage/LoginPage';
import OauthJumpPage from './oauthJumpPage/OauthJumpPage';

export default class App extends React.Component {
    public render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={env.webPath + '/oauthJump'} component={OauthJumpPage}/>
                    <Route path="/" component={LoginPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}