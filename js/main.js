import { QuestionManager } from './questions.js';
import { ResultsAnalyzer, ResultsVisualizer } from './results.js';
import soundEngine from './sound-engine.js';

class MindExplorer {
    constructor() {
        this.questionManager = new QuestionManager();
        this.resultsAnalyzer = new ResultsAnalyzer();
        this.resultsVisualizer = new ResultsVisualizer();
        this.currentSection = 'welcome';
        this.userResponses = [];
        this.animationsEnabled = true;
        
        // Initialize the sound engine
        soundEngine.initialize();
        
        // DOM references
        this.elements = {
            welcomeSection: document.getElementById('welcome-section'),
            assessmentSection: document.getElementById('assessment-section'),
            resultsSection: document.getElementById('results-section'),
            questionContainer: document.getElementById('question-container'),
            optionsContainer: document.getElementById('options-container'),
            progressBar: document.getElementById('progress-bar'),
            resultsContainer: document.getElementById('results-container'),
            startButton: document.getElementById('start-button'),
            nextButton: document.getElementById('next-button'),
            backButton: document.getElementById('back-button'),
            soundToggle: document.getElementById('sound-toggle'),
            themeToggle: document.getElementById('theme-toggle'),
            animationToggle: document.getElementById('animation-toggle'),
            loader: document.getElementById('loader')
        };
        
        // Initialize UI
        this.initializeUI();
        
        // Apply theme from localStorage if available
        this.applyTheme();
        
        // Show welcome section with animation
        this.showSection('welcome');
    }
    
    initializeUI() {
        // Add event listeners
        this.elements.startButton.addEventListener('click', () => {
            soundEngine.play('click');
            this.startAssessment();
        });
        
        this.elements.nextButton.addEventListener('click', () => {
            soundEngine.play('click');
            this.nextQuestion();
        });
        
        this.elements.backButton.addEventListener('click', () => {
            soundEngine.play('click');
            this.previousQuestion();
        });
        
        // Sound toggle
        this.elements.soundToggle.addEventListener('click', () => {
            const isMuted = soundEngine.toggleMute();
            this.elements.soundToggle.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
            
            // Play a sound if unmuting
            if (!isMuted) {
                soundEngine.play('click');
            }
        });
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            soundEngine.play('click');
            this.toggleTheme();
        });
        
        // Animation toggle
        this.elements.animationToggle.addEventListener('click', () => {
            soundEngine.play('click');
            this.toggleAnimations();
        });
        
        // Initialize animations
        this.initializeAnimations();
        
        // Resume audio context on user interaction (needed for some browsers)
        document.addEventListener('click', () => {
            soundEngine.resume();
        }, { once: true });
    }
    
    startAssessment() {
        // Play transition sound
        soundEngine.play('transition');
        
        // Reset user responses
        this.userResponses = [];
        
        // Initialize questions
        this.questionManager.initializeQuestions();
        
        // Show first question
        this.showQuestion(0);
        
        // Show assessment section with animation
        this.showSection('assessment');
    }
    
    showQuestion(index) {
        const question = this.questionManager.getQuestion(index);
        if (!question) return;
        
        // Play sound based on question type
        if (question.sound) {
            soundEngine.play(question.sound);
        }
        
        // Update question text with animation
        this.elements.questionContainer.innerHTML = `
            <div class="question-number">Question ${index + 1}/${this.questionManager.getTotalQuestions()}</div>
            <h2 class="question-text">${question.text}</h2>
        `;
        
        // Update options with animation
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = typeof option === 'string' ? option : option.text;
            optionElement.style.animationDelay = `${optionIndex * 0.1}s`;
            
            optionElement.addEventListener('click', () => {
                soundEngine.play('click');
                this.selectOption(index, optionIndex);
            });
            
            this.elements.optionsContainer.appendChild(optionElement);
        });
        
        // Update progress bar
        const progress = ((index + 1) / this.questionManager.getTotalQuestions()) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        
        // Show/hide back button based on index
        this.elements.backButton.style.display = index > 0 ? 'block' : 'none';
        
        // Add visual mood class to body
        if (question.visualMood) {
            document.body.className = `mood-${question.visualMood}`;
        } else {
            document.body.className = '';
        }
        
        // Handle timed questions
        if (question.timed) {
            this.startTimer(question.timeLimit, index);
        }
    }
    
    selectOption(questionIndex, optionIndex) {
        // Store user response
        this.userResponses[questionIndex] = optionIndex;
        
        // Highlight selected option
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
                
                // Play correct/incorrect sound if applicable
                const question = this.questionManager.getQuestion(questionIndex);
                if (question.correctAnswer !== undefined) {
                    if (optionIndex === question.correctAnswer) {
                        soundEngine.play('correct');
                    } else {
                        soundEngine.play('incorrect');
                    }
                }
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Automatically go to next question after a short delay
        setTimeout(() => {
            this.nextQuestion();
        }, 800);
    }
    
    nextQuestion() {
        const currentIndex = this.questionManager.getCurrentIndex();
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < this.questionManager.getTotalQuestions()) {
            // Go to next question
            this.questionManager.setCurrentIndex(nextIndex);
            this.showQuestion(nextIndex);
        } else {
            // Assessment complete
            this.completeAssessment();
        }
    }
    
    previousQuestion() {
        const currentIndex = this.questionManager.getCurrentIndex();
        const prevIndex = currentIndex - 1;
        
        if (prevIndex >= 0) {
            // Go to previous question
            this.questionManager.setCurrentIndex(prevIndex);
            this.showQuestion(prevIndex);
        }
    }
    
    startTimer(seconds, questionIndex) {
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Create timer element
        const timerElement = document.createElement('div');
        timerElement.className = 'timer';
        timerElement.innerHTML = `<div class="timer-bar"></div><div class="timer-text">${seconds}</div>`;
        this.elements.questionContainer.appendChild(timerElement);
        
        // Start timer animation
        const timerBar = timerElement.querySelector('.timer-bar');
        timerBar.style.transition = `width ${seconds}s linear`;
        timerBar.style.width = '0%';
        
        // Update timer text
        let timeLeft = seconds;
        const timerText = timerElement.querySelector('.timer-text');
        
        this.timer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;
            
            if (timeLeft <= 5) {
                timerElement.classList.add('warning');
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                soundEngine.play('timeout');
                
                // Auto-select an option or move to next question
                if (this.userResponses[questionIndex] === undefined) {
                    // If no option selected, select a random one
                    const randomOption = Math.floor(Math.random() * this.questionManager.getQuestion(questionIndex).options.length);
                    this.selectOption(questionIndex, randomOption);
                } else {
                    // If already selected, move to next question
                    this.nextQuestion();
                }
            }
        }, 1000);
    }
    
    completeAssessment() {
        // Play completion sound
        soundEngine.play('complete');
        
        // Clear any active timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Show loader while analyzing results
        this.elements.loader.style.display = 'flex';
        
        // Analyze results
        setTimeout(() => {
            const results = this.resultsAnalyzer.analyzeResponses(
                this.questionManager.getQuestions(),
                this.userResponses
            );
            
            // Generate results visualization
            this.resultsVisualizer.visualizeResults(results, this.elements.resultsContainer);
            
            // Hide loader
            this.elements.loader.style.display = 'none';
            
            // Show results section with animation
            this.showSection('results');
            
            // Reset body class
            document.body.className = '';
        }, 1500); // Simulate processing time
    }
    
    showSection(sectionName) {
        // Hide all sections first
        ['welcome', 'assessment', 'results'].forEach(section => {
            this.elements[`${section}Section`].style.opacity = '0';
            this.elements[`${section}Section`].style.display = 'none';
        });
        
        // Show the selected section with animation
        const sectionElement = this.elements[`${sectionName}Section`];
        sectionElement.style.display = 'flex';
        
        // Trigger reflow
        void sectionElement.offsetWidth;
        
        // Fade in
        sectionElement.style.opacity = '1';
        
        // Update current section
        this.currentSection = sectionName;
    }
    
    toggleTheme() {
        const body = document.body;
        const isDarkTheme = body.classList.contains('dark-theme');
        
        if (isDarkTheme) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        
        if (this.animationsEnabled) {
            document.documentElement.style.setProperty('--animation-duration', '0.5s');
            this.elements.animationToggle.innerHTML = '<i class="fas fa-film"></i>';
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0s');
            this.elements.animationToggle.innerHTML = '<i class="fas fa-stop"></i>';
        }
    }
    
    initializeAnimations() {
        // Initialize particles
        this.initializeParticles();
        
        // Initialize 3D effects
        this.initialize3DEffects();
    }
    
    initializeParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    initialize3DEffects() {
        // Add 3D perspective to containers
        const containers = document.querySelectorAll('.section-container');
        containers.forEach(container => {
            container.style.perspective = '1000px';
            
            // Add hover effect to children
            const children = container.querySelectorAll('.card, .option, button');
            children.forEach(child => {
                child.addEventListener('mousemove', e => {
                    if (!this.animationsEnabled) return;
                    
                    const rect = child.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const angleX = (y - centerY) / 20;
                    const angleY = (centerX - x) / 20;
                    
                    child.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
                    child.style.boxShadow = `0 5px 15px rgba(0,0,0,0.3)`;
                });
                
                child.addEventListener('mouseleave', () => {
                    child.style.transform = 'rotateX(0) rotateY(0) scale(1)';
                    child.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                });
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create Mind Explorer instance
    window.mindExplorer = new MindExplorer();
    
    // Add loading animation
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
    
    // Simulate loading time
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});