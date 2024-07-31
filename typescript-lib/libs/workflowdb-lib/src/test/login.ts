import { IRequest, ProcessRequest, ResponseStatus, ServerFuntionNames, ServerRequest } from '../server/server'

const login_request: IRequest = {
    function: ServerFuntionNames['create/list-values'], params: {
        loginid: 'rvsingh42',
        password: 'test@1'
    }
};
const server_request = ProcessRequest(login_request);
console.log(JSON.stringify(server_request.Response.response));