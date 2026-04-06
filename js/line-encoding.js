/**
 * line-encoding.js - Restored Classic Aesthetic with Modern Animation
 * Features: Classic Red Signal, White Background Graph, and High-Contrast Labels.
 */

window.encodingExp = {
    title: "Experiment 1: Line Encoding Schemes",
    
    theory: `
        <div class="theory-content custom-scrollbar" style="max-height: 450px; overflow-y: auto; padding-right: 15px; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; background: #fff;">
            <h3 style="margin-top:0;">1. Introduction to Line Coding</h3>
            <p>Line encoding converts digital data into digital signals. This is essential for physical layer transmission to ensure the signal matches the media's characteristics and stays synchronized.</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 5px solid var(--primary);">
                    <h4 style="margin-top:0; color: var(--primary); font-size: 1.1rem;">Self-Synchronization</h4>
                    <p style="font-size: 0.95rem; margin-bottom:0;">Receiver stays in sync using transitions. <strong>Manchester</strong> provides transitions in every bit interval.</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 5px solid #d32f2f;">
                    <h4 style="margin-top:0; color: var(--primary); font-size: 1.1rem;">DC Components</h4>
                    <p style="font-size: 0.95rem; margin-bottom:0;">Constant levels create DC current. <strong>Bipolar AMI</strong> eliminates this by alternating polarities.</p>
                </div>
            </div>

            <h3>2. Common Schemes</h3>
            <ul class="theory-list" style="font-size: 1rem; line-height: 1.8;">
                <li><strong>Unipolar NRZ:</strong> One polarity (+V and 0). High DC component.</li>
                <li><strong>Polar NRZ-L:</strong> Symmetric voltages (+V and -V).</li>
                <li><strong>Bipolar AMI:</strong> Three levels. '1' bits alternate between positive and negative.</li>
                <li><strong>Manchester:</strong> Transition in the middle of every bit. Ideal for self-sync.</li>
            </ul>
        </div>`,

    simulation: `
        <div class="simulator-wrapper custom-scrollbar" style="max-height: 700px; overflow-y: auto; padding-right: 10px;">
            <!-- Control Dashboard -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 15px; border: 1px solid #cbd5e1; margin-bottom: 25px; box-shadow: var(--shadow-sm);">
                <div style="display: grid; grid-template-columns: 1.2fr 1fr 0.8fr; gap: 20px; align-items: end;">
                    <div class="control-group">
                        <label style="font-size: 0.9rem; margin-bottom: 8px; color: var(--primary); font-weight: bold;">Binary Sequence:</label>
                        <input type="text" id="binaryInput" value="101100" maxlength="12" style="font-size: 1.1rem; padding: 10px; font-family: monospace; letter-spacing: 4px; text-align: center; border-radius: 8px; border: 1px solid #ccc; background: #fff; width: 100%;">
                    </div>
                    <div class="control-group">
                        <label style="font-size: 0.9rem; margin-bottom: 8px; color: var(--primary); font-weight: bold;">Scheme:</label>
                        <select id="schemeSelect" style="font-size: 0.95rem; padding: 10px; height: 45px; border-radius: 8px; border: 1px solid #ccc; background: #fff; width: 100%;">
                            <option value="unipolar">Unipolar NRZ</option>
                            <option value="polar">Polar NRZ-L</option>
                            <option value="ami">Bipolar AMI</option>
                            <option value="manchester">Manchester</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label style="font-size: 0.9rem; margin-bottom: 8px; color: var(--primary); font-weight: bold;">Voltage:</label>
                        <input type="range" id="voltageRange" min="20" max="60" value="40" style="height: 45px; width: 100%;">
                    </div>
                </div>
                <button class="start-btn" style="width: 100%; margin-top: 20px; height: 50px; font-size: 1.1rem; border-radius: 10px;" onclick="encodingExp.runSimulation()">
                    GENERATE WAVEFORM
                </button>
            </div>
            
            <!-- Classic Style Graph -->
            <div class="canvas-container" style="background: #ffffff; border: 2px solid #003366; padding: 20px; border-radius: 10px; position: relative; box-shadow: var(--shadow-md);">
                <div style="position: absolute; left: 15px; top: 10px; color: #999; font-family: monospace; font-size: 0.75rem; font-weight: bold;">
                    SIGNAL ANALYZER: 5V/DIV
                </div>
                <canvas id="encodingCanvas" width="1000" height="220" style="width:100%; display: block;"></canvas>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container custom-scrollbar" style="max-height: 500px; overflow-y: auto; padding-right: 15px; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; background: #fff;">
            <h3 style="margin-bottom:25px; font-size: 1.5rem; font-weight: 800; color: var(--primary);">Assessment Quiz</h3>
            <div id="quiz-questions-area"></div>
            <button class="gen-btn" style="margin-top:25px; width:100%; height: 45px;" onclick="encodingExp.gradeQuiz()">Submit Assessment</button>
            <div id="quiz-result" style="display:none; margin-top:20px; padding:15px; border-radius:10px; text-align:center; font-weight:bold;"></div>
        </div>`,

    quizQuestions: [
        { q: "What is the unit for signal elements per second?", a: ["Bits", "Baud", "Hertz"], c: 1 },
        { q: "Which scheme has a transition in the middle of every bit?", a: ["Unipolar", "Polar NRZ", "Manchester"], c: 2 },
        { q: "In AMI, Logic 0 is represented by:", a: ["Positive Voltage", "Negative Voltage", "Zero Voltage"], c: 2 },
        { q: "Manchester encoding transition from Positive to Negative represents:", a: ["Binary 1", "Binary 0", "Zero voltage"], c: 1 },
        { q: "The DC component of a Bipolar AMI signal is:", a: ["High", "Positive", "Zero"], c: 2 }
    ],

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') setTimeout(() => this.runSimulation(), 100);
        if (part === 'quiz') this.loadQuiz();
    },

    loadQuiz() {
        const area = document.getElementById('quiz-questions-area');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question" style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:15px;">
                <p style="margin-top:0; font-weight:700;">${i+1}. ${item.q}</p>
                ${item.a.map((opt, oi) => `<label style="display:block; padding:8px; cursor:pointer;"><input type="radio" name="encQ${i}" value="${oi}" style="margin-right:10px;"> ${opt}</label>`).join('')}
            </div>`).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const sel = document.querySelector(`input[name="encQ${i}"]:checked`);
            if (sel && parseInt(sel.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.style.display = "block";
        res.innerHTML = `Score: ${score}/${this.quizQuestions.length}`;
        res.style.background = score >= 3 ? "#dcfce7" : "#fee2e2";
        res.style.color = score >= 3 ? "#166534" : "#991b1b";
    },

    activeAnimation: null,

    runSimulation() {
        if (this.activeAnimation) cancelAnimationFrame(this.activeAnimation);
        
        const canvas = document.getElementById('encodingCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const input = document.getElementById('binaryInput').value;
        const scheme = document.getElementById('schemeSelect').value;
        const volt = parseInt(document.getElementById('voltageRange').value);
        
        if (!/^[01]+$/.test(input)) { alert("Enter Binary bits only!"); return; }

        const bits = input.split('').map(Number);
        const bitW = canvas.width / 12;
        const midY = canvas.height / 2;

        let startTime = null;
        const duration = 1200; 

        const drawFrame = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentXLimit = canvas.width * progress;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Baseline - Like the old code
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(canvas.width, midY); ctx.stroke();

            // Axes Labels
            ctx.fillStyle = '#aaa';
            ctx.font = '10px Arial';
            ctx.fillText('+V', 5, midY - volt - 5);
            ctx.fillText('0V', 5, midY + 12);
            ctx.fillText('-V', 5, midY + volt + 15);

            // Signal - Red signal from older code
            ctx.strokeStyle = '#d32f2f'; 
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.beginPath();

            let x = 0;
            let lastP = 1;
            let first = true;

            for (let i = 0; i < bits.length; i++) {
                const bit = bits[i];
                if (i * bitW > currentXLimit) break;

                let y;
                if (scheme === 'unipolar') {
                    y = bit === 1 ? midY - volt : midY;
                } else if (scheme === 'polar') {
                    y = bit === 1 ? midY + volt : midY - volt;
                } else if (scheme === 'ami') {
                    if (bit === 0) y = midY;
                    else { lastP *= -1; y = lastP === 1 ? midY - volt : midY + volt; }
                }

                if (scheme === 'manchester') {
                    let h = midY - volt, l = midY + volt;
                    let start = bit === 1 ? l : h, end = bit === 1 ? h : l;
                    if (first) { ctx.moveTo(x, start); first = false; }
                    ctx.lineTo(x, start);
                    ctx.lineTo(x + bitW/2, start);
                    ctx.lineTo(x + bitW/2, end);
                    x += bitW;
                    ctx.lineTo(x, end);
                } else {
                    if (first) { ctx.moveTo(x, y); first = false; }
                    ctx.lineTo(x, y);
                    x += bitW;
                    ctx.lineTo(x, y);
                }

                // Bit label
                ctx.save();
                ctx.fillStyle = '#666';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(bit, (i * bitW) + bitW/2, 30);
                ctx.restore();
            }
            ctx.stroke();

            if (progress < 1) this.activeAnimation = requestAnimationFrame(drawFrame);
        };

        requestAnimationFrame(drawFrame);
    }
};