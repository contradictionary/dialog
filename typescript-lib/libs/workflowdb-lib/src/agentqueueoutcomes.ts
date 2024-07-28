const agentqueueoutcomes = [
    {
        id: 1,
        agent: agents.BULKUPLOAD,
        presentqueue: Queue.CREATE,
        outcome: Outcome.SUCCESS,
        nextqueue: Queue.SCANNING,
    },
    {
        id: 2,
        agent: agents.MAKER,
        presentqueue: Queue.SCANNING,
        outcome: Outcome.SUCCESS,
        nextqueue: Queue.INDEXING,
    },
    {
        id: 3,
        agent: agents.MAKER,
        presentqueue: Queue.INDEXING,
        outcome: Outcome.SUCCESS,
        nextqueue: Queue.VERIFY,
    },
    {
        id: 4,
        agent: agents.CHECKER,
        presentqueue: Queue.VERIFY,
        outcome: Outcome.SUCCESS,
        nextqueue: Queue.PUBLISH,
    },
    {
        id: 5,
        agent: agents.PUBLISHER,
        presentqueue: Queue.VERIFY,
        outcome: Outcome.SUCCESS,
        nextqueue: Queue.CREATE,//history
    },
];
const agentqueueoutcomes_map: Record<string, typeof agentqueueoutcomes> = {};

for (let i = 0; i < agentqueueoutcomes.length; i++) {
    const entry = agentqueueoutcomes[i];
    const key = `${entry.agent.id}_${entry.outcome}`;
    if (!agentqueueoutcomes_map[key]) {
        agentqueueoutcomes_map[key] = [];
    }
    agentqueueoutcomes_map[key].push(entry);
}

const getnextqueue = (agent: { id: number }, outcome: number, withfile = false) => {
    return agentqueueoutcomes_map[`${agent.id}_${outcome}`];
};
const isvalidoutcome = (agent: { id: number }, outcome: number) => {
    return getnextqueue(agent, outcome)?.length > 0;
}