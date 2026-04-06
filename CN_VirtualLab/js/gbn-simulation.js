/**
 * gbn-simulation.js - Implementation of Go-Back-N ARQ Experiment
 */

window.gbnExp = {
    title: "Experiment 4: Go-Back-N ARQ Flow Control",

    theory: `
        <div class="theory-content">
            <h3>1. Introduction to Flow Control</h3>
            <p>Flow Control is a set of procedures for the Data Link Layer that regulates the flow of data between the sender and the receiver. It allows stations working at different speeds to communicate without overwhelming the receiver.</p>
            
            <h3>2. Go-Back-N Protocol (GBN)</h3>
            <p>GBN is a specific instance of the Automatic Repeat Request (ARQ) protocol. It uses <strong>Pipelining</strong>, allowing the sender to transmit multiple frames before receiving an acknowledgment.</p>
            <ul>
                <li><strong>Sender Window Size (WS):</strong> N (The number of frames that can be sent without ACK).</li>
                <li><strong>Receiver Window Size (WR):</strong> Always 1. The receiver only accepts the specific frame it expects.</li>
                <li><strong>Acknowledgements:</strong> GBN often uses <em>Cumulative ACKs</em>. If ACK 3 is received, it implies all frames up to 3 were received correctly.</li>
            </ul>

            <h3>3. Sequence Numbers</h3>
            <p>Sequence numbers are modulo 2<sup>m</sup>. To avoid ambiguity between original frames and retransmissions, the window size must be less than 2<sup>m</sup> (usually WS = 2<sup>m</sup> - 1).</p>

            <h3>4. Efficiency and Calculations</h3>
            <p>The efficiency (η) of GBN is defined as:</p>
            <p style="text-align:center; font-family:serif; font-style:italic;">η = N / (1 + 2a), where a = T<sub>p</sub> / T<sub>t</sub></p>
            <ul>
                <li><strong>Transmission Delay (T<sub>t</sub>):</strong> D / B (Data size / Bandwidth)</li>
                <li><strong>Propagation Delay (T<sub>p</sub>):</strong> d / s (Distance / Speed)</li>
            </ul>

            <h3>5. Advantages & Disadvantages</h3>
            <p><strong>Pros:</strong> High efficiency due to pipelining; reduced waiting time.</p>
            <p><strong>Cons:</strong> If one frame is lost, the <em>entire window</em> must be retransmitted, which can increase congestion and bandwidth waste.</p>
        </div>`,

    simulation: `
        <div class="simulator-wrapper">
            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                <!-- Legend -->
                <div style="flex: 1; background: #f8f9fa; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.85rem;">
                    <h4 style="margin:0 0 10px 0;">Index</h4>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:12px; height:12px; background:#2e7d32; margin-right:8px;"></div> Successful</div>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:12px; height:12px; background:#d32f2f; margin-right:8px;"></div> Lost (Frame/ACK)</div>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:12px; height:12px; border: 2px solid #003366; margin-right:8px;"></div> Current Window</div>
                </div>

                <!-- Config -->
                <div style="flex: 3; background: #f8f9fa; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <label><strong>Select Window Size (N):</strong></label>
                    <select id="gbnWinSelect" onchange="gbnExp.initScenario(this.value)" style="padding:5px; margin-left:10px;">
                        <option value="3">Window Size 3</option>
                        <option value="4">Window Size 4</option>
                        <option value="5">Window Size 5</option>
                    </select>
                    <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #555;" id="gbnInstructions">
                        Select frames 1, 2, and 3 to begin.
                    </p>
                </div>
            </div>

            <!-- Frames Array -->
            <div id="gbnFramesArray" style="display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; padding: 10px; background: #eee; border-radius: 8px;">
                <!-- Buttons generated here -->
            </div>

            <!-- Visualizer -->
            <div class="visualizer-box" style="height: 250px; border: 2px solid #003366; border-radius: 8px; position: relative; background: #fff; overflow: hidden;">
                <div style="position: absolute; left: 30px; top: 80px; width: 80px; height: 100px; background: #003366; color: white; text-align: center; border-radius: 5px; padding-top: 10px;">SENDER</div>
                <div style="position: absolute; right: 30px; top: 80px; width: 80px; height: 100px; background: #003366; color: white; text-align: center; border-radius: 5px; padding-top: 10px;">RECEIVER</div>
                
                <!-- Animation Elements -->
                <div id="gbnPacket" class="hidden" style="position: absolute; width: 50px; height: 30px; background: #003366; color: white; font-size: 11px; text-align: center; line-height: 30px; border-radius: 3px; z-index: 10; transition: all 0.8s linear;">DATA</div>
                <div id="gbnAck" class="hidden" style="position: absolute; width: 45px; height: 25px; background: #2e7d32; color: white; font-size: 11px; text-align: center; line-height: 25px; border-radius: 3px; z-index: 10; transition: all 0.8s linear;">ACK</div>
                
                <div id="gbnStatus" style="position: absolute; bottom: 15px; width: 100%; text-align: center; font-weight: bold; color: #003366;">Initializing...</div>
            </div>

            <div id="gbnFinal" class="hidden" style="margin-top: 20px; padding: 20px; background: #e8f5e9; border: 2px solid #2e7d32; border-radius: 8px;">
                <h4 style="margin:0 0 10px 0;">ALL FRAMES SENT SUCCESSFULLY!</h4>
                <p>Calculate total transmissions (Original + Retransmissions):</p>
                <input type="number" id="gbnTotalInput" style="padding: 8px; width: 100px; border: 1px solid #ccc; border-radius: 4px;">
                <button class="action-btn-blue" onclick="gbnExp.checkFinal()" style="padding: 8px 20px; border-radius: 4px;">Submit</button>
                <p id="gbnFeedback" style="margin-top: 10px; font-weight: bold;"></p>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container">
            <h3>Go-Back-N Assessment</h3>
            <div id="gbn-quiz-area" style="max-height: 450px; overflow-y: auto; padding-right: 10px;"></div>
            <button class="gen-btn" style="margin-top:20px;" onclick="gbnExp.gradeQuiz()">Submit Quiz</button>
            <div id="quiz-result"></div>
        </div>`,

    quizQuestions: [
        { q: "What is the receiver window size in GBN?", a: ["N", "N-1", "1"], c: 2 },
        { q: "If WS=4 and frame 2 is lost, which frames are retransmitted?", a: ["Only 2", "2, 3, 4, 5 (Current Window)", "None"], c: 1 },
        { q: "In GBN, sequence numbers are modulo 2^m. Maximum window size is:", a: ["2^m", "2^m - 1", "2^m + 1"], c: 1 },
        { q: "What type of ACK is typically used in GBN?", a: ["Cumulative", "Negative", "Selective"], c: 0 },
        { q: "Pipelining increases efficiency by:", a: ["Reducing frame size", "Allowing multiple unacknowledged frames", "Increasing speed of light"], c: 1 },
        { q: "What happens if an ACK is lost but the next ACK arrives before timeout?", a: ["Timeout occurs", "Sender retransmits", "Cumulative ACK handles it (no retransmission)"], c: 2 },
        { q: "The term 'Go-Back-N' refers to retransmitting N frames from:", null: "The last unacknowledged frame", a: ["Point of loss", "The last unacknowledged frame Sf", "Frame 0"], c: 1 },
        { q: "Transmission delay depends on:", a: ["Distance", "Bandwidth", "Medium speed"], c: 1 },
        { q: "Which is a disadvantage of GBN?", a: ["Slow transmission", "High bandwidth waste on errors", "No sequence numbers"], c: 1 },
        { q: "Efficiency η equals:", a: ["1 / (1 + 2a)", "N / (1 + 2a)", "N * (1 + 2a)"], c: 1 }
    ],

    // --- State Management ---
    curWinSize: 3,
    stepIndex: 0,
    totalSent: 0,
    isBusy: false,
    scenario: [],
    
    scenarios: {
        "3": [
            { cmd: 'send', frames: [1, 2, 3], msg: "First, select the first three frames (1,2,3)." },
            { cmd: 'ack', frame: 1, msg: "ACK 1 received. Select next frame (4)." },
            { cmd: 'send', frames: [4], msg: "" },
            { cmd: 'error', type: 'ack_lost', frame: 2, msg: "ACK 2 lost! Retransmit current window (2,3,4)." },
            { cmd: 'send', frames: [2, 3, 4], msg: "Retransmitting 2, 3, 4..." },
            { cmd: 'ack', frame: 2, msg: "ACK 2 received. Select next (5)." },
            { cmd: 'send', frames: [5], msg: "" },
            { cmd: 'ack', frame: 3, msg: "ACK 3 received. Select next (6)." },
            { cmd: 'send', frames: [6], msg: "" },
            { cmd: 'ack', frame: 4, msg: "ACK 4 received. Select next (7)." },
            { cmd: 'send', frames: [7], msg: "" },
            { cmd: 'error', type: 'ack_lost', frame: 5, msg: "ACK 5 lost! Retransmit window (5,6,7)." },
            { cmd: 'send', frames: [5, 6, 7], msg: "" },
            { cmd: 'ack', frame: 5, msg: "ACK 5 received. Select next (8)." },
            { cmd: 'send', frames: [8, 9, 10], msg: "ACK 6, 7 received. Send final batch (8,9,10)." },
            { cmd: 'done', ans: 16 } // Calculated manually for the scenario
        ],
        "4": [
            { cmd: 'send', frames: [1, 2, 3, 4], msg: "Select first four frames (1,2,3,4)." },
            { cmd: 'ack', frame: 1, msg: "ACK 1 received. Select next (5)." },
            { cmd: 'send', frames: [5], msg: "" },
            { cmd: 'ack', frame: 2, msg: "ACK 2 received. Select next (6)." },
            { cmd: 'send', frames: [6], msg: "" },
            { cmd: 'error', type: 'frame_lost', frame: 3, msg: "Frame 3 lost! Retransmit window (3,4,5,6)." },
            { cmd: 'send', frames: [3, 4, 5, 6], msg: "" },
            { cmd: 'ack', frame: 3, msg: "ACK 3,4,5,6 received. Select next (7,8,9,10)." },
            { cmd: 'send', frames: [7, 8, 9, 10], msg: "" },
            { cmd: 'error', type: 'ack_lost', frame: 7, msg: "ACK 7 lost! Retransmit window (7,8,9,10)." },
            { cmd: 'send', frames: [7, 8, 9, 10], msg: "" },
            { cmd: 'done', ans: 18 }
        ],
        "5": [
            { cmd: 'send', frames: [1, 2, 3, 4, 5], msg: "Select first five frames (1-5)." },
            { cmd: 'ack', frame: 1, msg: "ACK 1 received. Select next (6)." },
            { cmd: 'send', frames: [6], msg: "" },
            { cmd: 'ack', frame: 2, msg: "ACK 2 received. Select next (7)." },
            { cmd: 'send', frames: [7], msg: "" },
            { cmd: 'error', type: 'ack_lost', frame: 3, msg: "ACK 3 lost! Retransmit window (3,4,5,6,7)." },
            { cmd: 'send', frames: [3, 4, 5, 6, 7], msg: "" },
            { cmd: 'ack', frame: 3, msg: "ACK 3 received. Select next (8)." },
            { cmd: 'send', frames: [8], msg: "" },
            { cmd: 'ack', frame: 4, msg: "ACK 4 received. Select next (9)." },
            { cmd: 'send', frames: [9], msg: "" },
            { cmd: 'ack', frame: 5, msg: "ACK 5 received. Select next (10)." },
            { cmd: 'send', frames: [10], msg: "" },
            { cmd: 'error', type: 'ack_lost', frame: 6, msg: "ACK 6 lost! Retransmit window (6,7,8,9,10)." },
            { cmd: 'send', frames: [6, 7, 8, 9, 10], msg: "" },
            { cmd: 'done', ans: 22 }
        ]
    },

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') this.initScenario("3");
        if (part === 'quiz') this.loadQuiz();
    },

    initScenario(winSize) {
        this.curWinSize = parseInt(winSize);
        this.stepIndex = 0;
        this.totalSent = 0;
        this.isBusy = false;
        this.scenario = this.scenarios[winSize];
        
        // Render Frame Array
        const container = document.getElementById('gbnFramesArray');
        container.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.innerText = i;
            btn.onclick = () => this.handleFrameClick(i);
            container.appendChild(btn);
        }
        
        document.getElementById('gbnStatus').innerText = "Ready. Follow instructions.";
        document.getElementById('gbnInstructions').innerText = this.scenario[0].msg;
        document.getElementById('gbnFinal').classList.add('hidden');
        document.getElementById('gbnFeedback').innerText = "";
    },

    handleFrameClick(num) {
        if (this.isBusy) return;
        const currentStep = this.scenario[this.stepIndex];
        
        if (currentStep.cmd === 'send') {
            // Check if frame is in the expected set
            if (currentStep.frames.includes(num)) {
                // For simplicity in the multi-select steps, we check if they click the first in the set
                // or if it's the specific single frame expected.
                // Guided logic: if multiple are expected, they must be clicked in sequence or it just triggers.
                // We'll allow any frame in the expected 'frames' array to trigger the animation for that set.
                this.runAnimation(currentStep);
            } else {
                alert("Wrong Frame Selected! Expected: " + currentStep.frames.join(", "));
            }
        }
    },

    async runAnimation(step) {
        this.isBusy = true;
        const packet = document.getElementById('gbnPacket');
        const ack = document.getElementById('gbnAck');
        const status = document.getElementById('gbnStatus');
        const inst = document.getElementById('gbnInstructions');

        // Increment total transmissions
        this.totalSent += step.frames.length;

        for (let frame of step.frames) {
            packet.innerText = "DATA " + frame;
            packet.style.left = '110px';
            packet.style.top = '120px';
            packet.className = "";
            packet.classList.remove('hidden');
            status.innerText = "Sending Frame " + frame + "...";

            await this.delay(800);

            // Check if next step is error lost frame
            const nextStep = this.scenario[this.stepIndex + 1];
            if (nextStep && nextStep.cmd === 'error' && nextStep.type === 'frame_lost' && nextStep.frame === frame) {
                packet.style.left = '50%';
                packet.style.opacity = '0';
                await this.delay(800);
                packet.classList.add('hidden');
                packet.style.opacity = '1';
                status.innerHTML = `<span style="color:#d32f2f">Frame ${frame} LOST!</span>`;
                this.stepIndex += 2; // Jump to retransmit instruction
                inst.innerText = this.scenario[this.stepIndex].msg;
                this.isBusy = false;
                return;
            }

            packet.style.left = 'calc(100% - 160px)';
            await this.delay(800);
            packet.classList.add('hidden');

            // Handle ACK
            if (step.frames.indexOf(frame) === step.frames.length - 1) {
                // If it's an error scenario for ACK Lost
                if (nextStep && nextStep.cmd === 'error' && nextStep.type === 'ack_lost') {
                    ack.innerText = "ACK " + nextStep.frame;
                    ack.style.right = '110px';
                    ack.style.top = '120px';
                    ack.className = "";
                    ack.classList.remove('hidden');
                    await this.delay(100);
                    ack.style.right = '50%';
                    ack.style.opacity = '0';
                    await this.delay(800);
                    ack.classList.add('hidden');
                    ack.style.opacity = '1';
                    status.innerHTML = `<span style="color:#d32f2f">ACK ${nextStep.frame} LOST!</span>`;
                    this.stepIndex += 2;
                    inst.innerText = this.scenario[this.stepIndex].msg;
                    this.isBusy = false;
                    return;
                }

                // Normal successful ACK logic
                this.stepIndex++;
                const nextAction = this.scenario[this.stepIndex];
                if (nextAction.cmd === 'ack') {
                    ack.innerText = "ACK " + nextAction.frame;
                    ack.style.right = '110px';
                    ack.style.top = '120px';
                    ack.className = "";
                    ack.classList.remove('hidden');
                    await this.delay(800);
                    ack.style.right = 'calc(100% - 160px)';
                    await this.delay(800);
                    ack.classList.add('hidden');
                    status.innerText = "ACK " + nextAction.frame + " received.";
                    this.stepIndex++;
                }

                const finalCheck = this.scenario[this.stepIndex];
                if (finalCheck.cmd === 'done') {
                    inst.innerText = "All frames sent!";
                    document.getElementById('gbnFinal').classList.remove('hidden');
                } else {
                    inst.innerText = this.scenario[this.stepIndex].msg;
                }
            }
        }
        this.isBusy = false;
    },

    delay(ms) { return new Promise(res => setTimeout(res, ms)); },

    checkFinal() {
        const val = parseInt(document.getElementById('gbnTotalInput').value);
        const correct = this.scenario[this.scenario.length - 1].ans;
        const feedback = document.getElementById('gbnFeedback');
        if (val === correct) {
            feedback.innerText = "Correct! Total transmissions: " + correct;
            feedback.style.color = "green";
        } else {
            feedback.innerText = "Incorrect. Try counting all original attempts and retransmitted frames in the window.";
            feedback.style.color = "red";
        }
    },

    loadQuiz() {
        const area = document.getElementById('gbn-quiz-area');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question">
                <p><strong>${i+1}. ${item.q}</strong></p>
                ${item.a.map((opt, oi) => `
                    <label><input type="radio" name="gbnQ${i}" value="${oi}"> ${opt}</label><br>
                `).join('')}
            </div>
        `).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const sel = document.querySelector(`input[name="gbnQ${i}"]:checked`);
            if (sel && parseInt(sel.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.innerHTML = `You scored ${score}/10!`;
        res.style.padding = "15px";
        res.style.background = score >= 7 ? "#d4edda" : "#f8d7da";
    }
};