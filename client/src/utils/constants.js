export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_ACTIVITY: 'new-activity',
  PULSE_UPDATE: 'pulse-update',
  PROJECT_CREATED: 'project-created',
  PROJECT_UPDATED: 'project-updated',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  NOTIFICATION: 'notification',
  JOIN_PROJECT: 'join-project',
  LEAVE_PROJECT: 'leave-project',
  PROJECT_MESSAGE: 'project-message',
  PRESENCE_UPDATE: 'presence-update',
};

export const USER_ROLES = {
  STUDENT: 'student',
  PROFESSOR: 'professor',
  ALUMNI: 'alumni',
};

export const PROJECT_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  INTERNSHIP: 'internship',
  RESEARCH: 'research',
};

export const ACTIVITY_TYPES = {
  PROJECT: 'project',
  JOB: 'job',
  CONNECTION: 'connection',
  ACHIEVEMENT: 'achievement',
};

export const STATUS_COLORS = {
  open: 'text-green-400 bg-green-400/10',
  'in-progress': 'text-yellow-400 bg-yellow-400/10',
  completed: 'text-blue-400 bg-blue-400/10',
};

export const ROLE_COLORS = {
  student: 'text-primary-400 bg-primary-400/10',
  professor: 'text-accent-400 bg-accent-400/10',
  alumni: 'text-secondary-400 bg-secondary-400/10',
};

export const SKILL_COLORS = {
  JavaScript: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  TypeScript: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Python: 'bg-green-500/20 text-green-300 border border-green-500/30',
  React: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  Java: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  Go: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  Rust: 'bg-red-500/20 text-red-300 border border-red-500/30',
  default: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
};
