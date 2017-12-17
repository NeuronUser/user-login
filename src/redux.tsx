import { isUndefined } from 'util';
import {
    DefaultApiFactory,
    oauthJump_FAILURE, oauthJump_SUCCESS, OauthJumpParams, OauthJumpResponse, oauthState_FAILURE, oauthState_SUCCESS,
    OauthStateParams
} from './api/user-private/gen/api';
import { Dispatchable, StandardAction } from './_common/action';
import { Dispatch } from 'react-redux';
import { combineReducers } from 'redux';

const userPrivateApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8086/api-private/v1/users' );

export interface RootState {
    oauthState: string;
    oauthJumpResponse: OauthJumpResponse;
}

export function apiOauthState(p: OauthStateParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        userPrivateApi.oauthState(p)
            .then((data) => {
                dispatch({type: oauthState_SUCCESS, payload: data});
            })
            .catch((err) => {
                dispatch({type: oauthState_FAILURE, error: true, payload: err});
            });
    };
}

export function apiOauthJump(p: OauthJumpParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        userPrivateApi.oauthJump(p)
            .then((data) => {
                dispatch({type: oauthJump_SUCCESS, payload: data});
            }).catch((err) => {
            dispatch({type: oauthJump_FAILURE, error: true, payload: err});
        });
    };
}

export function apiRefreshToken() {
    return;
}

export function apiLogout() {
    return;
}

function oauthState(state: string, action: StandardAction): string {
    if (isUndefined(state)) {
        return '';
    }

    switch (action.type) {
        case oauthState_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function oauthJumpResponse(state: OauthJumpResponse, action: StandardAction): OauthJumpResponse {
    if (isUndefined(state)) {
        return {token: '', refreshToken: ''};
    }

    switch (action.type) {
        case oauthJump_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    oauthState,
    oauthJumpResponse
});