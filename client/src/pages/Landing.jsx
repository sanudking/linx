import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, Github, Briefcase, Users, Code2,
  CheckCircle, Star, BookOpen, Network
} from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const stats = [
  { value: '10K+', label: 'Students & Researchers' },
  { value: '500+', label: 'Universities' },
  { value: '2K+', label: 'Active Projects' },
  { value: '300+', label: 'Job Postings' },
];

const features = [
  {
    icon: Zap,
    color: 'from-primary-500 to-primary-700',
    title: 'Real-time Pulse',
    description: 'Live activity feeds powered by Socket.io. See what your peers are building in real time.',
  },
  {
    icon: Github,
    color: 'from-gray-600 to-gray-800',
    title: 'GitHub Skills',
    description: 'Automatic skill extraction from your GitHub repos. Your code speaks for itself.',
  },
  {
    icon: Code2,
    color: 'from-accent-500 to-accent-700',
    title: 'Project Hub',
    description: 'Discover research projects and collaborations matched to your skill set.',
  },
  {
    icon: Briefcase,
    color: 'from-secondary-500 to-secondary-700',
    title: 'Job Board',
    description: 'Internships, research positions, and jobs posted by alumni and professors.',
  },
  {
    icon: Users,
    color: 'from-green-500 to-green-700',
    title: 'Alumni Network',
    description: 'Connect with graduates in industry for mentorship and career guidance.',
  },
  {
    icon: CheckCircle,
    color: 'from-amber-500 to-amber-700',
    title: 'Edu Verified',
    description: 'Academic email verification ensures a trusted community of real scholars.',
  },
];

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up with your academic email to join the verified community.' },
  { num: '02', title: 'Link your GitHub', desc: 'Automatically import your skills and showcase your open source work.' },
  { num: '03', title: 'Discover & Connect', desc: 'Find projects matching your skills and connect with collaborators.' },
  { num: '04', title: 'Build together', desc: 'Collaborate in real time, apply to opportunities, and grow your career.' },
];

const testimonials = [
  { name: 'Priya Nair', role: 'PhD Student, MIT', text: 'Lincxx helped me find co-authors for my NLP research within days. The skill matching is incredibly accurate.' },
  { name: 'James Okonkwo', role: 'Alumni, Google', text: 'I use Lincxx to post internship openings specifically for students with the right technical background.' },
  { name: 'Sofia Reyes', role: 'Professor, Stanford', text: 'My lab found three talented undergrads through Lincxx. It\'s become essential for academic recruitment.' },
];

const Landing = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openModal = (mode) => {
    if (isAuthenticated) { navigate('/dashboard'); return; }
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen animated-gradient">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm">
              <Zap size={13} className="text-primary-400" />
              Real-time Academic Collaboration Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-manrope font-extrabold text-white leading-tight mb-6">
              Where Academic{' '}
              <span className="gradient-text">Minds Connect</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Lincxx bridges students, professors, and alumni through real-time collaboration, GitHub-powered skill matching, and exclusive academic opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal('register')}
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center gap-2"
              >
                Start Collaborating <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => openModal('login')}
                className="px-8 py-4 rounded-2xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 relative"
          >
            <div className="glass rounded-3xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-gray-500">Lincxx Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Python · NLP Research', 'TypeScript · WebDev', 'Rust · Systems'].map((text, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500/40 to-secondary-500/40 mb-2 flex items-center justify-center">
                      <Code2 size={12} className="text-primary-300" />
                    </div>
                    <p className="text-xs text-gray-300 font-medium">{text}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex -space-x-1">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border border-gray-900" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Open</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="pulse-dot" />
                  <span className="text-xs text-green-400">
                    <strong>Alex Chen</strong> just joined "Distributed ML Systems" project
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-manrope font-extrabold gradient-text">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-manrope font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">thrive academically</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From real-time collaboration to career opportunities — Lincxx is your complete academic growth platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-manrope font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Get started in minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 glass rounded-2xl p-6"
              >
                <span className="text-4xl font-manrope font-black gradient-text opacity-60 leading-none">{num}</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-manrope font-bold text-white mb-4">
              Loved by the <span className="gradient-text">academic community</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic mb-4">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary-600/10" />
            <div className="relative">
              <BookOpen size={40} className="text-primary-400 mx-auto mb-4" />
              <h2 className="text-4xl font-manrope font-bold text-white mb-4">
                Ready to connect?
              </h2>
              <p className="text-gray-400 mb-8">
                Join thousands of students, professors, and alumni building the future of academia together.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal('register')}
                className="px-10 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center gap-2 mx-auto"
              >
                Join Lincxx Free <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultMode={modalMode} />
    </div>
  );
};

export default Landing;
