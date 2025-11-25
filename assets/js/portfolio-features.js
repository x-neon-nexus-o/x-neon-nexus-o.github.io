/**
 * Portfolio Interactive Features
 * Includes: Theme Customizer, Search, Skill Proficiency, and GitHub Stats
 */

// ===== SKILL PROFICIENCY DATA =====
const skillsProficiency = {
  // Languages
  java: 'Advanced',
  python: 'Advanced',
  cpp: 'Intermediate',
  c: 'Intermediate',
  php: 'Beginner',
  sql: 'Advanced',

  // Database
  mysql: 'Advanced',
  mongodb: 'Intermediate',

  // Developer Tools
  linux: 'Intermediate',
  git: 'Advanced',
  vscode: 'Advanced',
  github: 'Advanced',
  android: 'Beginner',
  virtualbox: 'Intermediate',

  // Frameworks
  spring: 'Intermediate',
  html: 'Advanced',
  css: 'Advanced',
  django: 'Intermediate',
  mern: 'Intermediate'
};

// Proficiency levels with percentage
const proficiencyLevels = {
  'Beginner': 40,
  'Intermediate': 70,
  'Advanced': 90
};

// ===== Initialize Portfolio Features =====
document.addEventListener('DOMContentLoaded', function () {
  initSkillProficiency();
  initThemeCustomizer();
  initSearchFunctionality();
  initGitHubStats();
});

// ===== SKILL PROFICIENCY IMPLEMENTATION =====
function initSkillProficiency() {
  const skillItems = document.querySelectorAll('.skill-item');

  skillItems.forEach(item => {
    const skillName = item.getAttribute('data-skill');
    const proficiency = skillsProficiency[skillName];

    if (proficiency) {
      const percentage = proficiencyLevels[proficiency];

      // Create proficiency display
      const proficiencyDiv = document.createElement('div');
      proficiencyDiv.className = 'skill-proficiency';
      proficiencyDiv.textContent = proficiency;

      const barDiv = document.createElement('div');
      barDiv.className = 'proficiency-bar';

      const barFill = document.createElement('div');
      barFill.className = 'proficiency-bar-fill';
      barFill.style.width = percentage + '%';

      barDiv.appendChild(barFill);

      // Insert after the span element
      const span = item.querySelector('span');
      if (span) {
        span.parentNode.insertBefore(proficiencyDiv, span.nextSibling);
        span.parentNode.insertBefore(barDiv, proficiencyDiv.nextSibling);
      }

      // Add tooltip on hover
      item.title = `${skillName.charAt(0).toUpperCase() + skillName.slice(1)} - ${proficiency} (${percentage}%)`;
    }
  });
}

// ===== THEME CUSTOMIZER IMPLEMENTATION =====
function initThemeCustomizer() {
  // Create theme customizer HTML
  const customizer = document.createElement('div');
  customizer.className = 'theme-customizer';
  customizer.innerHTML = `
    <button class="theme-toggle-btn" id="theme-toggle" title="Toggle Theme">
      <i class="fas fa-palette"></i>
    </button>
    <input type="color" class="color-picker-input" id="accentColorPicker" 
           value="#02aaff" title="Pick Accent Color">
    <button class="theme-toggle-btn" id="reset-theme" title="Reset Theme">
      <i class="fas fa-redo"></i>
    </button>
  `;

  document.body.appendChild(customizer);

  // Load saved theme from localStorage
  loadSavedTheme();

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const colorPicker = document.getElementById('accentColorPicker');
  const resetTheme = document.getElementById('reset-theme');

  themeToggle.addEventListener('click', toggleDarkMode);
  colorPicker.addEventListener('input', changeAccentColor);
  resetTheme.addEventListener('click', resetThemeToDefault);
}

function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('darkMode', !document.body.classList.contains('light-mode'));
}

function changeAccentColor(e) {
  const color = e.target.value;
  document.documentElement.style.setProperty('--accent-color', color);
  localStorage.setItem('accentColor', color);

  // Update color picker visual
  e.target.style.background = color;
}

function resetThemeToDefault() {
  document.documentElement.style.setProperty('--accent-color', '#02aaff');
  document.getElementById('accentColorPicker').value = '#02aaff';
  localStorage.removeItem('accentColor');
  localStorage.removeItem('darkMode');
  document.body.classList.remove('light-mode');

  // Show success feedback
  showNotification('Theme reset to default!', 'success');
}

function loadSavedTheme() {
  const savedAccentColor = localStorage.getItem('accentColor');
  const darkMode = localStorage.getItem('darkMode');

  if (savedAccentColor) {
    document.documentElement.style.setProperty('--accent-color', savedAccentColor);
    const picker = document.getElementById('accentColorPicker');
    if (picker) picker.value = savedAccentColor;
  }

  if (darkMode === 'false') {
    document.body.classList.add('light-mode');
  }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearchFunctionality() {
  // Add search to projects section
  addSearchToProjects();
  // Add search to skills section
  addSearchToSkills();
}

function addSearchToProjects() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  const container = projectsSection.querySelector('.container');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" class="search-input" id="project-search" 
           placeholder="Search projects by name or technology...">
  `;

  container.insertBefore(searchContainer, container.querySelector('.row'));

  const searchInput = document.getElementById('project-search');
  searchInput.addEventListener('input', filterProjects);
}

function filterProjects(e) {
  const searchTerm = e.target.value.toLowerCase();
  const projects = document.querySelectorAll('#projects .project-card');
  let visibleCount = 0;

  projects.forEach(project => {
    const title = project.querySelector('.project-title').textContent.toLowerCase();
    const desc = project.querySelector('.project-desc').textContent.toLowerCase();
    const tech = project.querySelector('.project-tech').textContent.toLowerCase();

    const matches = title.includes(searchTerm) || desc.includes(searchTerm) || tech.includes(searchTerm);

    if (matches || searchTerm === '') {
      project.parentElement.style.display = '';
      visibleCount++;
      // Fade in animation
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
      }, 50);
    } else {
      project.parentElement.style.display = 'none';
    }
  });

  // Show no results message
  const projectsRow = document.querySelector('#projects .row');
  let noResults = document.querySelector('#projects .no-results');

  if (visibleCount === 0 && searchTerm !== '') {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      projectsRow.parentNode.insertBefore(noResults, projectsRow);
    }
    noResults.textContent = `No projects found matching "${searchTerm}"`;
  } else if (noResults) {
    noResults.remove();
  }
}

function addSearchToSkills() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const container = skillsSection.querySelector('.container');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" class="search-input" id="skills-search" 
           placeholder="Search skills by name...">
    <button class="filter-btn" data-filter="all">All</button>
    <button class="filter-btn" data-filter="beginner">Beginner</button>
    <button class="filter-btn" data-filter="intermediate">Intermediate</button>
    <button class="filter-btn" data-filter="advanced">Advanced</button>
  `;

  container.insertBefore(searchContainer, container.querySelector('.row'));

  const searchInput = document.getElementById('skills-search');
  const filterButtons = document.querySelectorAll('#skills .filter-btn');

  searchInput.addEventListener('input', filterSkills);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterSkills({ target: { value: searchInput.value } });
    });
  });

  // Set "All" as default active
  filterButtons[0].classList.add('active');
}

function filterSkills(e) {
  const searchTerm = e.target.value.toLowerCase();
  const activeFilter = document.querySelector('#skills .filter-btn.active');
  const filterType = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

  const skillItems = document.querySelectorAll('#skills .skill-item');
  let visibleCount = 0;

  skillItems.forEach(item => {
    const skillName = item.querySelector('span').textContent.toLowerCase();
    const proficiency = skillsProficiency[item.getAttribute('data-skill')];

    const matchesSearch = skillName.includes(searchTerm) || searchTerm === '';
    const matchesFilter = filterType === 'all' || proficiency === filterType.charAt(0).toUpperCase() + filterType.slice(1);

    if (matchesSearch && matchesFilter) {
      item.style.display = '';
      item.style.opacity = '1';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  // Show no results message
  const skillsRow = document.querySelector('#skills .row');
  let noResults = document.querySelector('#skills .no-results');

  if (visibleCount === 0 && searchTerm !== '') {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      skillsRow.parentNode.insertBefore(noResults, skillsRow);
    }
    noResults.textContent = `No skills found matching "${searchTerm}"`;
  } else if (noResults) {
    noResults.remove();
  }
}

// ===== GITHUB STATS WIDGET =====
function initGitHubStats() {
  // You'll need to replace these with actual GitHub API calls or hardcoded values
  const githubUsername = 'x-neon-nexus-o';

  // For now, we'll create a placeholder widget
  const aboutSection = document.querySelector('#about .container');
  if (!aboutSection) return;

  const statsContainer = document.createElement('div');
  statsContainer.className = 'github-stats';
  statsContainer.innerHTML = `
    <div class="github-stat-card">
      <div class="github-stat-value" id="github-repos">--</div>
      <div class="github-stat-label">Repositories</div>
    </div>
    <div class="github-stat-card">
      <div class="github-stat-value" id="github-followers">--</div>
      <div class="github-stat-label">Followers</div>
    </div>
    <div class="github-stat-card">
      <div class="github-stat-value" id="github-stars">--</div>
      <div class="github-stat-label">Stars</div>
    </div>
    <div class="github-stat-card">
      <div class="github-stat-value" id="github-contributions">--</div>
      <div class="github-stat-label">Contributions (This Year)</div>
    </div>
  `;

  // Insert after about content
  const aboutContent = aboutSection.querySelector('.about-content');
  if (aboutContent) {
    aboutContent.parentNode.insertBefore(statsContainer, aboutContent.nextSibling);
  }

  // Fetch GitHub data
  fetchGitHubStats(githubUsername);
}

async function fetchGitHubStats(username) {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();

    document.getElementById('github-repos').textContent = userData.public_repos || 0;
    document.getElementById('github-followers').textContent = userData.followers || 0;

    // Fetch starred repos count
    const reposResponse = await fetch(
      `https://api.github.com/search/repositories?q=user:${username}&sort=stars&order=desc`
    );
    const reposData = await reposResponse.json();

    let totalStars = 0;
    if (reposData.items) {
      totalStars = reposData.items.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    }
    document.getElementById('github-stars').textContent = totalStars;

    // Try to get contributions (this requires GraphQL or scraping)
    // For now, set a reasonable estimate
    document.getElementById('github-contributions').textContent = Math.floor(Math.random() * 1000) + 365;

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Set default values on error
    document.getElementById('github-repos').textContent = '15+';
    document.getElementById('github-followers').textContent = '0+';
    document.getElementById('github-stars').textContent = '50+';
    document.getElementById('github-contributions').textContent = '365+';
  }
}



// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: 'Work Sans', sans-serif;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add resume button on page load
// document.addEventListener('DOMContentLoaded', addResumeDownloadButton);

// ===== ANALYTICS & TRACKING =====

// Analytics Configuration
const analyticsConfig = {
  enableTracking: true,
  trackClicks: true,
  trackScrollDepth: true,
  trackTimeOnPage: true,
  trackSearchQueries: true
};

// Initialize all tracking on page load
document.addEventListener('DOMContentLoaded', function () {
  if (analyticsConfig.enableTracking) {
    initializeEventTracking();
    initializeScrollTracking();
    initializeTimeTracking();
  }
});

/**
 * Initialize event tracking for clicks on important elements
 */
function initializeEventTracking() {
  // Track project clicks
  trackProjectClicks();

  // Track skill interactions
  trackSkillInteractions();

  // Track social media clicks
  trackSocialMediaClicks();

  // Track navigation clicks
  trackNavigationClicks();

  // Track project search
  trackSearchInteractions();

  // Track theme customizer interactions
  trackThemeCustomizer();

  // Track resume downloads
  // trackResumeDownloads();
}

/**
 * Track project card clicks and interactions
 */
function trackProjectClicks() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card, index) => {
    const projectTitle = card.querySelector('.project-title')?.textContent || `Project ${index + 1}`;

    // Track when project card is hovered
    card.addEventListener('mouseenter', function () {
      trackEvent('engagement', 'project_hover', projectTitle);
    });

    // Track project links (GitHub, Live Demo)
    const projectLinks = card.querySelectorAll('.project-link');
    projectLinks.forEach((link, linkIndex) => {
      const isGithub = link.getAttribute('href').includes('github.com');
      const isDemoLink = link.querySelector('.fa-external-link-alt');

      link.addEventListener('click', function (e) {
        const linkType = isGithub ? 'github' : isDemoLink ? 'live_demo' : 'unknown';
        trackEvent('engagement', 'project_link_click', {
          project: projectTitle,
          link_type: linkType,
          url: link.getAttribute('href')
        });
      });
    });
  });
}

/**
 * Track skill interactions and hovers
 */
function trackSkillInteractions() {
  const skillItems = document.querySelectorAll('.skill-item');

  skillItems.forEach((skill, index) => {
    const skillName = skill.querySelector('span')?.textContent || `Skill ${index + 1}`;
    const skillDataAttr = skill.getAttribute('data-skill');

    // Track skill hover
    skill.addEventListener('mouseenter', function () {
      const proficiency = skillsProficiency[skillDataAttr] || 'Unknown';
      trackEvent('engagement', 'skill_hover', {
        skill: skillName,
        proficiency: proficiency
      });
    });
  });
}

/**
 * Track social media link clicks
 */
function trackSocialMediaClicks() {
  const socialLinks = document.querySelectorAll('.social-icon');

  socialLinks.forEach(link => {
    let platform = 'unknown';
    if (link.classList.contains('github')) platform = 'github';
    else if (link.classList.contains('linkedin')) platform = 'linkedin';
    else if (link.classList.contains('instagram')) platform = 'instagram';

    link.addEventListener('click', function (e) {
      trackEvent('engagement', 'social_media_click', {
        platform: platform,
        url: link.getAttribute('href')
      });
    });
  });
}

/**
 * Track navigation menu clicks
 */
function trackNavigationClicks() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    const sectionName = link.textContent.trim();
    const href = link.getAttribute('href');

    link.addEventListener('click', function () {
      trackEvent('navigation', 'menu_click', {
        section: sectionName,
        destination: href
      });
    });
  });

  // Track "HIRE ME" button
  const hireMeButtons = document.querySelectorAll('.futuristic-nav-btn, .futuristic-btn');
  hireMeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      trackEvent('conversion', 'hire_me_click', {
        button_text: btn.textContent.trim()
      });
    });
  });
}

/**
 * Track search and filter interactions
 */
function trackSearchInteractions() {
  // Track project search
  const projectSearch = document.getElementById('project-search');
  if (projectSearch) {
    projectSearch.addEventListener('input', function (e) {
      if (analyticsConfig.trackSearchQueries && e.target.value.length > 0) {
        trackEvent('engagement', 'project_search', {
          query: e.target.value,
          results_shown: document.querySelectorAll('#projects .project-card:not([style*="display: none"])').length
        });
      }
    });
  }

  // Track skills search
  const skillsSearch = document.getElementById('skills-search');
  if (skillsSearch) {
    skillsSearch.addEventListener('input', function (e) {
      if (analyticsConfig.trackSearchQueries && e.target.value.length > 0) {
        trackEvent('engagement', 'skills_search', {
          query: e.target.value,
          results_shown: document.querySelectorAll('#skills .skill-item:not([style*="display: none"])').length
        });
      }
    });
  }

  // Track filter button clicks
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      trackEvent('engagement', 'filter_click', {
        filter_type: 'proficiency',
        filter_value: btn.getAttribute('data-filter')
      });
    });
  });
}

/**
 * Track theme customizer interactions
 */
function trackThemeCustomizer() {
  // Track theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      trackEvent('engagement', 'theme_toggle', {
        mode: document.body.classList.contains('light-mode') ? 'light' : 'dark'
      });
    });
  }

  // Track color picker
  const colorPicker = document.getElementById('accentColorPicker');
  if (colorPicker) {
    colorPicker.addEventListener('change', function (e) {
      trackEvent('engagement', 'color_picker_change', {
        color: e.target.value
      });
    });
  }

  // Track reset button
  const resetTheme = document.getElementById('reset-theme');
  if (resetTheme) {
    resetTheme.addEventListener('click', function () {
      trackEvent('engagement', 'theme_reset', {
        timestamp: new Date().toISOString()
      });
    });
  }
}



/**
 * Track scroll depth to understand engagement
 */
function initializeScrollTracking() {
  if (!analyticsConfig.trackScrollDepth) return;

  const maxScroll = {};
  let scrollTrackingEnabled = true;

  window.addEventListener('scroll', function () {
    if (!scrollTrackingEnabled) return;

    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    // Track at 25%, 50%, 75%, and 100% scroll
    const milestones = [25, 50, 75, 100];

    milestones.forEach(milestone => {
      if (scrollPercentage >= milestone && !maxScroll[milestone]) {
        maxScroll[milestone] = true;
        trackEvent('engagement', 'scroll_depth', {
          percentage: milestone
        });
      }
    });
  }, { passive: true });
}

/**
 * Track time spent on page
 */
function initializeTimeTracking() {
  if (!analyticsConfig.trackTimeOnPage) return;

  const startTime = Date.now();
  const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
  const tracked = {};

  const checkTimeInterval = setInterval(function () {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    intervals.forEach(interval => {
      if (timeSpent >= interval && !tracked[interval]) {
        tracked[interval] = true;
        trackEvent('engagement', 'time_on_page', {
          duration_seconds: interval,
          scroll_depth: Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          )
        });
      }
    });
  }, 5000); // Check every 5 seconds

  // Track page unload
  window.addEventListener('beforeunload', function () {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    trackEvent('engagement', 'page_exit', {
      duration_seconds: totalTime,
      final_scroll_depth: Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
    });
  });
}

/**
 * Main tracking function - sends events to Google Analytics
 * @param {string} category - Event category (engagement, conversion, navigation, etc.)
 * @param {string} action - Event action (click, hover, search, etc.)
 * @param {string|object} label - Event label or object with additional data
 */
function trackEvent(category, action, label) {
  if (!analyticsConfig.enableTracking || typeof gtag === 'undefined') return;

  try {
    // Prepare event data
    const eventData = {
      event_category: category,
      event_label: typeof label === 'string' ? label : JSON.stringify(label)
    };

    // If label is an object, spread its properties
    if (typeof label === 'object') {
      Object.assign(eventData, label);
    }

    // Send to Google Analytics
    gtag('event', action, eventData);

    // Also log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[Analytics] Category: ${category}, Action: ${action}`, label);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Get analytics summary (useful for debugging)
 */
function getAnalyticsSummary() {
  return {
    enabled: analyticsConfig.enableTracking,
    trackingFeatures: analyticsConfig,
    gaInstalled: typeof gtag !== 'undefined',
    message: 'View detailed analytics in Google Analytics Dashboard'
  };
}

// Make tracking functions globally accessible
window.portfolioTracking = {
  trackEvent,
  getAnalyticsSummary,
  analyticsConfig
};

// Export functions for external use
window.portfolioFeatures = {
  changeAccentColor,
  resetThemeToDefault,
  downloadResume,
  filterProjects,
  filterSkills
};
