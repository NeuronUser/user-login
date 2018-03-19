import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { parseQueryString } from '../_common/common';
import { oauthJumpParams, OauthJumpResponse } from '../api/user-private/gen';
import { env } from '../env';
import { apiOauthJump, RootState } from '../redux';

export interface Props {
    oauthJumpResponse: OauthJumpResponse;
    apiOauthJump: (p: oauthJumpParams) => Dispatchable;
}

class OauthJumpPage extends React.Component<Props> {
    public componentWillMount() {
        const query = parseQueryString(window.location.search);
        const code = query.get('code');
        const state = query.get('state');

        this.props.apiOauthJump({
            redirectUri: encodeURIComponent(window.location.origin + env.publicUrl + '/oauthJump'),
            authorizationCode: code ? code : '',
            state: state ? state : ''
        });
    }

    public render() {
        const {oauthJumpResponse} = this.props;
        const {queryString, token, userID} = oauthJumpResponse;
        const {accessToken, refreshToken} = token;
        if (accessToken === '') {
            return null;
        }

        const actionMessage = {
            type: 'onLoginCallback',
            payload: {userID, accessToken, refreshToken}
        };
        window.parent.postMessage(actionMessage, queryString ? queryString : '');

        return null;
    }
}

const selectProps = (rootState: RootState) => ({
    oauthJumpResponse: rootState.oauthJumpResponse,
});

export default connect(selectProps, {
    apiOauthJump,
})(OauthJumpPage);