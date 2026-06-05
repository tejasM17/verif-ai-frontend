import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';
import { Sparkles, ArrowUpRight, TrendingUp, ShieldCheck, FileText } from 'lucide-react';

const DashboardHome = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Overview</h1>
          <p className="text-gray-500">Track your verification status and trust score in real-time.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
          <Sparkles className="w-4 h-4" />
          New Verification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Overall Trust Score', value: '0.0', icon: ShieldCheck, color: 'blue' },
          { label: 'Active Verifications', value: '0', icon: TrendingUp, color: 'purple' },
          { label: 'Success Rate', value: '100%', icon: Sparkles, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#16161a] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon className="w-24 h-24" />
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <div className="mt-4 inline-flex items-center text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +0.0% from last month
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#16161a] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">View All</button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[#0f0f12] rounded-2xl border border-white/5 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-700" />
          </div>
          <p className="text-gray-400 font-medium">No activity records found</p>
          <p className="text-gray-600 text-sm max-w-xs mt-2">Start by uploading your first document to initiate the AI verification process.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Layout>
                <DashboardHome />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
