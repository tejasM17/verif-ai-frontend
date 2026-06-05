import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'recruiter',
    display_name: '',
  });
  const { register, loading, error: authError } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData.email, formData.password, formData.display_name, formData.role);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Join VERIF-AI
          </h1>
          <p className="text-gray-400 text-sm">Create your verified academic profile</p>
        </div>

        <div className="bg-[#16161a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f12] border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f12] border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f12] border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === 'student' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-[#0f0f12] border-white/5 text-gray-500 hover:border-white/20'}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'recruiter'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === 'recruiter' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-[#0f0f12] border-white/5 text-gray-500 hover:border-white/20'}`}
                >
                  <Briefcase className="w-4 h-4" />
                  Recruiter
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Already have an account? <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
