import { Dispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { isUndefined } from 'util';
import { Dispatchable, StandardAction } from './_common/action';
import {
    DefaultApiFactory,
    oauthJumpParams, OauthJumpResponse,
    oauthStateParams
} from './api/user-private/gen';

const userPrivateApi = DefaultApiFactory(undefined, fetch, 'http://127.0.0.1:8086/api-private/v1/users');

export interface RootState {
    oauthState: string;
    oauthJumpResponse: OauthJumpResponse;
}

const OAUTH_STATE_SUCCESS = 'OAUTH_STATE_SUCCESS';
const OAUTH_STATE_FAILURE = 'OAUTH_STATE_FAILURE';
export function apiOauthState(p: oauthStateParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        userPrivateApi.oauthState(p.queryString)
            .then((data) => {
                dispatch({type: OAUTH_STATE_SUCCESS, payload: data});
            })
            .catch((err) => {
                dispatch({type: OAUTH_STATE_FAILURE, error: true, payload: err});
            });
    };
}

const OAUTH_JUMP_SUCCESS = 'OAUTH_JUMP_SUCCESS';
const OAUTH_JUMP_FAILURE = 'OAUTH_JUMP_FAILURE';
export function apiOauthJump(p: oauthJumpParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        userPrivateApi.oauthJump(p.redirectUri, p.authorizationCode, p.state)
            .then((data) => {
                dispatch({type: OAUTH_JUMP_SUCCESS, payload: data});
            }).catch((err) => {
            dispatch({type: OAUTH_JUMP_FAILURE, error: true, payload: err});
        });
    };
}

function oauthState(state: string, action: StandardAction): string {
    if (isUndefined(state)) {
        return '';
    }

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

export const rootReducer = combineReducers({
    oauthState,
    oauthJumpResponse
});