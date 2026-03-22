import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Code2, Briefcase, Users, Star } from 'lucide-react';
import { activityAPI } from '../../services/api';
import useSocket from '../../hooks/useSocket';
import { formatRelativeTime, getInitials } from '../../utils/helpers';
import { SOCKET_EVENTS } from '../../utils/constants';

const typeConfig = {
  project: { icon: Code2, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  job: { icon: Briefcase, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  connection: { icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
  achievement: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

const ActivityItem = ({ activity }) => {
  const config = typeConfig[activity.type] || typeConfig.project;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
        {activity.user?.avatar ? (
          <img src={activity.user.avatar} alt={activity.user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <span className={`text-xs font-bold ${config.color}`}>
            {getInitials(activity.user?.name)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200">
          <span className="font-medium">{activity.user?.name || 'Someone'}</span>
          {' '}
          <span className="text-gray-400">{activity.action}</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{formatRelativeTime(activity.timestamp)}</p>
      </div>
      <div className={`p-1.5 rounded-lg ${config.bg} flex-shrink-0`}>
        <Icon size={12} className={config.color} />
      </div>
    </motion.div>
  );
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { on } = useSocket();
  const listRef = useRef(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityAPI.getFeed({ limit: 15 });
        setActivities(data.activities || []);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const cleanup = on(SOCKET_EVENTS.NEW_ACTIVITY, (activity) => {
      setActivities((prev) => [activity, ...prev.slice(0, 19)]);
    });
    return cleanup;
  }, [on]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Live Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin" ref={listRef}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary-500/40 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Zap size={24} className="text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No activity yet</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {activities.map((activity, i) => (
              <ActivityItem key={activity._id || i} activity={activity} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
