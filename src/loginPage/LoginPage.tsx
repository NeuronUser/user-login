import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { parseQueryString } from '../_common/common';
import { TextTimestamp } from '../_common/TimedText';
import { oauthStateParams } from '../api/user-private/gen';
import { env } from '../env';
import { apiOauthState, RootState } from '../redux';

const AUTHORIZE_CLIENT_ID = '10001';
const AUTHORIZE_SCOPE = 'BASIC';

export interface Props {
    errorMessage: TextTimestamp;
    oauthState: string;
    apiOauthState: (p: oauthStateParams) => Dispatchable;
}

interface State {
    fromOrigin?: string;
}

class LoginPage extends React.Component<Props, State> {
    private static redirectToAuthorize(oauthState: string) {
        window.location.href = env.host + '/web/oauth/authorize/?response_type=code&client_id='
            + encodeURIComponent(AUTHORIZE_CLIENT_ID)
            + '&state=' + encodeURIComponent(oauthState)
            + '&scope=' + encodeURIComponent(AUTHORIZE_SCOPE)
            + '&redirect_uri='
            + encodeURIComponent(window.location.origin + env.webPath + '/oauthJump');
    }

    public componentWillMount() {
        const queryParams = parseQueryString(window.location.search);
        const fromOrigin = queryParams.get('fromOrigin');

        this.setState({fromOrigin});

        if (fromOrigin && fromOrigin !== '') {
            this.props.apiOauthState({queryString: decodeURIComponent(fromOrigin)});
        }
    }

    public render() {
        const {fromOrigin} = this.state;
        if (!fromOrigin || fromOrigin === '') {
            return (<div>缺少参数：fromOrigin</div>);
        }

        const {errorMessage, oauthState} = this.props;
        if (errorMessage && errorMessage.text !== '') {
            return (
                <div>{errorMessage.text}</div>
            );
        }

        if (oauthState !== '') {
            LoginPage.redirectToAuthorize(oauthState);
            return null;
        }

        return null;
    }
}

const selectProps = (rootState: RootState) => ({
    errorMessage: rootState.errorMessage,
    oauthState: rootState.oauthState
});

export default connect(selectProps, {
    apiOauthState
})(LoginPage);