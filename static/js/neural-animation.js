class HeroAnimation {
    constructor() {
        this.container = document.getElementById('heroNeural');
        if (!this.container) return;

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 15 : 25;
        
        this.init();
        this.animate();
        
        // Оптимізований resize listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
    }

    init() {
        this.container.innerHTML = '';
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'neural-particle';
            
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const data = {
                element: particle,
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5
            };

            this.particles.push(data);
            this.container.appendChild(particle);
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.speedY *= -1;

            particle.element.style.transform = 
                `translate(${particle.x}px, ${particle.y}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.particleCount = window.innerWidth < 768 ? 15 : 25;
        this.init();
    }
}

// Ініціалізація анімації тільки для десктопів або при певній потужності пристрою
document.addEventListener('DOMContentLoaded', () => {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        new HeroAnimation();
    }
});
