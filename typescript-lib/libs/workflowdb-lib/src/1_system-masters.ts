enum UserType {
    USER = 0,
    SYSTEM = 1,
}

enum UserAgentCategory {
    TASK = 1,
    READER,
    WRITER,
    CONTROL,
}

enum UserStatus {
    ENABLED = 0,
    LOCKED,
    LOGGEDIN,
    DISABLED,
    INACTIVE,
    INACTIVE_DISABLED,
    EXPIRED,
    DORMANT
}

enum Outcome {
    SUCCESS = 0,
    FAILURE,
    EXCEPTION,
}

enum Queue {
    CREATE = 0,
    SCANNING,
    INDEXING,
    VERIFY,
    PUBLISH,
}

enum UserACL {
    VIEW_FILE = 1,
    DOWNLOAD_FILE,
}

interface Agent {
    id: number;
    name: string;
    type: [UserType,UserType?];
    category: UserAgentCategory;
}

const agents: { [key: string]: Agent } = {
    MAKER: {
        id: 1,
        name: 'maker',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
    },
    CHECKER: {
        id: 2,
        name: 'checker',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
    },
    QUERY: {
        id: 3,
        name: 'query',
        type: [UserType.USER],
        category: UserAgentCategory.READER,
    },
    DASHBOARD: {
        id: 3,
        name: 'dashboard',
        type: [UserType.USER,UserType.SYSTEM],
        category: UserAgentCategory.READER,
    },
    BULKUPLOAD: {
        id: 4,
        name: 'bulkupload',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
    },
    PUBLISHER: {
        id: 5,
        name: 'publisher',
        type: [UserType.USER],
        category: UserAgentCategory.TASK,
    },
};

const systemagents: Agent[] = [
    agents.PUBLISHER,
];