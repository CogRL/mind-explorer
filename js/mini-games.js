export class MiniGameManager {
    constructor() {
        this.games = {
            reactionTime: new ReactionTimeGame(),
            patternMemory: new PatternMemoryGame(),
            numberSequence: new NumberSequenceGame(),
            spatialPuzzle: new SpatialPuzzleGame()
        };
        this.currentGame = null;
        this.gameContainer = null;
        this.onGameComplete = null;
    }

    initializeGame(gameType, container, onComplete) {
        this.gameContainer = container;
        this.onGameComplete = onComplete;
        this.currentGame = this.games[gameType];
        
        // Create game intro screen
        const introScreen = document.createElement('div');
        introScreen.className = 'game-intro';
        introScreen.innerHTML = `
            <h3>${this.currentGame.title}</h3>
            <p>${this.currentGame.instructions}</p>
            <button id="start-game" class="start-game-btn">Got it!</button>
        `;
        
        container.innerHTML = '';
        container.appendChild(introScreen);
        
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        this.gameContainer.innerHTML = '';
        this.currentGame.start(this.gameContainer, (score) => {
            if (this.onGameComplete) {
                this.onGameComplete(score);
            }
        });
    }
}

class ReactionTimeGame {
    constructor() {
        this.title = "Lightning Reflexes";
        this.instructions = "When the screen turns green, click as fast as you can! But be careful - clicking too early will reset the test. We'll take your best time out of 5 attempts.";
        this.timeoutId = null;
        this.startTime = null;
        this.container = null;
        this.onComplete = null;
        this.attempts = 0;
        this.maxAttempts = 5;
        this.bestTime = Infinity;
        this.audioContext = null;
        this.sounds = {};
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sounds
        this.sounds = {
            ready: this.createTone(440, 0.1), // A4 note
            go: this.createTone(880, 0.1),    // A5 note
            fail: this.createTone(220, 0.2),  // A3 note
            success: this.createTone([440, 554.37, 659.25], 0.2) // A4, C#5, E5 (A major chord)
        };
    }

    createTone(frequencies, duration) {
        return () => {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(this.audioContext.destination);

            if (Array.isArray(frequencies)) {
                // Create chord
                frequencies.forEach(freq => {
                    const osc = this.audioContext.createOscillator();
                    osc.frequency.value = freq;
                    osc.connect(gainNode);
                    osc.start();
                    osc.stop(this.audioContext.currentTime + duration);
                });
            } else {
                // Create single tone
                const osc = this.audioContext.createOscillator();
                osc.frequency.value = frequencies;
                osc.connect(gainNode);
                osc.start();
                osc.stop(this.audioContext.currentTime + duration);
            }

            // Add fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        };
    }

    calculatePercentile(reactionTime) {
        if (reactionTime < 160) return 99;
        if (reactionTime < 200) return 90;
        if (reactionTime < 230) return 75;
        if (reactionTime < 270) return 50;
        return Math.max(1, Math.round(50 * (400 - reactionTime) / 130));
    }

    start(container, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.attempts = 0;
        this.bestTime = Infinity;
        this.initAudio();
        
        this.createGameScreen();
        this.startNewAttempt();
    }

    createGameScreen() {
        const gameScreen = document.createElement('div');
        gameScreen.className = 'reaction-game';
        gameScreen.innerHTML = `
            <div class="game-area waiting">
                <div class="game-text">Get Ready...</div>
            </div>
            <div class="score-display">
                <div class="attempts">Attempt: 1/${this.maxAttempts}</div>
                <div class="best-time">Best: --</div>
            </div>
        `;
        this.container.innerHTML = '';
        this.container.appendChild(gameScreen);
        
        const gameArea = gameScreen.querySelector('.game-area');
        gameArea.addEventListener('click', () => this.handleClick(gameArea));
    }

    startNewAttempt() {
        this.attempts++;
        this.updateScoreDisplay();
        
        const gameArea = this.container.querySelector('.game-area');
        gameArea.className = 'game-area waiting';
        gameArea.querySelector('.game-text').textContent = 'Get Ready...';
        
        this.sounds.ready();
        
        // Random delay between 1-5 seconds
        this.timeoutId = setTimeout(() => {
            if (gameArea.classList.contains('waiting')) {
                gameArea.classList.remove('waiting');
                gameArea.classList.add('go');
                gameArea.querySelector('.game-text').textContent = 'CLICK NOW!';
                this.startTime = Date.now();
                this.sounds.go();
            }
        }, 1000 + Math.random() * 4000);
    }

    handleClick(gameArea) {
        if (gameArea.classList.contains('waiting')) {
            // Clicked too early
            clearTimeout(this.timeoutId);
            gameArea.classList.add('failed');
            gameArea.querySelector('.game-text').textContent = 'Too Early!';
            this.sounds.fail();
            
            setTimeout(() => {
                if (this.attempts < this.maxAttempts) {
                    this.startNewAttempt();
                } else {
                    this.endGame();
                }
            }, 1500);
        } else if (gameArea.classList.contains('go')) {
            // Successful click
            const reactionTime = Date.now() - this.startTime;
            this.bestTime = Math.min(this.bestTime, reactionTime);
            
            gameArea.classList.remove('go');
            gameArea.classList.add('complete');
            
            const percentile = this.calculatePercentile(reactionTime);
            gameArea.querySelector('.game-text').innerHTML = `
                ${reactionTime}ms<br>
                <span class="percentile">Top ${percentile}%</span>
            `;
            
            this.updateScoreDisplay();
            this.sounds.success();
            
            setTimeout(() => {
                if (this.attempts < this.maxAttempts) {
                    this.startNewAttempt();
                } else {
                    this.endGame();
                }
            }, 1500);
        }
    }

    updateScoreDisplay() {
        const scoreDisplay = this.container.querySelector('.score-display');
        scoreDisplay.innerHTML = `
            <div class="attempts">Attempt: ${this.attempts}/${this.maxAttempts}</div>
            <div class="best-time">Best: ${this.bestTime === Infinity ? '--' : this.bestTime + 'ms'}</div>
        `;
    }

    endGame() {
        // Convert best time to score (0-100)
        const score = Math.max(0, Math.min(100, 100 - (this.bestTime - 150) / 2));
        const percentile = this.calculatePercentile(this.bestTime);
        
        const gameArea = this.container.querySelector('.game-area');
        gameArea.innerHTML = `
            <div class="game-text">
                Final Score<br>
                Best Time: ${this.bestTime}ms<br>
                <span class="percentile">Top ${percentile}%</span>
            </div>
        `;
        
        setTimeout(() => {
            this.onComplete({
                score: score,
                bestTime: this.bestTime,
                percentile: percentile
            });
        }, 2000);
    }
}

class PatternMemoryGame {
    constructor() {
        this.title = "Pattern Memory";
        this.instructions = "Watch the pattern of highlighted squares and repeat it in order. Each successful round adds one more step. Reach level 20 to achieve legendary status!";
        this.pattern = [];
        this.playerPattern = [];
        this.level = 1;
        this.gridSize = 4; // Increased from 3 for more challenge
        this.speed = 1000; // Base speed in ms
        this.lives = 3;
        this.score = 0;
        this.audioContext = null;
        this.sounds = {};
        this.isShowingPattern = false;
        this.highestLevel = 1;
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sounds using pentatonic scale for pleasant memory sequence
        this.sounds = {
            sequence: [
                this.createTone(523.25), // C5
                this.createTone(587.33), // D5
                this.createTone(659.25), // E5
                this.createTone(783.99), // G5
                this.createTone(880.00)  // A5
            ],
            correct: this.createTone([523.25, 659.25, 783.99], 0.2), // C major chord
            wrong: this.createTone([466.16, 554.37], 0.2), // Dissonant interval
            levelUp: this.createTone([523.25, 659.25, 783.99, 987.77], 0.3) // Extended chord
        };
    }

    createTone(frequencies, duration = 0.1) {
        return () => {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(this.audioContext.destination);

            if (Array.isArray(frequencies)) {
                frequencies.forEach(freq => {
                    const osc = this.audioContext.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    osc.connect(gainNode);
                    osc.start();
                    osc.stop(this.audioContext.currentTime + duration);
                });
            } else {
                const osc = this.audioContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = frequencies;
                osc.connect(gainNode);
                osc.start();
                osc.stop(this.audioContext.currentTime + duration);
            }

            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        };
    }

    calculatePercentile(level) {
        if (level >= 20) return 99.9;
        if (level >= 15) return 99;
        if (level >= 12) return 90;
        if (level >= 10) return 75;
        if (level >= 8) return 50;
        return Math.max(1, Math.round(50 * level / 8));
    }

    start(container, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.pattern = [];
        this.playerPattern = [];
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.initAudio();
        
        this.createGameScreen();
        this.generatePattern();
    }

    createGameScreen() {
        const gameScreen = document.createElement('div');
        gameScreen.className = 'pattern-game';
        gameScreen.innerHTML = `
            <div class="game-header">
                <div class="level-display">Level ${this.level}</div>
                <div class="lives-display">❤️".repeat(this.lives)</div>
                <div class="score-display">Score: ${this.score}</div>
            </div>
            <div class="pattern-grid size-${this.gridSize}">
                ${Array(this.gridSize * this.gridSize).fill(0).map((_, i) => 
                    `<div class="pattern-cell" data-index="${i}">
                        <div class="cell-inner"></div>
                    </div>`
                ).join('')}
            </div>
            <div class="game-footer">
                <div class="speed-indicator">Pattern Speed: ${Math.round(100 * 1000/this.speed)}%</div>
                <div class="streak-bonus">Streak Bonus: x${Math.floor(this.level/5) + 1}</div>
            </div>
        `;
        
        this.container.innerHTML = '';
        this.container.appendChild(gameScreen);
    }

    generatePattern() {
        // Add a new step to the pattern
        this.pattern.push(Math.floor(Math.random() * (this.gridSize * this.gridSize)));
        this.playerPattern = [];
        this.isShowingPattern = true;
        this.updateDisplay();
        
        // Speed increases with level
        this.speed = Math.max(300, 1000 - (this.level * 50));
        
        setTimeout(() => this.showPattern(), 1000);
    }

    showPattern() {
        let i = 0;
        const interval = setInterval(() => {
            if (i < this.pattern.length) {
                if (i > 0) {
                    const prevCell = this.container.querySelector(`[data-index="${this.pattern[i-1]}"]`);
                    prevCell.classList.remove('highlight');
                }
                
                const cell = this.container.querySelector(`[data-index="${this.pattern[i]}"]`);
                cell.classList.add('highlight');
                this.sounds.sequence[i % this.sounds.sequence.length]();
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    const lastCell = this.container.querySelector(`[data-index="${this.pattern[i-1]}"]`);
                    lastCell.classList.remove('highlight');
                    this.isShowingPattern = false;
                    this.enablePlayerInput();
                }, this.speed);
            }
        }, this.speed);
    }

    enablePlayerInput() {
        const cells = this.container.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            cell.classList.add('clickable');
            cell.addEventListener('click', () => this.handleCellClick(parseInt(cell.dataset.index)));
        });
    }

    disablePlayerInput() {
        const cells = this.container.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            cell.classList.remove('clickable');
        });
    }

    handleCellClick(index) {
        if (this.isShowingPattern) return;
        
        const cell = this.container.querySelector(`[data-index="${index}"]`);
        cell.classList.add('highlight');
        setTimeout(() => cell.classList.remove('highlight'), 300);
        
        this.playerPattern.push(index);
        this.sounds.sequence[this.playerPattern.length % this.sounds.sequence.length]();
        
        if (this.pattern[this.playerPattern.length - 1] !== index) {
            // Wrong pattern
            this.handleMistake();
        } else if (this.playerPattern.length === this.pattern.length) {
            // Completed pattern
            this.handleSuccess();
        }
    }

    handleMistake() {
        this.lives--;
        this.sounds.wrong();
        this.disablePlayerInput();
        
        const gameScreen = this.container.querySelector('.pattern-game');
        gameScreen.classList.add('mistake');
        
        setTimeout(() => {
            gameScreen.classList.remove('mistake');
            if (this.lives > 0) {
                this.playerPattern = [];
                this.updateDisplay();
                this.showPattern();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    handleSuccess() {
        this.level++;
        this.highestLevel = Math.max(this.highestLevel, this.level);
        this.score += 100 * (Math.floor(this.level/5) + 1); // Score with streak bonus
        this.sounds.levelUp();
        this.disablePlayerInput();
        
        const gameScreen = this.container.querySelector('.pattern-game');
        gameScreen.classList.add('success');
        
        setTimeout(() => {
            gameScreen.classList.remove('success');
            this.updateDisplay();
            this.generatePattern();
        }, 1000);
    }

    updateDisplay() {
        const levelDisplay = this.container.querySelector('.level-display');
        const livesDisplay = this.container.querySelector('.lives-display');
        const scoreDisplay = this.container.querySelector('.score-display');
        const speedIndicator = this.container.querySelector('.speed-indicator');
        const streakBonus = this.container.querySelector('.streak-bonus');
        
        if (levelDisplay) levelDisplay.textContent = `Level ${this.level}`;
        if (livesDisplay) livesDisplay.textContent = '❤️'.repeat(this.lives);
        if (scoreDisplay) scoreDisplay.textContent = `Score: ${this.score}`;
        if (speedIndicator) speedIndicator.textContent = `Pattern Speed: ${Math.round(100 * 1000/this.speed)}%`;
        if (streakBonus) streakBonus.textContent = `Streak Bonus: x${Math.floor(this.level/5) + 1}`;
    }

    endGame() {
        const percentile = this.calculatePercentile(this.highestLevel);
        const finalScore = {
            score: this.score,
            level: this.highestLevel,
            percentile: percentile
        };
        
        const gameScreen = this.container.querySelector('.pattern-game');
        gameScreen.innerHTML = `
            <div class="game-over">
                <h2>Game Over!</h2>
                <div class="final-stats">
                    <p>Highest Level: ${this.highestLevel}</p>
                    <p>Final Score: ${this.score}</p>
                    <p class="percentile">Top ${percentile}%</p>
                </div>
                <div class="achievement">
                    ${this.getAchievementBadge(this.highestLevel)}
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.onComplete(finalScore);
        }, 3000);
    }

    getAchievementBadge(level) {
        if (level >= 20) return '<div class="badge legendary">🏆 Memory Legend</div>';
        if (level >= 15) return '<div class="badge epic">🌟 Memory Master</div>';
        if (level >= 10) return '<div class="badge rare">💫 Pattern Pro</div>';
        if (level >= 5) return '<div class="badge common">✨ Memory Adept</div>';
        return '<div class="badge basic">🔰 Memory Novice</div>';
    }
}

class NumberSequenceGame {
    constructor() {
        this.title = "Number Sequence";
        this.instructions = "Find the missing number in the sequence. Type your answer and press Enter!";
        this.sequences = [
            { pattern: [2, 4, 6, 8], missing: 10, hint: "Add 2" },
            { pattern: [1, 2, 4, 8], missing: 16, hint: "Multiply by 2" },
            { pattern: [3, 6, 11, 18], missing: 27, hint: "Add increasing numbers" }
        ];
    }

    start(container, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        
        const sequence = this.sequences[Math.floor(Math.random() * this.sequences.length)];
        const gameScreen = document.createElement('div');
        gameScreen.className = 'sequence-game';
        gameScreen.innerHTML = `
            <div class="sequence-display">
                ${sequence.pattern.join(', ')}, ?
            </div>
            <input type="number" class="sequence-input" placeholder="Enter the next number">
            <div class="sequence-hint">${sequence.hint}</div>
        `;
        container.appendChild(gameScreen);
        
        const input = gameScreen.querySelector('.sequence-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const answer = parseInt(input.value);
                const score = answer === sequence.missing ? 100 : 0;
                setTimeout(() => {
                    this.onComplete(score);
                }, 1000);
            }
        });
    }
}

class SpatialPuzzleGame {
    constructor() {
        this.title = "Spatial Puzzle";
        this.instructions = "Rotate the shapes to match the target pattern. Click to rotate pieces!";
        this.pieces = ['⌞', '⌝', '⌟', '⌜'];
        this.target = null;
    }

    start(container, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        
        // Generate random target configuration
        this.target = [...this.pieces].sort(() => Math.random() - 0.5);
        const current = [...this.pieces];
        
        const gameScreen = document.createElement('div');
        gameScreen.className = 'spatial-game';
        gameScreen.innerHTML = `
            <div class="target-pattern">
                ${this.target.join('')}
            </div>
            <div class="current-pattern">
                ${current.map((piece, i) => `
                    <div class="piece" data-index="${i}">${piece}</div>
                `).join('')}
            </div>
        `;
        container.appendChild(gameScreen);
        
        const pieces = gameScreen.querySelectorAll('.piece');
        pieces.forEach(piece => {
            piece.addEventListener('click', () => this.rotatePiece(piece));
        });
    }

    rotatePiece(piece) {
        const index = parseInt(piece.dataset.index);
        const rotations = {
            '⌞': '⌝', '⌝': '⌟', '⌟': '⌜', '⌜': '⌞'
        };
        piece.textContent = rotations[piece.textContent];
        
        // Check if pattern matches
        const current = Array.from(this.container.querySelectorAll('.piece')).map(p => p.textContent);
        if (current.join('') === this.target.join('')) {
            setTimeout(() => {
                this.onComplete(100);
            }, 1000);
        }
    }
} 