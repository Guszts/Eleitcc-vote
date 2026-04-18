import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Conta criada com sucesso! Verifique seu email caso necessário e faça login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Google.');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2 truncate">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-gray-500 font-medium mb-8">
          {isLogin ? 'Faça login para participar da eleição' : 'Cadastre-se e deixe a sua marca'}
        </p>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100 text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mail size={16} className="text-gray-600" />
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none font-medium text-gray-900"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Lock size={16} className="text-gray-600" />
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-200 focus:border-gray-600 outline-none font-medium text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all shadow-lg active:translate-y-0 disabled:bg-gray-300"
          >
            {loading ? 'Aguarde...' : (isLogin ? <><LogIn size={20} /> Entrar</> : <><UserPlus size={20} /> Cadastrar</>)}
          </button>
        </form>

        <div className="mt-6">
           <button
             onClick={handleGoogleLogin}
             type="button"
             className="w-full py-4 text-gray-900 bg-white border-2 border-gray-100 hover:border-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
           >
             <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
             Continuar com Google
           </button>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          {isLogin ? "Ainda não tem conta?" : "Já possui conta?"}
          <button 
             onClick={() => setIsLogin(!isLogin)} 
             className="ml-2 pl-2 border-l border-gray-300 font-bold text-gray-900 hover:text-gray-600 transition-colors"
          >
            {isLogin ? "Cadastre-se" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
