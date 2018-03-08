import * as React from 'react';
import { connect } from 'react-redux';
import { StandardAction } from '../../../../NeuronEvolution/todo-web/src/_common/action';
import { Dispatchable } from '../_common/action';
import { parseQueryString } from '../_common/common';
import { oauthJumpParams, OauthJumpResponse } from '../api/user-private/gen';
import { apiOauthJump, RootState } from '../redux';

export interface Props {
    oauthJumpResponse: OauthJumpResponse;
    apiOauthJump(p: oauthJumpParams): Dispatchable;
}

interface State {
    code?: string;
    state?: string;
}

class OauthJumpPage extends React.Component<Props, State> {
    public componentWillMount() {
        const query = parseQueryString(window.location.search);
        const code = query.get('code');
        const state = query.get('state');

        this.setState({
            code,
            state,
        });

        this.props.apiOauthJump({
            redirectUri: encodeURIComponent(window.location.origin + '/oauthJump'),
            authorizationCode: code ? code : '',
            state: state ? state : ''
        });
    }

    public render() {
        const oauthJumpResponse = this.props.oauthJumpResponse;
        if (!oauthJumpResponse) {
            return null;
        }

        const origin = oauthJumpResponse.queryString ? oauthJumpResponse.queryString : '';
        const token = oauthJumpResponse.token;

        const actionMessage: StandardAction = {
            type: 'onLoginCallback'
        };

        if (origin === '' || token.accessToken === '' || token.refreshToken === '') {
            actionMessage.error = true;
            actionMessage.payload = Error('登录失败');
        } else {
            actionMessage.payload = {
                userID: oauthJumpResponse.userID,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            };
        }

        window.parent.postMessage(actionMessage, origin);

        return null;
    }
}

function selectProps(rootState: RootState) {
    return {
        oauthJumpResponse: rootState.oauthJumpResponse,
    };
}

export default connect(selectProps, {
    apiOauthJump,
})(OauthJumpPage);