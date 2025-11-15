document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const terminalText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
        terminalOutput.textContent = '> press any key or click to skip\n';
    }
    
    document.body.classList.add('loading');
    
    const messages = [
        'user@portfolio:~$ initializing...',
        'user@portfolio:~$ loading modules',
        'user@portfolio:~$ starting UI',
        'user@portfolio:~$ ready'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let finished = false;
    
    function hideLoading() {
        if (!loadingScreen || finished) return;
        finished = true;
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.remove('loading');
            document.body.classList.add('ready');
        }, 500);
    }
    
    function type() {
        const currentMessage = messages[messageIndex];
        if (!currentMessage) { hideLoading(); return; }
        
        if (isDeleting) {
            terminalText.textContent = currentMessage.substring(0, Math.max(charIndex - 1, 0));
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                messageIndex++;
                if (messageIndex === messages.length) {
                    terminalOutput.textContent += '> sequence complete ✓\n';
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    setTimeout(hideLoading, 800);
                    return;
                }
            }
        } else {
            terminalText.textContent = currentMessage.substring(0, Math.min(charIndex + 1, currentMessage.length));
            charIndex++;
            if (charIndex === currentMessage.length) {
                isDeleting = true;
                terminalOutput.textContent += '> ' + currentMessage + ' ✓\n';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(type, 600);
                return;
            }
        }
        const typingSpeed = isDeleting ? 40 : 60 + Math.random() * 60;
        setTimeout(type, typingSpeed);
    }
    
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const matrix = '01';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = new Array(columns).fill(0).map(() => Math.random() * -50);
        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px 'Fira Code', monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = matrix.charAt(Math.floor(Math.random() * matrix.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(draw, 33);
    }
    
    type();
    initMatrixRain();
    
    // User interaction to skip
    ['click','keydown','touchstart'].forEach(evt => window.addEventListener(evt, hideLoading, { once: true }));
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
