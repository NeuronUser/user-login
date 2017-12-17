import * as React from 'react';
import { parseQueryString, valueOrDefault } from '../_common/common';
import { OauthJumpParams, OauthJumpResponse } from '../api/user-private/gen/api';
import { Dispatchable } from '../_common/action';
import { apiOauthJump, RootState } from '../redux';
import { connect } from 'react-redux';
import { isUndefined } from 'util';

export interface Props {
    oauthJumpResponse: OauthJumpResponse;

    apiOauthJump(p: OauthJumpParams): Dispatchable;
}

interface State {
    from: string;
    code: string;
    state: string;
}

class OauthJumpPage extends React.Component<Props, State> {
    componentWillMount() {
        const query = parseQueryString(window.location.search);
        const from = valueOrDefault(query.get('from'));
        const code = valueOrDefault(query.get('code'));
        const state = valueOrDefault(query.get('state'));

        this.setState({
            from: from,
            code: code,
            state: state,
        });

        this.props.apiOauthJump({
            redirectUri: encodeURIComponent(window.location.origin + '/oauthJump'),
            authorizationCode: code,
            state: state
        });
    }

    render() {
        if (this.props.oauthJumpResponse != null
            && !isUndefined(this.props.oauthJumpResponse.token)
            && !isUndefined(this.props.oauthJumpResponse.refreshToken)
            && !isUndefined(this.props.oauthJumpResponse.queryString)) {

            const from = this.props.oauthJumpResponse.queryString;
            let href = from;
            if (from.indexOf('?') === -1) {
                href += '?';
            } else {
                href += '&';
            }
            href += 'token=' + encodeURIComponent(this.props.oauthJumpResponse.token)
                + '&refreshToken=' + encodeURIComponent(this.props.oauthJumpResponse.refreshToken);
            window.location.href = href;
        }

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