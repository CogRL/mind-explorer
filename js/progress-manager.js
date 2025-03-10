class ProgressManager {
    constructor() {
        this.currentStage = 0;
        this.totalStages = 5; // Total number of stages/games
        this.performances = [];
        this.initializeUI();
    }

    initializeUI() {
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div class="progress-bar"></div>';
        document.body.appendChild(progressContainer);

        // Create stage indicator
        const stageIndicator = document.createElement('div');
        stageIndicator.className = 'stage-indicator';
        stageIndicator.innerHTML = `
            <div class="stage-title">Stage ${this.currentStage + 1}/${this.totalStages}</div>
            <div class="stage-dots">
                ${Array(this.totalStages).fill(0).map((_, i) => 
                    `<div class="stage-dot${i === 0 ? ' active' : ''}"></div>`
                ).join('')}
            </div>
        `;
        document.body.appendChild(stageIndicator);

        // Create performance stats
        const performanceStats = document.createElement('div');
        performanceStats.className = 'performance-stats';
        performanceStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Average Score:</span>
                <span class="stat-value">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Best Time:</span>
                <span class="stat-value">0ms</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Accuracy:</span>
                <span class="stat-value">0%</span>
                <span class="stat-trend">+0%</span>
            </div>
        `;
        document.body.appendChild(performanceStats);

        // Show UI elements with a slight delay
        setTimeout(() => {
            stageIndicator.classList.add('visible');
            performanceStats.classList.add('visible');
        }, 1000);
    }

    updateProgress(progress) {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    updateStage(stage, completed = false) {
        this.currentStage = stage;
        const dots = document.querySelectorAll('.stage-dot');
        const title = document.querySelector('.stage-title');

        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index < stage) {
                dot.classList.add('completed');
            } else if (index === stage) {
                dot.classList.add('active');
            }
        });

        if (title) {
            title.textContent = `Stage ${stage + 1}/${this.totalStages}`;
        }

        // Update progress bar
        this.updateProgress((stage / this.totalStages) * 100);
    }

    recordPerformance(stats) {
        this.performances.push(stats);
        this.updatePerformanceStats();
    }

    updatePerformanceStats() {
        const stats = document.querySelector('.performance-stats');
        if (!stats || this.performances.length === 0) return;

        const latest = this.performances[this.performances.length - 1];
        const previous = this.performances[this.performances.length - 2];

        // Update average score
        const avgScore = Math.round(
            this.performances.reduce((sum, p) => sum + p.score, 0) / this.performances.length
        );
        stats.querySelector('.stat-value').textContent = avgScore;

        // Update best time
        const bestTime = Math.min(...this.performances.map(p => p.time));
        stats.querySelectorAll('.stat-value')[1].textContent = `${bestTime}ms`;

        // Update accuracy and trend
        const accuracy = Math.round(latest.accuracy * 100);
        const accuracyEl = stats.querySelectorAll('.stat-value')[2];
        const trendEl = stats.querySelector('.stat-trend');
        
        accuracyEl.textContent = `${accuracy}%`;
        
        if (previous) {
            const accuracyDiff = Math.round((latest.accuracy - previous.accuracy) * 100);
            trendEl.textContent = `${accuracyDiff >= 0 ? '+' : ''}${accuracyDiff}%`;
            trendEl.className = `stat-trend${accuracyDiff >= 0 ? '' : ' negative'}`;
        }
    }

    reset() {
        this.currentStage = 0;
        this.performances = [];
        this.updateStage(0);
        this.updateProgress(0);
    }
}

export default ProgressManager; 