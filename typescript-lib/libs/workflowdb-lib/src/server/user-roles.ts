import {UserType,UserAgentCategory,agents,UserStatus,UserACL} from './system-masters';
import { agentqueueoutcomes } from './agentqueueoutcomes';

export const userroles = [
    {
        id: 1,
        name: 'bulk-uploader',
        desc: '',
        rolecategory: [UserType.SYSTEM, UserAgentCategory.TASK],
        agentqueue: agentqueueoutcomes.filter(s => s.agent == agents.BULKUPLOAD),
        acls: [],
        status: UserStatus.ENABLED,
    },
    {
        id: 2,
        name: 'maker',
        desc: '',
        rolecategory: [UserType.USER, UserAgentCategory.TASK],
        agentqueue: agentqueueoutcomes.filter(s => s.agent == agents.MAKER),
        acls: [UserACL.DOWNLOAD_FILE, UserACL.VIEW_FILE],
        status: UserStatus.ENABLED,
    },
    {
        id: 3,
        name: 'checker',
        desc: '',
        rolecategory: [UserType.USER, UserAgentCategory.TASK],
        agentqueue: agentqueueoutcomes.filter(s => s.agent == agents.CHECKER),
        acls: [UserACL.DOWNLOAD_FILE, UserACL.VIEW_FILE],
        status: UserStatus.ENABLED,
    },
    {
        id: 4,
        name: 'web dashboard',
        desc: '',
        rolecategory: [UserType.USER, UserAgentCategory.CONTROL],
        agentqueue: agentqueueoutcomes.filter(s => s.agent.category == UserAgentCategory.CONTROL && s.agent.type.includes(UserType.USER)),
        acls: [UserACL.DOWNLOAD_FILE, UserACL.VIEW_FILE],
        status: UserStatus.ENABLED,
    },
    {
        id: 5,
        name: 'publisher',
        desc: '',
        rolecategory: [UserType.SYSTEM, UserAgentCategory.TASK],
        agentqueue: agentqueueoutcomes.filter(s => s.agent == agents.PUBLISHER),
        acls: [],
        status: UserStatus.ENABLED,
    },
];