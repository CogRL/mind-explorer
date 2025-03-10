/**
 * Sound Engine for Mind Explorer
 * Uses the Web Audio API to generate high-quality, dynamic sound effects
 */

export class SoundEngine {
    constructor() {
        // Initialize audio context
        this.audioCtx = null;
        this.sounds = {};
        this.masterGain = null;
        this.initialized = false;
        this.muted = false;
        
        // Sound definitions (will be created when initialize is called)
        this.soundDefinitions = {
            click: {
                type: 'click',
                frequency: 800,
                duration: 0.08
            },
            transition: {
                type: 'transition',
                frequency: 440,
                duration: 0.5
            },
            complete: {
                type: 'complete',
                duration: 1.2
            },
            intelligence: {
                type: 'intelligence',
                baseFrequency: 600,
                duration: 0.7
            },
            creativity: {
                type: 'creativity',
                baseFrequency: 440,
                duration: 0.8
            },
            personality: {
                type: 'personality',
                baseFrequency: 350,
                duration: 0.6
            },
            correct: {
                type: 'correct',
                baseFrequency: 800,
                duration: 0.3
            },
            incorrect: {
                type: 'incorrect',
                baseFrequency: 200,
                duration: 0.3
            },
            timeout: {
                type: 'timeout',
                baseFrequency: 300,
                duration: 0.5
            }
        };
    }
    
    /**
     * Initialize the audio system - must be called after user interaction
     * due to browser autoplay policies
     */
    initialize() {
        try {
            // Create audio context
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = 0.5; // Set default volume to 50%
            this.masterGain.connect(this.audioCtx.destination);
            
            // Create all sound effects
            this.createSoundEffects();
            
            this.initialized = true;
            console.log('Sound engine initialized successfully');
            
            return true;
        } catch (err) {
            console.error('Failed to initialize sound engine:', err);
            return false;
        }
    }
    
    /**
     * Create all sound effects
     */
    createSoundEffects() {
        // Create each sound effect
        Object.entries(this.soundDefinitions).forEach(([name, definition]) => {
            switch (definition.type) {
                case 'click':
                    this.createClickSound(name, definition);
                    break;
                case 'transition':
                    this.createTransitionSound(name, definition);
                    break;
                case 'complete':
                    this.createCompleteSound(name, definition);
                    break;
                case 'intelligence':
                case 'creativity':
                case 'personality':
                    this.createCharacterSound(name, definition);
                    break;
                case 'correct':
                    this.createCorrectSound(name, definition);
                    break;
                case 'incorrect':
                    this.createIncorrectSound(name, definition);
                    break;
                case 'timeout':
                    this.createTimeoutSound(name, definition);
                    break;
                default:
                    this.createBasicTone(name, definition);
            }
        });
    }
    
    /**
     * Create a basic click sound
     */
    createClickSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a quick attack and decay click sound
        for (let i = 0; i < bufferSize; i++) {
            // Quick attack and decay envelope
            const t = i / this.audioCtx.sampleRate;
            const envelope = t < 0.01 ? t / 0.01 : Math.exp(-(t - 0.01) * 30);
            
            // Main tone
            data[i] = envelope * Math.sin(2 * Math.PI * definition.frequency * t);
            
            // Add some noise for a more "clicky" sound
            if (t < 0.03) {
                data[i] += envelope * 0.3 * (Math.random() * 2 - 1);
            }
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a transition sound (a sweeping tone)
     */
    createTransitionSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a sweeping transition sound
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Sweeping frequency from low to high
            const freq = definition.frequency * (1 + t);
            
            // Envelope with quick attack and slow decay
            const envelope = t < 0.05 ? t / 0.05 : Math.pow(1 - (t - 0.05) / (definition.duration - 0.05), 0.8);
            
            data[i] = envelope * 0.8 * Math.sin(2 * Math.PI * freq * t);
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a completion sound (achievement-like)
     */
    createCompleteSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);
        const dataL = buffer.getChannelData(0);
        const dataR = buffer.getChannelData(1);
        
        // Base frequencies for a major chord
        const freqRatio1 = 1;      // root
        const freqRatio2 = 5/4;    // major third
        const freqRatio3 = 3/2;    // perfect fifth
        
        const baseFreq = 400;
        
        // Create an achievement-like sound with three ascending tones
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Divide the sound into three segments
            let segment = 0;
            let localT = t;
            let segmentFreq = baseFreq;
            let segmentDuration = definition.duration / 3;
            
            if (t < segmentDuration) {
                segment = 0;
                segmentFreq = baseFreq * freqRatio1;
            } else if (t < segmentDuration * 2) {
                segment = 1;
                localT = t - segmentDuration;
                segmentFreq = baseFreq * freqRatio2;
            } else {
                segment = 2;
                localT = t - segmentDuration * 2;
                segmentFreq = baseFreq * freqRatio3;
            }
            
            // Envelope for each segment
            const envelope = localT < 0.05 ? localT / 0.05 : Math.pow(1 - (localT - 0.05) / (segmentDuration - 0.05), 0.5);
            
            // Create a slight stereo effect
            const phase = segment * 0.2; // Slightly different phase for each segment
            dataL[i] = envelope * 0.7 * Math.sin(2 * Math.PI * segmentFreq * t + phase);
            dataR[i] = envelope * 0.7 * Math.sin(2 * Math.PI * segmentFreq * t);
            
            // Add a subtle second harmonic
            dataL[i] += envelope * 0.2 * Math.sin(4 * Math.PI * segmentFreq * t);
            dataR[i] += envelope * 0.2 * Math.sin(4 * Math.PI * segmentFreq * t + phase);
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a character-specific sound
     */
    createCharacterSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);
        const dataL = buffer.getChannelData(0);
        const dataR = buffer.getChannelData(1);
        
        // Different sound character based on type
        let tone1, tone2, modFreq;
        
        switch (name) {
            case 'intelligence':
                // Clear, bright tones for intelligence
                tone1 = definition.baseFrequency;
                tone2 = definition.baseFrequency * 1.5;
                modFreq = 8;
                break;
            case 'creativity':
                // Playful, varied tones for creativity
                tone1 = definition.baseFrequency;
                tone2 = definition.baseFrequency * (5/4);
                modFreq = 5;
                break;
            case 'personality':
                // Warm, gentle tones for personality
                tone1 = definition.baseFrequency;
                tone2 = definition.baseFrequency * (6/5);
                modFreq = 3;
                break;
        }
        
        // Create the character-specific sound
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Envelope with moderate attack and decay
            const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / (definition.duration - 0.1), 0.7);
            
            // Slight frequency modulation for more character
            const mod = 1 + 0.02 * Math.sin(2 * Math.PI * modFreq * t);
            
            // Create stereo effect by using slightly different frequencies
            dataL[i] = envelope * 0.5 * Math.sin(2 * Math.PI * tone1 * t * mod);
            dataR[i] = envelope * 0.5 * Math.sin(2 * Math.PI * tone2 * t * mod);
            
            // Add some harmonics
            dataL[i] += envelope * 0.2 * Math.sin(4 * Math.PI * tone1 * t);
            dataR[i] += envelope * 0.2 * Math.sin(4 * Math.PI * tone2 * t);
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a correct answer sound
     */
    createCorrectSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a positive, uplifting sound
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Two-tone "ding" with rising pitch
            const freq1 = definition.baseFrequency;
            const freq2 = definition.baseFrequency * 1.25;
            
            // Crossfade between tones
            const mix = Math.min(1, t / (definition.duration * 0.5));
            
            // Envelope with quick attack and moderate decay
            const envelope = t < 0.02 ? t / 0.02 : Math.pow(1 - (t - 0.02) / (definition.duration - 0.02), 2);
            
            data[i] = envelope * ((1 - mix) * Math.sin(2 * Math.PI * freq1 * t) + 
                                 mix * Math.sin(2 * Math.PI * freq2 * t));
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create an incorrect answer sound
     */
    createIncorrectSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a neutral, non-discouraging sound
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Two-tone "buzz" with slight frequency modulation
            const freq1 = definition.baseFrequency;
            const freq2 = definition.baseFrequency * 0.8;
            const mod = 1 + 0.04 * Math.sin(2 * Math.PI * 8 * t);
            
            // Envelope with moderate attack and decay
            const envelope = t < 0.05 ? t / 0.05 : Math.pow(1 - (t - 0.05) / (definition.duration - 0.05), 2);
            
            data[i] = envelope * 0.5 * (Math.sin(2 * Math.PI * freq1 * t * mod) + 
                                       Math.sin(2 * Math.PI * freq2 * t));
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a timeout sound
     */
    createTimeoutSound(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a soft alert sound
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            
            // Decreasing frequency
            const freq = definition.baseFrequency * (1 - t * 0.3);
            
            // Pulsating effect
            const pulse = 0.7 + 0.3 * Math.sin(2 * Math.PI * 8 * t);
            
            // Envelope
            const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / (definition.duration - 0.1), 0.7);
            
            data[i] = envelope * pulse * Math.sin(2 * Math.PI * freq * t);
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Create a basic tone
     */
    createBasicTone(name, definition) {
        const bufferSize = this.audioCtx.sampleRate * definition.duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioCtx.sampleRate;
            const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / (definition.duration - 0.1), 1);
            data[i] = envelope * Math.sin(2 * Math.PI * definition.frequency * t);
        }
        
        this.sounds[name] = buffer;
    }
    
    /**
     * Play a sound by name
     */
    play(name) {
        if (!this.initialized) {
            this.initialize();
        }
        
        if (this.muted || !this.initialized || !this.sounds[name]) return;
        
        try {
            const source = this.audioCtx.createBufferSource();
            source.buffer = this.sounds[name];
            source.connect(this.masterGain);
            source.start();
            return source;
        } catch (err) {
            console.error(`Error playing sound ${name}:`, err);
            return null;
        }
    }
    
    /**
     * Set master volume (0.0 to 1.0)
     */
    setVolume(volume) {
        if (!this.initialized) return;
        
        const vol = Math.max(0, Math.min(1, volume));
        this.masterGain.gain.value = vol;
    }
    
    /**
     * Mute/unmute all sounds
     */
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
    
    /**
     * Resume audio context (needed after browser policy changes)
     */
    resume() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
}

// Create and export a singleton instance
const soundEngine = new SoundEngine();
export default soundEngine;
