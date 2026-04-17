import React, { useState } from 'react';
import { addCandidate, getSystemData } from '../store';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { CandidateCard } from '../components/CandidateCard';
import { PhotoSelector } from '../components/PhotoSelector';

export function Candidatar() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const state = getSystemData().state;
  const candidates = getSystemData().candidates;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (state.status === 'finished') {
      setError('A eleição já foi finalizada.');
      return;
    }
    if (!name.trim() || !description.trim()) {
      setError('Nome e justificativa são obrigatórios.');
      return;
    }
    if (description.length < 20) {
      setError('Sua justificativa deve ter pelo menos 20 caracteres.');
      return;
    }

    try {
      addCandidate({
        name: name.trim(),
        description: description.trim(),
        photoUrl: photoUrl.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar candidatura.');
    }
  };

  if (state.status === 'finished') {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <UserPlus size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Eleição Fechada</h2>
        <p className="text-gray-600 text-lg">As candidaturas para esta eleição já foram encerradas.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-20 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Candidatura Registrada!</h2>
        <p className="text-gray-600 text-lg mb-8">Muito obrigado por se colocar à disposição da escola. Boa sorte na eleição!</p>
        <p className="text-sm font-semibold text-gray-400">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-12 pb-24 max-w-4xl mx-auto">
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">Faça a sua parte.</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Ao se candidatar, você assume um compromisso com os alunos da escola. Preencha seus dados com atenção.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <section className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UserPlus size={18} className="text-gray-600" />
                Nome Completo (ou como deseja ser chamado)
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-gray-600" />
                Por que votar em mim? (Suas propostas)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Conte para os eleitores suas ideias, o que você pretende melhorar e por que você é a pessoa certa..."
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
              />
              <p className="text-xs text-gray-400 font-semibold text-right">{description.length} caracteres</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-gray-600" />
                Sua Foto (Opcional, porém recomendado)
              </label>
              <PhotoSelector photoUrl={photoUrl} onChange={setPhotoUrl} />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Confirmar Candidatura
            </button>
          </form>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <div className="bg-gray-100/50 border border-gray-200 rounded-3xl p-8">
             <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Regras de Candidatura</h3>
             <ul className="space-y-4">
               <li className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">1</div>
                 Insira seu nome de forma clara. Nomes repetidos exatamente iguais serão bloqueados.
               </li>
               <li className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">2</div>
                 Preencha o campo de texto de propostas. Os eleitores irão ler isso antes de votar.
               </li>
               <li className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">3</div>
                 Você também poderá votar depois de se candidatar.
               </li>
             </ul>
          </div>

          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight px-2">Quem já se candidatou</h3>
             {candidates.length === 0 ? (
               <p className="text-sm text-gray-500 px-2">Ninguém se candidatou ainda.</p>
             ) : (
               <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
                 {candidates.map(c => (
                   <div key={c.id} className="pointer-events-none">
                      <CandidateCard candidate={c} />
                   </div>
                 ))}
               </div>
             )}
          </div>
        </section>
      </div>
    </div>
  );
}
