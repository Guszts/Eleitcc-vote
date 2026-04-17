import React, { useState } from 'react';
import { addVote, useSystemData } from '../store';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ShieldCheck, CheckCircle2, Vote as VoteIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from '../components/Modal';

export function Votar() {
  const [voterName, setVoterName] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();
  
  const data = useSystemData();
  const state = data.state;
  const candidates = data.candidates;

  const handleVote = async () => {
    setError('');
    if (state.status === 'finished') {
      setError('A eleição já foi finalizada.');
      return;
    }
    if (!voterName.trim()) {
      setError('Preencha seu nome completo.');
      setConfirmModal(false);
      return;
    }
    if (!selectedCandidate) {
      setError('Selecione um candidato para votar.');
      setConfirmModal(false);
      return;
    }

    try {
      await addVote(voterName.trim(), selectedCandidate);
      setConfirmModal(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar voto.');
      setConfirmModal(false);
    }
  };

  if (state.status === 'finished') {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Votação Encerrada</h2>
        <p className="text-gray-600 text-lg">A eleição atual já foi finalizada. Consulte os resultados na tela inicial.</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
          <VoteIcon size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Aguarde os candidatos</h2>
        <p className="text-gray-600 text-lg">Não há candidatos registrados no momento. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Voto Registrado!</h2>
        <p className="text-gray-600 text-lg mb-8">Obrigado por participar. Seu voto foi salvo anonimamente na página do candidato.</p>
        <p className="text-sm font-semibold text-gray-400">Redirecionando...</p>
      </div>
    );
  }

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

  return (
    <div className="p-4 sm:p-8 space-y-12 pb-24 max-w-4xl mx-auto">
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-black font-bold mb-2">
          <ShieldCheck size={20} /> Urna Segura
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">Faça sua escolha.</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          O seu voto vai definir o futuro. Preencha seus dados para garantir a segurança do processo, o seu voto será mantido em anonimato.
        </p>
      </section>

      <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 max-w-3xl mx-auto space-y-10">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            Identifique-se
          </label>
          <input
            type="text"
            value={voterName}
            onChange={e => setVoterName(e.target.value)}
            placeholder="Digite o seu nome completo"
            className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none transition-all font-bold text-gray-900 text-lg placeholder:text-gray-400 placeholder:font-medium"
          />
        </div>

        <div className="space-y-4">
          <label className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            Escolha seu candidato
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCandidate(c.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                  selectedCandidate === c.id
                    ? "border-gray-900 bg-gray-100 shadow-md scale-[1.02]"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 bg-white"
                )}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-white flex items-center justify-center">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="text-gray-400" size={24} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{c.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">Toque para selecionar</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (!voterName || !selectedCandidate) {
              setError("Preencha o nome e selecione um candidato.");
              return;
            }
            setConfirmModal(true)
          }}
          disabled={!voterName || !selectedCandidate}
          className="w-full py-5 px-6 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xl shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Confirmar Voto
        </button>
      </div>

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirme seu voto">
        <div className="space-y-8 text-center pb-4">
           <div>
             <p className="text-gray-600 mb-2 font-medium">Você está preste a votar em:</p>
             <h3 className="text-3xl font-black text-black">{selectedCandidateData?.name}</h3>
           </div>
           
           <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
             <p className="text-orange-800 font-bold text-sm">
               Atenção: O voto não pode ser desfeito após a confirmação.
             </p>
           </div>

           <div className="flex gap-4">
             <button onClick={() => setConfirmModal(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors">
               Cancelar
             </button>
             <button onClick={handleVote} className="flex-1 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all">
               Confirmar Voto
             </button>
           </div>
        </div>
      </Modal>

    </div>
  );
}
