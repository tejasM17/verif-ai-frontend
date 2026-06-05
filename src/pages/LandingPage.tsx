import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit, Search, ArrowRight, Github, FileText, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-indigo-500/30 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">VERIF-AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
              Log in
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-6 py-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl w-full text-center relative z-10 animate-fade-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Live Hackathon Demo</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
            Trust, verified by AI.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Upload your resume, certificates, and GitHub. Our AI agents verify your claims and generate an immutable Trust Score for recruiters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)]"
            >
              Verify My Profile
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/10"
            >
              I'm a Recruiter
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 relative z-10">
          {[
            {
              icon: <FileText className="w-6 h-6 text-cyan-400" />,
              title: "Smart Document OCR",
              desc: "Upload PDFs and images. Our models extract and cross-reference your skills instantly."
            },
            {
              icon: <Github className="w-6 h-6 text-purple-400" />,
              title: "Codebase Analysis",
              desc: "Link your GitHub. The AI agent clones, analyzes, and scores the quality of your code."
            },
            {
              icon: <BrainCircuit className="w-6 h-6 text-emerald-400" />,
              title: "Live Agent Streaming",
              desc: "Watch the AI thinking in real-time through our WebSocket-powered research log."
            }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors animate-fade-slide-up"
              style={{ animationDelay: `${idx * 150 + 300}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span className="font-bold tracking-widest text-slate-400">VERIF-AI</span>
        </div>
        <p>© {new Date().getFullYear()} Built for the Hackathon.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
