import { useState, useEffect } from 'react';
import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#ed8b00',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#239120',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#cc342d',
  PHP: '#777bb4',
  Swift: '#fa7343',
  Kotlin: '#7f52ff',
  Dart: '#00b4ab',
  HTML: '#e34f26',
  CSS: '#1572b6',
  Vue: '#42b883',
  Shell: '#89e051',
};

const useGitHubData = (username) => {
  const [repos, setRepos] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers = token ? { Authorization: `token ${token}` } : {};

        const [reposRes, profileRes] = await Promise.all([
          axios.get(`${GITHUB_API}/users/${username}/repos`, {
            params: { per_page: 100, sort: 'updated' },
            headers,
          }),
          axios.get(`${GITHUB_API}/users/${username}`, { headers }),
        ]);

        const repoData = reposRes.data;
        setRepos(repoData);
        setProfile(profileRes.data);

        const langMap = {};
        repoData.forEach((r) => {
          if (r.language) {
            langMap[r.language] = (langMap[r.language] || 0) + 1;
          }
        });

        const skillList = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .map(([lang, count]) => ({
            language: lang,
            count,
            color: LANGUAGE_COLORS[lang] || '#6366f1',
          }));

        setSkills(skillList);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch GitHub data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { skills, repos, profile, loading, error };
};

export { LANGUAGE_COLORS };
export default useGitHubData;
