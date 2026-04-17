import React, { useState } from 'react';
import { addCandidate, addVote, getSystemData } from '../store';
import { UserPlus, Vote, PlusCircle } from 'lucide-react';
import { SystemData } from '../types';

export function AdminTools({ onUpdate }: { onUpdate: () => void }) {
  const [candidateName, setCandidateName] = useState('');
  const [description, setDescription] = useState('');
  const [voteCount, setVoteCount] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState('');

  const data = getSystemData();

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !description.trim()) {
      alert("Preencha nome e propostas.");
      return;
    }
    try {
      addCandidate({
        name: candidateName.trim(),
        description: description.trim(),
        photoUrl: ''
      });
      setCandidateName('');
      setDescription('');
      onUpdate();
      alert("Candidato adicionado pelo admin com sucesso!");
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar candidato.');
    }
  };

  const handleAddVotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert("Selecione um candidato");
      return;
    }
    try {
      for (let i = 0; i < voteCount; i++) {
        addVote('Anônimo (Admin)', selectedCandidate);
      }
      setVoteCount(1);
      onUpdate();
      alert(`${voteCount} votos adicionados com sucesso!`);
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar votos.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-12">
      {/* Add Candidate Form */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-gray-500" /> Cadastro Rápido de Candidato
        </h3>
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <input
            type="text"
            placeholder="Nome do candidato"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm font-medium"
          />
          <textarea
            placeholder="Propostas/Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm font-medium"
          />
          <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors">
            <PlusCircle size={16} /> Adicionar Candidato
          </button>
        </form>
      </div>

      {/* Add Votes Form */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Vote size={20} className="text-gray-500" /> Inserção Direta de Votos
        </h3>
        <form onSubmit={handleAddVotes} className="space-y-4">
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm font-medium"
          >
            <option value="">Selecione um candidato</option>
            {data.candidates.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Quantidade:</label>
            <input
              type="number"
              min="1"
              value={voteCount}
              onChange={(e) => setVoteCount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm font-medium"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors">
            <PlusCircle size={16} /> Adicionar Votos
          </button>
        </form>
      </div>
    </div>
  );
}
