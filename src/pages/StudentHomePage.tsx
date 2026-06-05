import React from 'react';
import TopNav from '../components/student/TopNav';
import SearchBar from '../components/student/SearchBar';
import FiltersRow from '../components/student/FiltersRow';
import JobCard, { JobCardProps } from '../components/student/JobCard';
import ProfileSidebar from '../components/student/ProfileSidebar';

const MOCK_JOBS: Omit<JobCardProps, 'animationDelayClass'>[] = [
  {
    company: 'Google',
    logoInitials: 'G',
    logoColor: 'bg-red-500',
    title: 'Senior Frontend Engineer',
    location: 'Bangalore, India',
    type: 'Remote',
    postedAt: '2h ago',
    skills: ['React', 'TypeScript', 'Node.js'],
    salary: '₹40-60 LPA',
  },
  {
    company: 'Flipkart',
    logoInitials: 'F',
    logoColor: 'bg-blue-600',
    title: 'Data Analyst Intern',
    location: 'Bangalore, India',
    type: 'Hybrid',
    postedAt: '4h ago',
    skills: ['Python', 'SQL', 'Pandas'],
    salary: '₹8-12 LPA',
  },
  {
    company: 'Razorpay',
    logoInitials: 'R',
    logoColor: 'bg-indigo-600',
    title: 'Backend Developer',
    location: 'Remote',
    type: 'Full-time',
    postedAt: '6h ago',
    skills: ['FastAPI', 'PostgreSQL', 'Docker'],
    salary: '₹25-35 LPA',
  },
  {
    company: 'Swiggy',
    logoInitials: 'S',
    logoColor: 'bg-orange-500',
    title: 'ML Engineer',
    location: 'Bangalore, India',
    type: 'On-site',
    postedAt: '1d ago',
    skills: ['Python', 'TensorFlow', 'MLflow'],
    salary: '₹30-45 LPA',
  },
];

const StudentHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <TopNav />
      
      <main className="max-w-[1440px] mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0">
          <SearchBar />
          <FiltersRow />

          <div className="mt-8 mb-4">
            <h1 className="text-xl font-bold text-slate-900">Recommended for You</h1>
            <p className="text-sm text-slate-400 mt-1">Based on your verified skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_JOBS.map((job, index) => (
              <JobCard
                key={`${job.company}-${job.title}`}
                {...job}
                animationDelayClass={`animation-delay-${index * 100}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <ProfileSidebar />
      </main>
    </div>
  );
};

export default StudentHomePage;
