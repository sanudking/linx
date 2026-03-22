import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, X, Github, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import ProjectCard from '../components/dashboard/ProjectCard';
import Button from '../components/common/Button';

const SKILL_OPTIONS = ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Java', 'Go', 'Rust', 'Machine Learning', 'Data Science'];

const CreateModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ title: '', description: '', skills: [], tags: '', github: { repoUrl: '' } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const data = await projectAPI.create({ ...form, tags });
      toast.success('Project created!');
      onCreate(data.project);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
          <X size={16} />
        </button>
        <h2 className="text-xl font-bold text-white mb-5">New Project</h2>

        {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              placeholder="ML Research Collaboration"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
              rows={3}
              placeholder="Describe your project..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    form.skills.includes(skill)
                      ? 'bg-primary-600/30 text-primary-300 border-primary-500/50'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="research, open-source, NLP"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">GitHub Repo URL</label>
            <input
              value={form.github.repoUrl}
              onChange={(e) => setForm((p) => ({ ...p, github: { repoUrl: e.target.value } }))}
              placeholder="https://github.com/username/repo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">Create Project</Button>
        </form>
      </motion.div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchProjects = async (params = {}) => {
    setLoading(true);
    try {
      const data = await projectAPI.getAll({ ...params, limit: 30 });
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects({ search, status: statusFilter });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-manrope font-bold text-white">Project Hub</h1>
            <p className="text-sm text-gray-400 mt-1">Discover and join academic projects</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> New Project
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); fetchProjects({ search, status: e.target.value }); }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="" className="bg-gray-900">All Status</option>
            <option value="open" className="bg-gray-900">Open</option>
            <option value="in-progress" className="bg-gray-900">In Progress</option>
            <option value="completed" className="bg-gray-900">Completed</option>
          </select>
          <Button type="submit" variant="outline" size="md">
            <Filter size={15} /> Filter
          </Button>
        </form>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Loader size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={(p) => setProjects((prev) => [p, ...prev])}
        />
      )}
    </div>
  );
};

export default Projects;
