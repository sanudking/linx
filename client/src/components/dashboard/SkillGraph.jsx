import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import useGitHubData from '../../hooks/useGitHub';

const SkillBar = ({ language, count, maxCount, color, index }) => {
  const pct = Math.round((count / maxCount) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          <span className="text-xs text-gray-300">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{count} repos</span>
          <span className="text-xs font-medium text-gray-400">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
};

const SkillGraph = ({ githubUsername }) => {
  const { skills, loading, error, profile } = useGitHubData(githubUsername);
  const maxCount = skills[0]?.count || 1;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Github size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-white">Skills</h3>
        </div>
        {profile?.html_url && (
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ExternalLink size={12} />
            GitHub
          </a>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-primary-500/40 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <Github size={24} className="text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            {githubUsername ? 'Could not load GitHub data' : 'Link your GitHub to see skills'}
          </p>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-gray-500">No languages detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.slice(0, 8).map((skill, i) => (
            <SkillBar
              key={skill.language}
              language={skill.language}
              count={skill.count}
              maxCount={maxCount}
              color={skill.color}
              index={i}
            />
          ))}
          {profile && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="text-center">
                <p className="text-base font-bold text-white">{profile.public_repos}</p>
                <p className="text-xs text-gray-500">Repos</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-white">{profile.followers}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-white">{profile.following}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGraph;
