import { useState, useEffect } from 'react';
import { Candidate, Voter, ElectionState, SystemData } from '../types';
import { supabase } from '../lib/supabase';

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

export const fetchSystemData = async () => {
    const [cRes, vRes, sRes] = await Promise.all([
      supabase.from('candidates').select('*').order('created_at', { ascending: true }),
      supabase.from('votes').select('*').order('created_at', { ascending: true }),
      supabase.from('system_settings').select('*').eq('id', 'election').single()
    ]);
    
    if (cRes.data) {
      currentSystemData.candidates = cRes.data.map(c => ({
        id: c.id,
        user_id: c.user_id,
        name: c.name,
        slogan: c.slogan,
        grade: c.grade,
        description: c.description,
        photoUrl: c.photourl || c.photoUrl || '',
        createdAt: new Date(c.created_at).getTime()
      }));
    }
    
    if (vRes.data) {
      currentSystemData.votes = vRes.data.map(v => ({
        id: v.id,
        votedForId: v.voted_for_id,
        name: v.name || 'Anônimo',
        timestamp: new Date(v.created_at).getTime()
      }));
    }
    
    if (sRes.data) {
      currentSystemData.state = { 
        status: sRes.data.status, 
        winner: sRes.data.winner, 
        vice: sRes.data.vice 
      };
    } else {
      currentSystemData.state = DEFAULT_STATE;
    }
    notifyListeners();
};

supabase.channel('public:system_settings').on('postgres_changes', { event: '*', schema: 'public', table: 'system_settings' }, fetchSystemData).subscribe();
supabase.channel('public:candidates').on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, fetchSystemData).subscribe();
supabase.channel('public:votes').on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, fetchSystemData).subscribe();

fetchSystemData();

export const useSystemData = (): SystemData => {
  const [data, setData] = useState<SystemData>(currentSystemData);

  useEffect(() => {
    const listener = () => setData({ ...currentSystemData });
    dataListeners.add(listener);
    setData({ ...currentSystemData });
    return () => {
      dataListeners.delete(listener);
    };
  }, []);

  return data;
};

export const getSystemData = () => currentSystemData;

// Mutations (Async Supabase calls)

export const addCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado, faça login primeiro.");

  const { error } = await supabase.from('candidates').insert({
    user_id: user.id,
    name: candidate.name,
    slogan: candidate.slogan,
    grade: candidate.grade,
    description: candidate.description,
    photoUrl: candidate.photoUrl
  });

  if (error) {
    if (error.code === '23505') throw new Error('Você já possui uma candidatura registrada. (Limite de 1 por conta)');
    throw new Error(error.message);
  }
  fetchSystemData();
};

export const deleteCandidate = async (candidateId: string) => {
  await supabase.from('candidates').delete().eq('id', candidateId);
  fetchSystemData();
};

export const addVote = async (voterName: string, candidateId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado, faça login primeiro.");

  if (currentSystemData.state.status === 'finished') {
    throw new Error('Eleição já foi finalizada.');
  }

  const { error } = await supabase.from('votes').insert({
    user_id: user.id,
    voted_for_id: candidateId,
    name: voterName
  });

  if (error) {
    if (error.code === '23505') throw new Error('Seu voto já foi registrado no sistema. Só é possível votar 1 vez.');
    throw new Error(error.message);
  }
  fetchSystemData();
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

  await supabase.from('system_settings').update(updatePayload).eq('id', 'election');
  fetchSystemData();
};

export const resetElection = async () => {
  // Clear all candidates, votes, and reset system status
  await supabase.from('system_settings').update({ status: 'ongoing', winner: null, vice: null }).eq('id', 'election');
  await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  fetchSystemData();
};
