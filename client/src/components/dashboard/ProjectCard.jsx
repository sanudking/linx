import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Users, CheckCircle, Clock, Loader } from 'lucide-react';
import { getSkillColor, getInitials, truncateText, getStatusLabel } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const ProjectCard = ({ project, onJoin }) => {
  const { title, description, skills = [], creator, collaborators = [], status, github, createdAt } = project;
  const statusClass = STATUS_COLORS[status] || STATUS_COLORS.open;

  const statusIcon = {
    open: <CheckCircle size={11} />,
    'in-progress': <Loader size={11} className="animate-spin" />,
    completed: <CheckCircle size={11} />,
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{title}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{truncateText(description, 90)}</p>
        </div>
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}>
          {statusIcon[status]}
          {getStatusLabel(status)}
        </span>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className={`skill-tag ${getSkillColor(skill)}`}>
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="skill-tag bg-gray-700/50 text-gray-400">+{skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {creator?.avatar ? (
            <img src={creator.avatar} alt={creator.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xs text-white font-bold">
              {getInitials(creator?.name)}
            </div>
          )}
          <span className="text-xs text-gray-400 truncate max-w-[100px]">{creator?.name}</span>
          <span className="flex items-center gap-0.5 text-xs text-gray-500">
            <Users size={11} />
            {collaborators.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {github?.repoUrl && (
            <a
              href={github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <Github size={14} />
            </a>
          )}
          {status === 'open' && (
            <button
              onClick={() => onJoin?.(project)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 border border-primary-500/20 transition-all"
            >
              Join
            </button>
          )}
          <Link
            to={`/projects/${project._id}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
