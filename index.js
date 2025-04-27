import { fetchJSON, renderProjects } from './global.js';

async function loadLatestProjects() {
  const projects = await fetchJSON('./lib/projects.json'); // notice ../ because you're inside /projects
  const latestProjects = projects.slice(0, 3); // grab first 3

  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h2'); // render only the latest 3
}

loadLatestProjects();

import { fetchGitHubData } from './global.js';

async function loadGitHubProfile() {
  const githubData = await fetchGitHubData('elinalebuff'); // <-- replace with YOUR username

  const profileStats = document.querySelector('#profile-stats');
  if (profileStats) {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
}

loadGitHubProfile();