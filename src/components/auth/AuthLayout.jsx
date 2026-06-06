import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  Zap,
  Award,
  Building2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const metrics = [
  { label: 'Students Placed', value: '12,000+', icon: GraduationCap, color: 'from-primary-400 to-primary-600' },
  { label: 'Active Recruiters', value: '850+', icon: Building2, color: 'from-purple-400 to-purple-600' },
  { label: 'Avg. Salary Hike', value: '65%', icon: TrendingUp, color: 'from-emerald-400 to-emerald-600' },
  { label: 'Success Rate', value: '94%', icon: Zap, color: 'from-amber-400 to-amber-600' },
];

const trustIndicators = [
  'AI-powered candidate matching',
  'Verified student credentials',
  'Enterprise-grade security',
  'Real-time recruitment analytics',
];

const stats = [
  { value: '3,200+', label: 'Companies hiring' },
  { value: '50,000+', label: 'Verified students' },
  { value: '98%', label: 'Satisfaction rate' },
];

export default function AuthLayout({ children }) {
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute left-6 top-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground dark:text-dark-foreground">
            VerifAI
          </span>
        </div>
        <div className="w-full max-w-[440px]">
          {children}
        </div>
        <p className="mt-6 text-xs text-muted dark:text-dark-muted">
          &copy; {new Date().getFullYear()} VerifAI. All rights reserved.
        </p>
      </div>

      <aside className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0f1a] via-[#13132b] to-[#0f0f1a] lg:flex">
        <div className="mesh-gradient-dark absolute inset-0 opacity-80" />

        <div className="relative z-10 mx-auto max-w-[480px] px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Hiring Platform
            </div>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Where Talent
              <br />
              <span className="bg-gradient-to-r from-primary-300 via-purple-300 to-primary-400 bg-clip-text text-transparent">
                Meets Opportunity
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Connect with top recruiters, verify your credentials, and land your dream role with AI-powered matching.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="stat-card text-center"
              >
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="mt-0.5 text-xs text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMetric}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="stat-card flex items-center gap-4"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${metrics[activeMetric].color}`}>
                  {(() => {
                    const Icon = metrics[activeMetric].icon;
                    return <Icon className="h-6 w-6 text-white" />;
                  })()}
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {metrics[activeMetric].value}
                  </div>
                  <div className="text-xs text-white/60">
                    {metrics[activeMetric].label}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 space-y-3"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-white/40">
              <Award className="h-3.5 w-3.5" />
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap gap-2">
              {trustIndicators.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary-400" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} VerifAI. Enterprise Hiring Platform
          </p>
        </div>
      </aside>
    </div>
  );
}