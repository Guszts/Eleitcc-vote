import React, { useState, useEffect } from 'react';
import { useSystemData, finalizeElection, resetElection, getAdminAuth, getCandidateVotesCount, addCandidate, addVote } from '../store';
import { useNavigate } from 'react-router-dom';
import { SystemData, Candidate } from '../types';
import { Modal } from '../components/Modal';
import { AlertTriangle, Users, Vote as VoteIcon, Activity, Trophy, RefreshCcw, LogOut, Search, Clock, CheckCircle2, UserCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { CandidateCard } from '../components/CandidateCard';
import { PhotoSelector } from '../components/PhotoSelector';

export function AdminPanel() {
  const data = useSystemData();
  const [confirmFinalize, setConfirmFinalize] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showAddVote, setShowAddVote] = useState(false);

  // Forms states
  const [candidateName, setCandidateName] = useState('');
  const [candidateDesc, setCandidateDesc] = useState('');
  const [candidatePhoto, setCandidatePhoto] = useState('');
  const [candidateError, setCandidateError] = useState('');

  const [voterName, setVoterName] = useState('');
  const [voterSelectedCandidate, setVoterSelectedCandidate] = useState('');
  const [voterError, setVoterError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate('/ajustes');
      return;
    }
  }, [navigate]);

  const handleFinalize = async () => {
    await finalizeElection();
    setConfirmFinalize(false);
  };

  const handleReset = async () => {
    await resetElection();
    setConfirmReset(false);
  };

  const handleManualAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCandidateError('');
    if (!candidateName.trim() || !candidateDesc.trim()) {
      setCandidateError('Nome e descrição são obrigatórios.');
      return;
    }
    try {
      await addCandidate({
        name: candidateName.trim(),
        description: candidateDesc.trim(),
        photoUrl: candidatePhoto
      });
      setShowAddCandidate(false);
      setCandidateName('');
      setCandidateDesc('');
      setCandidatePhoto('');
    } catch (err: any) {
      setCandidateError(err.message || 'Erro ao adicionar.');
    }
  };

  const handleManualAddVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoterError('');
    if (!voterName.trim() || !voterSelectedCandidate) {
      setVoterError('Preencha nome e selecione o candidato.');
      return;
    }
    try {
      await addVote(voterName.trim(), voterSelectedCandidate);
      setShowAddVote(false);
      setVoterName('');
      setVoterSelectedCandidate('');
    } catch (err: any) {
      setVoterError(err.message || 'Erro ao votar.');
    }
  };

  if (!data) return null;

  // Sorting candidates for the ranking
  const sortedCandidates = [...data.candidates].sort((a, b) => {
    const votesA = getCandidateVotesCount(a.id);
    const votesB = getCandidateVotesCount(b.id);
    if (votesB !== votesA) return votesB - votesA;
    return a.createdAt - b.createdAt; // Tie-breaker by registration date
  });

  return (
    <div className="p-4 sm:p-8 pb-32 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             Painel Administrativo
          </h1>
          <p className="text-gray-500 font-medium">Controle total sobre o processo eleitoral.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
           <button onClick={() => setShowAddCandidate(true)} className="p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors tooltip flex items-center gap-2 font-bold text-sm border border-gray-200">
             <Plus size={18} /> Candidato Manual
           </button>
           <button onClick={() => setShowAddVote(true)} className="p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors tooltip flex items-center gap-2 font-bold text-sm border border-gray-200">
             <Plus size={18} /> Voto Manual
           </button>
           <button onClick={() => setConfirmReset(true)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors tooltip flex items-center gap-2 font-bold text-sm">
             <RefreshCcw size={18} /> Resetar
           </button>
        </div>
      </header>

      {/* Estatisticas Gerais */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
             <Users size={24} />
           </div>
           <div>
             <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Candidatos</p>
             <p className="text-3xl font-black text-gray-900">{data.candidates.length}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
             <VoteIcon size={24} />
           </div>
           <div>
             <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Votos Registrados</p>
             <p className="text-3xl font-black text-gray-900">{data.votes.length}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", data.state.status === 'ongoing' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600')}>
             <Activity size={24} />
           </div>
           <div>
             <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Status</p>
             <p className="text-2xl font-black text-gray-900">
               {data.state.status === 'ongoing' ? 'Em andamento' : 'Finalizada'}
             </p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Controle da eleicao & Ranking */}
        <section className="space-y-8">
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl">
              <h2 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-2">
                <Trophy size={24} className="text-yellow-400" /> Controle de Eleição
              </h2>
              <p className="text-gray-300 font-medium mb-8 leading-relaxed text-sm">
                Ao finalizar a eleição, candidaturas e votações serão bloqueadas. O sistema calculará automaticamente o 1º e 2º colocados, levando em consideração a ordem de candidatura em caso de empates.
              </p>
              {data.state.status === 'ongoing' ? (
                <button
                  onClick={() => setConfirmFinalize(true)}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors text-lg shadow-lg"
                >
                  Finalizar Eleição Agora
                </button>
              ) : (
                <div className="w-full py-4 bg-white/10 text-white/50 rounded-xl font-bold border border-white/10 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Eleição Fechada
                </div>
              )}
           </div>

           <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-xl tracking-tight">Ranking Parcial</h3>
                <span className="text-xs font-bold bg-gray-200 text-black px-3 py-1 rounded-full">Automático</span>
             </div>
             
             {sortedCandidates.length === 0 ? (
               <div className="p-8 text-center text-gray-500 font-medium">Nenhum candidato registrado.</div>
             ) : (
               <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                 {sortedCandidates.map((c, idx) => {
                   const votes = getCandidateVotesCount(c.id);
                   return (
                     <div key={c.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                       <span className="text-2xl font-black text-gray-300 w-8 text-right shrink-0">{idx + 1}º</span>
                       <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                         {c.photoUrl ? <img src={c.photoUrl} alt="" className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full p-2 text-gray-400" />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-gray-900 truncate">{c.name}</p>
                         <p className="text-xs text-gray-500">Inscrito em: {new Date(c.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                         <span className="block text-2xl font-black text-gray-900">{votes}</span>
                         <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">votos</span>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
           </div>
        </section>

        {/* Lista de Votantes (Auditoria) */}
        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col max-h-[850px]">
           <div className="p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none mb-1">Relação de Eleitores</h3>
                <p className="text-sm font-medium text-gray-500">Acesso exclusivo do painel.</p>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 shadow-sm">
                 <Search size={18} />
              </div>
           </div>
           
           {data.votes.length === 0 ? (
             <div className="p-12 text-center text-gray-500 font-medium flex-1 flex items-center justify-center">Nenhum voto computado ainda.</div>
           ) : (
             <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-2">
               {[...data.votes].reverse().map(vote => {
                 const candidate = data.candidates.find(c => c.id === vote.votedForId);
                 return (
                   <div key={vote.id} className="p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                     <div className="flex items-start justify-between mb-2">
                       <span className="font-bold text-gray-900">{vote.name}</span>
                       <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                         <Clock size={12} /> {new Date(vote.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 bg-gray-100/50 border border-gray-200 rounded-xl max-w-max">
                       <VoteIcon size={14} className="text-gray-600" />
                       <span className="text-sm font-semibold text-black">
                         Votou em: <span className="font-bold">{candidate?.name || 'Desconhecido'}</span>
                       </span>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </section>
      </div>

      <Modal isOpen={confirmFinalize} onClose={() => setConfirmFinalize(false)} title="Finalizar Eleição">
         <div className="space-y-6 text-center pb-4">
           <AlertTriangle className="mx-auto text-yellow-500 w-16 h-16" />
           <p className="text-gray-900 font-medium text-lg leading-relaxed">
             Deseja mesmo finalizar a eleição? Esta ação encerrará as opções de voto e calculará os resultados definitivos.
           </p>
           <div className="flex gap-4 pt-4">
             <button onClick={() => setConfirmFinalize(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
               Cancelar
             </button>
             <button onClick={handleFinalize} className="flex-1 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all">
               Sim, Finalizar
             </button>
           </div>
         </div>
      </Modal>

      <Modal isOpen={confirmReset} onClose={() => setConfirmReset(false)} title="Resetar Todo o Sistema">
         <div className="space-y-6 text-center pb-4">
           <AlertTriangle className="mx-auto text-red-500 w-16 h-16" />
           <p className="text-red-600 font-black text-xl mb-2">Atenção Extrema</p>
           <p className="text-gray-900 font-medium leading-relaxed">
             Você vai deletar TODOS os dados: candidatos, votos e configurações. O sistema ficará vazio como se estivesse novo. NADA poderá ser recuperado.
           </p>
           <div className="flex gap-4 pt-4">
             <button onClick={() => setConfirmReset(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
               Mudei de Ideia
             </button>
             <button onClick={handleReset} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all">
               APAGAR TUDO
             </button>
           </div>
         </div>
      </Modal>

      <Modal isOpen={showAddCandidate} onClose={() => setShowAddCandidate(false)} title="Adicionar Candidato Manual">
         <form onSubmit={handleManualAddCandidate} className="space-y-4 pb-4">
           {candidateError && <div className="text-red-600 bg-red-50 p-2 font-bold text-sm rounded-lg text-center">{candidateError}</div>}
           <div>
             <label className="text-sm font-bold text-gray-900 block mb-2">Nome</label>
             <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Nome do Candidato" />
           </div>
           <div>
             <label className="text-sm font-bold text-gray-900 block mb-2">Justificativa</label>
             <textarea value={candidateDesc} onChange={e => setCandidateDesc(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none h-24" placeholder="Propostas..." />
           </div>
           <div>
             <label className="text-sm font-bold text-gray-900 block mb-2">Foto</label>
             <PhotoSelector photoUrl={candidatePhoto} onChange={setCandidatePhoto} />
           </div>
           <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg mt-4">
             Adicionar Candidato
           </button>
         </form>
      </Modal>

      <Modal isOpen={showAddVote} onClose={() => setShowAddVote(false)} title="Registrar Voto Manual">
         <form onSubmit={handleManualAddVote} className="space-y-4 pb-4">
           {voterError && <div className="text-red-600 bg-red-50 p-2 font-bold text-sm rounded-lg text-center">{voterError}</div>}
           <div>
             <label className="text-sm font-bold text-gray-900 block mb-2">Nome do Eleitor</label>
             <input type="text" value={voterName} onChange={e => setVoterName(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Nome completo" />
           </div>
           <div>
             <label className="text-sm font-bold text-gray-900 block mb-2">Candidato</label>
             <select value={voterSelectedCandidate} onChange={e => setVoterSelectedCandidate(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium">
               <option value="" disabled>Selecione um candidato</option>
               {data.candidates.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
           </div>
           <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg mt-4">
             Registrar Voto
           </button>
         </form>
      </Modal>
    </div>
  );
}
