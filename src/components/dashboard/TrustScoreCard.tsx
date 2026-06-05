import React from 'react';
import { TrendingUp, Shield, Award, GitBranch } from 'lucide-react';
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

const getLevelBadgeVariant = (
  level: TrustScore['level']
): 'success' | 'info' | 'warning' | 'error' => {
  const variants: Record<TrustScore['level'], 'success' | 'info' | 'warning' | 'error'> = {
    excellent: 'success',
    high: 'info',
    medium: 'warning',
    low: 'error',
  };
  return variants[level];
};

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({ trustScore, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card bordered>
        <CardBody>
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse">
              <div className="h-24 w-24 bg-slate-700 rounded-full" />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!trustScore) {
    return (
      <Card bordered>
        <CardBody className="text-center py-12">
          <p className="text-slate-400">Upload documents to generate trust score</p>
        </CardBody>
      </Card>
    );
  }

  const colors = getTrustScoreColor(trustScore.score);

  return (
    <Card bordered>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">AI Trust Score</h3>
        <Badge variant={getLevelBadgeVariant(trustScore.level)} size="sm">
          {trustScore.level.toUpperCase()}
        </Badge>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Big Score Circle */}
        <div className="flex justify-center">
          <div
            className={`
              relative w-40 h-40 rounded-full bg-gradient-to-br ${colors.bg}
              flex items-center justify-center ring-4 ${colors.ring}
              shadow-lg
            `}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-white">{trustScore.score}</div>
              <div className="text-xs text-white/80 uppercase tracking-widest mt-1">Verified</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Score Breakdown</h4>

          {/* Resume Verification */}
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-slate-300">Resume Verification</span>
            </div>
            <div className="text-sm font-bold text-blue-400">{trustScore.breakdown.resume_verification}%</div>
          </div>

          {/* Certificate Verification */}
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-slate-300">Certificate Verification</span>
            </div>
            <div className="text-sm font-bold text-purple-400">{trustScore.breakdown.certificate_verification}%</div>
          </div>

          {/* GitHub Validation */}
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-green-400" />
              <span className="text-sm text-slate-300">GitHub Validation</span>
            </div>
            <div className="text-sm font-bold text-green-400">{trustScore.breakdown.github_validation}%</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-3 border-t border-slate-600/30 flex items-center justify-between">
          <span className="text-xs text-slate-400">Last Updated</span>
          <span className="text-xs text-slate-300 font-medium">
            {new Date(trustScore.last_updated).toLocaleDateString()}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

TrustScoreCard.displayName = 'TrustScoreCard';
