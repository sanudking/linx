import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Github, ExternalLink, MessageCircle, Filter } from 'lucide-react';
import { userAPI } from '../services/api';
import { getInitials, getSkillColor } from '../utils/helpers';
import { ROLE_COLORS } from '../utils/constants';

const AlumniCard = ({ user }) => {
  const roleClass = ROLE_COLORS[user.role] || ROLE_COLORS.student;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-secondary-500/30 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary-500/20" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(user.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
            {user.verified && (
              <div className="w-4 h-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              </div>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleClass}`}>
            {user.role}
          </span>
        </div>
      </div>

      {user.bio && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{user.bio}</p>
      )}

      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {user.skills.slice(0, 4).map((s) => (
            <span key={s} className={`skill-tag ${getSkillColor(s)}`}>{s}</span>
          ))}
          {user.skills.length > 4 && (
            <span className="skill-tag bg-gray-700/50 text-gray-400">+{user.skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {user.github?.username && (
          <a
            href={`https://github.com/${user.github.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
          >
            <Github size={13} />
          </a>
        )}
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary-600/20 text-secondary-400 hover:bg-secondary-600/30 border border-secondary-500/20 transition-all">
          <MessageCircle size={12} />
          Connect
        </button>
      </div>
    </motion.div>
  );
};

const Alumni = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const data = await userAPI.searchUsers({ ...params, limit: 50 });
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers({ query: search, role: roleFilter });
  };

  const stats = [
    { label: 'Total Members', value: users.length },
    { label: 'Alumni', value: users.filter((u) => u.role === 'alumni').length },
    { label: 'Professors', value: users.filter((u) => u.role === 'professor').length },
    { label: 'Students', value: users.filter((u) => u.role === 'student').length },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-manrope font-bold text-white">Alumni Network</h1>
          <p className="text-sm text-gray-400 mt-1">Connect with students, professors, and alumni</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or skills..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); fetchUsers({ query: search, role: e.target.value }); }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none"
          >
            <option value="" className="bg-gray-900">All Roles</option>
            <option value="student" className="bg-gray-900">Students</option>
            <option value="professor" className="bg-gray-900">Professors</option>
            <option value="alumni" className="bg-gray-900">Alumni</option>
          </select>
          <button type="submit" className="px-5 py-2.5 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-xl text-sm font-medium hover:bg-primary-600/30 transition-all">
            <Filter size={15} />
          </button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {users.map((user) => (
              <AlumniCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {/* Career Insights Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">Career Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Top Skills in Demand', desc: 'Python, Machine Learning, TypeScript, Kubernetes, React', color: 'from-primary-600/10' },
              { title: 'Popular Industries', desc: 'Tech, Research, Finance, Healthcare, Education', color: 'from-accent-600/10' },
              { title: 'Mentor Matching', desc: 'Connect with alumni who share your career goals', color: 'from-secondary-600/10' },
            ].map(({ title, desc, color }) => (
              <div key={title} className={`bg-gradient-to-br ${color} to-transparent border border-white/10 rounded-2xl p-5`}>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
