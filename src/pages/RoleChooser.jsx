import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Sparkles } from 'lucide-react';

const roles = [
  {
    id: 'student',
    title: 'I\u2019m a Student',
    description: 'Find internships and jobs from verified recruiters',
    icon: GraduationCap,
    gradient: 'from-primary-500 to-purple-600',
    shadow: 'shadow-primary-500/20',
    path: '/auth/student/signup',
  },
  {
    id: 'recruiter',
    title: 'I\u2019m a Recruiter',
    description: 'Hire verified talent with AI-powered matching',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    path: '/auth/recruiter/signup',
  },
];

export default function RoleChooser() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#13132b] to-[#0f0f1a] p-4">
      <div className="mesh-gradient-dark absolute inset-0 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Join VerifAI
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            How would you like to join?
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Choose the account type that best fits your needs
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              onClick={() => navigate(role.path)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient} ${role.shadow}`}
              >
                <role.icon className="h-7 w-7 text-white" />
              </div>
              <h2 className="mb-1.5 text-xl font-bold text-white">
                {role.title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                {role.description}
              </p>
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${role.gradient} scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
              />
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/auth/student/login')}
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
