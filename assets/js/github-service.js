/**
 * GitHub Service Module
 * Handles fetching user stats, caching, and repainting project images
 */

const GithubService = (function () {
    const USERNAME = 'x-neon-nexus-o';
    const CACHE_KEY = 'github-stats-cache';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
    const TOP_REPOS_COUNT = 5;

    function init() {
        initGitHubStats();
        initGithubGraph();
        initRepoShowcase();
        replaceProjectImagesWithGitHubPreview();
    }

    /**
     * Cache Management
     */
    function getCachedStats() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            if (age > CACHE_EXPIRY) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return { data, timestamp };
        } catch (e) {
            console.warn('Cache read error:', e);
            return null;
        }
    }

    function setCachedStats(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Cache write error:', e);
        }
    }

    /**
     * Initialize stat cards with loading skeleton
     */
    function initGitHubStats() {
        const aboutSection = document.querySelector('#about .container');
        if (!aboutSection) return;

        // Only create if not exists
        if (!document.querySelector('.github-stats')) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'github-stats';
            statsContainer.innerHTML = `
                <div class="github-stat-card" data-stat="repos" title="Public repositories count">
                  <div class="github-stat-value" id="github-repos">
                    <span class="stat-skeleton"></span>
                  </div>
                  <div class="github-stat-label">Repositories</div>
                  <div class="stat-updated" style="display:none; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px;"></div>
                </div>
                <div class="github-stat-card" data-stat="followers" title="GitHub followers">
                  <div class="github-stat-value" id="github-followers">
                    <span class="stat-skeleton"></span>
                  </div>
                  <div class="github-stat-label">Followers</div>
                  <div class="stat-updated" style="display:none; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px;"></div>
                </div>
                <div class="github-stat-card" data-stat="stars" title="Total stars across all repos">
                  <div class="github-stat-value" id="github-stars">
                    <span class="stat-skeleton"></span>
                  </div>
                  <div class="github-stat-label">Total Stars</div>
                  <div class="stat-updated" style="display:none; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px;"></div>
                </div>
                <div class="github-stat-card" data-stat="contributions" title="Contributions in last year">
                  <div class="github-stat-value" id="github-contributions">
                    <span class="stat-skeleton"></span>
                  </div>
                  <div class="github-stat-label">Contributions (Year)</div>
                  <div class="stat-updated" style="display:none; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px;"></div>
                </div>
            `;
            const aboutContent = aboutSection.querySelector('.about-content');
            if (aboutContent) {
                aboutContent.parentNode.insertBefore(statsContainer, aboutContent.nextSibling);
            }
        }

        fetchGitHubStats(USERNAME);
    }

    /**
     * Fetch GitHub stats with cache strategy
     */
    async function fetchGitHubStats(username) {
        // Check cache first
        const cached = getCachedStats();
        if (cached) {
            updateStatsDisplay(cached.data, cached.timestamp);
            return;
        }

        try {
            const data = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/search/repositories?q=user:${username}&sort=stars&order=desc&per_page=${TOP_REPOS_COUNT}`)
            ]).then(async ([userRes, reposRes]) => {
                const userData = await userRes.json();
                const reposData = await reposRes.json();

                let totalStars = 0;
                let topRepos = [];

                if (reposData.items) {
                    topRepos = reposData.items.slice(0, TOP_REPOS_COUNT);
                    totalStars = topRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                }

                // Fetch contributions from scraping GitHub's public profile
                const contributionsData = await scrapeGitHubContributions(username);

                return {
                    repos: userData.public_repos || 0,
                    followers: userData.followers || 0,
                    stars: totalStars,
                    contributions: contributionsData.contributions || 0,
                    topRepos: topRepos,
                    profileUrl: userData.html_url || `https://github.com/${username}`
                };
            });

            setCachedStats(data);
            updateStatsDisplay(data, Date.now());

            // Update repo showcase with fetched data
            updateRepoShowcase(data.topRepos);

        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            updateStatsFallback();
        }
    }

    /**
     * Scrape contribution count from public GitHub profile page
     * Parses the contribution data from the profile page HTML
     */
    async function scrapeGitHubContributions(username) {
        try {
            const response = await fetch(`https://github.com/${username}`, {
                headers: { 'Accept': 'text/html' }
            });
            const html = await response.text();

            // Look for contribution count in GitHub's profile page
            // Pattern: "X contributions in the last year"
            const match = html.match(/(\d+)\s+contributions? in the last year/);
            if (match && match[1]) {
                return { contributions: parseInt(match[1], 10) };
            }

            // Fallback: estimate based on activity
            return { contributions: 0 };
        } catch (e) {
            console.warn('Could not scrape contributions:', e);
            return { contributions: 0 };
        }
    }

    /**
     * Update display with fetched data
     */
    function updateStatsDisplay(data, timestamp) {
        updateStat('github-repos', data.repos);
        updateStat('github-followers', data.followers);
        updateStat('github-stars', data.stars);
        updateStat('github-contributions', data.contributions || 0);

        // Update "last updated" timestamps
        const timeAgo = getTimeAgo(timestamp);
        document.querySelectorAll('.stat-updated').forEach(el => {
            el.textContent = `Updated ${timeAgo}`;
            el.style.display = 'block';
        });
    }

    /**
     * Fallback for when API fails
     */
    function updateStatsFallback() {
        updateStat('github-repos', '?');
        updateStat('github-followers', '?');
        updateStat('github-stars', '?');
        updateStat('github-contributions', '?');
    }

    /**
     * Format time difference for display
     */
    function getTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return 'cached';
    }

    function updateStat(id, value) {
        const el = document.getElementById(id);
        if (el) {
            // Remove skeleton if present
            const skeleton = el.querySelector('.stat-skeleton');
            if (skeleton) skeleton.remove();
            el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    }

    /**
     * Initialize repository showcase section
     */
    function initRepoShowcase() {
        const githubSection = document.querySelector('#github-activity');
        if (!githubSection || document.querySelector('.repo-showcase')) return;

        const showcase = document.createElement('div');
        showcase.className = 'repo-showcase';
        showcase.innerHTML = `
            <h3 class="section-subtitle">Top Repositories</h3>
            <div class="repo-list" id="repo-list">
                <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.6);">
                    Loading repositories...
                </div>
            </div>
        `;

        githubSection.querySelector('.container').appendChild(showcase);
    }

    function initGithubGraph() {
        const img = document.querySelector('#github-activity .github-graph');
        if (!img) return;
        img.addEventListener('error', () => {
            img.alt = 'GitHub Contribution Graph unavailable';
            img.style.opacity = '0.7';
        });
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        }, { once: true });
    }

    function replaceProjectImagesWithGitHubPreview() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const ghLink = card.querySelector('.project-links a[href*="github.com"]');
            const img = card.querySelector('.project-img');

            if (!ghLink || !img) return;

            try {
                const href = ghLink.getAttribute('href');
                const match = href.match(/github\.com\/([^\/]+)\/([^\/?#]+)/i);
                if (!match) return;

                const [_, owner, repo] = match;
                // Using opengraph image as preview
                const url = `https://opengraph.githubassets.com/portfolio/${owner}/${repo}`;

                img.dataset.originalSrc = img.src || '';
                img.src = url;
                img.loading = 'lazy';
                img.alt = `${owner}/${repo} GitHub preview`;

                img.addEventListener('error', (e) => {
                    if (e.currentTarget.dataset.originalSrc) {
                        e.currentTarget.src = e.currentTarget.dataset.originalSrc;
                    }
                }, { once: true });

                img.addEventListener('load', (e) => {
                    e.currentTarget.style.opacity = '1';
                }, { once: true });

            } catch (_) { }
        });
    }

    /**
     * Public API for repository showcase module
     */
    function updateRepoShowcase(repos) {
        const repoList = document.getElementById('repo-list');
        if (!repoList) return;

        if (!repos || repos.length === 0) {
            repoList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No repositories found.</p>';
            return;
        }

        repoList.innerHTML = repos.map(repo => `
            <div class="repo-item">
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">
                        <i class="fas fa-code-branch"></i> ${repo.name}
                    </a>
                    ${repo.private ? '<span class="repo-badge">Private</span>' : ''}
                </div>
                <p class="repo-description">${repo.description || 'No description'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span class="repo-lang"><i class="fas fa-circle"></i> ${repo.language}</span>` : ''}
                    <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            </div>
        `).join('');
    }

    return { 
        init,
        updateRepoShowcase 
    };
})();

document.addEventListener('DOMContentLoaded', GithubService.init);
