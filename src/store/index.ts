import { useState, useEffect } from 'react';
import { Candidate, Voter, ElectionState, SystemData } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, query, addDoc, updateDoc, deleteDoc, getDoc, runTransaction } from 'firebase/firestore';

const DEFAULT_STATE: ElectionState = { status: 'ongoing' };

let currentSystemData: SystemData = {
  candidates: [],
  votes: [],
  state: DEFAULT_STATE,
};

let dataListeners: Set<() => void> = new Set();

function notifyListeners() {
  dataListeners.forEach(l => l());
}

// Global subscriptions to build currentSystemData
const candidatesRef = collection(db, 'candidates');
const votesRef = collection(db, 'votes');
const systemRef = doc(db, 'system', 'election');

onSnapshot(candidatesRef, (snap) => {
  currentSystemData.candidates = snap.docs.map(d => ({ id: d.id, ...d.data() } as Candidate));
  notifyListeners();
});

onSnapshot(votesRef, (snap) => {
  currentSystemData.votes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Voter));
  notifyListeners();
});

onSnapshot(systemRef, (snap) => {
  if (snap.exists()) {
    currentSystemData.state = { status: snap.data().status || 'ongoing', winner: snap.data().winner, vice: snap.data().vice };
  } else {
    currentSystemData.state = DEFAULT_STATE;
  }
  notifyListeners();
});

export const useSystemData = (): SystemData => {
  const [data, setData] = useState<SystemData>(currentSystemData);

  useEffect(() => {
    const listener = () => setData({ ...currentSystemData });
    dataListeners.add(listener);
    setData({ ...currentSystemData }); // Catch any updates during mount
    return () => {
      dataListeners.delete(listener);
    };
  }, []);

  return data;
};

// For synchronous utility reads where hook can't be used (like nested functions if any, but hooks are preferred)
export const getSystemData = () => currentSystemData;

// Mutations (Now Async Firebase calls)

export const addCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
  if (!auth.currentUser) throw new Error("Não autenticado");
  const candidatesRef = collection(db, 'candidates');
  const snap = await getDocs(candidatesRef);
  if (snap.docs.some(d => d.data().name.trim().toLowerCase() === candidate.name.trim().toLowerCase())) {
    throw new Error('Candidato com este nome já cadastrado.');
  }

  const { id: _, ...payload } = candidate as any; // Ignore id if passed somehow
  await setDoc(doc(db, "candidates", crypto.randomUUID()), {
    ...payload,
    createdAt: Date.now(),
  });
};

export const addVote = async (voterName: string, candidateId: string) => {
  if (!auth.currentUser) throw new Error("Não autenticado");
  
  const systemSnap = await getDoc(systemRef);
  if (systemSnap.exists() && systemSnap.data().status === 'finished') {
    throw new Error('Eleição já foi finalizada.');
  }

  await setDoc(doc(db, "votes", crypto.randomUUID()), {
    name: voterName,
    votedForId: candidateId,
    timestamp: Date.now(),
  });
};

export const getCandidateVotesCount = (candidateId: string): number => {
  return currentSystemData.votes.filter(v => v.votedForId === candidateId).length;
};

export const getAnonymousVotersForCandidate = (candidateId: string) => {
  return currentSystemData.votes.filter(v => v.votedForId === candidateId).map(v => ({
    timestamp: v.timestamp,
  }));
};

export const getAdminAuth = (): boolean => {
  return localStorage.getItem('admin_auth') === 'true';
};

export const setAdminAuth = async (isAuth: boolean) => {
  if (isAuth) {
    if (auth.currentUser) {
      await setDoc(doc(db, 'admins', auth.currentUser.uid), { email: 'admin@local' }, { merge: true });
    }
    localStorage.setItem('admin_auth', 'true');
  } else {
    localStorage.removeItem('admin_auth');
  }
};

export const finalizeElection = async () => {
  const data = currentSystemData;
  if (data.state.status === 'finished') return;

  const voteCounts = data.candidates.map(candidate => ({
    ...candidate,
    votes: getCandidateVotesCount(candidate.id)
  }));

  voteCounts.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return a.createdAt - b.createdAt;
  });

  const updatePayload: any = { status: 'finished' };
  
  if (voteCounts.length > 0) {
    const { votes: _, ...winner } = voteCounts[0];
    updatePayload.winner = winner;
  }
  if (voteCounts.length > 1) {
    const { votes: _, ...vice } = voteCounts[1];
    updatePayload.vice = vice;
  }

  await setDoc(systemRef, updatePayload, { merge: true });
};

export const resetElection = async () => {
  // Clear all candidates, votes, and reset system status
  const candidatesSnap = await getDocs(collection(db, 'candidates'));
  const votesSnap = await getDocs(collection(db, 'votes'));
  
  for (const c of candidatesSnap.docs) {
    await deleteDoc(c.ref);
  }
  for (const v of votesSnap.docs) {
    await deleteDoc(v.ref);
  }
  
  await setDoc(systemRef, { status: 'ongoing' });
};
