import React from 'react';
import { Shield, Award, GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TrustScore } from '../../types';

interface TrustScoreCardProps {
  trustScore: TrustScore | null;
  isLoading?: boolean;
}

const getTrustScoreColor = (score: number): { bg: string; ring: string; text: string } => {
  if (score >= 80) return { bg: 'from-emerald-500 to-green-600', ring: 'ring-emerald-500/30', text: 'text-emerald-400' };
  if (score >= 60) return { bg: 'from-blue-500 to-cyan-600', ring: 'ring-blue-500/30', text: 'text-blue-400' };
  if (score >= 40) return { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-500/30', text: 'text-amber-400' };
  return { bg: 'from-red-500 to-pink-600', ring: 'ring-red-500/30', text: 'text-red-400' };
};

const getVerdictBadgeVariant = (
  verdict: TrustScore['verdict']
): 'success' | 'info' | 'warning' | 'error' => {
  const v = verdict?.toLowerCase();
  if (v === 'authentic' || v === 'verified') return 'success';
  if (v === 'likely_authentic') return 'info';
  if (v === 'suspicious') return 'warning';
  if (v === 'fake' || v === 'flagged') return 'error';
  return 'info';
};

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({ trustScore, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card bordered className="animate-pulse">
        <CardBody className="flex flex-col items-center py-12 space-y-4">
          <div className="h-40 w-40 bg-slate-800 rounded-full" />
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-20 w-full bg-slate-800 rounded-xl" />
        </CardBody>
      </Card>
    );
  }

  if (!trustScore) {
    return (
      <Card bordered className="bg-slate-900/50 border-dashed border-slate-700">
        <CardBody className="text-center py-16">
          <Shield className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium italic">Complete analysis to generate score</p>
        </CardBody>
      </Card>
    );
  }

  const colors = getTrustScoreColor(trustScore.trust_score);

  return (
    <Card bordered className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Verification Result</h3>
        <Badge variant={getVerdictBadgeVariant(trustScore.verdict)} size="sm">
          {trustScore.verdict?.replace('_', ' ').toUpperCase()}
        </Badge>
      </CardHeader>

      <CardBody className="space-y-8">
        {/* Visual Gauge */}
        <div className="flex flex-col items-center justify-center pt-4">
          <div className={`relative w-44 h-44 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center ring-8 ${colors.ring} shadow-[0_0_50px_-12px] shadow-indigo-500/20`}>
            <div className="text-center">
              <div className="text-6xl font-black text-white tracking-tighter">{trustScore.trust_score}</div>
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">Trust Score</div>
            </div>
            
            {/* Verdict Icon */}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
              {trustScore.trust_score >= 70 ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-400" />
              )}
            </div>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 gap-3">
          <MetricRow 
            icon={Shield} 
            label="Resume Consistency" 
            value={trustScore.resume_score} 
            color="text-blue-400" 
          />
          <MetricRow 
            icon={Award} 
            label="Credential Authenticity" 
            value={trustScore.cert_score} 
            color="text-purple-400" 
          />
          <MetricRow 
            icon={GitBranch} 
            label="Technical Footprint" 
            value={trustScore.github_score} 
            color="text-emerald-400" 
          />
        </div>

        {/* Flags Section */}
        {trustScore.flags && trustScore.flags.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Integrity Alerts</p>
            <div className="space-y-2">
              {trustScore.flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5" />
                  <span className="text-xs text-red-200/70 leading-tight">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-[9px] text-slate-500 font-mono">
            Analysis ID: {trustScore.student_uid.substring(0, 8)}... | 
            {new Date(trustScore.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

const MetricRow = ({ icon: Icon, label, value, color }: any) => (
  <div className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-current ${color}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
      <span className={`text-sm font-black ${color}`}>{value}%</span>
    </div>
  </div>
);

TrustScoreCard.displayName = 'TrustScoreCard';
