import { SKILL_COLORS } from './constants';

export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const groupByLanguage = (repos) => {
  const map = {};
  repos.forEach((repo) => {
    if (repo.language) {
      if (!map[repo.language]) map[repo.language] = [];
      map[repo.language].push(repo);
    }
  });
  return map;
};

export const getSkillColor = (skill) => {
  return SKILL_COLORS[skill] || SKILL_COLORS.default;
};

export const getRoleLabel = (role) => {
  const labels = { student: 'Student', professor: 'Professor', alumni: 'Alumni' };
  return labels[role] || role;
};

export const getStatusLabel = (status) => {
  const labels = { open: 'Open', 'in-progress': 'In Progress', completed: 'Completed' };
  return labels[status] || status;
};

export const formatSalary = (salary) => {
  if (!salary) return 'Not disclosed';
  const { min, max, currency = 'USD' } = salary;
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Not disclosed';
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');
