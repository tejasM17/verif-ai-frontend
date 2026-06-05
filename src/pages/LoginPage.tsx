import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Continue your secure verification journey
          </p>
        </div>

        <div className="bg-[#16161a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0f0f12] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder-gray-600 hover:border-white/10"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0f0f12] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder-gray-600 hover:border-white/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              New to VERIF-AI? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create account</Link>
            </p>
          </div>
        </div>

        {/* Footer Trust Note */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-gray-600 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by End-to-End Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
