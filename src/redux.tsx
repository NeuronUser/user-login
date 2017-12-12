import { AnyAction, combineReducers } from 'redux';
import { isUndefined } from 'util';
import { Dispatchable } from './_common/common';
import { DefaultApiFactory } from './api/user-private/gen/api';

const userPrivateApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8086/api-private/v1/users' );

export interface RootState {
    oauthState: string;
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
}

const ON_ERROR_MESSAGE = 'ON_ERROR_MESSAGE';
export function errorMessage( params: {message: string} ): AnyAction {
    return {
        type: ON_ERROR_MESSAGE,
        error: true,
        payload: {
            errorMessage: params.message
        },
    };
}

export function dispatchResponseError(dispatch: (action: AnyAction) => void , actionType: string, payload: {}) {
    dispatch({type: actionType, error: true, payload: payload});
    dispatch(errorMessage({message: JSON.stringify(payload)}));
}

export function errorFromResponse(response: {}): Promise<ApiError> {
    if (response instanceof Response) {
        return response.json().then((json: ApiError) => {
            return json;
        }).catch((err: {}) => {
            return {status: response.status, code: 'NetworkException', message: err.toString()};
        });
    } else if (response instanceof TypeError) {
        if (response.message === 'Failed to fetch') {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: '连接失败，请检查网络'});
            });
        } else {
            return new Promise(function (resolve: (err: ApiError) => void) {
                resolve({status: 8193, code: 'NetworkException', message: response.toString()});
            });
        }
    } else {
        return new Promise(function (resolve: (err: ApiError) => void) {
            resolve({status: 8193, code: 'NetworkException', message: '未知错误 response:' + response});
        });
    }
}

export const OAUTH_STATE_REQUEST = 'OAUTH_STATE_REQUEST';
export const OAUTH_STATE_SUCCESS = 'OAUTH_STATE_SUCCESS';
export const OAUTH_STATE_FAILURE = 'OAUTH_STATE_FAILURE';
export function apiOauthState(): Dispatchable {
    return function (dispatch: (action: AnyAction) => void) {
        dispatch({type: OAUTH_STATE_REQUEST});
        return userPrivateApi.newOauthState()
            .then((data: {}) => {
                dispatch({type: OAUTH_STATE_SUCCESS, payload: data});
            })
            .catch((response: {}) => {
                errorFromResponse(response).then((err) => {
                    dispatchResponseError(dispatch, OAUTH_STATE_FAILURE, err);
                });
            });
    };
}
function oauthState(state: string, action: AnyAction): string {
    if (isUndefined(state)) {
        return '';
    }

    switch (action.type) {
        case '':
            return action.payload;
        default:
            return state;
    }
}

export const OAUTH_JUMP_REQUEST = 'OAUTH_JUMP_REQUEST';
export const OAUTH_JUMP_FAILURE = 'OAUTH_JUMP_FAILURE';
export const OAUTH_JUMP_SUCCESS = 'OAUTH_JUMP_SUCCESS';
export function apiOauthJump() {
    return;
}
export const REFRESH_TOKEN__REQUEST = 'REFRESH_TOKEN__REQUEST';
export const REFRESH_TOKEN__FAILURE = 'REFRESH_TOKEN__FAILURE';
export const REFRESH_TOKEN__SUCCESS = 'REFRESH_TOKEN__SUCCESS';
export function apiRefreshToken() {
    return;
}

export function apiLogout() {
    return;
}

export const rootReducer = combineReducers({
    oauthState
});