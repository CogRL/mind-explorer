// Import statements must be at the top of the file
import { MiniGameManager } from './mini-games.js';
import soundEngine from './sound-engine.js';

// Question Types
const QuestionType = {
    INTELLIGENCE: 'intelligence',
    CREATIVITY: 'creativity',
    PERSONALITY: 'personality'
};

// Initialize question manager class
export class QuestionManager {
    constructor() {
        this.currentIndex = 0;
        this.questions = [];
        this.miniGameManager = new MiniGameManager();
    }
    
    initializeQuestions() {
        // Combine quick assessment questions for now
        this.questions = [...quickAssessmentQuestions];
        this.currentIndex = 0;
    }
    
    getQuestion(index) {
        return this.questions[index];
    }
    
    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }
    
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    setCurrentIndex(index) {
        this.currentIndex = index;
    }
    
    getTotalQuestions() {
        return this.questions.length;
    }
    
    getQuestions() {
        return this.questions;
    }
}

// Helper function to play sounds safely
function playQuestionSound(soundType) {
    soundEngine.play(soundType);
}

// Quick Assessment Questions (10 questions)
const quickAssessmentQuestions = [
    {
        text: "You're at a party with many people you don't know. What's your most likely action?",
        options: [
            { text: "Find someone interesting and start a deep conversation", impact: { extraversion: 1, openness: 2 } },
            { text: "Float between groups, meeting as many people as possible", impact: { extraversion: 3, agreeableness: 1 } },
            { text: "Find a small group and stay with them most of the night", impact: { extraversion: 0, agreeableness: 2 } },
            { text: "Observe people from a distance before engaging", impact: { extraversion: -1, analytical: 2 } }
        ],
        visualMood: "social",
        sound: 'personality'
    },
    {
        text: "You encounter an abstract artwork that everyone's praising, but you don't understand it. Your reaction?",
        options: [
            { text: "Ask questions to understand the artist's intention", impact: { openness: 2, analytical: 1 } },
            { text: "Pretend to appreciate it to fit in with others", impact: { neuroticism: 2, extraversion: 1 } },
            { text: "Openly admit you don't see what others see in it", impact: { openness: 1, neuroticism: -1 } },
            { text: "Spend time with it, trying to form your own interpretation", impact: { openness: 3, creativity: 2 } }
        ],
        visualMood: "artistic",
        sound: 'creativity'
    },
    {
        text: "You're given a complex puzzle with no instructions. How do you approach it?",
        options: [
            { text: "Try to find a pattern or system immediately", impact: { analytical: 3, conscientiousness: 1 } },
            { text: "Try random approaches until something works", impact: { creativity: 2, openness: 1 } },
            { text: "Look for similar puzzles you've solved before", impact: { analytical: 2, conscientiousness: 2 } },
            { text: "Ask someone else for a hint or help", impact: { agreeableness: 2, extraversion: 1 } }
        ],
        visualMood: "puzzle",
        timed: true,
        timeLimit: 20,
        type: "cognitive",
        sound: 'intelligence'
    },
    {
        text: "You have 30 seconds to solve this sequence: 2, 3, 5, 8, 12, ?",
        options: [
            { text: "17 (I analyzed each step: the differences form a pattern)", impact: { analytical: 3, conscientiousness: 1 }, reasoning: "Mathematical pattern analysis" },
            { text: "17 (I just sensed it was the right number)", impact: { creativity: 2, openness: 1 }, reasoning: "Intuitive pattern recognition" },
            { text: "18 (I tried different mathematical operations)", impact: { analytical: 2, conscientiousness: 2 }, reasoning: "Systematic trial and error" },
            { text: "I'd rather think about this longer than rush to an answer", impact: { conscientiousness: 2, neuroticism: 1 }, reasoning: "Cautious, thorough approach", isTimeoutDefault: true }
        ],
        visualMood: "puzzle",
        timed: true,
        timeLimit: 30,
        type: "cognitive",
        sound: 'intelligence'
    },
    {
        text: "Which scenario would make you feel most fulfilled?",
        options: [
            { text: "Creating something beautiful that moves people emotionally", impact: { creativity: 3, openness: 2 } },
            { text: "Solving a problem that others thought was impossible", impact: { analytical: 3, conscientiousness: 1 } },
            { text: "Being surrounded by people who appreciate and understand you", impact: { extraversion: 2, agreeableness: 2 } },
            { text: "Having the freedom to explore and learn without constraints", impact: { openness: 3, extraversion: 1 } }
        ],
        visualMood: "dream",
        sound: 'personality'
    },
    {
        text: "When faced with a controversial topic, you tend to:",
        options: [
            { text: "Consider multiple perspectives before forming an opinion", impact: { openness: 3, analytical: 2 } },
            { text: "Stand firmly by your principles regardless of opposition", impact: { conscientiousness: 2, neuroticism: -1 } },
            { text: "Adjust your views to maintain harmony in the group", impact: { agreeableness: 3, neuroticism: 1 } },
            { text: "Find unique angles that others might have missed", impact: { creativity: 3, openness: 2 } }
        ],
        visualMood: "conflict",
        sound: 'personality'
    },
    {
        text: "Solve this visual puzzle: If two squares overlap to form a rectangle where 1/4 of each square is in the overlap, what fraction of the combined area is the overlap?",
        options: [
            { text: "1/7 (I drew it out and calculated the areas)", impact: { analytical: 3, conscientiousness: 2 }, reasoning: "Systematic spatial calculation" },
            { text: "1/7 (I visualized it in my mind and estimated)", impact: { creativity: 2, openness: 2 }, reasoning: "Visual-spatial reasoning" },
            { text: "I'd need to work through this step-by-step with paper", impact: { conscientiousness: 2, analytical: 1 }, reasoning: "Thoroughness preference" },
            { text: "I find it difficult to mentally manipulate complex 3D shapes", impact: { neuroticism: 1, creativity: 1 }, reasoning: "Visual-spatial challenge", isTimeoutDefault: true }
        ],
        visualMood: "puzzle",
        timed: true,
        timeLimit: 30,
        type: "cognitive",
        sound: 'intelligence'
    },
    {
        text: "What does consciousness mean to you?",
        options: [
            { text: "A complex neurological phenomenon that emerges from brain activity", impact: { analytical: 3, openness: 1 }, reasoning: "Scientific materialist perspective" },
            { text: "A profound mystery that may transcend scientific explanation", impact: { openness: 3, creativity: 2 }, reasoning: "Philosophical/spiritual openness" },
            { text: "Self-awareness and the ability to reflect on one's own existence", impact: { conscientiousness: 1, analytical: 2 }, reasoning: "Psychological self-reflective view" },
            { text: "A shared experience that connects all sentient beings", impact: { agreeableness: 2, openness: 2 }, reasoning: "Interconnected/empathic perspective" }
        ],
        visualMood: "dream",
        type: "philosophical",
        sound: 'personality'
    },
    {
        text: "What's your approach to understanding your own emotions?",
        options: [
            { text: "Analyze them logically to identify patterns and triggers", impact: { analytical: 3, neuroticism: -1 } },
            { text: "Express them through creative outlets like art or writing", impact: { creativity: 3, openness: 2 } },
            { text: "Process them privately before sharing with others", impact: { neuroticism: 1, extraversion: -1 } },
            { text: "Discuss them with trusted people to gain perspective", impact: { extraversion: 2, agreeableness: 2 } }
        ],
        visualMood: "dream",
        sound: 'personality'
    },
    {
        text: "Given this ethical dilemma: 'You can save five people by sacrificing one.' Your first instinct is to:",
        options: [
            { text: "Analyze the utilitarian calculus of maximizing welfare", impact: { analytical: 3, openness: 1 }, reasoning: "Utilitarian ethical framework" },
            { text: "Consider your moral principles about the value of each human life", impact: { conscientiousness: 2, neuroticism: 1 }, reasoning: "Deontological/principled ethics" },
            { text: "Look for a creative third option that saves everyone", impact: { creativity: 3, openness: 2 }, reasoning: "Creative problem-solving approach" },
            { text: "Consider how your choice would impact the relationships involved", impact: { agreeableness: 2, extraversion: 1 }, reasoning: "Relational/care ethics" }
        ],
        visualMood: "conflict",
        type: "ethical",
        sound: 'personality'
    }
];

// Standard Assessment Questions (30 questions)
const standardAssessmentQuestions = [
    // Include all quick assessment questions
    ...quickAssessmentQuestions,
    // Additional standard questions
    {
        text: "You make a significant mistake at work that affects others. What's your response?",
        options: [
            { text: "Immediately take responsibility and work on fixing it", impact: { conscientiousness: 3, neuroticism: -1 } },
            { text: "Try to fix it quietly without anyone noticing", impact: { neuroticism: 2, conscientiousness: 1 } },
            { text: "Analyze how it happened to prevent future mistakes", impact: { analytical: 3, conscientiousness: 2 } },
            { text: "Find creative solutions that might turn the mistake into an opportunity", impact: { creativity: 3, openness: 2 } }
        ],
        visualMood: "work",
        sound: 'personality'
    },
    // ... [Continue adding all standard assessment questions]
];

// In-Depth Assessment Questions (50 questions)
const inDepthAssessmentQuestions = [
    // Include all standard assessment questions
    ...standardAssessmentQuestions,
    // Additional challenging questions
    {
        text: "Analyze this statement: 'The map is not the territory.' What does this mean to you?",
        options: [
            { text: "Our mental models always simplify complex realities", impact: { analytical: 2, openness: 2 }, reasoning: "Epistemological understanding" },
            { text: "Language and symbols can never fully capture experience", impact: { openness: 3, creativity: 1 }, reasoning: "Phenomenological perspective" },
            { text: "We should be cautious about mistaking abstractions for reality", impact: { conscientiousness: 2, analytical: 1 }, reasoning: "Pragmatic caution" },
            { text: "Different people can interpret the same situation in different valid ways", impact: { agreeableness: 2, openness: 2 }, reasoning: "Relativistic/pluralistic view" }
        ],
        visualMood: "puzzle",
        type: "philosophical",
        sound: 'intelligence'
    },
    {
        text: "You have 45 seconds to mentally rotate this 3D shape and determine how many faces it has: a truncated icosahedron (like a soccer ball).",
        options: [
            { text: "32 faces (I counted them systematically)", impact: { analytical: 3, conscientiousness: 2 }, reasoning: "Systematic visualization" },
            { text: "32 faces (I recognized the shape from experience)", impact: { analytical: 2, openness: 1 }, reasoning: "Knowledge application" },
            { text: "I can visualize it but need more time to count accurately", impact: { conscientiousness: 2, analytical: 1 }, reasoning: "Thoroughness preference" },
            { text: "I find it difficult to mentally manipulate complex 3D shapes", impact: { neuroticism: 1, creativity: 1 }, reasoning: "Visual-spatial challenge", isTimeoutDefault: true }
        ],
        visualMood: "puzzle",
        timed: true,
        timeLimit: 45,
        type: "cognitive",
        sound: 'intelligence'
    },
    // ... [Continue adding all in-depth questions]
];

// Additional Mind-Explorer questions
const mindExplorerQuestions = [
    {
        id: "me1",
        text: "When faced with a complex problem, which approach do you typically take first?",
        options: [
            "Break it down into smaller, manageable parts",
            "Look for patterns or similarities to known solutions",
            "Brainstorm multiple possible approaches",
            "Gather more information before proceeding"
        ],
        type: "cognitive",
        weight: {
            analytical: 3,
            creative: 2,
            systematic: 4
        }
    },
    {
        id: "me2",
        text: "In a hypothetical scenario where you could instantly master any skill, what would you choose and why?",
        options: [
            "A universal language to communicate with anyone",
            "The ability to understand complex systems instantly",
            "Perfect memory and recall",
            "The power to visualize and manipulate 4D objects"
        ],
        type: "cognitive",
        weight: {
            openness: 4,
            curiosity: 3,
            adaptability: 2
        }
    },
    {
        id: "me3",
        text: "If you could design a new color that has never been seen before, how would you describe it to others?",
        options: [
            "Through its emotional impact and feelings it evokes",
            "By comparing it to existing colors and their combinations",
            "Using mathematical and physical properties",
            "Through metaphors and abstract concepts"
        ],
        type: "creative",
        weight: {
            abstract: 4,
            communication: 3,
            creativity: 5
        }
    },
    {
        id: "me4",
        text: "In a world where time flows backwards, how would you adapt your decision-making process?",
        options: [
            "Focus on understanding consequences before actions",
            "Develop new frameworks for cause and effect",
            "Use different types of signals for each direction",
            "Create detailed maps of future-to-past connections"
        ],
        type: "abstract",
        weight: {
            adaptability: 4,
            analytical: 3,
            creativity: 4
        }
    },
    {
        id: "me5",
        text: "How do you approach understanding concepts that exist beyond human sensory perception?",
        options: [
            "Through mathematical models and equations",
            "By creating analogies to familiar experiences",
            "Using visualization and imagination",
            "By breaking them down into testable components"
        ],
        type: "cognitive",
        weight: {
            abstract: 5,
            analytical: 3,
            creativity: 3
        }
    },
    {
        id: "me6",
        text: "If you could redesign the human brain's architecture, what would you prioritize?",
        options: [
            "Enhanced pattern recognition and parallel processing",
            "Better emotional regulation and empathy circuits",
            "Improved memory storage and retrieval systems",
            "Stronger connections between logical and creative centers"
        ],
        type: "cognitive",
        weight: {
            analytical: 4,
            creativity: 3,
            systematic: 3
        }
    },
    {
        id: "me7",
        text: "In a world where thoughts are visible as colors above people's heads, how would you adapt?",
        options: [
            "Develop a system to categorize and interpret thought colors",
            "Create new forms of non-verbal communication",
            "Study the patterns of thought color changes",
            "Focus on controlling your own thought colors"
        ],
        type: "abstract",
        weight: {
            adaptability: 5,
            creativity: 3,
            emotional: 4
        }
    },
    {
        id: "me8",
        text: "You discover a mathematical equation that predicts human behavior. Your first step would be:",
        options: [
            "Verify the equation's accuracy across different cultures",
            "Explore its implications for free will and consciousness",
            "Look for practical applications in psychology",
            "Study how it could be used to improve society"
        ],
        type: "analytical",
        weight: {
            analytical: 5,
            ethical: 3,
            systematic: 4
        }
    },
    {
        id: "me9",
        text: "How would you approach teaching advanced concepts to an AI that learns differently from humans?",
        options: [
            "Develop new frameworks based on the AI's unique processing",
            "Translate human learning patterns into AI-compatible formats",
            "Create hybrid teaching methods combining multiple approaches",
            "Focus on fundamental principles that transcend learning styles"
        ],
        type: "cognitive",
        weight: {
            adaptability: 4,
            creativity: 3,
            analytical: 4
        }
    },
    {
        id: "me10",
        text: "If you could experience time non-linearly, how would you organize your thoughts and memories?",
        options: [
            "Create a multi-dimensional mental mapping system",
            "Develop new ways to categorize simultaneous experiences",
            "Focus on emotional anchors across different timepoints",
            "Build a framework for managing parallel timelines"
        ],
        type: "abstract",
        weight: {
            creativity: 5,
            systematic: 3,
            abstract: 4
        }
    },
    {
        id: "me11",
        text: "When solving a complex puzzle, which mental state do you find most effective?",
        options: [
            "Focused concentration with systematic analysis",
            "Relaxed state allowing for intuitive insights",
            "Alternating between intense focus and relaxation",
            "Maintaining multiple parallel thought processes"
        ],
        type: "cognitive",
        weight: {
            analytical: 4,
            intuitive: 3,
            adaptability: 4
        }
    },
    {
        id: "me12",
        text: "If you could combine any two fields of knowledge to create new insights, which would you choose?",
        options: [
            "Quantum physics and consciousness studies",
            "Evolutionary biology and artificial intelligence",
            "Psychology and mathematics",
            "Art and neuroscience"
        ],
        type: "creative",
        weight: {
            interdisciplinary: 5,
            creativity: 4,
            analytical: 3
        }
    },
    {
        id: "me13",
        text: "How do you approach decisions when all options seem equally valid?",
        options: [
            "Create a detailed analysis framework",
            "Trust intuition and emotional resonance",
            "Consider long-term implications first",
            "Seek patterns in similar past decisions"
        ],
        type: "decision",
        weight: {
            analytical: 3,
            intuitive: 4,
            systematic: 4
        }
    },
    {
        id: "me14",
        text: "What aspect of consciousness would you most want to understand scientifically?",
        options: [
            "The nature of self-awareness",
            "The mechanism of subjective experience",
            "The relationship between mind and brain",
            "The origin of creative insights"
        ],
        type: "philosophical",
        weight: {
            abstract: 5,
            analytical: 4,
            creativity: 3
        }
    },
    {
        id: "me15",
        text: "In designing a universal problem-solving method, what would be your core principle?",
        options: [
            "Adaptability to different types of challenges",
            "Integration of logical and intuitive approaches",
            "Balance between efficiency and thoroughness",
            "Focus on pattern recognition and application"
        ],
        type: "methodological",
        weight: {
            systematic: 5,
            adaptability: 4,
            analytical: 3
        }
    },
    {
        id: "me16",
        text: "How would you design an experiment to measure emotional intelligence across different species?",
        options: [
            "Create situations requiring empathetic responses",
            "Study social problem-solving behaviors",
            "Analyze communication patterns in groups",
            "Measure adaptability to emotional challenges"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            analytical: 3,
            systematic: 3
        }
    },
    {
        id: "me17",
        text: "In a world where time flows backwards, how would you adapt your decision-making process?",
        options: [
            "Focus on understanding consequences before actions",
            "Develop new frameworks for cause and effect",
            "Use different types of signals for each direction",
            "Create detailed maps of future-to-past connections"
        ],
        type: "abstract",
        weight: {
            adaptability: 4,
            analytical: 3,
            creativity: 4
        }
    },
    {
        id: "me18",
        text: "How would you approach understanding a completely alien form of social interaction?",
        options: [
            "Look for universal patterns in social behavior",
            "Create models of their social dynamics",
            "Participate while observing systematically",
            "Compare with known social structures"
        ],
        type: "social",
        weight: {
            adaptability: 4,
            analytical: 3,
            empathy: 4
        }
    },
    {
        id: "me19",
        text: "What aspect of human social cognition would you enhance if possible?",
        options: [
            "The ability to understand multiple perspectives simultaneously",
            "The capacity for genuine empathy across differences",
            "The skill of detecting subtle social patterns",
            "The power to influence group dynamics positively"
        ],
        type: "social",
        weight: {
            empathy: 5,
            social: 4,
            analytical: 2
        }
    },
    {
        id: "me20",
        text: "How would you design a system to optimize group decision-making?",
        options: [
            "Balance emotional and rational inputs equally",
            "Create structured frameworks for diverse perspectives",
            "Implement real-time feedback mechanisms",
            "Develop adaptive consensus algorithms"
        ],
        type: "methodological",
        weight: {
            systematic: 4,
            social: 4,
            analytical: 3
        }
    },
    {
        id: "me21",
        text: "If you could create a new form of artistic expression that combines multiple senses, what would you prioritize?",
        options: [
            "Synesthetic connections between sound and color",
            "Emotional resonance across different sensory inputs",
            "Mathematical patterns translated into experiences",
            "Interactive elements that evolve with the audience"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            emotional: 3
        }
    },
    {
        id: "me22",
        text: "How would you approach designing a completely new form of music?",
        options: [
            "Explore mathematical relationships in sound",
            "Focus on emotional impact and resonance",
            "Combine elements from different cultural traditions",
            "Create new instruments and sound generation methods"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            systematic: 3
        }
    },
    {
        id: "me23",
        text: "What would be your approach to solving a problem that has never been solved before?",
        options: [
            "Combine insights from multiple disciplines",
            "Question fundamental assumptions",
            "Create new methodologies specific to the problem",
            "Look for patterns in seemingly unrelated areas"
        ],
        type: "innovation",
        weight: {
            creativity: 4,
            analytical: 3,
            systematic: 4
        }
    },
    {
        id: "me24",
        text: "How would you design an environment that maximizes creative thinking?",
        options: [
            "Balance structure and flexibility",
            "Incorporate natural and digital elements",
            "Create spaces for both collaboration and solitude",
            "Use dynamic, adaptive environments"
        ],
        type: "creative",
        weight: {
            creativity: 4,
            systematic: 3,
            innovation: 4
        }
    },
    {
        id: "me25",
        text: "If you could enhance human creativity through technology, what would you focus on?",
        options: [
            "Expanding the range of perceivable possibilities",
            "Strengthening connections between different ideas",
            "Removing mental blocks and limitations",
            "Facilitating collaborative creative processes"
        ],
        type: "innovation",
        weight: {
            creativity: 5,
            innovation: 4,
            systematic: 2
        }
    },
    {
        id: "me26",
        text: "Given a sequence of shapes: ○ □ △ ○ □ △ ○ □ △, what comes next?",
        options: [
            "○ (Circle)",
            "□ (Square)",
            "△ (Triangle)",
            "⬡ (Hexagon)"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            analytical: 4,
            logical: 4
        },
        correct: "○"
    },
    {
        id: "me27",
        text: "If you rotate this pattern ⬡△○ three times clockwise, what would it look like?",
        options: [
            "⬡△○",
            "○⬡△",
            "△○⬡",
            "All look the same after rotation"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            analytical: 3
        },
        correct: "⬡△○"
    },
    {
        id: "me28",
        text: "In a mirror world, if you see this sequence ◀▶▲▼, what would it look like?",
        options: [
            "▶◀▲▼",
            "▼▲▶◀",
            "▶◀▼▲",
            "◀▶▼▲"
        ],
        type: "intelligence",
        weight: {
            spatial: 4,
            logical: 4,
            visualization: 5
        },
        correct: "▶◀▲▼"
    },
    {
        id: "me29",
        text: "If big shapes eat smaller shapes, and ■ > ● > ▲, after ■ eats ● which ate ▲, what remains?",
        options: [
            "■",
            "●",
            "▲",
            "■▲"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            sequential: 4,
            analytical: 4
        },
        correct: "■"
    },
    {
        id: "me30",
        text: "In a pattern where each element doubles and rotates: → ↓ ← ↑, what comes after ↑↑?",
        options: [
            "→→",
            "←←",
            "↓↓",
            "↑↑"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            sequential: 4,
            spatial: 4
        },
        correct: "→→"
    },
    {
        id: "me31",
        text: "If water flows downhill (↓) and can't flow uphill (↑), through this path: →↓←↑, where will it stop?",
        options: [
            "At the first ↑",
            "At the end",
            "At the first ↓",
            "It will flow forever"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            sequential: 4,
            problem_solving: 4
        },
        correct: "At the first ↑"
    },
    {
        id: "me32",
        text: "If A mirrors to Ɐ, B to ꓭ, and C to Ɔ, what does BAC mirror to?",
        options: [
            "ƆꓭƎ",
            "ƆꓭⱯ",
            "ƆⱯꓭ",
            "ꓭⱯƆ"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 4,
            spatial: 5,
            logical: 4
        },
        correct: "ƆⱯꓭ"
    },
    {
        id: "me33",
        text: "In a world where ○ + □ = △, □ + △ = ⬡, what does ○ + ⬡ equal?",
        options: [
            "□",
            "△",
            "⬡",
            "Cannot be determined"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            analytical: 4,
            problem_solving: 4
        },
        correct: "Cannot be determined"
    },
    {
        id: "me34",
        text: "If shapes stack by size (bigger on bottom), how would ▲■●⬡ stack if ■>⬡>▲>●?",
        options: [
            "■⬡▲●",
            "●▲⬡■",
            "⬡■▲●",
            "■●▲⬡"
        ],
        type: "intelligence",
        weight: {
            sequential: 4,
            logical: 5,
            spatial: 4
        },
        correct: "■⬡▲●"
    },
    {
        id: "me35",
        text: "If every third shape in a sequence disappears: ○□△⬡■▲●, what remains after one round?",
        options: [
            "○□⬡■●",
            "○□△■▲",
            "□△■▲",
            "○△⬡▲●"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            sequential: 4,
            analytical: 4
        },
        correct: "○□⬡■●"
    },
    {
        id: "me36",
        text: "In a system where information can only flow in one direction, how would you create two-way communication?",
        options: [
            "Create parallel one-way channels in opposite directions",
            "Develop a time-sharing protocol on the same channel",
            "Use different types of signals for each direction",
            "Transform the one-way system into a loop"
        ],
        type: "abstract",
        weight: {
            problem_solving: 5,
            creativity: 4,
            systematic: 4
        }
    },
    {
        id: "me37",
        text: "If you could only move diagonally, how would you reach a point directly above you?",
        options: [
            "Use a series of diagonal moves to create a zigzag pattern",
            "Find a way to transform vertical distance into diagonal distance",
            "Create a new reference frame where diagonal is straight",
            "Combine multiple diagonal movements into a vertical result"
        ],
        type: "abstract",
        weight: {
            spatial: 5,
            problem_solving: 4,
            creativity: 4
        }
    },
    {
        id: "me38",
        text: "How would you measure the size of something if you could only use time as a unit?",
        options: [
            "Convert spatial dimensions into temporal sequences",
            "Use the duration of a standard movement across the object",
            "Create a time-based scanning system",
            "Measure interference patterns in temporal flows"
        ],
        type: "abstract",
        weight: {
            analytical: 5,
            creativity: 4,
            problem_solving: 4
        }
    },
    {
        id: "me39",
        text: "If you could only compare things by their shadows, how would you determine their true shape?",
        options: [
            "Observe shadows from multiple angles",
            "Create a system of standardized light sources",
            "Develop a shadow-pattern recognition system",
            "Use the changes in shadows over time"
        ],
        type: "abstract",
        weight: {
            spatial: 4,
            analytical: 5,
            problem_solving: 4
        }
    },
    {
        id: "me40",
        text: "In a world where cause follows effect, how would you make decisions?",
        options: [
            "Focus on desired outcomes and work backwards",
            "Create a map of effect-cause relationships",
            "Develop predictive models based on reverse patterns",
            "Use parallel timelines to understand connections"
        ],
        type: "abstract",
        weight: {
            logical: 5,
            creativity: 4,
            problem_solving: 4
        }
    },
    {
        id: "me41",
        text: "How would you communicate a complex idea using only simple shapes?",
        options: [
            "Create a visual language based on shape combinations",
            "Use sequences of shapes to represent processes",
            "Develop a hierarchical system of shape meanings",
            "Transform the idea into geometric relationships"
        ],
        type: "abstract",
        weight: {
            creativity: 5,
            communication: 4,
            systematic: 4
        }
    },
    {
        id: "me42",
        text: "If you could only interact with the world through reflections, how would you navigate?",
        options: [
            "Create a mental map of reflection relationships",
            "Develop a system of controlled light sources",
            "Use multiple reflective surfaces for triangulation",
            "Learn to interpret complex reflection patterns"
        ],
        type: "abstract",
        weight: {
            spatial: 5,
            problem_solving: 4,
            analytical: 4
        }
    },
    {
        id: "me43",
        text: "How would you measure change if you couldn't compare different moments in time?",
        options: [
            "Create parallel systems that track variations",
            "Develop internal reference points",
            "Use relative differences between concurrent events",
            "Establish a system of continuous monitoring"
        ],
        type: "abstract",
        weight: {
            analytical: 5,
            creativity: 4,
            problem_solving: 4
        }
    },
    {
        id: "me44",
        text: "If information could only be stored in patterns of movement, how would you create a library?",
        options: [
            "Design perpetual motion systems for each piece of information",
            "Create a choreography-based encoding system",
            "Use interactions between multiple moving elements",
            "Develop a system of synchronized oscillations"
        ],
        type: "abstract",
        weight: {
            creativity: 5,
            systematic: 4,
            problem_solving: 4
        }
    },
    {
        id: "me45",
        text: "How would you represent a four-dimensional concept using only two dimensions?",
        options: [
            "Use multiple 2D projections in sequence",
            "Create a system of layered representations",
            "Develop a symbolic notation for extra dimensions",
            "Use dynamic changes to represent additional dimensions"
        ],
        type: "abstract",
        weight: {
            spatial: 5,
            visualization: 4,
            creativity: 4
        }
    },
    {
        id: "me46",
        text: "If you could combine any two natural phenomena to create a new one, what would you choose?",
        options: [
            "Lightning and waves to create energy patterns",
            "Wind and crystallization to form dynamic structures",
            "Gravity and magnetism for controlled floating",
            "Plant growth and bioluminescence for living light"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            synthesis: 4
        }
    },
    {
        id: "me47",
        text: "How would you design a communication system for beings that experience time differently?",
        options: [
            "Create messages that unfold across multiple timescales",
            "Develop time-independent symbolic patterns",
            "Use natural cycles as universal reference points",
            "Design adaptive temporal compression systems"
        ],
        type: "creative",
        weight: {
            innovation: 5,
            problem_solving: 4,
            creativity: 4
        }
    },
    {
        id: "me48",
        text: "If you could create a new sense beyond the existing ones, what would it detect?",
        options: [
            "Patterns in probability and potential futures",
            "Connections between seemingly unrelated events",
            "The flow and distribution of energy",
            "Hidden dimensions of space-time"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            abstract: 4
        }
    },
    {
        id: "me49",
        text: "How would you design a language that could express concepts that don't exist yet?",
        options: [
            "Create modular elements that can be combined infinitely",
            "Develop a system based on abstract relationships",
            "Use dynamic symbols that evolve with meaning",
            "Build a framework of conceptual primitives"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            systematic: 4
        }
    },
    {
        id: "me50",
        text: "If you could create a new form of matter with unique properties, what would it do?",
        options: [
            "Adapt its structure based on surrounding needs",
            "Store and process information within its atoms",
            "Transform energy between different forms freely",
            "Create temporary copies of itself for specific tasks"
        ],
        type: "creative",
        weight: {
            innovation: 5,
            creativity: 4,
            analytical: 4
        }
    },
    {
        id: "me51",
        text: "How would you design a system to visualize abstract concepts like justice or love?",
        options: [
            "Create dynamic patterns that reflect emotional states",
            "Develop a symbolic language of universal experiences",
            "Use interactive networks of related concepts",
            "Build geometric representations of value relationships"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            abstract: 4,
            communication: 4
        }
    },
    {
        id: "me52",
        text: "If you could create a new color that interacts with existing ones in unique ways, what would it do?",
        options: [
            "Change other colors' properties when mixed",
            "Create harmonies that transcend the color wheel",
            "Reveal hidden aspects of viewed objects",
            "Generate emotional responses beyond current colors"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            emotional: 4
        }
    },
    {
        id: "me53",
        text: "How would you design a game that could be played across different realities?",
        options: [
            "Use universal physical constants as game elements",
            "Create rules that adapt to each reality's physics",
            "Develop abstract goals that transcend physical laws",
            "Build connections between parallel game states"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            systematic: 4
        }
    },
    {
        id: "me54",
        text: "If you could create a new form of art that engages all senses simultaneously, how would it work?",
        options: [
            "Synchronize different sensory inputs into unified experiences",
            "Create cross-modal translations between senses",
            "Develop interactive sensory landscapes",
            "Build layered compositions of sensory elements"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            synthesis: 4
        }
    },
    {
        id: "me55",
        text: "How would you design a tool that could manipulate abstract concepts directly?",
        options: [
            "Create interfaces that map thoughts to actions",
            "Develop conceptual space navigation systems",
            "Build frameworks for idea transformation",
            "Design abstract pattern recognition tools"
        ],
        type: "creative",
        weight: {
            innovation: 5,
            creativity: 4,
            abstract: 4
        }
    },
    {
        id: "me56",
        text: "In a sequence where each number is the sum of the previous two: 1, 1, 2, 3, 5, 8, what comes next?",
        options: [
            "13",
            "11",
            "15",
            "21"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            logical: 4,
            analytical: 4
        },
        correct: "13"
    },
    {
        id: "me57",
        text: "If ◇ rotates 90° clockwise each step, and ▷ rotates 90° counterclockwise, after 3 steps what do you see?",
        options: [
            "◇ ◁",
            "◇ ▷",
            "◆ ▷",
            "◆ ◁"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            sequential: 4
        },
        correct: "◇ ◁"
    },
    {
        id: "me58",
        text: "If a shape grows by adding one line each step: |, ⌋, ⊏, □, what comes next in the pattern?",
        options: [
            "⊞",
            "▣",
            "▤",
            "⊟"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            sequential: 4,
            logical: 4
        },
        correct: "⊞"
    },
    {
        id: "me59",
        text: "In a pattern where black and white alternate, and shapes add: ○, ●○, ○●○, ●○●○, what's next?",
        options: [
            "○●○●○",
            "●○●○●",
            "○●●○○",
            "●●○●○"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            sequential: 4,
            logical: 4
        },
        correct: "○●○●○"
    },
    {
        id: "me60",
        text: "If each symbol represents a number, and ◇ + ○ = ▷, ○ + ▷ = □, ◇ + □ = ?, what's the value of ?",
        options: [
            "△",
            "▽",
            "◆",
            "Cannot be determined"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            analytical: 4,
            problem_solving: 4
        },
        correct: "Cannot be determined"
    },
    {
        id: "me61",
        text: "In a sequence where each shape is reflected and rotated: ◢◣◤, what comes next?",
        options: [
            "◥",
            "◢",
            "◣",
            "◤"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            spatial: 4,
            logical: 4
        },
        correct: "◥"
    },
    {
        id: "me62",
        text: "If combining shapes follows the rule: same shape = larger size, different shapes = new shape, what is ▲ + ▲?",
        options: [
            "▲ (larger)",
            "■",
            "●",
            "▲▲"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            pattern_recognition: 4,
            analytical: 4
        },
        correct: "▲ (larger)"
    },
    {
        id: "me63",
        text: "In a grid where shapes can only move to empty adjacent spaces, how many moves to swap ◯ and ◇: ◯□◇?",
        options: [
            "2",
            "3",
            "4",
            "5"
        ],
        type: "intelligence",
        weight: {
            problem_solving: 5,
            spatial: 4,
            analytical: 4
        },
        correct: "3"
    },
    {
        id: "me64",
        text: "If shapes merge when they touch (▲+■=◆, ■+●=⬡, ▲+●=△), what happens when ◆ touches ⬡?",
        options: [
            "New shape",
            "No change",
            "Both disappear",
            "Cannot be determined"
        ],
        type: "intelligence",
        weight: {
            logical: 5,
            analytical: 4,
            pattern_recognition: 4
        },
        correct: "Cannot be determined"
    },
    {
        id: "me65",
        text: "In a sequence where each step adds dots inside: ○, ⊙, ⊚, what comes next?",
        options: [
            "⊛",
            "⊕",
            "⊗",
            "⊜"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            sequential: 4,
            logical: 4
        },
        correct: "⊛"
    },
    {
        id: "me66",
        text: "How would you design a system to measure the collective emotional state of a group?",
        options: [
            "Create a network of individual emotional sensors",
            "Analyze patterns of group behavior and interaction",
            "Develop emotional resonance detection methods",
            "Map emotional energy flows between individuals"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            analytical: 4,
            systematic: 4
        }
    },
    {
        id: "me67",
        text: "If emotions had physical properties, how would you organize them?",
        options: [
            "By their wavelength and frequency patterns",
            "Through their interaction dynamics",
            "Based on their energy states and transitions",
            "Using their resonance with other emotions"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            systematic: 4,
            analytical: 4
        }
    },
    {
        id: "me68",
        text: "How would you translate complex emotional states into a universal language?",
        options: [
            "Create a spectrum of basic emotional components",
            "Develop geometric patterns representing emotional combinations",
            "Use dynamic symbols that evolve with emotional intensity",
            "Build a hierarchy of emotional relationships"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            communication: 4,
            systematic: 4
        }
    },
    {
        id: "me69",
        text: "If you could map the flow of empathy between people, what pattern would you look for?",
        options: [
            "Reciprocal feedback loops of understanding",
            "Resonance patterns in emotional states",
            "Networks of shared emotional experience",
            "Synchronization of emotional responses"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            pattern_recognition: 4,
            social: 4
        }
    },
    {
        id: "me70",
        text: "How would you design a system to help people understand emotions they've never experienced?",
        options: [
            "Create simulated emotional experiences",
            "Build bridges between familiar and unfamiliar emotions",
            "Develop emotional translation matrices",
            "Use metaphorical relationship mapping"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            creativity: 4,
            communication: 4
        }
    },
    {
        id: "me71",
        text: "If you could visualize social connections, what dimension would you add beyond simple links?",
        options: [
            "Emotional resonance frequencies",
            "Trust and vulnerability gradients",
            "Temporal patterns of interaction",
            "Multi-dimensional relationship qualities"
        ],
        type: "social",
        weight: {
            social: 5,
            emotional: 4,
            analytical: 4
        }
    },
    {
        id: "me72",
        text: "How would you measure the authenticity of emotional expressions?",
        options: [
            "Compare patterns across multiple emotional channels",
            "Analyze the coherence of emotional signals",
            "Track emotional response consistency",
            "Map emotional state transitions"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            analytical: 4,
            pattern_recognition: 4
        }
    },
    {
        id: "me73",
        text: "If you could design a way to share emotional experiences directly, what would you prioritize?",
        options: [
            "Preserving the uniqueness of individual experience",
            "Creating accurate emotional translations",
            "Maintaining emotional boundaries",
            "Enabling selective emotional sharing"
        ],
        type: "emotional",
        weight: {
            empathy: 5,
            ethical: 4,
            innovation: 4
        }
    },
    {
        id: "me74",
        text: "How would you create a map of someone's emotional growth over time?",
        options: [
            "Track emotional response patterns and changes",
            "Map emotional complexity development",
            "Chart emotional resilience indicators",
            "Document emotional awareness expansion"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            analytical: 4,
            systematic: 4
        }
    },
    {
        id: "me75",
        text: "If you could design a system to optimize group emotional intelligence, what would be its core feature?",
        options: [
            "Real-time emotional feedback loops",
            "Collective emotional awareness indicators",
            "Emotional synchronization mechanisms",
            "Adaptive emotional response patterns"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            social: 4,
            systematic: 4
        }
    },
    {
        id: "me76",
        text: "In a system where every action has multiple cascading effects, how would you make decisions?",
        options: [
            "Map out all possible interaction chains",
            "Focus on key leverage points in the system",
            "Develop adaptive response strategies",
            "Create feedback loop monitoring systems"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            analytical: 4,
            problem_solving: 4
        }
    },
    {
        id: "me77",
        text: "How would you design a self-improving system that maintains stability?",
        options: [
            "Create balanced feedback mechanisms",
            "Implement gradual evolution protocols",
            "Design adaptive stability controls",
            "Build hierarchical improvement cycles"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            innovation: 4,
            analytical: 4
        }
    },
    {
        id: "me78",
        text: "If you could see all interconnections in a complex system, what pattern would you look for first?",
        options: [
            "Feedback loops and their strengths",
            "Emergent behavioral patterns",
            "Critical connection nodes",
            "System boundary conditions"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            pattern_recognition: 4,
            analytical: 4
        }
    },
    {
        id: "me79",
        text: "How would you design a system that can adapt to unknown future challenges?",
        options: [
            "Build in multiple redundant capabilities",
            "Create flexible response frameworks",
            "Develop pattern recognition systems",
            "Implement evolutionary learning mechanisms"
        ],
        type: "systems",
        weight: {
            adaptability: 5,
            innovation: 4,
            systematic: 4
        }
    },
    {
        id: "me80",
        text: "In a system where everything influences everything else, how would you identify root causes?",
        options: [
            "Track influence propagation patterns",
            "Analyze system state transitions",
            "Map causal relationship networks",
            "Study system behavior over time"
        ],
        type: "systems",
        weight: {
            analytical: 5,
            systematic: 4,
            problem_solving: 4
        }
    },
    {
        id: "me81",
        text: "How would you design a system that maintains balance between opposing forces?",
        options: [
            "Create dynamic equilibrium mechanisms",
            "Implement adaptive balancing controls",
            "Design self-correcting feedback loops",
            "Build force distribution networks"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            problem_solving: 4,
            analytical: 4
        }
    },
    {
        id: "me82",
        text: "If you could design a system that learns from its mistakes, what would be its key feature?",
        options: [
            "Pattern recognition in failure modes",
            "Adaptive response mechanisms",
            "Error-triggered learning protocols",
            "Systematic improvement cycles"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            learning: 4,
            innovation: 4
        }
    },
    {
        id: "me83",
        text: "How would you create a system that evolves its own goals?",
        options: [
            "Create adaptive purpose generators",
            "Implement goal mutation algorithms",
            "Develop objective evolution frameworks",
            "Build purpose synthesis engines"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            innovation: 4,
            creativity: 4
        }
    },
    {
        id: "me84",
        text: "In a system with limited resources, how would you optimize for multiple competing goals?",
        options: [
            "Create dynamic resource allocation systems",
            "Implement priority-based distribution",
            "Design adaptive optimization protocols",
            "Build efficient resource sharing networks"
        ],
        type: "systems",
        weight: {
            optimization: 5,
            systematic: 4,
            problem_solving: 4
        }
    },
    {
        id: "me85",
        text: "How would you design a system that can detect and respond to emerging patterns?",
        options: [
            "Implement real-time pattern recognition",
            "Create adaptive response frameworks",
            "Build predictive modeling systems",
            "Design pattern-triggered protocols"
        ],
        type: "systems",
        weight: {
            pattern_recognition: 5,
            systematic: 4,
            adaptability: 4
        }
    },
    {
        id: "me86",
        text: "If concepts could interact like particles, what properties would determine their behavior?",
        options: [
            "Their level of abstraction and complexity",
            "Their resonance with other concepts",
            "Their stability and transformation potential",
            "Their interconnectedness and influence"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            creativity: 4,
            analytical: 4
        }
    },
    {
        id: "me87",
        text: "How would you map the evolution of an idea through conceptual space?",
        options: [
            "Track its transformations and combinations",
            "Map its interaction with existing ideas",
            "Chart its abstraction level changes",
            "Document its contextual adaptations"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            pattern_recognition: 4,
            systematic: 4
        }
    },
    {
        id: "me88",
        text: "If you could see the structure of knowledge itself, what pattern would you expect to find?",
        options: [
            "A fractal network of interconnected concepts",
            "Hierarchical layers of increasing abstraction",
            "Dynamic webs of evolving relationships",
            "Modular clusters of related ideas"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            pattern_recognition: 4,
            systematic: 4
        }
    },
    {
        id: "me89",
        text: "How would you design a system to navigate between different levels of abstraction?",
        options: [
            "Create conceptual elevation mechanisms",
            "Build abstraction layer interfaces",
            "Develop semantic zoom capabilities",
            "Implement recursive pattern growth"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            systematic: 4,
            innovation: 4
        }
    },
    {
        id: "me90",
        text: "If ideas could merge and split like living cells, what would govern their behavior?",
        options: [
            "Conceptual compatibility patterns",
            "Idea resonance frequencies",
            "Semantic field interactions",
            "Cognitive energy gradients"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            creativity: 4,
            systematic: 4
        }
    },
    {
        id: "me91",
        text: "How would you represent the relationship between infinity and zero?",
        options: [
            "As opposite points on a circular spectrum",
            "Through their roles in different number systems",
            "As complementary aspects of completeness",
            "Using dimensional transformation patterns"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            conceptual: 4,
            creativity: 4
        }
    },
    {
        id: "me92",
        text: "If consciousness could be programmed like software, what would be its core algorithm?",
        options: [
            "Self-awareness recursion",
            "Experience integration loops",
            "Meaning generation processes",
            "Reality modeling systems"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            abstract: 4,
            systematic: 4
        }
    },
    {
        id: "me93",
        text: "How would you design a language for communicating abstract patterns?",
        options: [
            "Create a vocabulary of pattern primitives",
            "Develop dynamic pattern combinations",
            "Build hierarchical pattern structures",
            "Implement pattern transformation rules"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            systematic: 4,
            communication: 4
        }
    },
    {
        id: "me94",
        text: "If time were a spatial dimension, how would you map causality?",
        options: [
            "As intersecting planes of possibility",
            "Through topological relationship networks",
            "Using causal field gradients",
            "With multi-dimensional event chains"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            spatial: 4,
            conceptual: 4
        }
    },
    {
        id: "me95",
        text: "How would you represent the concept of change itself?",
        options: [
            "As transformations between states",
            "Through patterns of difference",
            "Using dynamic relationship maps",
            "With state transition networks"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            conceptual: 4,
            creativity: 4
        }
    },
    {
        id: "me96",
        text: "If you fold this pattern: ▢→△→○, what shape would be in the middle?",
        options: [
            "△",
            "▢",
            "○",
            "None of these"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "△"
    },
    {
        id: "me97",
        text: "When these shapes overlap: ○ ◇ □, what's the minimum number of regions created?",
        options: [
            "4",
            "6",
            "7",
            "8"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            analytical: 4,
            logical: 4
        },
        correct: "7"
    },
    {
        id: "me98",
        text: "If ▲ casts a shadow when light comes from the left, and ◆ from the right, what's the shadow pattern of ▲◆?",
        options: [
            "Two overlapping shadows",
            "One continuous shadow",
            "Two separate shadows",
            "No shadow in the middle"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "Two separate shadows"
    },
    {
        id: "me99",
        text: "In a sequence where shapes grow by one point: △, ◇, ⬡, what comes next?",
        options: [
            "⬢",
            "⬣",
            "◯",
            "⬠"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            spatial: 4,
            logical: 4
        },
        correct: "⬢"
    },
    {
        id: "me100",
        text: "If you rotate ◐ clockwise and ◑ counterclockwise, what do you see after 180 degrees?",
        options: [
            "◐◑",
            "◑◐",
            "◓◒",
            "◒◓"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "◑◐"
    },
    {
        id: "me101",
        text: "When three cubes stack with different rotations: ⧈⧉⧇, what's the view from above?",
        options: [
            "⊞",
            "⊟",
            "⊠",
            "⊡"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            analytical: 4
        },
        correct: "⊠"
    },
    {
        id: "me102",
        text: "If shapes merge when touching corners: ▲ ► ▼ ◄, what's the final shape?",
        options: [
            "□",
            "◇",
            "○",
            "⬡"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "□"
    },
    {
        id: "me103",
        text: "In a pattern where each shape reflects the next: ◢◣◤, what comes next?",
        options: [
            "◥",
            "◢",
            "◣",
            "◤"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            spatial: 4,
            logical: 4
        },
        correct: "◥"
    },
    {
        id: "me104",
        text: "If you unfold this shape: ⬡, how many triangles would you see?",
        options: [
            "4",
            "6",
            "8",
            "12"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            analytical: 4
        },
        correct: "6"
    },
    {
        id: "me105",
        text: "When these shapes nest inside each other: ○>□>△, how many regions are visible?",
        options: [
            "3",
            "4",
            "5",
            "6"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            analytical: 4
        },
        correct: "3"
    },
    {
        id: "me106",
        text: "How would you design a communication system that works across different types of consciousness?",
        options: [
            "Create a universal pattern language",
            "Develop multi-modal translation interfaces",
            "Build shared experiential frameworks",
            "Implement adaptive meaning protocols"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            communication: 4
        }
    },
    {
        id: "me107",
        text: "If you could design a new form of intelligence, what would be its core feature?",
        options: [
            "Adaptive pattern synthesis",
            "Multi-dimensional problem solving",
            "Dynamic concept integration",
            "Emergent consciousness mapping"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            systematic: 4
        }
    },
    {
        id: "me108",
        text: "How would you create a system for sharing experiences across different forms of existence?",
        options: [
            "Develop universal experience mappings",
            "Create cross-reality translation matrices",
            "Build adaptive perspective frameworks",
            "Implement experiential synthesis protocols"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            empathy: 4,
            creativity: 4
        }
    },
    {
        id: "me109",
        text: "If you could design a new way of processing information, what would it transcend?",
        options: [
            "Linear sequential thinking",
            "Binary logic constraints",
            "Spatial-temporal limitations",
            "Conscious-unconscious boundaries"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            abstract: 4
        }
    },
    {
        id: "me110",
        text: "How would you design a system for evolving ideas beyond current human comprehension?",
        options: [
            "Create self-modifying concept structures",
            "Develop idea evolution algorithms",
            "Build transcendent pattern generators",
            "Implement recursive pattern growth"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            abstract: 4
        }
    },
    {
        id: "me111",
        text: "If you could create a new form of problem-solving, what would it integrate?",
        options: [
            "Multiple levels of consciousness",
            "Parallel reality perspectives",
            "Quantum probability states",
            "Collective intelligence patterns"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            problem_solving: 4,
            creativity: 4
        }
    },
    {
        id: "me112",
        text: "How would you design a system for generating new forms of creativity?",
        options: [
            "Combine unlikely pattern sources",
            "Create emergent idea ecosystems",
            "Develop novelty amplification loops",
            "Build creative synthesis engines"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            systematic: 4
        }
    },
    {
        id: "me113",
        text: "If you could design a new way of understanding reality, what would it reveal?",
        options: [
            "Hidden dimensional connections",
            "Unified field patterns",
            "Consciousness-reality interfaces",
            "Transcendent causal networks"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            abstract: 4,
            creativity: 4
        }
    },
    {
        id: "me114",
        text: "How would you create a system for evolving consciousness itself?",
        options: [
            "Develop awareness expansion protocols",
            "Build consciousness integration networks",
            "Create meta-cognitive frameworks",
            "Implement consciousness synthesis engines"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            creativity: 4,
            abstract: 4
        }
    },
    {
        id: "me115",
        text: "If you could design a new form of learning, what would it transcend?",
        options: [
            "Sequential knowledge acquisition",
            "Experience-memory barriers",
            "Cognitive processing limits",
            "Conscious-unconscious divisions"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            learning: 4,
            creativity: 4
        }
    },
    {
        id: "me116",
        text: "In a sequence where shapes combine their properties: △+○=?, what's the result?",
        options: [
            "A curved triangle",
            "A pointed circle",
            "Both shapes overlapping",
            "A new hybrid shape"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "A curved triangle"
    },
    {
        id: "me117",
        text: "How would you measure the complexity of an emotion?",
        options: [
            "By its number of component feelings",
            "Through its intensity variations",
            "By mapping its neural patterns",
            "Through its behavioral manifestations"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            analytical: 4,
            systematic: 4
        }
    },
    {
        id: "me118",
        text: "If ideas had mass and gravity, how would they interact?",
        options: [
            "Form conceptual solar systems",
            "Create thought singularities",
            "Develop idea orbits",
            "Generate mental galaxies"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            abstract: 4,
            systematic: 4
        }
    },
    {
        id: "me119",
        text: "How would you design a system that evolves its own goals?",
        options: [
            "Create adaptive purpose generators",
            "Implement goal mutation algorithms",
            "Develop objective evolution frameworks",
            "Build purpose synthesis engines"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            innovation: 4,
            creativity: 4
        }
    },
    {
        id: "me120",
        text: "When three-dimensional patterns cast four-dimensional shadows, what would you look for?",
        options: [
            "Temporal distortion patterns",
            "Dimensional intersection points",
            "Hyperspatial projections",
            "Cross-dimensional mappings"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            spatial: 4,
            visualization: 4
        }
    },
    {
        id: "me121",
        text: "If consciousness could be programmed like software, what would be its core algorithm?",
        options: [
            "Self-awareness recursion",
            "Experience integration loops",
            "Meaning generation processes",
            "Reality modeling systems"
        ],
        type: "innovation",
        weight: {
            innovation: 5,
            abstract: 4,
            systematic: 4
        }
    },
    {
        id: "me122",
        text: "In a pattern where shapes evolve based on their neighbors: □△○, what comes next?",
        options: [
            "⬡",
            "◇",
            "⬢",
            "⬣"
        ],
        type: "intelligence",
        weight: {
            pattern_recognition: 5,
            logical: 4,
            analytical: 4
        },
        correct: "⬡"
    },
    {
        id: "me123",
        text: "How would you quantify the depth of an emotional connection?",
        options: [
            "Measure resonance patterns",
            "Track synchronization levels",
            "Analyze interaction complexity",
            "Map emotional field strength"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            empathy: 4,
            analytical: 4
        }
    },
    {
        id: "me124",
        text: "If creativity could be distilled into pure energy, how would you harness it?",
        options: [
            "Build idea fusion reactors",
            "Create thought particle accelerators",
            "Develop concept energy converters",
            "Design innovation power cells"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            systematic: 4
        }
    },
    {
        id: "me125",
        text: "How would you design a system that predicts its own evolution?",
        options: [
            "Create recursive prediction models",
            "Implement self-analysis algorithms",
            "Develop future-state mapping",
            "Build evolution simulation engines"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            analytical: 4,
            innovation: 4
        }
    }
];

// Additional balanced questions - Extended Set
const extendedQuestions = [
    {
        id: "me176",
        text: "If emotions could be transformed into physical structures, what would their architecture reveal?",
        options: [
            "Dynamic tension networks",
            "Resonance chambers of feeling",
            "Emotional energy lattices",
            "Affective state matrices"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            creativity: 4,
            abstract: 3
        }
    },
    {
        id: "me177",
        text: "How would you design a system that evolves through quantum leaps of understanding?",
        options: [
            "Create insight acceleration fields",
            "Build knowledge fusion reactors",
            "Develop cognitive jump gates",
            "Implement wisdom teleportation"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            innovation: 4,
            abstract: 3
        }
    },
    {
        id: "me178",
        text: "If consciousness could fold like origami, what patterns would emerge?",
        options: [
            "Self-referential awareness loops",
            "Nested reality matrices",
            "Dimensional thought creases",
            "Meta-cognitive pleats"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            creativity: 4,
            philosophical: 3
        }
    },
    {
        id: "me179",
        text: "How do you navigate the intersection of multiple belief systems?",
        options: [
            "Create synthesis frameworks",
            "Map overlapping truth domains",
            "Build perspective bridges",
            "Develop integration protocols"
        ],
        type: "personality",
        weight: {
            integration: 5,
            philosophical: 4,
            adaptability: 3
        }
    },
    {
        id: "me180",
        text: "When ideas collide at light speed, what emerges from the impact?",
        options: [
            "Conceptual fusion reactions",
            "Thought particle showers",
            "Innovation wave functions",
            "Creative matter/antimatter"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            abstract: 3
        }
    },
    {
        id: "me181",
        text: "How would you measure the resonance between different states of being?",
        options: [
            "Through consciousness harmonics",
            "Using existential wave patterns",
            "By mapping state transitions",
            "With quantum state coherence"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            measurement: 4,
            philosophical: 3
        }
    },
    {
        id: "me182",
        text: "If you fold this pattern: ▢→△→○, what shape would be in the middle?",
        options: [
            "△",
            "▢",
            "○",
            "None of these"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "△"
    },
    {
        id: "me183",
        text: "When these shapes overlap: ○ ◇ □, what's the minimum number of regions created?",
        options: [
            "4",
            "6",
            "7",
            "8"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            analytical: 4,
            logical: 4
        },
        correct: "7"
    },
    {
        id: "me184",
        text: "If ▲ casts a shadow when light comes from the left, and ◆ from the right, what's the shadow pattern of ▲◆?",
        options: [
            "Two overlapping shadows",
            "One continuous shadow",
            "Two separate shadows",
            "No shadow in the middle"
        ],
        type: "intelligence",
        weight: {
            spatial: 5,
            visualization: 4,
            logical: 4
        },
        correct: "Two separate shadows"
    },
    {
        id: "me185",
        text: "How would you design a system that generates new forms of thought?",
        options: [
            "Create cognitive fusion engines",
            "Build thought evolution matrices",
            "Develop idea synthesis protocols",
            "Implement mind expansion fields"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            innovation: 4,
            creativity: 3
        }
    },
    {
        id: "me186",
        text: "If wisdom could crystallize, what would its growth pattern reveal?",
        options: [
            "Understanding lattice structures",
            "Knowledge nucleation points",
            "Insight growth planes",
            "Wisdom facet networks"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            pattern: 4,
            philosophical: 3
        }
    },
    {
        id: "me187",
        text: "How do you maintain coherence across multiple states of consciousness?",
        options: [
            "Create awareness bridges",
            "Develop state synchronization",
            "Build consciousness anchors",
            "Implement coherence fields"
        ],
        type: "personality",
        weight: {
            integration: 5,
            consciousness: 4,
            stability: 3
        }
    },
    {
        id: "me188",
        text: "If emotions could quantum entangle, how would you use this phenomenon?",
        options: [
            "Create empathy networks",
            "Build emotional teleportation",
            "Develop feeling synchronicity",
            "Implement affective linking"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            innovation: 4,
            connection: 3
        }
    },
    {
        id: "me189",
        text: "How would you design a system that evolves through meta-patterns?",
        options: [
            "Create pattern evolution engines",
            "Build meta-level processors",
            "Develop pattern synthesis nodes",
            "Implement recursive pattern growth"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            pattern: 4,
            evolution: 3
        }
    },
    {
        id: "me190",
        text: "When creativity flows like water, what shapes does it carve?",
        options: [
            "Innovation canyons",
            "Idea river deltas",
            "Thought meanders",
            "Creative erosion patterns"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            metaphor: 4,
            pattern: 3
        }
    },
    {
        id: "me191",
        text: "If understanding were a phase transition, what states would it pass through?",
        options: [
            "Confusion condensation",
            "Insight crystallization",
            "Knowledge sublimation",
            "Wisdom plasma state"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            process: 4,
            philosophical: 3
        }
    },
    {
        id: "me192",
        text: "How do you navigate the quantum foam of possibilities in decision-making?",
        options: [
            "Map probability densities",
            "Create decision wave functions",
            "Build choice superpositions",
            "Develop outcome entanglement"
        ],
        type: "personality",
        weight: {
            decision: 5,
            quantum: 4,
            navigation: 3
        }
    },
    {
        id: "me193",
        text: "If emotional intelligence had its own mathematics, what would be its fundamental theorems?",
        options: [
            "Empathy conservation laws",
            "Emotional energy equations",
            "Feeling field theories",
            "Affective calculus principles"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            systematic: 4,
            abstract: 3
        }
    },
    {
        id: "me194",
        text: "How would you design a system that evolves through paradox resolution?",
        options: [
            "Create contradiction synthesis engines",
            "Build paradox integration matrices",
            "Develop antinomy processors",
            "Implement dialectical evolution"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            paradox: 4,
            evolution: 3
        }
    },
    {
        id: "me195",
        text: "When ideas dance like particles in a quantum field, what choreography emerges?",
        options: [
            "Thought interference patterns",
            "Concept wave functions",
            "Innovation probability clouds",
            "Creative superpositions"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            quantum: 4,
            pattern: 3
        }
    },
    {
        id: "me196",
        text: "If consciousness could fold space-time, what dimensions would it reveal?",
        options: [
            "Awareness curvature fields",
            "Mind-space manifolds",
            "Thought-time tensors",
            "Cognitive dimension warps"
        ],
        type: "abstract",
        weight: {
            abstract: 5,
            consciousness: 4,
            spatial: 3
        }
    },
    {
        id: "me197",
        text: "How do you maintain identity coherence across parallel possibilities?",
        options: [
            "Create self-reference anchors",
            "Build identity wave functions",
            "Develop core state resonance",
            "Implement quantum self-stability"
        ],
        type: "personality",
        weight: {
            identity: 5,
            quantum: 4,
            stability: 3
        }
    },
    {
        id: "me198",
        text: "If emotional states could form compounds, what would be their bonding rules?",
        options: [
            "Feeling valence patterns",
            "Affective resonance bonds",
            "Emotional energy shells",
            "Mood orbital structures"
        ],
        type: "emotional",
        weight: {
            emotional: 5,
            systematic: 4,
            pattern: 3
        }
    },
    {
        id: "me199",
        text: "How would you design a system that evolves through dimensional transcendence?",
        options: [
            "Create dimension bridging protocols",
            "Build reality expansion engines",
            "Develop transcendence matrices",
            "Implement evolution tensors"
        ],
        type: "systems",
        weight: {
            systematic: 5,
            transcendence: 4,
            evolution: 3
        }
    },
    {
        id: "me200",
        text: "When creativity bends reality, what new forms emerge?",
        options: [
            "Reality-warping innovations",
            "Dimension-folding ideas",
            "Possibility-space sculptures",
            "Quantum creativity structures"
        ],
        type: "creative",
        weight: {
            creativity: 5,
            innovation: 4,
            reality: 3
        }
    }
];

// Add extended questions to mindExplorerQuestions
mindExplorerQuestions.push(...extendedQuestions);

// Update allQuestions array to include all questions
const allQuestions = [
    ...quickAssessmentQuestions,
    ...standardAssessmentQuestions.filter(q => !quickAssessmentQuestions.includes(q)),
    ...inDepthAssessmentQuestions.filter(q => !standardAssessmentQuestions.includes(q)),
    ...mindExplorerQuestions
];

// Verify we have enough questions
console.assert(allQuestions.length >= 100, `Not enough questions: ${allQuestions.length}/100`);

// Question selection functions
function getRandomQuestions(count, excludeQuestions = []) {
    const availableQuestions = allQuestions.filter(q => !excludeQuestions.includes(q));
    return shuffleArray(availableQuestions).slice(0, count);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Class definition
class QuestionManager {
    constructor() {
        this.questions = mindExplorerQuestions;
        this.currentIndex = 0;
        this.scores = {
            intelligence: 0,
            creativity: 0,
            personality: 0,
            miniGames: {
                reactionTime: 0,
                patternMemory: 0,
                numberSequence: 0,
                spatialPuzzle: 0
            }
        };
        this.miniGameManager = new MiniGameManager();
        this.miniGameInterval = 3; // Show mini-game every 3 questions
        this.lastMiniGameType = null;
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    async nextQuestion() {
        this.currentIndex++;
        
        // Check if it's time for a mini-game
        if (this.currentIndex % this.miniGameInterval === 0) {
            await this.startMiniGame();
        }
        
        return this.getCurrentQuestion();
    }

    async startMiniGame() {
        // Select a mini-game type that wasn't played last
        let availableTypes = ['reactionTime', 'patternMemory', 'numberSequence', 'spatialPuzzle'];
        if (this.lastMiniGameType) {
            availableTypes = availableTypes.filter(type => type !== this.lastMiniGameType);
        }
        const gameType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        this.lastMiniGameType = gameType;

        // Create transition effect
        const overlay = document.createElement('div');
        overlay.className = 'game-transition-overlay';
        document.body.appendChild(overlay);

        // Wait for transition
        await new Promise(resolve => setTimeout(resolve, 500));

        // Initialize and start the mini-game
        return new Promise(resolve => {
            this.miniGameManager.initializeGame(gameType, document.querySelector('.question-container'), (score) => {
                this.scores.miniGames[gameType] = score;
                
                // Remove transition overlay
                overlay.addEventListener('transitionend', () => {
                    overlay.remove();
                });
                overlay.style.opacity = '0';
                
                resolve();
            });
        });
    }

    submitAnswer(answer) {
        const question = this.getCurrentQuestion();
        let score = 0;

        if (question.type === 'intelligence' && question.correct === answer) {
            score = 100;
        } else if (question.type === 'creativity') {
            score = this.evaluateCreativeAnswer(answer, question.weight);
        } else if (question.type === 'personality') {
            score = this.evaluatePersonalityAnswer(answer, question.weight);
        }

        this.scores[question.type] += score;
        return score;
    }

    getResults() {
        const totalQuestions = {
            intelligence: this.questions.filter(q => q.type === 'intelligence').length,
            creativity: this.questions.filter(q => q.type === 'creativity').length,
            personality: this.questions.filter(q => q.type === 'personality').length
        };

        return {
            intelligence: (this.scores.intelligence / totalQuestions.intelligence),
            creativity: (this.scores.creativity / totalQuestions.creativity),
            personality: (this.scores.personality / totalQuestions.personality),
            miniGames: this.scores.miniGames,
            cognitiveProfile: this.generateCognitiveProfile()
        };
    }

    // ... existing code ...
}

// Add transition styles to the CSS
const transitionStyles = document.createElement('style');
transitionStyles.textContent = `
    .game-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 46, 0.95);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
    }

    .game-transition-overlay::after {
        content: 'Get Ready!';
        color: #6C63FF;
        font-size: 2rem;
        font-weight: bold;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(transitionStyles);

// Export what needs to be used by other modules
export { QuestionManager, QuestionType };