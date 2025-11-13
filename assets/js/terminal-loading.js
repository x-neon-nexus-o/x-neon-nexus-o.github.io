document.addEventListener('DOMContentLoaded', () => {
    // Terminal typing effect
    const terminalText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const terminalOutput = document.querySelector('.terminal-output');
    
    const messages = [
        'Initializing portfolio...',
        'Loading modules...',
        'Ready!'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;
    
    function type() {
        const currentMessage = messages[messageIndex];
        
        if (isDeleting) {
            terminalText.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                messageIndex++;
                if (messageIndex === messages.length) {
                    isEnd = true;
                    // We'll handle the hiding in the 10-second timeout
                    return;
                }
            }
        } else {
            terminalText.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentMessage.length) {
                isDeleting = true;
                terminalOutput.textContent += '> ' + currentMessage + ' ✓\n';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(type, 1000);
                return;
            }
        }
        
        const typingSpeed = isDeleting ? 50 : Math.random() * 100 + 50;
        setTimeout(type, typingSpeed);
    }
    
    // Matrix rain effect
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        const ctx = canvas.getContext('2d');
        
        // Set canvas to full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Matrix characters
        const matrix = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        // Array to store the Y coordinate of each drop
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start drops at random positions above the viewport
        }
        
        // Drawing the characters
        function draw() {
            // Black background with opacity for trail effect
            ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set style for the characters
            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px 'Fira Code', monospace`;
            
            // Loop over drops
            for (let i = 0; i < drops.length; i++) {
                // Random character from matrix string
                const text = matrix.charAt(Math.floor(Math.random() * matrix.length));
                
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Reset drop if it reaches the bottom or randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Move the drop down
                drops[i]++;
            }
        }
        
        // Animation loop
        setInterval(draw, 33);
    }
    
    // Start animations
    type();
    initMatrixRain();
    
    // Hide loading screen after 10 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 10000); // 10 seconds
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('matrix-rain');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
