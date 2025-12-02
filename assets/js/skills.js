/**
 * Skills Module
 * Handles skill proficiency rendering and filtering
 */

const Skills = (function () {
    const skillsProficiency = {
        // Languages
        java: 'Advanced', python: 'Advanced', cpp: 'Intermediate', c: 'Intermediate',
        php: 'Beginner', sql: 'Advanced',
        // Database
        mysql: 'Advanced', mongodb: 'Intermediate',
        // Tools
        linux: 'Intermediate', git: 'Advanced', vscode: 'Advanced',
        github: 'Advanced', android: 'Beginner', virtualbox: 'Intermediate',
        // Frameworks
        spring: 'Intermediate', html: 'Advanced', css: 'Advanced',
        django: 'Intermediate', mern: 'Intermediate'
    };

    const proficiencyLevels = {
        'Beginner': 40,
        'Intermediate': 70,
        'Advanced': 90
    };

    function init() {
        renderProficiencyBars();
        initSearchAndFilter();

        // Track interactions if Analytics is available
        if (typeof Analytics !== 'undefined') {
            trackSkillInteractions();
        }
    }

    function renderProficiencyBars() {
        document.querySelectorAll('.skill-item').forEach(item => {
            const skillName = item.getAttribute('data-skill');
            const proficiency = skillsProficiency[skillName];

            if (proficiency) {
                const percentage = proficiencyLevels[proficiency];

                // Create UI elements
                const proficiencyDiv = document.createElement('div');
                proficiencyDiv.className = 'skill-proficiency';
                proficiencyDiv.textContent = proficiency;

                const barDiv = document.createElement('div');
                barDiv.className = 'proficiency-bar';

                const barFill = document.createElement('div');
                barFill.className = 'proficiency-bar-fill';
                barFill.style.width = percentage + '%';

                barDiv.appendChild(barFill);

                const span = item.querySelector('span');
                if (span) {
                    span.parentNode.insertBefore(proficiencyDiv, span.nextSibling);
                    span.parentNode.insertBefore(barDiv, proficiencyDiv.nextSibling);
                }

                item.title = `${skillName} - ${proficiency} (${percentage}%)`;
            }
        });
    }

    function initSearchAndFilter() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const container = skillsSection.querySelector('.container');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" class="search-input" id="skills-search" placeholder="Search skills...">
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="beginner">Beginner</button>
                <button class="filter-btn" data-filter="intermediate">Intermediate</button>
                <button class="filter-btn" data-filter="advanced">Advanced</button>
            </div>
        `;

        container.insertBefore(searchContainer, container.querySelector('.row'));

        const searchInput = document.getElementById('skills-search');
        const filterButtons = searchContainer.querySelectorAll('.filter-btn');

        searchInput.addEventListener('input', (e) => filterSkills(e.target.value));

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterSkills(searchInput.value);
            });
        });
    }

    function filterSkills(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterType = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

        let visibleCount = 0;
        const skillItems = document.querySelectorAll('#skills .skill-item');

        skillItems.forEach(item => {
            const skillName = item.querySelector('span').textContent.toLowerCase();
            const skillKey = item.getAttribute('data-skill');
            const proficiency = skillsProficiency[skillKey];

            const matchesSearch = skillName.includes(searchTerm);
            const matchesFilter = filterType === 'all' ||
                (proficiency && proficiency.toLowerCase() === filterType);

            if (matchesSearch && matchesFilter) {
                item.style.display = '';
                item.style.opacity = '1';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        handleNoResults(visibleCount, searchTerm);
    }

    function handleNoResults(count, term) {
        const row = document.querySelector('#skills .row');
        let msg = document.querySelector('#skills .no-results');

        if (count === 0 && term !== '') {
            if (!msg) {
                msg = document.createElement('div');
                msg.className = 'no-results';
                row.parentNode.insertBefore(msg, row);
            }
            msg.textContent = `No skills found matching "${term}"`;
        } else if (msg) {
            msg.remove();
        }
    }

    function trackSkillInteractions() {
        document.querySelectorAll('.skill-item').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                const skillKey = skill.getAttribute('data-skill');
                Analytics.trackEvent('engagement', 'skill_hover', {
                    skill: skillKey,
                    proficiency: skillsProficiency[skillKey]
                });
            });
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', Skills.init);
