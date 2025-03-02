document.addEventListener('DOMContentLoaded', function() {
    // Створюємо екземпляр нейронної анімації
    const neuralBg = document.getElementById('neuralNetwork');
    if (neuralBg) {
        new NeuralAnimation(neuralBg, {
            nodeCount: 30,
            connectionDistance: 200,
            nodeSize: 4,
            animationSpeed: 0.3,
            pulseChance: 0.05
        });
    }

    // Додаємо ефект наведення для карток
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
