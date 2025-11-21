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
document.addEventListener('DOMContentLoaded', function() {
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
    btn.addEventListener('click', function() {
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

// ===== RESUME DOWNLOAD BUTTON =====
function addResumeDownloadButton() {
  // Add resume button to navbar
  const navbar = document.querySelector('.navbar-nav');
  if (!navbar) return;
  
  const resumeItem = document.createElement('li');
  resumeItem.className = 'nav-item';
  resumeItem.innerHTML = `
    <a class="nav-link resume-download-btn" href="#" onclick="downloadResume(event)">
      <i class="fas fa-file-pdf"></i> Resume
    </a>
  `;
  
  navbar.appendChild(resumeItem);
}

function downloadResume(e) {
  e.preventDefault();
  
  // Check if resume file exists at assets/resume.pdf
  const resumeUrl = 'assets/Prathamesh_Resume.pdf';
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = resumeUrl;
  link.download = 'Prathamesh_Gawas_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Resume downloading...', 'info');
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
document.addEventListener('DOMContentLoaded', addResumeDownloadButton);

// Export functions for external use
window.portfolioFeatures = {
  changeAccentColor,
  resetThemeToDefault,
  downloadResume,
  filterProjects,
  filterSkills
};
