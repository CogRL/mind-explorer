import { QuestionManager, QuestionType } from './questions.js';
import MindScene from './three-scene.js';
import { ResultsAnalyzer, ResultsVisualizer } from './results.js';

class MindExplorer {
    constructor() {
        this.questionManager = null;
        this.scene = new MindScene('three-container');
        this.resultsAnalyzer = new ResultsAnalyzer();
        this.resultsVisualizer = new ResultsVisualizer('results-screen');
        
        // Audio setup
        this.sounds = {
            click: new Audio('sounds/click.mp3'),
            transition: new Audio('sounds/transition.mp3'),
            complete: new Audio('sounds/complete.mp3')
        };

        this.initializeEventListeners();
        this.showLoadingScreen();
    }

    initializeEventListeners() {
        // Mode selection buttons
        document.getElementById('quick-mode').addEventListener('click', () => this.startGame('quick'));
        document.getElementById('deep-mode').addEventListener('click', () => this.startGame('deep'));

        // Answer options container
        document.getElementById('answer-options').addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn')) {
                this.handleAnswer(e.target.dataset.answer);
            }
        });

        // Results screen buttons
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('share-btn').addEventListener('click', () => this.shareResults());

        // Loading screen animation
        this.animateLoadingScreen();
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
        
        // Simulate loading time (replace with actual asset loading)
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        }, 2000);
    }

    animateLoadingScreen() {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = '100%';
    }

    startGame(mode) {
        this.sounds.click.play();
        this.questionManager = new QuestionManager(mode);
        
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        if (mode === 'deep') {
            document.getElementById('timer').classList.remove('hidden');
        }
        
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questionManager.getCurrentQuestion();
        document.getElementById('question-text').textContent = question.text;
        
        // Update question counter
        const currentQuestion = this.questionManager.currentIndex + 1;
        document.getElementById('current-question').textContent = currentQuestion;
        document.getElementById('total-questions').textContent = this.questionManager.questionCount;

        // Generate answer buttons
        const answerContainer = document.getElementById('answer-options');
        answerContainer.innerHTML = question.options.map((option, index) => `
            <button class="answer-btn" data-answer="${option}">
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                ${option}
            </button>
        `).join('');

        // Start timer if applicable
        if (question.timeLimit) {
            this.startTimer(question.timeLimit);
        }

        // Animate scene transition
        this.scene.transitionToNextQuestion();
    }

    startTimer(seconds) {
        const timerElement = document.getElementById('timer-value');
        timerElement.textContent = seconds;
        
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            seconds--;
            timerElement.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp();
            }
        }, 1000);
    }

    handleTimeUp() {
        // Auto-submit current answer or skip question
        this.handleAnswer(null);
    }

    handleAnswer(answer) {
        clearInterval(this.timerInterval);
        this.sounds.click.play();

        const result = this.questionManager.submitAnswer(answer);
        
        // Update visualization based on answer
        const question = this.questionManager.getCurrentQuestion();
        this.scene.updateVisualization(
            question.id[0], // First letter indicates question type
            result.score * 100
        );

        if (result.isLast) {
            this.showResults();
        } else {
            this.questionManager.nextQuestion();
            this.sounds.transition.play();
            this.displayQuestion();
        }
    }

    showResults() {
        this.sounds.complete.play();
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        const results = this.resultsAnalyzer.analyzeResults(this.questionManager.scores);
        this.resultsVisualizer.displayResults(results);
    }

    restart() {
        this.sounds.click.play();
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
        
        // Reset game state
        this.questionManager = null;
        clearInterval(this.timerInterval);
    }

    shareResults() {
        const results = this.questionManager.getResults();
        const shareText = `I just explored my mind with MindExplorer!\n
Intelligence: ${results.intelligence}%\n
Creativity: ${results.creativity}%\n
Try it yourself at mindexplorer.com`;

        if (navigator.share) {
            navigator.share({
                title: 'My Mind Explorer Results',
                text: shareText,
                url: 'https://mindexplorer.com'
            });
        } else {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Results copied to clipboard!'))
                .catch(err => console.error('Failed to copy results:', err));
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MindExplorer();
}); 