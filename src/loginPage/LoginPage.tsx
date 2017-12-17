import * as React from 'react';
import { connect } from 'react-redux';
import { apiOauthState, RootState } from '../redux';
import { Dispatchable } from '../_common/action';
import { parseQueryString, valueOrDefault } from '../_common/common';
import {OauthStateParams} from "../api/user-private/gen/api";

const AUTHORIZE_URL = 'http://localhost:3002';
const AUTHORIZE_CLIENT_ID = '10001';
const AUTHORIZE_SCOPE = 'BASIC';

export interface Props {
    oauthState: string;

    apiOauthState: (p: OauthStateParams) => Dispatchable;
}

interface State {
    from: string;
}

class LoginPage extends React.Component<Props, State> {
    componentWillMount() {
        const queryParams = parseQueryString(window.location.search);
        const from = valueOrDefault(queryParams.get('from'));

        this.setState({from: from});

        this.props.apiOauthState({
            queryString: decodeURIComponent(from)
        });
    }

    render() {
        if (this.state.from === '') {
            return (<div>缺少参数：from</div>);
        }

        if (this.props.oauthState != null && this.props.oauthState !== '') {
            window.location.href = AUTHORIZE_URL + '?response_type=code&client_id='
                + encodeURIComponent(AUTHORIZE_CLIENT_ID)
                + '&state=' + encodeURIComponent(this.props.oauthState)
                + '&scope=' + encodeURIComponent(AUTHORIZE_SCOPE)
                + '&redirect_uri='
                + encodeURIComponent(window.location.origin + '/oauthJump');

            return null;
        }
        return null;
    }
}

function selectProps(rootState: RootState) {
    return {
        oauthState: rootState.oauthState
    };
}

export default connect(
    selectProps,
    {
        apiOauthState
    })
(LoginPage);