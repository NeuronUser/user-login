import { Dispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { Dispatchable, StandardAction } from './_common/action';
import { errorMessageReducer, onApiError } from './_common/redux_error';
import { TextTimestamp } from './_common/TimedText';
import {
    DefaultApiFactory,
    oauthJumpParams, OauthJumpResponse,
    oauthStateParams
} from './api/user-private/gen';
import { env } from './env';
const userPrivateApi = DefaultApiFactory(undefined, fetch, env.host + '/api-private/v1/users');

export interface RootState {
    errorMessage: TextTimestamp;
    oauthState: string;
    oauthJumpResponse: OauthJumpResponse;
}

const OAUTH_STATE_SUCCESS = 'OAUTH_STATE_SUCCESS';
export function apiOauthState(p: oauthStateParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        userPrivateApi.oauthState(p.queryString)
            .then((data) => {
                dispatch({type: OAUTH_STATE_SUCCESS, payload: data});
            })
            .catch((err) => {
                dispatch(onApiError(err, 'userPrivateApi.oauthState'));
            });
    };
}

const OAUTH_JUMP_SUCCESS = 'OAUTH_JUMP_SUCCESS';
export function apiOauthJump(p: oauthJumpParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        userPrivateApi.oauthJump(p.redirectUri, p.authorizationCode, p.state)
            .then((data) => {
                dispatch({type: OAUTH_JUMP_SUCCESS, payload: data});
            }).catch((err) => {
            dispatch(onApiError(err, 'userPrivateApi.oauthJump'));
        });
    };
}

function oauthState(state: string = '', action: StandardAction): string {
    switch (action.type) {
        case OAUTH_STATE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

const initialOauthJumpResponse: OauthJumpResponse = {token: {accessToken: '', refreshToken: ''}, userID : ''};
function oauthJumpResponse(state: OauthJumpResponse= initialOauthJumpResponse,
                           action: StandardAction): OauthJumpResponse {
    switch (action.type) {
        case OAUTH_JUMP_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers<RootState>({
    errorMessage: errorMessageReducer,
    oauthState,
    oauthJumpResponse
});