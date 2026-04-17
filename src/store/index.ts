import { Candidate, Voter, ElectionState, SystemData } from '../types';

const STORAGE_KEY = 'election_system_data';

const defaultData: SystemData = {
  candidates: [],
  votes: [],
  state: { status: 'ongoing' },
};

export const getSystemData = (): SystemData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return defaultData;
  try {
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
};

export const saveSystemData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addCandidate = (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
  const data = getSystemData();
  // Prevent duplicate exact names
  if (data.candidates.some(c => c.name.trim().toLowerCase() === candidate.name.trim().toLowerCase())) {
    throw new Error('Candidato com este nome já cadastrado.');
  }
  const newCandidate: Candidate = {
    ...candidate,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  data.candidates.push(newCandidate);
  saveSystemData(data);
};

export const addVote = (voterName: string, candidateId: string) => {
  const data = getSystemData();
  if (data.state.status === 'finished') {
    throw new Error('Eleição já foi finalizada.');
  }
  // Allow duplicate voter names (user asked to register who voted, and "quem for candidato também pode votar")
  // For safety against completely repeated "spam", maybe no strict block on voter name unless specified.
  const vote: Voter = {
    id: crypto.randomUUID(),
    name: voterName,
    votedForId: candidateId,
    timestamp: Date.now(),
  };
  data.votes.push(vote);
  saveSystemData(data);
};

export const getCandidateVotesCount = (candidateId: string): number => {
  const data = getSystemData();
  return data.votes.filter(v => v.votedForId === candidateId).length;
};

export const getAnonymousVotersForCandidate = (candidateId: string) => {
  const data = getSystemData();
  return data.votes.filter(v => v.votedForId === candidateId).map(v => ({
    timestamp: v.timestamp,
    // explicitly do not map real name here to enforce anonymity in UI
  }));
};

export const getAdminAuth = (): boolean => {
  return localStorage.getItem('admin_auth') === 'true';
};

export const setAdminAuth = (auth: boolean) => {
  if (auth) {
    localStorage.setItem('admin_auth', 'true');
  } else {
    localStorage.removeItem('admin_auth');
  }
};

export const finalizeElection = () => {
  const data = getSystemData();
  if (data.state.status === 'finished') return;

  const voteCounts = data.candidates.map(candidate => ({
    ...candidate,
    votes: getCandidateVotesCount(candidate.id)
  }));

  voteCounts.sort((a, b) => {
    if (b.votes !== a.votes) {
      return b.votes - a.votes; // descending
    }
    // tie-breaker: oldest registration first
    return a.createdAt - b.createdAt;
  });

  const state: ElectionState = { status: 'finished' };
  
  if (voteCounts.length > 0) {
    const { votes: _, ...winner } = voteCounts[0];
    state.winner = winner;
  }
  if (voteCounts.length > 1) {
    const { votes: _, ...vice } = voteCounts[1];
    state.vice = vice;
  }

  data.state = state;
  saveSystemData(data);
};

export const resetElection = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
};
