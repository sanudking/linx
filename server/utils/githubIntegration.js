const axios = require('axios');

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

const getGitHubRepos = async (username) => {
  const response = await githubApi.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated' },
  });
  return response.data;
};

const extractSkills = (repos) => {
  const languageMap = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });
  return Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count }));
};

const getGitHubProfile = async (username) => {
  const response = await githubApi.get(`/users/${username}`);
  return response.data;
};

const getContributions = async (username) => {
  try {
    const response = await githubApi.get(`/users/${username}/events/public`, {
      params: { per_page: 100 },
    });
    const pushEvents = response.data.filter((e) => e.type === 'PushEvent');
    const totalCommits = pushEvents.reduce(
      (sum, e) => sum + (e.payload.commits ? e.payload.commits.length : 0),
      0
    );
    return { events: response.data.length, commits: totalCommits };
  } catch {
    return { events: 0, commits: 0 };
  }
};

module.exports = { getGitHubRepos, extractSkills, getGitHubProfile, getContributions };
