// Existing FAQ Toggle function
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.material-symbols-outlined');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Nav scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('h-20');
        nav.classList.add('h-16');
    } else {
        nav.classList.remove('py-2');
        nav.classList.add('h-20');
        nav.classList.remove('h-16');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    // ==========================================
    // 1. Technical Gaming Cursor (Desktop Only)
    // ==========================================
    if (!isMobile) {
        const dot = document.querySelector('.custom-cursor-dot');
        const circle = document.querySelector('.custom-cursor-circle');
        
        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;
        
        // Lerp factor (0.1 means 10% movement per frame towards target for buttery smooth lag)
        const lerpFactor = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly place the center dot
            if (dot) {
                dot.style.left = `${mouseX}px`;
                dot.style.top = `${mouseY}px`;
            }
        });

        // Animation loop for outer circle smooth interpolation
        function updateCircle() {
            circleX += (mouseX - circleX) * lerpFactor;
            circleY += (mouseY - circleY) * lerpFactor;
            
            if (circle) {
                circle.style.left = `${circleX}px`;
                circle.style.top = `${circleY}px`;
            }
            requestAnimationFrame(updateCircle);
        }
        updateCircle();

        // Mouse hover state tracking
        const clickables = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .tilt-card, #terminal-toggle-btn');
        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==========================================
    // 2. 3D Parallax Card Tilt (Desktop Only)
    // ==========================================
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Mouse relative X inside card
                const y = e.clientY - rect.top;  // Mouse relative Y inside card
                
                // Map coordinates to percentage ranges (-0.5 to 0.5)
                const pctX = (x / rect.width) - 0.5;
                const pctY = (y / rect.height) - 0.5;
                
                // Max tilt rotation degrees
                const maxRotation = 12;
                const rotateY = pctX * maxRotation;
                const rotateX = -pctY * maxRotation; // Negative so tilting down on bottom
                
                // Apply 3D rotation
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Update CSS variables for sheen reflection spot
                card.style.setProperty('--sheen-x', `${x}px`);
                card.style.setProperty('--sheen-y', `${y}px`);
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset card rotation smoothly
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // ==========================================
    // 3. Hero Interactive Canvas Particles
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };
        
        // Handle resize
        function resizeCanvas() {
            const heroSection = canvas.parentElement.parentElement;
            canvas.width = heroSection.clientWidth;
            canvas.height = heroSection.clientHeight;
            initParticles();
        }
        
        // Track mouse inside Hero Section
        canvas.parentElement.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.density = Math.random() * 20 + 5;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(60, 215, 255, 0.7)';
                ctx.fill();
            }
            
            update() {
                // Return to base position slowly (drift effect)
                this.baseX += this.vx;
                this.baseY += this.vy;
                
                // Wrap around boundaries
                if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;
                
                // Repel effect from mouse pointer
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        let forceX = directionX * force * this.density;
                        let forceY = directionY * force * this.density;
                        
                        this.x -= forceX;
                        this.y -= forceY;
                    } else {
                        // Return to base position
                        this.x += (this.baseX - this.x) * 0.08;
                        this.y += (this.baseY - this.y) * 0.08;
                    }
                } else {
                    this.x += (this.baseX - this.x) * 0.08;
                    this.y += (this.baseY - this.y) * 0.08;
                }
            }
        }
        
        function initParticles() {
            particles = [];
            const numberOfParticles = Math.min(65, Math.floor((canvas.width * canvas.height) / 14000));
            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }
        
        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Render lines if nodes are close to each other
                    if (distance < 110) {
                        let opacity = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(60, 215, 255, ${opacity * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    // ==========================================
    // 4. Cyberpunk Developer Console & Game
    // ==========================================
    const consoleToggleBtn = document.getElementById('terminal-toggle-btn');
    const consoleCloseBtn = document.getElementById('console-close-btn');
    const cyberConsole = document.getElementById('cyber-console');
    const terminalLogs = document.getElementById('terminal-logs');
    
    // Tab switching
    const tabMonitorBtn = document.getElementById('tab-monitor-btn');
    const tabClickerBtn = document.getElementById('tab-clicker-btn');
    const panelMonitor = document.getElementById('panel-monitor');
    const panelClicker = document.getElementById('panel-clicker');

    // Clicker Game elements
    const clickerCountEl = document.getElementById('clicker-count');
    const clickerPerSecEl = document.getElementById('clicker-persec');
    const clickerMainBtn = document.getElementById('clicker-main-btn');
    
    const upgradeAutoBtn = document.getElementById('upgrade-auto-btn');
    const upgradeAutoCostEl = document.getElementById('upgrade-auto-cost');
    const upgradeGpuBtn = document.getElementById('upgrade-gpu-btn');
    const upgradeGpuCostEl = document.getElementById('upgrade-gpu-cost');

    // Toggle Console show/hide
    if (consoleToggleBtn && cyberConsole) {
        consoleToggleBtn.addEventListener('click', () => {
            const isHidden = cyberConsole.classList.contains('pointer-events-none');
            if (isHidden) {
                // Show
                cyberConsole.classList.remove('pointer-events-none', 'scale-90', 'translate-y-10', 'opacity-0');
                cyberConsole.classList.add('scale-100', 'translate-y-0', 'opacity-100');
                consoleToggleBtn.classList.remove('animate-bounce'); // stop bouncing once clicked
                addTerminalLog("SYSTEM INITIALIZED. WEBSERVER CONNECTED TO DONG-C 102.");
                addTerminalLog("WELCOME TO GAME ENGINEERING DEVELOPER HUB.");
            } else {
                // Hide
                cyberConsole.classList.add('pointer-events-none', 'scale-90', 'translate-y-10', 'opacity-0');
                cyberConsole.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
            }
        });
    }

    if (consoleCloseBtn && cyberConsole) {
        consoleCloseBtn.addEventListener('click', () => {
            cyberConsole.classList.add('pointer-events-none', 'scale-90', 'translate-y-10', 'opacity-0');
            cyberConsole.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        });
    }

    // Tabs switching logic
    if (tabMonitorBtn && tabClickerBtn) {
        tabMonitorBtn.addEventListener('click', () => {
            tabMonitorBtn.classList.add('bg-slate-950/30', 'text-secondary', 'border-b-2', 'border-b-secondary', 'font-bold');
            tabMonitorBtn.classList.remove('text-secondary/60');
            tabClickerBtn.classList.remove('bg-slate-950/30', 'text-secondary', 'border-b-2', 'border-b-secondary', 'font-bold');
            tabClickerBtn.classList.add('text-secondary/60');
            panelMonitor.classList.remove('hidden');
            panelClicker.classList.add('hidden');
        });

        tabClickerBtn.addEventListener('click', () => {
            tabClickerBtn.classList.add('bg-slate-950/30', 'text-secondary', 'border-b-2', 'border-b-secondary', 'font-bold');
            tabClickerBtn.classList.remove('text-secondary/60');
            tabMonitorBtn.classList.remove('bg-slate-950/30', 'text-secondary', 'border-b-2', 'border-b-secondary', 'font-bold');
            tabMonitorBtn.classList.add('text-secondary/60');
            panelClicker.classList.remove('hidden');
            panelMonitor.classList.add('hidden');
        });
    }

    // Live logging logic
    function addTerminalLog(message, type = "INFO") {
        if (!terminalLogs) return;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let colorClass = "text-green-400";
        if (type === "WARN") colorClass = "text-yellow-400";
        if (type === "ERROR") colorClass = "text-red-400";
        if (type === "SUCCESS") colorClass = "text-cyan-300";

        const logItem = document.createElement('div');
        logItem.innerHTML = `<span class="text-secondary/50">[${timeStr}]</span> <span class="${colorClass}">[${type}] ${message}</span>`;
        terminalLogs.appendChild(logItem);
        
        // Auto scroll to bottom
        terminalLogs.scrollTop = terminalLogs.scrollHeight;

        // Cap log size to 50 lines to prevent memory issues
        while (terminalLogs.children.length > 50) {
            terminalLogs.removeChild(terminalLogs.firstChild);
        }
    }

    // Periodic simulation logs
    const mockLogs = [
        { msg: "Rendering frame: DirectX 12 buffer SwapChain finished", type: "INFO" },
        { msg: "Draw Calls: 142 | Vertices: 28,491 rendered", type: "INFO" },
        { msg: "AssetManager loaded: '고기산책로.png' texture cached", type: "SUCCESS" },
        { msg: "AssetManager loaded: 'diver.png' texture cached", type: "SUCCESS" },
        { msg: "Physics thread: PhysX simulation stepping (4ms)", type: "INFO" },
        { msg: "Garbage Collector run: freed 12.8 MB heap memory", type: "INFO" },
        { msg: "GC threshold warning: Heap usage close to 60%", type: "WARN" },
        { msg: "Capstones database connection secure: 200 OK", type: "SUCCESS" },
        { msg: "Academic Club NLIP: Intel AI inference model loaded", type: "SUCCESS" },
        { msg: "NetMedia Engine: TCP gaming socket heartbeat sent", type: "INFO" }
    ];

    setInterval(() => {
        if (!cyberConsole.classList.contains('pointer-events-none')) {
            const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
            addTerminalLog(randomLog.msg, randomLog.type);
            
            // Randomly twitch system monitor stats
            const fpsVal = (58.5 + Math.random() * 3).toFixed(1);
            const drawCalls = Math.floor(130 + Math.random() * 25);
            const vramVal = (4.1 + Math.random() * 0.4).toFixed(1);
            
            document.getElementById('stat-fps').textContent = fpsVal;
            document.getElementById('stat-drawcalls').textContent = drawCalls;
            document.getElementById('stat-vram').textContent = `${vramVal} GB / 16 GB`;
        }
    }, 3500);

    // ==========================================
    // 5. Code Clicker Game Core State & Logic
    // ==========================================
    let gameState = {
        loc: 0,
        autoCoders: 0,
        gpus: 0,
        perClick: 1
    };

    function updateClickerUI() {
        if (!clickerCountEl) return;
        clickerCountEl.innerHTML = `${Math.floor(gameState.loc)} <span class="text-[11px] text-secondary/60">LoC</span>`;
        
        const locPerSec = (gameState.autoCoders * 1) + (gameState.gpus * 10);
        clickerPerSecEl.textContent = `Auto-Coder: +${locPerSec} LoC / sec`;

        // Purchase costs
        const autoCost = Math.floor(15 * Math.pow(1.15, gameState.autoCoders));
        const gpuCost = Math.floor(100 * Math.pow(1.15, gameState.gpus));

        if (upgradeAutoCostEl) upgradeAutoCostEl.textContent = `${autoCost} LoC`;
        if (upgradeGpuCostEl) upgradeGpuCostEl.textContent = `${gpuCost} LoC`;

        // Style buttons disabled state depending on cost
        if (gameState.loc >= autoCost) {
            upgradeAutoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            upgradeAutoBtn.classList.add('hover:bg-secondary/15');
        } else {
            upgradeAutoBtn.classList.add('opacity-50', 'cursor-not-allowed');
            upgradeAutoBtn.classList.remove('hover:bg-secondary/15');
        }

        if (gameState.loc >= gpuCost) {
            upgradeGpuBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            upgradeGpuBtn.classList.add('hover:bg-secondary/15');
        } else {
            upgradeGpuBtn.classList.add('opacity-50', 'cursor-not-allowed');
            upgradeGpuBtn.classList.remove('hover:bg-secondary/15');
        }
    }

    if (clickerMainBtn) {
        clickerMainBtn.addEventListener('click', () => {
            gameState.loc += gameState.perClick;
            updateClickerUI();

            // Flash cyan glow on click
            clickerMainBtn.classList.add('bg-secondary/20');
            setTimeout(() => clickerMainBtn.classList.remove('bg-secondary/20'), 80);
            
            // Random code compilation messages in console logs
            const compileMsgs = [
                "Compiled main.cpp successfully",
                "Assembled vertex_shader.hlsl",
                "Calculated collision physics bounding box",
                "Serialized network state package",
                "Constructed AI behavior tree node"
            ];
            const msg = compileMsgs[Math.floor(Math.random() * compileMsgs.length)];
            addTerminalLog(`[UserClick] +1 LoC. ${msg}.`, "SUCCESS");
        });
    }

    if (upgradeAutoBtn) {
        upgradeAutoBtn.addEventListener('click', () => {
            const cost = Math.floor(15 * Math.pow(1.15, gameState.autoCoders));
            if (gameState.loc >= cost) {
                gameState.loc -= cost;
                gameState.autoCoders++;
                updateClickerUI();
                addTerminalLog(`[Purchase] Hired AI Auto-Coder! (Active: ${gameState.autoCoders})`, "SUCCESS");
            }
        });
    }

    if (upgradeGpuBtn) {
        upgradeGpuBtn.addEventListener('click', () => {
            const cost = Math.floor(100 * Math.pow(1.15, gameState.gpus));
            if (gameState.loc >= cost) {
                gameState.loc -= cost;
                gameState.gpus++;
                updateClickerUI();
                addTerminalLog(`[Purchase] Upgraded server node with RTX 5090 cluster! (Active: ${gameState.gpus})`, "SUCCESS");
            }
        });
    }

    // Auto LoC compilation tick (every 1 second)
    setInterval(() => {
        const autoLoC = (gameState.autoCoders * 1) + (gameState.gpus * 10);
        if (autoLoC > 0) {
            gameState.loc += autoLoC;
            updateClickerUI();
            
            if (!cyberConsole.classList.contains('pointer-events-none')) {
                addTerminalLog(`[AutoCompile] Compiled +${autoLoC} lines of source code.`, "SUCCESS");
            }
        }
    }, 1000);

    // Initial clicker values
    updateClickerUI();
});
