/**
 * arq-simulation.js - Guided Scenario for Experiment 2
 */

window.arqExp = {
    title: "Experiment 2: Stop & Wait ARQ Flow Control",
    
    theory: `
        <div class="theory-content">
            <h3>Introduction</h3>
            <p>Stop-and-Wait ARQ is a protocol where the sender sends one frame and waits for an acknowledgment (ACK) before sending the next one. This experiment demonstrates how the protocol handles <strong>Frame Loss</strong> and <strong>Acknowledgment Loss</strong>.</p>

            <h3>Simulation Instructions</h3>
            <ol>
                <li>Click the buttons in the <strong>Frames Array</strong> to send specific frames.</li>
                <li>Follow the status messages: if a frame or ACK is lost, you must <strong>retransmit</strong> the same frame.</li>
                <li>The simulation uses a specific sequence to teach different behaviors:
                    <ul>
                        <li>Frame 1: Successful.</li>
                        <li>Frame 2: ACK will be lost on first try.</li>
                        <li>Frame 4: Frame will be lost on first try.</li>
                    </ul>
                </li>
            </ol>
        </div>`,

    simulation: `
        <div class="simulator-wrapper">
            <div style="display: flex; gap: 20px;">
                <!-- Legend/Index -->
                <div style="flex: 1; background: #f4f4f4; padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 0.9rem;">
                    <h4 style="margin-top:0">Index</h4>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:15px; height:15px; background:#2e7d32; margin-right:10px;"></div> Successful</div>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:15px; height:15px; background:#d32f2f; margin-right:10px;"></div> Frame Lost</div>
                    <div style="display:flex; align-items:center; margin-bottom:5px;"><div style="width:15px; height:15px; background:#fbc02d; margin-right:10px;"></div> ACK Lost</div>
                    <div style="display:flex; align-items:center;"><div style="width:15px; height:15px; background:#003366; margin-right:10px;"></div> Current</div>
                </div>

                <!-- Control Panel -->
                <div style="flex: 3;">
                    <p><strong>Step: Select the frame to be sent from the array below:</strong></p>
                    <div id="framesArray" style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="tab-btn" onclick="arqExp.selectFrame(1)">1</button>
                        <button class="tab-btn" onclick="arqExp.selectFrame(2)">2</button>
                        <button class="tab-btn" onclick="arqExp.selectFrame(3)">3</button>
                        <button class="tab-btn" onclick="arqExp.selectFrame(4)">4</button>
                        <button class="tab-btn" onclick="arqExp.selectFrame(5)">5</button>
                    </div>
                </div>
            </div>

            <!-- Visualizer -->
            <div class="arq-visualizer" style="height: 250px; border: 2px solid #003366; position: relative; background: #fff; margin-top: 10px; overflow: hidden;">
                <div id="senderNode" style="position: absolute; left: 20px; top: 80px; width: 70px; height: 90px; background: #003366; color: white; text-align: center; border-radius: 5px; padding-top: 10px;">Sender</div>
                <div id="receiverNode" style="position: absolute; right: 20px; top: 80px; width: 70px; height: 90px; background: #003366; color: white; text-align: center; border-radius: 5px; padding-top: 10px;">Receiver</div>
                
                <div id="packet" class="hidden" style="position: absolute; width: 50px; height: 30px; background: #003366; color: white; font-size: 11px; text-align: center; line-height: 30px; border-radius: 3px; z-index: 10; transition: all 1s linear;">DATA</div>
                <div id="ackPacket" class="hidden" style="position: absolute; width: 45px; height: 25px; background: #2e7d32; color: white; font-size: 11px; text-align: center; line-height: 25px; border-radius: 3px; z-index: 10; transition: all 1s linear;">ACK</div>
                
                <div id="arqStatus" style="position: absolute; bottom: 10px; width: 100%; text-align: center; font-weight: bold; color: #003366; background: rgba(255,255,255,0.8);">Select Frame 1 to start simulation...</div>
            </div>

            <!-- Final Step (Hidden) -->
            <div id="finalStep" class="hidden" style="margin-top: 20px; padding: 20px; background: #e8f5e9; border: 1px solid #2e7d32; border-radius: 5px;">
                <h4>ALL FRAMES SENT!</h4>
                <p>Based on the simulation, how many total transmissions (including retransmissions) were made?</p>
                <input type="number" id="totalTransmissionsInput" style="padding: 8px; width: 60px;">
                <button class="enter-btn" style="padding:8px 20px;" onclick="arqExp.checkResult()">Submit</button>
                <p id="finalFeedback" style="margin-top:10px; font-weight:bold;"></p>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container">
            <h3>Assessment Quiz</h3>
            <div id="quiz-questions-area" style="max-height:400px; overflow-y:auto; padding-right:10px;"></div>
            <button class="gen-btn" style="margin-top:20px;" onclick="arqExp.gradeQuiz()">Submit Quiz</button>
            <div id="quiz-result"></div>
        </div>`,

    quizQuestions: [
        { q: "In Stop-and-Wait ARQ, sender waits for which packet?", a: ["NACK", "ACK", "DATA"], c: 1 },
        { q: "What happens if Frame 4 is lost?", a: ["Sender sends Frame 5", "Receiver requests retransmission", "Sender times out and retransmits"], c: 2 },
        { q: "If ACK is lost, the sender will:", a: ["Send the same frame again", "Abort transmission", "Send next frame"], c: 0 },
        { q: "Sequence numbers 0 and 1 are used to detect:", a: ["Lost frames", "Duplicate frames", "Speed of channel"], c: 1 },
        { q: "Stop-and-Wait is an example of:", a: ["Sliding Window", "Flow Control", "Physical Layer protocol"], c: 1 },
        { q: "What color was used for ACK Lost in the simulation?", a: ["Red", "Green", "Yellow/Orange"], c: 2 },
        { q: "High propagation delay makes Stop-and-Wait:", a: ["Highly efficient", "Inefficient", "No impact"], c: 1 },
        { q: "ARQ stands for:", a: ["Automatic Repeat Request", "Auto Routing Query", "Analog Repeat Quantity"], c: 0 },
        { q: "If receiver receives a duplicate frame, it must:", a: ["Accept it", "Ignore it but send ACK", "Discard it and send nothing"], c: 1 },
        { q: "A timeout occurs at the:", a: ["Receiver side", "Sender side", "Middle of channel"], c: 1 }
    ],

    // --- Logic State ---
    state: {
        nextExpectedFrame: 1,
        step: 1, // Specific scenario step
        totalTransmissions: 0,
        isAnimating: false
    },

    onTabLoad(part) {
        if (part === 'simulation') this.resetSim();
        if (part === 'quiz') this.loadQuiz();
    },

    resetSim() {
        this.state = { nextExpectedFrame: 1, step: 1, totalTransmissions: 0, isAnimating: false };
        const packet = document.getElementById('packet');
        const ack = document.getElementById('ackPacket');
        if (packet) packet.classList.add('hidden');
        if (ack) ack.classList.add('hidden');
        if (document.getElementById('finalStep')) document.getElementById('finalStep').classList.add('hidden');
    },

    selectFrame(num) {
        if (this.state.isAnimating) return;
        if (this.state.step > 7) return;

        if (num !== this.state.nextExpectedFrame) {
            alert("Wrong Frame Selected! Please select frame " + this.state.nextExpectedFrame);
            return;
        }

        this.state.isAnimating = true;
        this.state.totalTransmissions++;
        this.executeStepAnimation(num);
    },

    executeStepAnimation(num) {
        const packet = document.getElementById('packet');
        const ack = document.getElementById('ackPacket');
        const status = document.getElementById('arqStatus');
        
        packet.className = "";
        packet.style.left = '90px';
        packet.style.top = '120px';
        packet.innerText = "DATA " + num;
        packet.classList.remove('hidden');
        status.innerText = "Sending Frame " + num + "...";

        setTimeout(() => {
            // Check for Frame Loss scenario (Step 5: Frame 4 Lost)
            if (this.state.step === 5) {
                packet.style.left = '50%';
                packet.style.opacity = '0';
                setTimeout(() => {
                    packet.classList.add('hidden');
                    packet.style.opacity = '1';
                    status.innerHTML = "<span style='color:#d32f2f'>Frame " + num + " Lost! Reselect Frame " + num + ".</span>";
                    this.state.isAnimating = false;
                    this.state.step = 6; // Move to retransmission step
                }, 1000);
                return;
            }

            // Normal arrival at receiver
            packet.style.left = 'calc(100% - 140px)';
            
            setTimeout(() => {
                status.innerText = "Frame " + num + " Received. Sending ACK...";
                
                // Check for ACK Loss scenario (Step 2: ACK 2 Lost)
                if (this.state.step === 2) {
                    packet.classList.add('hidden');
                    ack.className = "";
                    ack.style.right = '90px';
                    ack.style.top = '120px';
                    ack.innerText = "ACK " + num;
                    ack.classList.remove('hidden');
                    
                    setTimeout(() => {
                        ack.style.right = '50%';
                        ack.style.opacity = '0';
                        setTimeout(() => {
                            ack.classList.add('hidden');
                            ack.style.opacity = '1';
                            status.innerHTML = "<span style='color:#fbc02d'>ACK " + num + " Lost! Timeout expected. Reselect Frame " + num + ".</span>";
                            this.state.isAnimating = false;
                            this.state.step = 3; // Move to retransmission step
                        }, 1000);
                    }, 100);
                    return;
                }

                // Normal ACK path
                packet.classList.add('hidden');
                ack.className = "";
                ack.style.right = '90px';
                ack.style.top = '120px';
                ack.innerText = "ACK " + num;
                ack.classList.remove('hidden');

                setTimeout(() => {
                    ack.style.right = 'calc(100% - 140px)';
                    setTimeout(() => {
                        ack.classList.add('hidden');
                        status.innerHTML = "<span style='color:#2e7d32'>ACK " + num + " Received!</span>";
                        
                        // Scenario Logic Progression
                        this.progressScenario();
                        this.state.isAnimating = false;
                    }, 1000);
                }, 100);
            }, 1000);
        }, 100);
    },

    progressScenario() {
        const status = document.getElementById('arqStatus');
        this.state.step++;
        
        // Map steps to expected frame numbers
        const stepToFrame = { 1:1, 2:2, 3:2, 4:3, 5:4, 6:4, 7:5 };
        this.state.nextExpectedFrame = stepToFrame[this.state.step] || null;

        if (this.state.step > 7) {
            status.innerText = "ALL FRAMES SENT!";
            document.getElementById('finalStep').classList.remove('hidden');
        } else {
            setTimeout(() => {
                status.innerText = "Select next frame (" + this.state.nextExpectedFrame + ") to continue...";
            }, 500);
        }
    },

    checkResult() {
        const input = document.getElementById('totalTransmissionsInput').value;
        const feedback = document.getElementById('finalFeedback');
        // Scenario: 1(ok), 2(lost ack), 2(ok), 3(ok), 4(lost frame), 4(ok), 5(ok)
        // Total should be 7
        if (parseInt(input) === 7) {
            feedback.innerText = "Correct! 7 transmissions occurred (5 original + 2 retransmissions).";
            feedback.style.color = "#2e7d32";
        } else {
            feedback.innerText = "Incorrect. Remember: Frame 2 and Frame 4 were sent twice.";
            feedback.style.color = "#d32f2f";
        }
    },

    loadQuiz() {
        const area = document.getElementById('quiz-questions-area');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question">
                <p><strong>${i+1}. ${item.q}</strong></p>
                ${item.a.map((opt, oi) => `
                    <label><input type="radio" name="arqQ${i}" value="${oi}"> ${opt}</label>
                `).join('')}
            </div>
        `).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const selected = document.querySelector(`input[name="arqQ${i}"]:checked`);
            if (selected && parseInt(selected.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.innerHTML = `You scored ${score}/10!`;
        res.className = "theory-content";
        res.style.padding = "10px";
        res.style.marginTop = "10px";
        res.style.background = score >= 7 ? "#e8f5e9" : "#ffebee";
    },

    getContent(part) { return this[part]; }
};