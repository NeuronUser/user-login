import * as url from "url";

import * as isomorphicFetch from "isomorphic-fetch";
import * as assign from "core-js/library/fn/object/assign";

interface Dictionary<T> { [index: string]: T; }
export interface FetchAPI { (url: string, init?: any): Promise<any>; }

const BASE_PATH = "http://localhost/api-private/v1/users".replace(/\/+$/, "");

export interface FetchArgs {
    url: string;
    options: any;
}

export class BaseAPI {
    basePath: string;
    fetch: FetchAPI;

    constructor(fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) {
        this.basePath = basePath;
        this.fetch = fetch;
    }
}

export interface InlineResponseDefault {
    "status"?: string;
    /**
     * Error code
     */
    "code"?: string;
    /**
     * Error message
     */
    "message"?: string;
    /**
     * Errors
     */
    "errors"?: Array<InlineResponseDefaultErrors>;
}

export interface InlineResponseDefaultErrors {
    /**
     * field name
     */
    "field"?: string;
    /**
     * error code
     */
    "code"?: string;
    /**
     * error message
     */
    "message"?: string;
}

export interface OauthJumpResponse {
    "token"?: string;
    "refreshToken"?: string;
    "queryString"?: string;
}



export const DefaultApiFetchParamCreator = {
    logout(params: {  "token": string; "refreshToken": string; }, options?: any): FetchArgs {
        // verify required parameter "token" is set
        if (params["token"] == null) {
            throw new Error("Missing required parameter token when calling logout");
        }
        // verify required parameter "refreshToken" is set
        if (params["refreshToken"] == null) {
            throw new Error("Missing required parameter refreshToken when calling logout");
        }
        const baseUrl = `/token/logout`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "token": params["token"],
            "refreshToken": params["refreshToken"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    oauthJump(params: {  "redirectUri": string; "authorizationCode": string; "state": string; }, options?: any): FetchArgs {
        // verify required parameter "redirectUri" is set
        if (params["redirectUri"] == null) {
            throw new Error("Missing required parameter redirectUri when calling oauthJump");
        }
        // verify required parameter "authorizationCode" is set
        if (params["authorizationCode"] == null) {
            throw new Error("Missing required parameter authorizationCode when calling oauthJump");
        }
        // verify required parameter "state" is set
        if (params["state"] == null) {
            throw new Error("Missing required parameter state when calling oauthJump");
        }
        const baseUrl = `/token/oauthJump`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "redirectUri": params["redirectUri"],
            "authorizationCode": params["authorizationCode"],
            "state": params["state"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    oauthState(params: {  "queryString": string; }, options?: any): FetchArgs {
        // verify required parameter "queryString" is set
        if (params["queryString"] == null) {
            throw new Error("Missing required parameter queryString when calling oauthState");
        }
        const baseUrl = `/token/oauthState`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "queryString": params["queryString"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    refreshToken(params: {  "refreshToken": string; }, options?: any): FetchArgs {
        // verify required parameter "refreshToken" is set
        if (params["refreshToken"] == null) {
            throw new Error("Missing required parameter refreshToken when calling refreshToken");
        }
        const baseUrl = `/token/refresh`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "refreshToken": params["refreshToken"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
};


export const DefaultApiFp = {
    logout(params: { "token": string; "refreshToken": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any> {
        const fetchArgs = DefaultApiFetchParamCreator.logout(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    oauthJump(params: { "redirectUri": string; "authorizationCode": string; "state": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<OauthJumpResponse> {
        const fetchArgs = DefaultApiFetchParamCreator.oauthJump(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    oauthState(params: { "queryString": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string> {
        const fetchArgs = DefaultApiFetchParamCreator.oauthState(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    refreshToken(params: { "refreshToken": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string> {
        const fetchArgs = DefaultApiFetchParamCreator.refreshToken(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
};

export class DefaultApi extends BaseAPI {
    logout(params: {  "token": string; "refreshToken": string; }, options?: any) {
        return DefaultApiFp.logout(params, options)(this.fetch, this.basePath);
    }
    oauthJump(params: {  "redirectUri": string; "authorizationCode": string; "state": string; }, options?: any) {
        return DefaultApiFp.oauthJump(params, options)(this.fetch, this.basePath);
    }
    oauthState(params: {  "queryString": string; }, options?: any) {
        return DefaultApiFp.oauthState(params, options)(this.fetch, this.basePath);
    }
    refreshToken(params: {  "refreshToken": string; }, options?: any) {
        return DefaultApiFp.refreshToken(params, options)(this.fetch, this.basePath);
    }
}

export const DefaultApiFactory = function (fetch?: FetchAPI, basePath?: string) {
    return {
        logout(params: {  "token": string; "refreshToken": string; }, options?: any) {
            return DefaultApiFp.logout(params, options)(fetch, basePath);
        },
        oauthJump(params: {  "redirectUri": string; "authorizationCode": string; "state": string; }, options?: any) {
            return DefaultApiFp.oauthJump(params, options)(fetch, basePath);
        },
        oauthState(params: {  "queryString": string; }, options?: any) {
            return DefaultApiFp.oauthState(params, options)(fetch, basePath);
        },
        refreshToken(params: {  "refreshToken": string; }, options?: any) {
            return DefaultApiFp.refreshToken(params, options)(fetch, basePath);
        },
    };
};

export interface LogoutParams {
    token: string;
    refreshToken: string;
}

export interface OauthJumpParams {
    redirectUri: string;
    authorizationCode: string;
    state: string;
}

export interface OauthStateParams {
    queryString: string;
}

export interface RefreshTokenParams {
    refreshToken: string;
}


export const logout_REQUEST = "logout_REQUEST";
export const logout_FAILURE = "logout_FAILURE";
export const logout_SUCCESS = "logout_SUCCESS";
export const oauthJump_REQUEST = "oauthJump_REQUEST";
export const oauthJump_FAILURE = "oauthJump_FAILURE";
export const oauthJump_SUCCESS = "oauthJump_SUCCESS";
export const oauthState_REQUEST = "oauthState_REQUEST";
export const oauthState_FAILURE = "oauthState_FAILURE";
export const oauthState_SUCCESS = "oauthState_SUCCESS";
export const refreshToken_REQUEST = "refreshToken_REQUEST";
export const refreshToken_FAILURE = "refreshToken_FAILURE";
export const refreshToken_SUCCESS = "refreshToken_SUCCESS";

