import React, { useState, useEffect } from 'react';
import { getAdminAuth, setAdminAuth, useSystemData } from '../store';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Info, LockKeyhole, ArrowRight, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function Ajustes() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const data = useSystemData();
  const state = data.state;

  useEffect(() => {
    setIsAdmin(getAdminAuth());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'BILFT') {
      try {
        await setAdminAuth(true);
        setIsAdmin(true);
        setError('');
        setPassword('');
        navigate('/admin');
      } catch (err: any) {
        setError(err.message || 'Erro ao autenticar.');
      }
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleLogoutAdmin = async () => {
    await setAdminAuth(false);
    setIsAdmin(false);
  };

  const handleLogoutVoter = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="p-4 sm:p-8 space-y-10 pb-24 max-w-4xl mx-auto">
      <section className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="p-3 bg-gray-100 rounded-2xl">
          <SettingsIcon size={24} className="text-gray-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Ajustes</h1>
          <p className="text-gray-500 font-medium">Configurações da conta, sistema e acesso restrito.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-gray-600" /> Sua Conta
            </h2>
            {user ? (
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium mb-1">Conectado como</p>
                    <p className="text-gray-900 font-bold truncate">{user.email}</p>
                 </div>
                 <button
                   onClick={handleLogoutVoter}
                   className="w-full py-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-red-100"
                 >
                   <LogOut size={18} /> Sair da conta
                 </button>
               </div>
            ) : (
               <div className="space-y-4 text-center py-4 text-gray-500">
                 <p className="font-medium text-sm">Você não está conectado.</p>
                 <button
                   onClick={() => navigate('/auth')}
                   className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold transition-colors"
                 >
                   Fazer Login
                 </button>
               </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info size={20} className="text-gray-600" /> Informações do Sistema
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 font-medium text-sm">Status da Eleição</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${state.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {state.status === 'ongoing' ? 'Em andamento' : 'Finalizada'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 font-medium text-sm">Versão do app</span>
                <span className="text-gray-900 font-bold text-sm">2.0.0</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          {isAdmin ? (
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <LayoutDashboard size={120} />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                    <LockKeyhole size={24} className="text-green-400" />
                 </div>
                 <h2 className="text-2xl font-black mb-2 tracking-tight">Painel Base</h2>
                 <p className="text-gray-400 font-medium mb-8">
                   Você possui uma sessão de administrador ativa.
                 </p>
                 <div className="flex flex-col gap-4">
                   <button
                     onClick={() => navigate('/admin')}
                     className="w-full flex items-center justify-center gap-2 py-4 bg-white text-gray-900 rounded-xl font-bold transition-transform hover:scale-[1.02]"
                   >
                     <LayoutDashboard size={18} /> Acessar Painel
                   </button>
                   <button
                     onClick={handleLogoutAdmin}
                     className="w-full py-4 text-gray-400 hover:text-white font-bold transition-colors"
                   >
                     Encerrar Sessão
                   </button>
                 </div>
               </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                 <LockKeyhole size={24} className="text-gray-600" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">Acesso Administrativo</h2>
              <p className="text-gray-500 font-medium mb-6 text-sm">
                Entre com a credencial segura para gerenciar os resultados e visualizar votos.
              </p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded-lg text-center">{error}</div>
                )}
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Senha administrativa"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none transition-all font-bold tracking-widest text-gray-900 text-center uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:gap-3 shadow-lg"
                >
                  Entrar <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
