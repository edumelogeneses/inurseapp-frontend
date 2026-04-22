/**
 * Audio Recorder Module
 * Grava áudio usando MediaRecorder API com visualização em tempo real
 */

class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.stream = null;
        this.startTime = null;
        this.pausedDuration = 0;
        this.pauseStartTime = null;
        this.timerInterval = null;
        this.audioContext = null;
        this.analyser = null;
        this.animationId = null;
        this.canvas = document.getElementById('audioVisualizer');
        this.canvasContext = this.canvas ? this.canvas.getContext('2d') : null;
    }

    async initialize() {
        try {
            // Processamento agressivo do browser estava cortando voz
            // clínica quando paciente/enfermeiro falavam em volume normal
            // de consulta. Whisper funciona melhor com áudio bruto de
            // alta qualidade. 128 kbps é padrão para voz profissional.
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 44100,
                },
            });

            // Configurar AudioContext para visualização
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(this.stream);
            source.connect(this.analyser);
            this.analyser.fftSize = 2048;

            // Configurar MediaRecorder
            const mimeType = this.getSupportedMimeType();
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType,
                audioBitsPerSecond: 128000,
            });

            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            });

            this.mediaRecorder.addEventListener('stop', () => {
                this.createAudioBlob();
            });

            return true;
        } catch (error) {
            console.error('Erro ao inicializar gravador:', error);
            throw new Error('Não foi possível acessar o microfone. Verifique as permissões.');
        }
    }

    getSupportedMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4',
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return 'audio/webm'; // fallback
    }

    start() {
        if (!this.mediaRecorder) {
            throw new Error('Gravador não inicializado');
        }

        this.audioChunks = [];
        this.audioBlob = null;
        this.startTime = Date.now();
        this.pausedDuration = 0;
        this.mediaRecorder.start(1000); // timeslice 1s — chunks periódicos evitam perda total se a aba for fechada
        this.startTimer();
        this.startVisualization();
    }

    pause() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
            this.pauseStartTime = Date.now();
            this.stopTimer();
        }
    }

    resume() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
            if (this.pauseStartTime) {
                this.pausedDuration += Date.now() - this.pauseStartTime;
                this.pauseStartTime = null;
            }
            this.startTimer();
        }
    }

    stop() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.stopTimer();
            this.stopVisualization();
        }
    }

    createAudioBlob() {
        const mimeType = this.mediaRecorder.mimeType;
        this.audioBlob = new Blob(this.audioChunks, { type: mimeType });
    }

    getAudioBlob() {
        return this.audioBlob;
    }

    getAudioURL() {
        if (!this.audioBlob) return null;
        return URL.createObjectURL(this.audioBlob);
    }

    getDuration() {
        if (!this.startTime) return 0;
        const now = this.mediaRecorder.state === 'paused' ? this.pauseStartTime : Date.now();
        return Math.floor((now - this.startTime - this.pausedDuration) / 1000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const duration = this.getDuration();
            this.updateTimerDisplay(duration);
        }, 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const timerElement = document.getElementById('recording-time');
        if (timerElement) {
            timerElement.textContent = display;
        }
    }

    startVisualization() {
        if (!this.canvasContext || !this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            this.animationId = requestAnimationFrame(draw);

            this.analyser.getByteTimeDomainData(dataArray);

            const { width, height } = this.canvas;
            this.canvasContext.fillStyle = '#f3f4f6';
            this.canvasContext.fillRect(0, 0, width, height);

            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = '#0066CC';
            this.canvasContext.beginPath();

            const sliceWidth = width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * height) / 2;

                if (i === 0) {
                    this.canvasContext.moveTo(x, y);
                } else {
                    this.canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            this.canvasContext.lineTo(width, height / 2);
            this.canvasContext.stroke();
        };

        draw();
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Limpar canvas
        if (this.canvasContext) {
            const { width, height } = this.canvas;
            this.canvasContext.fillStyle = '#f3f4f6';
            this.canvasContext.fillRect(0, 0, width, height);
        }
    }

    reset() {
        this.stop();
        this.audioChunks = [];
        this.audioBlob = null;
        this.startTime = null;
        this.pausedDuration = 0;
        this.pauseStartTime = null;
        this.updateTimerDisplay(0);
    }

    cleanup() {
        this.reset();
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.mediaRecorder = null;
        this.analyser = null;
    }

    getState() {
        return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
    }

    isRecording() {
        return this.getState() === 'recording';
    }

    isPaused() {
        return this.getState() === 'paused';
    }

    isStopped() {
        return this.getState() === 'inactive';
    }
}

// Exportar para uso global
window.AudioRecorder = AudioRecorder;
