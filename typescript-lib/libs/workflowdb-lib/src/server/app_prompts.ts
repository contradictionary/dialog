export enum SESSION_PROMTS {
    SESSION_START = "SESSION_START"
}
export enum APP_PROMPT {
    INVALID_LOGIN = 1,
    ALREADY_LOGIN,
    MAX_USER_SESSIONS,
    INVALID_PASSWORD,
    USER_EXPIRED,
    BEGIN_SESSION,
    CHANGE_PASSWORD,
    USER_NOTFOUND,
    INVALID_CREDENTIALS,
    ACCOUNT_LOCKED,
    INVALID_EMAIL,
    PASSWORD_LENGTH,
    REQUIRED_FIELDS,
    SESSION_EXPIRED,
    PASSWORD_CONTAINS_USERNAME,
    PASSWORD_CONTAINS_COMMON_WORD,
    ACCOUNT_SUSPENDED,
    ACCOUNT_DELETED,
    NETWORK,
    UNKNOWN,
    INVALID_SESSION,
    UNSUPPORTED,
    INVALID_DATA,
    ACCESS_DENIED,
    UNAUTHORIZED_ACCESS,
    PERMISSION_DENIED,
    RESTRICTED_ACCESS,
    INSUFFICIENT_PERMISSIONS,
    ACCESS_RESTRICTED,
    FORBIDDEN,
    ACCESS_ERROR,
    RESTRICTED_DATA,
    INSUFFICIENT_PRIVILEGES,
    NOT_ALLOWED = 34,//403 FORBIDDEN
    INVALID_OPTIONS = 35,//400 BAD_REQUEST
    DUPLICATE_RECORD_VALUE = 36,//400 BAD_REQUEST
    DB_CONNECTION_LOST = 37,//400 BAD_REQUEST
}

export const GetPromptMessage = (errorCode: APP_PROMPT) => {
    switch (errorCode) {
        case APP_PROMPT.INVALID_LOGIN:
            return "Invalid login credentials";
        case APP_PROMPT.ALREADY_LOGIN:
            return "User is already logged in";
        case APP_PROMPT.MAX_USER_SESSIONS:
            return "Maximum number of concurrent user sessions reached";
        case APP_PROMPT.INVALID_PASSWORD:
            return "Invalid password";
        case APP_PROMPT.USER_EXPIRED:
            return "User account has expired";
        case APP_PROMPT.INVALID_SESSION:
            return "session expired or invalid! Please login again";
        case APP_PROMPT.CHANGE_PASSWORD:
            return "Please change your password";
        case APP_PROMPT.USER_NOTFOUND:
            return "User not found";
        case APP_PROMPT.INVALID_CREDENTIALS:
            return "Invalid username or password";
        case APP_PROMPT.ACCOUNT_LOCKED:
            return "Account has been locked";
        case APP_PROMPT.INVALID_EMAIL:
            return "Invalid email address";
        case APP_PROMPT.PASSWORD_LENGTH:
            return "Password must be at least 8 characters long";
        case APP_PROMPT.REQUIRED_FIELDS:
            return "Please fill in all required fields";
        case APP_PROMPT.SESSION_EXPIRED:
            return "Session has expired. Please log in again";
        case APP_PROMPT.ACCOUNT_SUSPENDED:
            return "Account has been suspended";
        case APP_PROMPT.ACCOUNT_DELETED:
            return "Account has been deleted";
        case APP_PROMPT.UNSUPPORTED:
            return "Unsupported!";
        case APP_PROMPT.DB_CONNECTION_LOST:
            return "connection to database is lost, please try again after some time";
        case APP_PROMPT.DUPLICATE_RECORD_VALUE:
            return "Record with the same uniqueu value already exists!";
        case APP_PROMPT.INVALID_OPTIONS:
            return "Unsupported options";
        case APP_PROMPT.UNKNOWN:
            return "internal error";
        case APP_PROMPT.INSUFFICIENT_PRIVILEGES:
            return "Insufficient Privileges: You do not have the necessary permissions to access the requested data. Please contact your system administrator for assistance.";
        case APP_PROMPT.ACCESS_DENIED:
            return "Access Denied: Your user account does not have the required privileges to read the specified table. Please ensure you have the correct access rights.";
        case APP_PROMPT.UNAUTHORIZED_ACCESS:
            return "Unauthorized Access: The authenticated user does not have sufficient privileges to perform this operation. Please check your permissions and try again.";
        case APP_PROMPT.PERMISSION_DENIED:
            return "Permission Denied: You have been denied access to the requested table. Please verify your user privileges and try again.";
        case APP_PROMPT.RESTRICTED_ACCESS:
            return "Restricted Access: The requested table is restricted to privileged users only. Please ensure you have the necessary permissions to access it.";
        case APP_PROMPT.INSUFFICIENT_PERMISSIONS:
            return "Insufficient Permissions: Your user account lacks the required privileges to read the specified table. Please contact the system administrator for assistance.";
        case APP_PROMPT.ACCESS_RESTRICTED:
            return "Access Restricted: The table you are trying to access requires higher privileges. Please consult your administrator to obtain the necessary permissions.";
        case APP_PROMPT.FORBIDDEN:
            return "Forbidden: Access to the requested table is forbidden. Please make sure you have the appropriate permissions to read the data.";
        case APP_PROMPT.ACCESS_ERROR:
            return "Access Error: The current user does not have sufficient privileges to read the table. Please check your account permissions and try again.";
        case APP_PROMPT.RESTRICTED_DATA:
            return "Restricted Data: You are not authorized to view the contents of the requested table. Please verify your access rights and try again.";
        default:
            return "error :" + errorCode;
    }
}
