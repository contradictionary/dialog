export enum UserType {
    USER = 0,
    SYSTEM = 1,
}

export enum UserAgentCategory {
    TASK = 1,
    READER,
    WRITER,
    CONTROL,
}

export enum UserStatus {
    ENABLED = 0,
    LOCKED,
    LOGGEDIN,
    DISABLED,
    INACTIVE,
    INACTIVE_DISABLED,
    EXPIRED,
    DORMANT
}

export enum Outcome {
    SUCCESS = 0,
    FAILURE,
    EXCEPTION,
}

export enum Queue {
    CREATE = 0,
    SCANNING,
    INDEXING,
    VERIFY,
    PUBLISH,
}

export enum UserACL {
    VIEW_FILE = 1,
    DOWNLOAD_FILE,
}

export interface Agent {
    id: number;
    name: string;
    type: [UserType, UserType?];
    category: UserAgentCategory;
    instances: number,
}

export const agents: { [key: string]: Agent } = {
    MAKER: {
        id: 1,
        name: 'maker',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
        instances: 1,
    },
    CHECKER: {
        id: 2,
        name: 'checker',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
        instances: 1,
    },
    QUERY: {
        id: 3,
        name: 'query',
        type: [UserType.USER],
        category: UserAgentCategory.READER,
        instances: 1,
    },
    DASHBOARD: {
        id: 3,
        name: 'dashboard',
        type: [UserType.USER, UserType.SYSTEM],
        category: UserAgentCategory.READER,
        instances: 1,
    },
    BULKUPLOAD: {
        id: 4,
        name: 'bulkupload',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
        instances: 1,
    },
    PUBLISHER: {
        id: 5,
        name: 'publisher',
        type: [UserType.SYSTEM],
        category: UserAgentCategory.TASK,
        instances: 1,
    },
};