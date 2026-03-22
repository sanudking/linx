import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, MapPin, Calendar, ExternalLink, Edit2, CheckCircle } from 'lucide-react';
import { userAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import { getInitials, formatDate, getSkillColor } from '../utils/helpers';
import { ROLE_COLORS } from '../utils/constants';
import SkillGraph from '../components/dashboard/SkillGraph';
import Button from '../components/common/Button';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser && (currentUser._id === id || currentUser.id === id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile(id);
        setProfile(data.user);
        setFormData({ name: data.user.name, bio: data.user.bio || '', skills: data.user.skills?.join(', ') || '' });
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const skills = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const updated = await userAPI.updateProfile({ name: formData.name, bio: formData.bio, skills });
      setProfile(updated.user);
      setEditing(false);
    } catch {
      // handle error silently
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500/40 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const roleClass = ROLE_COLORS[profile.role] || ROLE_COLORS.student;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover ring-2 ring-primary-500/30" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-2xl text-white font-bold">
                  {getInitials(profile.name)}
                </div>
              )}

              <div className="flex-1">
                {editing ? (
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="text-2xl font-bold bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white w-full mb-2"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                    {profile.verified && <CheckCircle size={18} className="text-primary-400" />}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleClass}`}>
                    {profile.role}
                  </span>
                  {profile.github?.username && (
                    <a
                      href={`https://github.com/${profile.github.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={13} />
                      {profile.github.username}
                      <ExternalLink size={11} />
                    </a>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    Joined {formatDate(profile.createdAt)}
                  </span>
                </div>

                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell your story..."
                    rows={3}
                    className="mt-3 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  profile.bio && <p className="text-sm text-gray-400 mt-3">{profile.bio}</p>
                )}
              </div>

              {isOwn && (
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button size="sm" onClick={handleSave} loading={saving}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                      <Edit2 size={13} /> Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Skills */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Skills</h2>
              {editing ? (
                <input
                  value={formData.skills}
                  onChange={(e) => setFormData((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="JavaScript, Python, React, ..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary-500"
                />
              ) : profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} className={`skill-tag ${getSkillColor(s)}`}>{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills listed yet</p>
              )}
            </div>

            {/* GitHub Stats */}
            <SkillGraph githubUsername={profile.github?.username} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
