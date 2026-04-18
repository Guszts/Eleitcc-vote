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

  const paragraphs = candidate.description.split('\n').filter(p => p.trim() !== '');

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col items-start bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-gray-400 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 text-left w-full h-full"
      >
        <div className="p-5 w-full bg-gray-50/50 border-b border-gray-100 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-100 group-hover:border-gray-200 transition-colors bg-white">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full text-gray-400 flex items-center justify-center">
                <UserCircle size={32} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate tracking-tight mb-1">{candidate.name}</h3>
            {candidate.grade ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-600 bg-white shadow-sm uppercase tracking-wider">
                {candidate.grade}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-600 bg-white shadow-sm uppercase tracking-wider">
                Candidato
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col w-full h-full">
           {candidate.slogan && (
             <blockquote className="text-sm font-bold italic text-gray-900 border-l-2 border-gray-900 pl-3 mb-4">
               "{candidate.slogan}"
             </blockquote>
           )}
           <div className="text-gray-600 text-sm leading-relaxed flex-1 w-full flex flex-col gap-2">
             {paragraphs.slice(0, 2).map((p, idx) => (
                <p key={idx} className="line-clamp-2 pl-3 border-l-2 border-gray-200">{p}</p>
             ))}
             {paragraphs.length > 2 && <p className="text-xs text-gray-400 font-bold pl-3 border-l-2 border-transparent">Ler mais...</p>}
           </div>

           <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-between text-sm shrink-0">
             <span className="font-semibold text-gray-500">Votos confirmados</span>
             <span className="bg-gray-900 text-white px-3 py-1 rounded-full font-bold shadow-sm">
               {totalVotes}
             </span>
           </div>
        </div>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalhes do Candidato">
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm mx-auto mb-4">
              {candidate.photoUrl ? (
                <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover bg-white" />
              ) : (
                <div className="w-full h-full bg-gray-50 text-gray-400 flex items-center justify-center">
                  <UserCircle size={48} />
                </div>
              )}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">{candidate.name}</h3>
            {candidate.grade && <span className="inline-block mt-2 bg-gray-100 text-gray-600 font-bold px-3 py-1 text-sm rounded-full">{candidate.grade}</span>}
          </div>

          <div className="bg-white border-y sm:border sm:rounded-3xl border-gray-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Quote size={80} />
            </div>
            
            {candidate.slogan && (
              <h4 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 relative z-10 italic">"{candidate.slogan}"</h4>
            )}

            <div className="space-y-4 relative z-10">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed font-medium pl-4 border-l-2 border-gray-200 py-1">
                  {p}
                </p>
              ))}
              {paragraphs.length === 0 && <p className="text-gray-500 text-sm italic">Nenhum detalhe fornecido.</p>}
            </div>
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
