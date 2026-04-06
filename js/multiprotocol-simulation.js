/**
 * multiprotocol-simulation.js - The "Godbole Masterpiece" (v7.2 - Panoramic Update)
 * High-fidelity simulation of TCP/IP across heterogeneous networks.
 * Features: Frame-accurate pathing, Circular Token Ring motion, and X-Ray Modals.
 */

window.multiprotocolExp = {
    title: "Experiment 6: Multi-Protocol Internetworking & Heterogeneous Routing",

    theory: `
    <div class="theory-content">
        <h3>1. Internetworking Concept</h3>
        <p>Internetworking connects physical networks with different protocols (Ethernet, X.25, Token Ring) into a unified system. <strong>TCP/IP</strong> carries a constant message (datagram) inside changing link-layer "vehicles" (frames).</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 5px solid var(--primary); margin: 20px 0;">
            <h4>Heterogeneous Networks (Fig 17.7)</h4>
            <ul>
                <li><strong>Net 1 (Ethernet LAN):</strong> A bus-based LAN.</li>
                <li><strong>Net 2 (X.25 WAN):</strong> A packet-switched cloud.</li>
                <li><strong>Net 3 (Token Ring LAN):</strong> A circular LAN.</li>
            </ul>
        </div>
        <p><strong>The Core Rule:</strong> IP addresses are End-to-End (Source to Final Dest), while MAC/Physical addresses are Hop-by-Hop (Router to Router).</p>
    </div>`,

    simulation: `
    <div class="simulator-wrapper" style="user-select: none; position: relative;">
        <!-- Step-by-Step Protocol Inspector (Modal) -->
        <div id="step-modal" class="hidden" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background: white; border: 4px solid var(--primary); border-radius: 16px; z-index: 1000; box-shadow: 0 25px 60px rgba(0,0,0,0.5); padding: 25px; animation: fadeIn 0.3s ease;">
            <div style="background: var(--primary); color: white; margin: -25px -25px 20px -25px; padding: 15px; border-radius: 12px 12px 0 0; font-weight: bold; text-align: center; letter-spacing: 1px;">PROTOCOL STACK INSPECTOR</div>
            <div id="modal-content" style="font-size: 0.95rem; color: #333; line-height: 1.6;">
                <!-- Explained logic injected here -->
            </div>
            <div style="margin-top: 15px; font-weight: bold; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Current Encapsulation:</div>
            <div id="modal-stack" style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px; align-items: center;">
                <!-- Stack Layers -->
            </div>
            <button id="next-step-btn" class="start-btn" style="width: 100%; margin-top: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">Next Step →</button>
        </div>

        <!-- High-Resolution Topology Canvas with Scrolling Wrapper -->
        <div style="width: 100%; overflow-x: auto; background: #fff; border: 2px solid var(--primary); border-radius: 16px; box-shadow: inset 0 0 30px rgba(0,0,0,0.05);">
            <div id="canvas-container" style="position: relative; width: 1800px; height: 550px; overflow: hidden;">
                <canvas id="topo6Canvas" width="1800" height="550" style="width: 1800px; height: 550px; display: block;"></canvas>
                <!-- The Gold Datagram -->
                <div id="packet6" class="hidden" style="position:absolute; width:18px; height:18px; background:#ffd700; border: 2px solid #b8860b; border-radius:50%; box-shadow: 0 0 20px #ffd700; z-index:200;"></div>
            </div>
        </div>

        <!-- Dashboard Controls -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 2px solid var(--border); margin-top: 20px;">
            <div style="display: flex; gap: 20px; align-items: center;">
                <label style="font-weight:bold; color: var(--primary);">Select Destination Node:</label>
                <select id="targetSelect" style="padding: 10px; border-radius: 8px; border: 2px solid #cbd5e0; width: 220px; font-weight: 600;">
                    <option value="B">Computer B (Local Net 1)</option>
                    <option value="C">Computer C (Internal Net 2)</option>
                    <option value="D">Computer D (Internal Net 2)</option>
                    <option value="E">Computer E (Net 3 Ring)</option>
                    <option value="F">Computer F (Net 3 Ring)</option>
                    <option value="G" selected>Computer G (Net 3 Ring)</option>
                </select>
                <button id="sendBtn" class="start-btn" onclick="multiprotocolExp.initiateTransfer()" style="padding: 12px 30px;">INITIATE DATA TRANSFER</button>
            </div>
            <button class="action-btn-red" style="padding: 10px 25px;" onclick="multiprotocolExp.resetSim()">RESET LABORATORY</button>
        </div>
    </div>`,

    quiz: `
    <div class="quiz-container">
        <h3 style="color: var(--primary);">Assessment: Heterogeneous Routing</h3>
        <div id="quiz-area-6" style="max-height: 480px; overflow-y: auto; padding-right: 15px;"></div>
        <button class="gen-btn" style="margin-top: 25px; width: 100%;" onclick="multiprotocolExp.gradeQuiz()">Submit Assessment</button>
        <div id="quiz-result-6" style="margin-top:20px; display:none; padding:20px; border-radius:12px; text-align:center; font-weight:bold;"></div>
    </div>`,

    quizQuestions: [
        { q: "Which address remains constant from source (A) to destination (G)?", a: ["MAC Address", "IP Address", "Socket Number"], c: 1 },
        { q: "What happens to the Ethernet header when the packet leaves Net 1?", a: ["It is compressed", "It is stripped by Router R1", "It is encrypted"], c: 1 },
        { q: "Net 2 (X.25 WAN) handles data using what logic primarily?", a: ["Ethernet Switching", "Virtual Circuits", "CSMA/CD"], c: 1 },
        { q: "What is the physical topology of Net 3?", a: ["Bus", "Star", "Ring"], c: 2 },
        { q: "At Router R2, the X.25 header is replaced by which frame?", a: ["Token Ring", "Ethernet II", "Wi-Fi 802.11"], c: 0 },
        { q: "Why can Node A communicate with Node G despite different physical layers?", a: ["They use the same cables", "IP protocol acts as a common language", "Routers don't read headers"], c: 1 },
        { q: "A 48-bit address used in Ethernet is called:", a: ["IP Address", "MAC Address", "Subnet Mask"], c: 1 },
        { q: "In the simulation, the Gold Dot represents what?", a: ["The Physical Signal", "The IP Datagram", "The TCP Acknowledgement"], c: 1 },
        { q: "Which layer is responsible for end-to-end reliability?", a: ["Network Layer", "Transport Layer (TCP)", "Data Link Layer"], c: 1 },
        { q: "True or False: Routers R1 and R2 bridge heterogeneous networks.", a: ["True", "False"], c: 0 }
    ],

    // --- Panoramic Layout Coordinates (1800px span) ---
    nodes: {
        A: { x: 200, y: 100, label: "A", ip: "192.168.1.10" },
        B: { x: 200, y: 300, label: "B", ip: "192.168.1.20" },
        R1: { x: 520, y: 275, label: "R1", isRouter: true },
        C: { x: 930, y: 150, label: "C", ip: "172.16.0.10" },
        D: { x: 930, y: 400, label: "D", ip: "172.16.0.20" },
        R2: { x: 1340, y: 275, label: "R2", isRouter: true },
        E: { x: 1540, y: 415, label: "E", ip: "10.0.0.5" }, // Bottom of ring
        F: { x: 1680, y: 275, label: "F", ip: "10.0.0.6" }, // Right edge of ring
        G: { x: 1540, y: 135, label: "G", ip: "10.0.0.7" }  // Top of ring
    },

    ringCenter: { x: 1540, y: 275, radius: 140 },

    onTabLoad(part) {
        if (part === 'simulation') setTimeout(() => this.resetSim(), 100);
        if (part === 'quiz') this.loadQuiz();
    },

    initSim() {
        const canvas = document.getElementById('topo6Canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        this.drawTopology(ctx);
    },

    drawTopology(ctx) {
        ctx.clearRect(0, 0, 1800, 550);
        
        // 1. Draw Network Boundaries (Expanded for 1800px)
        const drawZone = (x, y, w, h, label, color) => {
            ctx.setLineDash([8, 4]); ctx.strokeStyle = "#cbd5e0"; ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h); ctx.setLineDash([]);
            ctx.fillStyle = color; ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
            ctx.fillText(label, x + w/2, y - 15);
        };
        drawZone(80, 50, 360, 460, "NET 1 (ETHERNET BUS)", "var(--primary)");
        drawZone(1370, 50, 380, 460, "NET 3 (TOKEN RING)", "#2e7d32");

        // 2. Cables (Guidelines)
        ctx.strokeStyle = "#4a5568"; ctx.lineWidth = 3;
        // Ethernet backbone
        ctx.beginPath(); ctx.moveTo(375, 60); ctx.lineTo(375, 490); ctx.stroke();
        // Node drops
        ctx.beginPath(); ctx.moveTo(230, 100); ctx.lineTo(375, 100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(230, 300); ctx.lineTo(375, 300); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(375, 275); ctx.lineTo(495, 275); ctx.stroke();
        // WAN entry points
        ctx.beginPath(); ctx.moveTo(545, 275); ctx.lineTo(680, 275); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1180, 275); ctx.lineTo(1315, 275); ctx.stroke();
        // Ring connection
        ctx.beginPath(); ctx.moveTo(1365, 275); ctx.lineTo(1400, 275); ctx.stroke();
        // Token Ring Arc
        ctx.beginPath(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#2e7d32";
        ctx.arc(this.ringCenter.x, this.ringCenter.y, this.ringCenter.radius, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        // WAN Cloud
        ctx.beginPath(); ctx.strokeStyle = "#a0aec0"; ctx.fillStyle = "#f7fafc";
        ctx.ellipse(930, 275, 300, 180, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fill();
        ctx.fillStyle = "#718096"; ctx.font = "bold 13px Arial"; ctx.fillText("NET 2 (X.25 WAN CLOUD)", 930, 85);

        // C and D cables
        ctx.strokeStyle = "#cbd5e0"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(930, 158); ctx.lineTo(930, 275); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(930, 380); ctx.lineTo(930, 275); ctx.stroke();

        // 3. Draw Computer Nodes & Routers
        Object.values(this.nodes).forEach(node => {
            if (node.isRouter) this.drawRouter(ctx, node.x, node.y, node.label);
            else this.drawComputer(ctx, node.x, node.y, node.label, node.ip);
        });
    },

    drawComputer(ctx, x, y, label, ip) {
        ctx.fillStyle = "#cbd5e0"; ctx.fillRect(x - 28, y - 20, 15, 35);
        ctx.strokeStyle = "#4a5568"; ctx.lineWidth = 1; ctx.strokeRect(x - 28, y - 20, 15, 35);
        ctx.fillStyle = "#e2e8f0"; ctx.fillRect(x - 10, y - 20, 35, 28);
        ctx.strokeRect(x - 10, y - 20, 35, 28);
        ctx.fillStyle = "#1a202c"; ctx.fillRect(x - 7, y - 17, 29, 22);
        ctx.fillStyle = "#4a5568"; ctx.fillRect(x + 5, y + 8, 5, 5);
        ctx.fillRect(x - 2, y + 13, 20, 3);
        ctx.fillStyle = "var(--primary)"; ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
        ctx.fillText(label, x - 5, y - 30);
        ctx.fillStyle = "#718096"; ctx.font = "10px Arial"; ctx.fillText(ip || "", x - 5, y + 35);
    },

    drawRouter(ctx, x, y, label) {
        ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fillStyle = "#d32f2f"; ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "white"; ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
        ctx.fillText(label, x, y + 5);
    },

    currentStepIndex: 0,
    steps: [],

    initiateTransfer() {
        const target = document.getElementById('targetSelect').value;
        const destNode = this.nodes[target];
        document.getElementById('sendBtn').disabled = true;
        this.resetSim(false);

        // Map out the scaled coordinates
        this.steps = [
            {
                pos: [200, 100],
                title: "Application Layer: Node A",
                msg: `Node A is sending an email to ${target} (${destNode.ip}). The <strong>IP Layer</strong> creates a datagram with: <br>Src IP: ${this.nodes.A.ip}<br>Dest IP: ${destNode.ip}`,
                stack: ["IP Header", "TCP Header", "Email Data"]
            },
            {
                pos: [375, 100],
                title: "Ethernet Encapsulation",
                msg: "The datagram enters the NIC. It is wrapped in an <strong>Ethernet II Frame</strong> with Router R1's MAC as the destination.",
                stack: ["Ethernet Header", "IP Header", "TCP Header", "Email Data"]
            },
            {
                pos: [375, 275],
                title: "Bus Transit (Net 1)",
                msg: "The electrical signal travels the Ethernet bus. Node B ignores it because the MAC doesn't match. Router R1 accepts it.",
                stack: ["Ethernet Header", "IP Header", "TCP Header", "Email Data"]
            },
            {
                pos: [520, 275],
                title: "Router R1 Processing",
                msg: "R1 strips the Ethernet frame. It extracts the Dest IP and checks its Routing Table. To reach " + destNode.ip + ", it must use the X.25 WAN.",
                stack: ["X.25 Header", "IP Header", "TCP Header", "Email Data"]
            }
        ];

        // Specific destination logic
        if (target === 'B') {
            this.steps.splice(2, 2, 
                { pos: [375, 300], title: "Intra-LAN Delivery", msg: "Router R1 realizes Destination B is local to Net 1 and forwards the frame directly.", stack: ["Ethernet Header", "IP Header", "TCP Header", "Email Data"] },
                { pos: [200, 300], title: "Received at B", msg: "Computer B removes all headers and processes the email.", stack: ["Email Data"] }
            );
        } else if (target === 'C' || target === 'D') {
            this.steps.push({ pos: [930, 275], title: "X.25 Cloud Transit", msg: "The packet moves through the X.25 cloud using a Virtual Circuit.", stack: ["X.25 Header", "IP Header", "TCP Header", "Email Data"] });
            this.steps.push({ pos: [destNode.x, destNode.y], title: "Net 2 Final Delivery", msg: "Node " + target + " identifies the packet and decapsulates the message.", stack: ["Email Data"] });
        } else {
            // Net 3 Logic (Extended Path)
            this.steps.push({ pos: [930, 275], title: "WAN Transit (R1 -> R2)", msg: "The packet traverses the X.25(WAN) cloud. As the destination is not here, it moves ahead and goes towards Router R2.", stack: ["X.25 Header", "IP Header", "TCP Header", "Email Data"] });
            this.steps.push({ pos: [1340, 275], title: "Router R2 Processing", msg: "R2 strips X.25. Destination is local to Net 3. It wraps the datagram in a <strong>Token Ring Frame</strong>.", stack: ["Token Ring Header", "IP Header", "TCP Header", "Email Data"] });
            this.steps.push({ pos: [1400, 275], title: "Ring Entry", msg: "Entering the circular Token Ring structure.", stack: ["Token Ring Header", "IP Header", "TCP Header", "Email Data"] });
            
            // Circular rotation for Net 3
            const targetAngle = Math.atan2(destNode.y - this.ringCenter.y, destNode.x - this.ringCenter.x);
            this.steps.push({ 
                isRing: true, 
                targetAngle: targetAngle, 
                title: "Token Ring Rotation", 
                msg: "The frame circulates Net 3. Each node reads the destination MAC. Node " + target + " will copy the data.",
                stack: ["Token Ring Header", "IP Header", "TCP Header", "Email Data"] 
            });
            this.steps.push({ pos: [destNode.x, destNode.y], title: "Final Goal: Node " + target, msg: "Transmission Successful. The heterogeneous journey is complete.", stack: ["Email Data"] });
        }

        this.currentStepIndex = 0;
        this.runStep();
    },

    runStep() {
        const step = this.steps[this.currentStepIndex];
        const packet = document.getElementById('packet6');
        const modal = document.getElementById('step-modal');
        const btn = document.getElementById('next-step-btn');
        
        packet.classList.remove('hidden');
        // Temporarily disable CSS transition for manual animation
        packet.style.transition = step.isRing ? "none" : "all 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95)";

        if (step.isRing) {
            this.animateRingPath(step.targetAngle);
        } else {
            packet.style.left = (step.pos[0] - 9) + "px";
            packet.style.top = (step.pos[1] - 9) + "px";
        }

        // Delay modal display until packet "arrives"
        setTimeout(() => {
            modal.classList.remove('hidden');
            document.getElementById('modal-content').innerHTML = `<strong>${step.title}</strong><p style="margin-top:10px;">${step.msg}</p>`;
            
            const stackUI = document.getElementById('modal-stack');
            stackUI.innerHTML = step.stack.map((layer, i) => {
                const colors = ["#3182ce", "#e53e3e", "#38a169", "#d69e2e"];
                return `<div style="width:${100 - (i*8)}%; height:30px; border:2px solid ${colors[i%4]}; color:${colors[i%4]}; font-weight:bold; font-size:11px; display:flex; align-items:center; justify-content:center; background:${colors[i%4]}11; border-radius:4px; animation: fadeIn 0.4s ease;">${layer}</div>`;
            }).join('');

            // Update button text if it's the last step
            btn.innerHTML = (this.currentStepIndex === this.steps.length - 1) ? "Finish" : "Next Step &rarr;";

            btn.onclick = () => {
                modal.classList.add('hidden');
                this.currentStepIndex++;
                if (this.currentStepIndex < this.steps.length) {
                    this.runStep();
                } else {
                    document.getElementById('sendBtn').disabled = false;
                }
            };
        }, 850);
    },

    animateRingPath(endAngle) {
        const packet = document.getElementById('packet6');
        let currentAngle = Math.PI; // 180 degrees (Entry from R2 at x=1400)
        
        // Force the rotation to flow smoothly in a clockwise direction
        if (endAngle < currentAngle) endAngle += Math.PI * 2; 

        const totalFrames = 40;
        let frame = 0;
        
        const move = () => {
            frame++;
            const t = frame / totalFrames;
            const angle = currentAngle + (endAngle - currentAngle) * t;
            const x = this.ringCenter.x + this.ringCenter.radius * Math.cos(angle);
            const y = this.ringCenter.y + this.ringCenter.radius * Math.sin(angle);
            packet.style.left = (x - 9) + "px";
            packet.style.top = (y - 9) + "px";
            if (frame < totalFrames) requestAnimationFrame(move);
        };
        move();
    },

    resetSim(clearModal = true) {
        if (clearModal) document.getElementById('step-modal').classList.add('hidden');
        document.getElementById('packet6').classList.add('hidden');
        document.getElementById('sendBtn').disabled = false;
        this.initSim();
    },

    loadQuiz() {
        const area = document.getElementById('quiz-area-6');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question" style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:15px; border: 1px solid #e2e8f0;">
                <p><strong>${i+1}. ${item.q}</strong></p>
                ${item.a.map((opt, oi) => `<label style="display:block; cursor:pointer; padding:5px;"><input type="radio" name="q6ans_${i}" value="${oi}"> ${opt}</label>`).join('')}
            </div>`).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const sel = document.querySelector(`input[name="q6ans_${i}"]:checked`);
            if (sel && parseInt(sel.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result-6');
        res.style.display = "block";
        res.innerHTML = `You scored ${score}/10! ${score >= 7 ? "Master of Networking!" : "Keep studying Fig 17.7."}`;
        res.style.background = score >= 7 ? "#d4edda" : "#f8d7da";
        res.style.color = score >= 7 ? "#155724" : "#721c24";
    },

    getContent(part) { return this[part]; }
};