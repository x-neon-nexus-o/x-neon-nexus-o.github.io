/**
 * Projects Module
 * Handles project search and interaction tracking
 */

const Projects = (function () {
    function init() {
        initSearch();

        if (typeof Analytics !== 'undefined') {
            trackProjectInteractions();
        }
    }

    function initSearch() {
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
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 50);
            } else {
                project.parentElement.style.display = 'none';
            }
        });

        handleNoResults(visibleCount, searchTerm);
    }

    function handleNoResults(count, term) {
        const row = document.querySelector('#projects .row');
        let msg = document.querySelector('#projects .no-results');

        if (count === 0 && term !== '') {
            if (!msg) {
                msg = document.createElement('div');
                msg.className = 'no-results';
                row.parentNode.insertBefore(msg, row);
            }
            msg.textContent = `No projects found matching "${term}"`;
        } else if (msg) {
            msg.remove();
        }
    }

    function trackProjectInteractions() {
        document.querySelectorAll('.project-card').forEach((card, index) => {
            const title = card.querySelector('.project-title')?.textContent || `Project ${index + 1}`;

            card.addEventListener('mouseenter', () => {
                Analytics.trackEvent('engagement', 'project_hover', title);
            });

            card.querySelectorAll('.project-link').forEach(link => {
                link.addEventListener('click', () => {
                    const isGithub = link.getAttribute('href').includes('github.com');
                    Analytics.trackEvent('engagement', 'project_link_click', {
                        project: title,
                        type: isGithub ? 'github' : 'demo',
                        url: link.getAttribute('href')
                    });
                });
            });
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', Projects.init);
