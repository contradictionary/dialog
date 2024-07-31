import { APP_PROMPT, SESSION_PROMTS } from '../server/app_prompts';
import { IRequest, IRquestState, IRquestStateStatus, ResponseStatus, IResponse, ServerRequest, LoginResponse, } from '../server/server';
import { UserStatus } from '../server/system-masters';
const passwords = [
    {
        id: 1,
        userid: 1,
        password: 'test',
        status: 'old',
    },
    {
        id: 2,
        userid: 1,
        password: 'test@1',
        status: 'current',
    },
]
const users = [
    {
        id: 1,
        loginid: 'rvsingh42',
        fname: 'Ravi',
        lname: 'Singh',
        stauts: UserStatus.ENABLED
    }
];

const session: any[] = [];
const sid = (prefix: string | number) => {
    let counter = 0;
    return () => `${prefix}_${++counter}`;
}
const getNextSessionId = sid('SSNID');
const getPassword = (user: any) => passwords.find(s => s.userid == user.id && s.status == 'current');
export function Login(req: ServerRequest) {
    const { Request, Response } = req;
    if (!Request.params) {
        return;
    }
    const { loginid, password } = Request.params;
    const user = users.find(s => s.loginid == loginid)

    if (!user) {
        Response.setErrorCode(APP_PROMPT.USER_NOTFOUND);
        return;
    }

    const savedPwd = getPassword(user);

    if (!savedPwd || savedPwd.password !== password) {
        Response.setErrorCode(APP_PROMPT.INVALID_CREDENTIALS);
        return;
    }

    //password expired
    //change password pending
    //user expired
    //logged-in
    //locked

    const sessionid = getNextSessionId();
    const result = {
        sessionid,
        user
    }
    let loginResponse;
    req.Response = loginResponse = new LoginResponse();

    loginResponse.setData(result);
    loginResponse.setPrompt(SESSION_PROMTS.SESSION_START)
}
export function Logout(req: ServerRequest) {
    const sid = req.Request.params?.sessionid;
    let count = 0;
    if (sid) {
        for (let i = session.length - 1; i >= 0; i--) {
            const element = session[i];
            if (element.sessionid == sid) {
                session.splice(i, 1);
                count++;
            }
        }
    }
    if (!sid || count <= 0) {
        req.Response.setErrorCode(APP_PROMPT.INVALID_SESSION);
        return;
    }

    req.Response.setData('session closed successfully');
}