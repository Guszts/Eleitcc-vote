import React, { useState } from 'react';
import { Candidate } from '../types';
import { Modal } from './Modal';
import { getCandidateVotesCount, getAnonymousVotersForCandidate } from '../store';
import { UserCircle, Quote, TrendingUp } from 'lucide-react';

interface CandidateCardProps {
  key?: React.Key;
  candidate: Candidate;
  showVotes?: boolean;
}

export function CandidateCard({ candidate, showVotes = false }: CandidateCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalVotes = getCandidateVotesCount(candidate.id);
  const anonymousVoters = getAnonymousVotersForCandidate(candidate.id);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col items-start p-5 bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-gray-400 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 text-left w-full h-full"
      >
        <div className="flex items-center gap-4 w-full mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-100 group-hover:border-gray-200 transition-colors">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <UserCircle size={32} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{candidate.name}</h3>
            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              Candidato
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed flex-1">
          {candidate.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-900">Total de votos</span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full font-bold shadow-sm">
            {totalVotes}
          </span>
        </div>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalhes do Candidato">
        <div className="space-y-8">
          <div className="flex flex-col items-centertext-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm mx-auto mb-4">
              {candidate.photoUrl ? (
                <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <UserCircle size={48} />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">{candidate.name}</h3>
          </div>

          <div className="bg-gray-100/50 border border-gray-200 rounded-3xl p-6 relative">
            <Quote className="absolute top-4 right-4 text-gray-300/50" size={48} />
            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Por que votar em mim?</h4>
            <p className="text-gray-700 leading-relaxed relative z-10 whitespace-pre-wrap">
              {candidate.description || 'Nenhum detalhe fornecido pelo candidato.'}
            </p>
          </div>

          {showVotes && (
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-gray-900" size={20} />
                  <h4 className="text-lg font-bold text-gray-900 tracking-tight">O que os eleitores dizem</h4>
               </div>
               
               {anonymousVoters.length === 0 ? (
                 <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center">
                   <p className="text-gray-500 font-medium tracking-tight">Nenhum voto registrado ainda.</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {anonymousVoters.map((v, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                       <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                         <UserCircle size={24} />
                       </div>
                       <div>
                         <p className="font-bold text-gray-900 text-sm tracking-tight">Eleitor Anônimo</p>
                         <p className="text-xs text-gray-500">Votou em {new Date(v.timestamp).toLocaleDateString()}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
