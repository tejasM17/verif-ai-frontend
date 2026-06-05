import React from 'react';
import SearchBar from '../components/student/SearchBar';
import FiltersRow from '../components/student/FiltersRow';
import JobCard from '../components/student/JobCard';
import ProfileSidebar from '../components/student/ProfileSidebar';
import TopNav from '../components/student/TopNav';

const MOCK_JOB_DATA = [
  {
    companyLogoInitials: 'G',
    companyName: 'Google',
    timeAgo: '2h ago',
    jobTitle: 'Senior Frontend Engineer',
    location: 'Bangalore, India',
    jobType: 'Remote',
    skills: ['React', 'TypeScript', 'Node.js'],
    salaryRange: '₹40-60 LPA',
    logoColor: 'bg-emerald-500'
  },
  {
    companyLogoInitials: 'FK',
    companyName: 'Flipkart',
    timeAgo: '5h ago',
    jobTitle: 'Data Analyst Intern',
    location: 'Bangalore, India',
    jobType: 'Hybrid',
    skills: ['Python', 'SQL', 'Pandas'],
    salaryRange: '₹8-12 LPA',
    logoColor: 'bg-amber-500'
  },
  {
    companyLogoInitials: 'RP',
    companyName: 'Razorpay',
    timeAgo: '1d ago',
    jobTitle: 'Backend Developer',
    location: 'Remote',
    jobType: 'Full-time',
    skills: ['FastAPI', 'PostgreSQL', 'Docker'],
    salaryRange: '₹25-35 LPA',
    logoColor: 'bg-blue-600'
  },
  {
    companyLogoInitials: 'SW',
    companyName: 'Swiggy',
    timeAgo: '2d ago',
    jobTitle: 'ML Engineer',
    location: 'Bangalore, India',
    jobType: 'On-site',
    skills: ['Python', 'TensorFlow', 'MLflow'],
    salaryRange: '₹30-45 LPA',
    logoColor: 'bg-orange-500'
  },
];

const StudentHomePage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <TopNav />

      <div className="flex flex-grow gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN - Main Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 pt-2">
          
          <SearchBar onSearch={handleSearch} />
          
          <div className="overflow-hidden">
            <FiltersRow />
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Recommended for You</h2>
            <p className="text-sm text-slate-500 mb-5">Based on your verified skills</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MOCK_JOB_DATA.map((job, index) => (
                <JobCard key={index} {...job} animationDelay={`${index * 100}ms`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Profile Sidebar */}
        <div className="hidden lg:block pt-2">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
