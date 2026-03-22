import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { projectAPI, jobAPI } from '../../services/api';
import { getInitials, formatRelativeTime, getSkillColor } from '../../utils/helpers';
import { ROLE_COLORS } from '../../utils/constants';
import ProjectCard from './ProjectCard';
import ActivityFeed from './ActivityFeed';
import SkillGraph from './SkillGraph';
import EduVerification from '../auth/EduVerification';

const StatCard = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, jobData] = await Promise.all([
          projectAPI.getAll({ limit: 6 }),
          jobAPI.recommend().catch(() => ({ jobs: [] })),
        ]);
        setProjects(projData.projects || []);
        setJobs(jobData.jobs || []);
      } catch {
        // data stays empty on error
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  const roleClass = ROLE_COLORS[user?.role] || ROLE_COLORS.student;

  return (
    <div className="space-y-6">
      {/* Verification banner */}
      {user && !user.verified && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <EduVerification email={user.email} />
        </div>
      )}

      {/* Top grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
        >
          <div className="flex flex-col items-center text-center">
            {user?.avatar ? (
              <img src={user.avatar} className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-500/30 mb-3" alt={user.name} />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                {getInitials(user?.name)}
              </div>
            )}
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-1 ${roleClass}`}>
              {user?.role}
            </span>
            {user?.bio && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{user.bio}</p>
            )}
            <div className="w-full border-t border-white/5 mt-4 pt-4 grid grid-cols-3 gap-2">
              <StatCard label="Skills" value={user?.skills?.length || 0} color="text-primary-400" />
              <StatCard label="Projects" value={projects.length} color="text-accent-400" />
              <StatCard label="Jobs" value={jobs.length} color="text-secondary-400" />
            </div>
            {user?.github?.username && (
              <a
                href={`https://github.com/${user.github.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                @{user.github.username}
              </a>
            )}
          </div>
        </motion.div>

        {/* Skill Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SkillGraph githubUsername={user?.github?.username} />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-h-[300px]"
        >
          <ActivityFeed />
        </motion.div>
      </div>

      {/* Projects section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          </div>
          <Link to="/projects" className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 mb-3">No projects yet</p>
            <Link to="/projects" className="text-sm text-primary-400 hover:underline flex items-center gap-1 justify-center">
              <Plus size={14} /> Create the first project
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      {jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recommended Jobs</h2>
            <Link to="/jobs" className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ y: -2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-accent-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{job.company} · {job.type}</p>
                  </div>
                  {job.remote && (
                    <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">Remote</span>
                  )}
                </div>
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills.slice(0, 3).map((s) => (
                      <span key={s} className={`skill-tag ${getSkillColor(s)}`}>{s}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
