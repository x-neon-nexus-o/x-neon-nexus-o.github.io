/**
 * Theme Customizer Module
 */

const Theme = (function () {
    function init() {
        loadSavedTheme();
        // Expose global functions for inline HTML event handlers if any
        window.toggleDarkMode = toggleDarkMode;
        window.changeAccentColor = changeAccentColor;
        window.resetThemeToDefault = resetThemeToDefault;
    }

    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('darkMode', !document.body.classList.contains('light-mode'));

        if (typeof Analytics !== 'undefined') {
            Analytics.trackEvent('engagement', 'theme_toggle', {
                mode: document.body.classList.contains('light-mode') ? 'light' : 'dark'
            });
        }
    }

    function changeAccentColor(e) {
        const color = e.target.value;
        document.documentElement.style.setProperty('--accent-color', color);
        localStorage.setItem('accentColor', color);
        e.target.style.background = color;
    }

    function resetThemeToDefault() {
        document.documentElement.style.setProperty('--accent-color', '#02aaff');
        const picker = document.getElementById('accentColorPicker');
        if (picker) picker.value = '#02aaff';

        localStorage.removeItem('accentColor');
        localStorage.removeItem('darkMode');
        document.body.classList.remove('light-mode');

        showNotification('Theme reset to default!', 'success');
    }

    function loadSavedTheme() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'false') {
            document.body.classList.add('light-mode');
        }

        const accentColor = localStorage.getItem('accentColor');
        if (accentColor) {
            document.documentElement.style.setProperty('--accent-color', accentColor);
            const picker = document.getElementById('accentColorPicker');
            if (picker) {
                picker.value = accentColor;
                picker.style.background = accentColor;
            }
        }
    }

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

    return { init };
})();

document.addEventListener('DOMContentLoaded', Theme.init);
