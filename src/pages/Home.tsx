import React from 'react';
import { useSystemData } from '../store';
import { SystemData } from '../types';
import { CandidateCard } from '../components/CandidateCard';
import { NavLink } from 'react-router-dom';
import { UserPlus, Vote, ShieldCheck, Info, Award, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function Home() {
  const data = useSystemData();

  if (!data) return null;

  if (data.state.status === 'finished') {
    return (
      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center py-12 px-4 bg-gradient-to-b from-gray-900 to-black rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=2000')] opacity-10 mix-blend-overlay object-cover" />
          <div className="relative z-10">
            {data.state.logoUrl ? (
              <img src={data.state.logoUrl} alt="Logo" className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-3xl object-cover bg-white p-1 drop-shadow-md" />
            ) : (
              <Trophy className="mx-auto text-yellow-300 w-16 h-16 sm:w-24 sm:h-24 mb-6 drop-shadow-md" />
            )}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 drop-shadow-sm">Eleição Encerrada</h1>
            <p className="text-gray-200 text-lg font-medium max-w-lg mx-auto">
              Os votos foram computados. Conheça agora a nossa nova representação escolar.
            </p>
          </div>
        </div>

        {data.state.winner && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Award className="text-yellow-500" />
              Representante Eleito
            </h2>
            <div className="max-w-2xl mx-auto">
              <CandidateCard candidate={data.state.winner} showVotes />
            </div>
          </section>
        )}

        {data.state.vice && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <ShieldCheck className="text-gray-400" />
              Vice-Representante Eleito
            </h2>
            <div className="max-w-2xl mx-auto">
              <CandidateCard candidate={data.state.vice} showVotes />
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-black rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl shadow-black/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000')] opacity-10 mix-blend-overlay object-cover" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            {data.state.logoUrl && (
              <img src={data.state.logoUrl} alt="Logo da Escola" className="w-16 h-16 rounded-2xl object-cover bg-white p-1" />
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Eleição em Andamento
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            O futuro da nossa escola está nas suas mãos.
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium mb-8 max-w-xl leading-relaxed">
            Participe ativamente da escolha da nova representação escolar. Candidate-se ou faça a sua voz ser ouvida através do voto seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink
              to="/votar"
              className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Votar Agora
              <ArrowRight size={20} />
            </NavLink>
            <NavLink
              to="/candidatar"
              className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-black backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Sou Candidato
            </NavLink>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-200 text-gray-900 rounded-2xl">
            <Info size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Como funciona o processo</h2>
            <p className="text-gray-500 font-medium mt-1">Simples, transparente e democrático.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-700">
              <UserPlus size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Candidatura</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Alunos podem se cadastrar com nome, foto e propostas. Mostre suas ideias!
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-900">
              <Vote size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Votação Segura</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Identifique-se com seu nome, escolha seu candidato com atenção e confirme seu voto anonimamente.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Resultados</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              O mais votado será o Representante e o segundo será o Vice. Tudo de forma automática.
            </p>
          </div>
        </div>
      </section>

      {/* Candidatos em destaque */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Candidatos</h2>
            <p className="text-gray-500 font-medium mt-1">Conheça quem quer representar você.</p>
          </div>
        </div>

        {data.candidates.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum candidato ainda</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Seja o primeiro a dar um passo à frente e ajudar a construir uma escola melhor.
            </p>
            <NavLink
              to="/candidatar"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold transition-all"
            >
              Me Candidatar
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.candidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} showVotes />
            ))}
          </div>
        )}
      </section>

      {/* Transparencia block */}
      <section className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tight mb-2">Transparência em primeiro lugar</h2>
          <p className="text-gray-400 max-w-xl font-medium leading-relaxed">
            A eleição será encerrada manualmente via painel administrativo. Após o encerramento, todos os votos serão invalidados e os representantes oficiais serão exibidos imediatamente nesta tela.
          </p>
        </div>
        <ShieldCheck className="text-gray-700 w-24 h-24 shrink-0 hidden md:block" />
      </section>
    </div>
  );
}
