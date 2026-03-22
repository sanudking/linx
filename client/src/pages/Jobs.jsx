import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Clock, DollarSign, X, Filter, Loader } from 'lucide-react';
import { jobAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import { getSkillColor, formatDate, formatSalary, truncateText } from '../utils/helpers';
import Button from '../components/common/Button';

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'research'];

const JobDetailModal = ({ job, onClose, onApply }) => {
  const { isAuthenticated } = useAuth();
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobAPI.apply(job._id);
      onApply?.(job._id);
      onClose();
    } catch {
      // silently handle
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
          <X size={16} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/30 to-primary-500/30 flex items-center justify-center">
            <Briefcase size={20} className="text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{job.title}</h2>
            <p className="text-gray-400 text-sm">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-3 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">{job.type}</span>
          {job.remote && <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Remote</span>}
          {job.salary && <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{formatSalary(job.salary)}</span>}
          {job.deadline && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
              Deadline: {formatDate(job.deadline)}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-5 whitespace-pre-wrap">{job.description}</p>

        {job.skills?.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 mb-2 font-medium">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className={`skill-tag ${getSkillColor(s)}`}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {job.postedBy && (
          <p className="text-xs text-gray-500 mb-5">
            Posted by <span className="text-gray-300">{job.postedBy.name}</span> · {formatDate(job.createdAt)}
          </p>
        )}

        {isAuthenticated && (
          <Button onClick={handleApply} loading={applying} className="w-full">
            Apply Now
          </Button>
        )}
      </motion.div>
    </div>
  );
};

const JobCard = ({ job, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    onClick={() => onClick(job)}
    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-accent-500/30 hover:shadow-xl transition-all cursor-pointer"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="text-base font-semibold text-white">{job.title}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{job.company}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="px-2.5 py-1 text-xs rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 whitespace-nowrap">{job.type}</span>
        {job.remote && <span className="text-xs text-green-400">Remote</span>}
      </div>
    </div>

    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{truncateText(job.description, 100)}</p>

    {job.skills?.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.skills.slice(0, 3).map((s) => (
          <span key={s} className={`skill-tag ${getSkillColor(s)}`}>{s}</span>
        ))}
        {job.skills.length > 3 && <span className="skill-tag bg-gray-700/50 text-gray-400">+{job.skills.length - 3}</span>}
      </div>
    )}

    <div className="flex items-center justify-between text-xs text-gray-500">
      {job.salary && <span className="flex items-center gap-1"><DollarSign size={11} /> {formatSalary(job.salary)}</span>}
      <span>{formatDate(job.createdAt)}</span>
    </div>
  </motion.div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [allData, recData] = await Promise.all([
          jobAPI.getAll({ limit: 30 }),
          isAuthenticated ? jobAPI.recommend().catch(() => ({ jobs: [] })) : Promise.resolve({ jobs: [] }),
        ]);
        setJobs(allData.jobs || []);
        setRecommended(recData.jobs || []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [isAuthenticated]);

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || j.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-manrope font-bold text-white">Job Board</h1>
          <p className="text-sm text-gray-400 mt-1">Opportunities for students, researchers, and alumni</p>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Recommended for You
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {recommended.slice(0, 4).map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className="min-w-[240px] bg-gradient-to-br from-primary-600/10 to-secondary-600/10 border border-primary-500/20 rounded-2xl p-4 cursor-pointer hover:border-primary-500/40 transition-all"
                >
                  <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.company}</p>
                  {job.skills?.slice(0, 2).map((s) => (
                    <span key={s} className={`skill-tag mr-1 mt-2 inline-block ${getSkillColor(s)}`}>{s}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none"
          >
            <option value="" className="bg-gray-900">All Types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t} className="bg-gray-900">{t.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No jobs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <JobCard key={job._id} job={job} onClick={setSelectedJob} />
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Jobs;
