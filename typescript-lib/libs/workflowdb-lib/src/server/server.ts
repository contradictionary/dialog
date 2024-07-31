import { Login, Logout } from '../functions/authentication';
import { APP_PROMPT, GetPromptMessage, SESSION_PROMTS } from "./app_prompts";
export enum ResponseStatus {
    SUCCESS = 20000,
    FAILED = 40001,
    EXCEPTION = 40002,
    UNHANDLED = 40005,
    INVALID_USERID_PWD = 40301,
}
export enum ServerFuntionNames {
    'user/login',
    'user/logout',
    "create/list-values"
}
export interface IRequest {
    function: ServerFuntionNames
    params?: Record<string, any>,
}
export interface IResponse {
    function: ServerFuntionNames,
    status: ResponseStatus,
    result?: any
}
export enum IRquestStateStatus {
    SUCCESS = 0,
    FAILED,
    ERROR,
}
export interface IRquestState {
    status: IRquestStateStatus,
    message?: string,
}
// import { STATEMENTS } from "../database/db.js";


export const RESPONSE_STATUS_SUCCESS = 'SUCCESS';
export const RESPONSE_STATUS_ERROR = 'ERROR';
//todo: update these
type other_response_fields = ('Test' | 'test2');
type server_respones_type = {
    ERROR?: string,
    DATA?: any,
    errorcode: APP_PROMPT | 0,
}
export class ServerResponse {
    response: server_respones_type = {
        errorcode: 0
    };

    setError(msg: string) {
        this.response.ERROR = msg;
    }
    setErrorCode(errcode: APP_PROMPT) {
        let msg = GetPromptMessage(errcode)
        this.response.ERROR = msg;
        this.response.errorcode = errcode;
    }
    setData(data: any) {
        this.response.DATA = data;
    }
}
interface server_respones_type_login extends server_respones_type {
    PROMPT?: SESSION_PROMTS
}
export class LoginResponse extends ServerResponse {
    response: server_respones_type_login = {
        errorcode: 0,
    }
    constructor() {
        super();
    }
    setPrompt(prmpt: SESSION_PROMTS) {
        this.response.PROMPT = prmpt;
    }
}
export class ServerRequest {
    /**
     * 
     * @param {string} type 
     * @param {any} data request data
     */
    type: ServerFuntionNames
    Request: IRequest
    Response: ServerResponse
    SessionDetails: any
    constructor(req: IRequest) {
        this.type = req.function;
        this.Request = req;
        this.Response = new ServerResponse();
        this.SessionDetails = {};
    }
}


export type IServerFunction = (req: ServerRequest) => void;

export function ProcessRequest(clientRequest: IRequest) {
    const request = new ServerRequest(clientRequest);
    const { type, Response: resp } = request;
    let handler: IServerFunction | null = null;

    switch (type) {
        case ServerFuntionNames['user/login']:
            handler = Login;
            break;

        case ServerFuntionNames['user/logout']:
            handler = Logout
            break;
    }
    if (!handler) {
        resp.setErrorCode(APP_PROMPT.UNSUPPORTED);
        resp.setData(`request type '${ServerFuntionNames[type]}' is not supported`);
    } else {
        try {
            handler(request);
        } catch (error) {
            resp.setErrorCode(APP_PROMPT.UNKNOWN);
        }
    }

    return request;
}