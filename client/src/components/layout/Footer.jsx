import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-gray-950/80 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Lincxx Logo" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Where academic minds connect. Collaborate on research, find opportunities, and build the future together.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Github size={16} />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Platform</h4>
            <ul className="space-y-2">
              {['Projects', 'Jobs', 'Alumni', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Lincxx. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500" /> for the academic community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
