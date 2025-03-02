class NeuralSphere {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.container = document.getElementById('neuralSphere');
        if (!this.container) return;

        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.points = [];
        this.numPoints = 100;
        this.radius = 150;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        
        // Create points on sphere
        for (let i = 0; i < this.numPoints; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            this.points.push({
                x: this.radius * Math.sin(phi) * Math.cos(theta),
                y: this.radius * Math.sin(phi) * Math.sin(theta),
                z: this.radius * Math.cos(phi),
                phi: phi,
                theta: theta
            });
        }
    }
    
    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Sort points by z-index for proper rendering
        this.points.sort((a, b) => b.z - a.z);
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(82, 109, 249, 0.1)';
        this.ctx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                const dx = this.points[i].x - this.points[j].x;
                const dy = this.points[i].y - this.points[j].y;
                const dz = this.points[i].z - this.points[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < this.radius * 0.5) {
                    this.ctx.moveTo(
                        this.width/2 + this.points[i].x,
                        this.height/2 + this.points[i].y
                    );
                    this.ctx.lineTo(
                        this.width/2 + this.points[j].x,
                        this.height/2 + this.points[j].y
                    );
                }
            }
        }
        this.ctx.stroke();
        
        // Draw points
        this.points.forEach(point => {
            const size = (point.z + this.radius) / (this.radius * 2);
            this.ctx.fillStyle = `rgba(82, 109, 249, ${size * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(
                this.width/2 + point.x,
                this.height/2 + point.y,
                size * 3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left - this.width/2) / this.width * 2;
            this.mouseY = (e.clientY - rect.top - this.height/2) / this.height * 2;
            
            this.points.forEach(point => {
                point.theta += this.mouseX * 0.01;
                point.phi += this.mouseY * 0.01;
                
                point.x = this.radius * Math.sin(point.phi) * Math.cos(point.theta);
                point.y = this.radius * Math.sin(point.phi) * Math.sin(point.theta);
                point.z = this.radius * Math.cos(point.phi);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeuralSphere();
});
