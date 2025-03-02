class ModelRunner {
    constructor() {
        this.isRunning = false;
        this.workerPool = [];
        this.maxWorkers = navigator.hardwareConcurrency || 4;
        this.initializeDeviceInfo();
    }

    async initializeDeviceInfo() {
        const deviceInfo = document.getElementById('deviceInfo');
        try {
            // Check device capabilities
            const gpuInfo = await this.checkGPUSupport();
            const memoryInfo = await this.checkMemory();
            
            deviceInfo.innerHTML = `
                <span class="device-spec">CPU Cores: ${navigator.hardwareConcurrency}</span>
                <span class="device-spec">GPU: ${gpuInfo}</span>
                <span class="device-spec">Memory: ${memoryInfo}</span>
            `;
        } catch (error) {
            deviceInfo.textContent = 'Could not detect device capabilities';
        }
    }

    async checkGPUSupport() {
        if ('gpu' in navigator) {
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter) {
                return 'WebGPU Supported';
            }
        }
        return 'GPU Acceleration Limited';
    }

    async checkMemory() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB Available`;
        }
        return 'Memory Info Unavailable';
    }

    async loadModel(modelName) {
        const modelRunner = document.getElementById('modelRunner');
        modelRunner.style.display = 'block';
        
        const statusText = document.querySelector('.status-text');
        const modelInterface = document.querySelector('.model-interface');

        try {
            statusText.textContent = 'Loading model...';
            modelInterface.innerHTML = this.getModelInterface(modelName);
            
            const worker = new Worker(`/static/js/models/${modelName}Worker.js`);
            this.workerPool.push(worker);

            // Додаємо обробники подій для інтерфейсу
            const generateBtn = modelInterface.querySelector('.generate-btn');
            const input = modelInterface.querySelector('.model-input');
            
            if (generateBtn && input) {
                generateBtn.addEventListener('click', () => {
                    const prompt = input.value;
                    if (prompt) {
                        worker.postMessage({
                            type: 'generate',
                            prompt: prompt
                        });
                    }
                });
            }

            worker.onmessage = (e) => {
                if (e.data.type === 'progress') {
                    statusText.textContent = e.data.message;
                } else if (e.data.type === 'result') {
                    this.displayResults(e.data.result, modelName);
                } else if (e.data.type === 'error') {
                    statusText.textContent = e.data.message;
                }
            };

            this.startPerformanceMonitoring();

        } catch (error) {
            statusText.textContent = 'Error loading model: ' + error.message;
        }
    }

    getModelInterface(modelName) {
        const interfaces = {
            'gpt2': `
                <div class="input-group">
                    <textarea placeholder="Enter your prompt..." class="model-input"></textarea>
                    <button class="generate-btn">Generate</button>
                </div>
                <div class="output-display"></div>
            `,
            'stable-diffusion-lite': `
                <div class="input-group">
                    <input type="text" placeholder="Describe the image..." class="model-input">
                    <div class="image-settings">
                        <select class="style-select">
                            <option value="realistic">Realistic</option>
                            <option value="artistic">Artistic</option>
                            <option value="anime">Anime</option>
                        </select>
                        <input type="range" min="1" max="20" value="10" class="steps-slider">
                    </div>
                    <button class="generate-btn">Generate Image</button>
                </div>
                <div class="image-display"></div>
            `,
            'codebert': `
                <div class="input-group">
                    <div class="code-editor" contenteditable="true"></div>
                    <button class="complete-btn">Complete Code</button>
                </div>
                <div class="suggestions-panel"></div>
            `
        };
        
        return interfaces[modelName] || '<div>Interface not found</div>';
    }

    async startPerformanceMonitoring() {
        const cpuUsage = document.getElementById('cpuUsage');
        const ramUsage = document.getElementById('ramUsage');

        const updateMetrics = async () => {
            if ('memory' in performance) {
                const memory = performance.memory;
                ramUsage.textContent = `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`;
            }

            // Симуляція навантаження CPU
            cpuUsage.textContent = `${Math.round(Math.random() * 30 + 20)}%`;
        };

        this.monitoringInterval = setInterval(updateMetrics, 1000);
    }

    displayResults(result, modelName) {
        const outputDisplay = document.querySelector('.output-display, .image-display, .suggestions-panel');
        
        switch(modelName) {
            case 'gpt2':
                outputDisplay.innerHTML = `<pre>${result.text}</pre>`;
                break;
            case 'stable-diffusion-lite':
                outputDisplay.innerHTML = `<img src="${result.imageUrl}" alt="Generated image">`;
                break;
            case 'codebert':
                outputDisplay.innerHTML = result.suggestions.map(s => 
                    `<div class="suggestion">${s}</div>`
                ).join('');
                break;
        }
    }

    cleanup() {
        this.workerPool.forEach(worker => worker.terminate());
        this.workerPool = [];
        clearInterval(this.monitoringInterval);
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    const runner = new ModelRunner();

    // Обробка фільтрів
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            document.querySelectorAll('.tool-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            document.querySelectorAll('.filter-btn').forEach(b => 
                b.classList.toggle('active', b === btn));
        });
    });

    // Пошук інструментів
    document.getElementById('toolSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(card => {
            const toolName = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = toolName.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Запуск моделей
    document.querySelectorAll('.run-locally-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            runner.loadModel(btn.dataset.model);
        });
    });

    // Закриття runner'а
    const closeRunner = document.querySelector('.close-runner');
    if (closeRunner) {
        closeRunner.addEventListener('click', () => {
            document.getElementById('modelRunner').style.display = 'none';
            runner.cleanup();
        });
    }
});
