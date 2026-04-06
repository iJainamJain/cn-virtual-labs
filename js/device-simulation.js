/**
 * device-simulation.js - Final Polished Version v2.0
 * Features: Side-by-side layout, High-fidelity hardware icons, and custom modal.
 */

window.deviceExp = {
    title: "Experiment 8: Functioning of Network Devices",

    theory: `
        <div class="theory-content custom-scrollbar" style="max-height: 500px; overflow-y: auto; padding: 25px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top:0; color:#003366;">1. Introduction to Networking Hardware</h3>
            <p>Network devices are the building blocks of any infrastructure. They operate at different layers of the OSI model to ensure data reaches its destination securely and efficiently.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin:20px 0;">
                <div style="background:#f0f7ff; padding:20px; border-radius:12px; border-left:5px solid #003366;">
                    <h4 style="margin-top:0; color:#003366;">Collision Domain</h4>
                    <p style="font-size:0.95rem; margin:0;">A segment where packets can collide. <strong>Hubs</strong> represent a single collision domain, while <strong>Switches</strong> provide a dedicated domain for every port.</p>
                </div>
                <div style="background:#fff9e6; padding:20px; border-radius:12px; border-left:5px solid #ffcc00;">
                    <h4 style="margin-top:0; color:#003366;">Broadcast Domain</h4>
                    <p style="font-size:0.95rem; margin:0;">The extent to which a broadcast frame travels. <strong>Switches</strong> forward broadcasts; <strong>Routers</strong> terminate them.</p>
                </div>
            </div>

            <h3>2. Device Specifications</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Hub:</strong> Layer 1 device. Simple signal repeater. Non-intelligent broadcasting.</li>
                <li><strong>Switch:</strong> Layer 2 device. Learns MAC addresses to enable private, point-to-point communication.</li>
                <li><strong>Router:</strong> Layer 3 device. Connects different logical subnets using IP addresses.</li>
            </ul>
        </div>`,

    simulation: `
        <div class="simulator-wrapper" style="position: relative; display: flex; gap: 20px; min-height: 600px;">
            <!-- Custom Centered Modal System -->
            <div id="device-modal-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,26,51,0.6); z-index: 2000; display: flex; justify-content: center; align-items: center; border-radius: 15px; backdrop-filter: blur(4px);">
                <div style="background: white; padding: 35px; border-radius: 15px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); max-width: 450px; width: 90%; text-align: center; border-top: 6px solid #ffcc00;">
                    <div id="device-modal-icon" style="font-size: 50px; margin-bottom: 20px;">✅</div>
                    <h3 id="device-modal-title" style="margin: 0 0 12px 0; color: #003366; font-family: 'Poppins', sans-serif;">Success</h3>
                    <p id="device-modal-text" style="margin: 0 0 25px 0; color: #4a5568; line-height: 1.6; font-size: 1.05rem;"></p>
                    <button class="start-btn" style="margin:0; width:100%; height:45px;" onclick="deviceExp.closeModal()">Continue</button>
                </div>
            </div>

            <!-- Left Sidebar Controls (Stacked) -->
            <div style="width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px;">
                <!-- Device Select -->
                <div style="background:#f8fafc; padding:20px; border-radius:12px; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
                    <label style="font-weight:800; color:#003366; text-transform:uppercase; font-size:0.75rem; display:block; margin-bottom:10px;">Network Architecture</label>
                    <select id="deviceSelect" onchange="deviceExp.initSim()" style="width:100%; padding:12px; border-radius:8px; border: 2px solid #cbd5e1; background: white; font-weight: bold; color: #003366; cursor:pointer;">
                        <option value="hub">Layer 1: Hub (Broadcast)</option>
                        <option value="switch">Layer 2: Switch (Unicast)</option>
                        <option value="router">Layer 3: Router (Routing)</option>
                    </select>
                </div>

                <!-- Source Stack -->
                <div style="background:white; padding:20px; border-radius:12px; border: 1px solid #e2e8f0; flex-grow: 1; box-shadow: var(--shadow-sm);">
                    <label style="font-weight:bold; color:#003366; display:block; margin-bottom:15px; font-size:0.85rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px;">SOURCE INTERFACE</label>
                    <div id="srcRadios" style="display:flex; flex-direction:column; gap:10px;"></div>
                </div>

                <!-- Destination Stack -->
                <div style="background:white; padding:20px; border-radius:12px; border: 1px solid #e2e8f0; flex-grow: 1; box-shadow: var(--shadow-sm);">
                    <label style="font-weight:bold; color:#003366; display:block; margin-bottom:15px; font-size:0.85rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px;">DESTINATION TARGET</label>
                    <div id="destRadios" style="display:flex; flex-direction:column; gap:10px;"></div>
                </div>

                <!-- Action Buttons -->
                <div style="display:flex; gap:10px;">
                    <button class="start-btn" onclick="deviceExp.startSimulation()" style="margin:0; flex:2; background:#003366; height: 50px;">SIMULATE</button>
                    <button class="start-btn" onclick="deviceExp.initSim()" style="margin:0; flex:1; background:#64748b; height: 50px;">RESET</button>
                </div>
            </div>

            <!-- Right Workspace (Main Canvas) -->
            <div class="canvas-container" style="flex-grow: 1; background:#ffffff; border:3px solid #003366; border-radius:20px; position:relative; overflow:hidden; box-shadow: inset 0 0 30px rgba(0,51,102,0.05);">
                <div id="deviceTitle" style="position:absolute; top:25px; width:100%; text-align:center; font-size:1.4rem; font-weight:900; color:#003366; text-transform:uppercase; letter-spacing:2px; pointer-events:none; opacity: 0.8;"></div>
                <canvas id="deviceCanvas" width="850" height="600" style="width:100%; height:100%; display:block;"></canvas>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container custom-scrollbar" style="max-height: 500px; overflow-y: auto; padding:25px;">
            <h3 style="color:#003366; font-weight:800;">Hardware & Protocols Assessment</h3>
            <div id="device-quiz-area"></div>
            <button class="gen-btn" style="margin-top:25px; width:100%; height:50px;" onclick="deviceExp.gradeQuiz()">Submit Final Assessment</button>
            <div id="quiz-result" style="display:none; margin-top:20px; padding:20px; border-radius:12px; text-align:center;"></div>
        </div>`,

    quizQuestions: [
        { q: "Which device is essentially a multi-port repeater?", a: ["Router", "Bridge", "Hub"], c: 2 },
        { q: "A Switch maintains a table mapping ports to which addresses?", a: ["IP Addresses", "MAC Addresses", "Subnet Masks"], c: 1 },
        { q: "Routers are responsible for connecting which types of networks?", a: ["Only identical protocols", "Dissimilar networks", "Single LAN segments"], c: 1 },
        { q: "In a Hub-based network, what happens to traffic security?", a: ["Highly secure/private", "No security (all see data)", "Encrypted automatically"], c: 1 },
        { q: "Which device helps reduce network congestion by segmenting collision domains?", a: ["Active Hub", "Switch", "Repeater"], c: 1 },
        { q: "Which device operates at the Network Layer (Layer 3)?", a: ["Switch", "Router", "Modem"], c: 1 },
        { q: "A 12-port Hub contains how many collision domains?", a: ["12", "1", "0"], c: 1 },
        { q: "Full-duplex communication is a standard feature of which device?", a: ["Hub", "Modem (half only)", "Switch"], c: 2 },
        { q: "Which connector type is standard for Ethernet NICs?", a: ["RJ11", "RJ45", "BNC"], c: 1 },
        { q: "A 'Broadcast Storm' is usually mitigated at the boundary of a:", a: ["Hub", "Switch", "Router"], c: 2 }
    ],

    pcList: [
        {id: 0, mac: "00:00:00:A1:2B:CC", x: 180, y: 150},
        {id: 1, mac: "00:00:00:A2:2B:CB", x: 425, y: 100},
        {id: 2, mac: "00:00:00:A3:2B:CD", x: 670, y: 150},
        {id: 3, mac: "00:00:00:A4:2B:CF", x: 180, y: 450},
        {id: 4, mac: "00:00:00:A5:2B:CG", x: 425, y: 500},
        {id: 5, mac: "00:00:00:A6:2B:CM", x: 670, y: 450}
    ],

    isAnimating: false,

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') setTimeout(() => this.initSim(), 100);
        if (part === 'quiz') this.loadQuiz();
    },

    showMsg(title, text, icon = "✅") {
        document.getElementById('device-modal-title').innerText = title;
        document.getElementById('device-modal-text').innerText = text;
        document.getElementById('device-modal-icon').innerText = icon;
        document.getElementById('device-modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('device-modal-overlay').classList.add('hidden');
        this.drawBase();
    },

    initSim() {
        this.isAnimating = false;
        const type = document.getElementById('deviceSelect').value;
        document.getElementById('deviceTitle').innerText = type.toUpperCase() + " OPERATION";
        
        const srcArea = document.getElementById('srcRadios');
        const destArea = document.getElementById('destRadios');
        
        const radioStyle = `style="display:flex; align-items:center; gap:12px; font-family:monospace; font-size:0.85rem; padding:8px; border-radius:6px; cursor:pointer; background: #f8fafc; border: 1px solid #e2e8f0;"`;
        
        srcArea.innerHTML = this.pcList.map(pc => `<label ${radioStyle}><input type="radio" name="srcMAC" value="${pc.id}"> ${pc.mac}</label>`).join('');
        destArea.innerHTML = this.pcList.map(pc => `<label ${radioStyle}><input type="radio" name="destMAC" value="${pc.id}"> ${pc.mac}</label>`).join('');
        
        this.drawBase();
    },

    drawBase() {
        const canvas = document.getElementById('deviceCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        // 1. Draw Connecting Lines (Bottom Layer)
        ctx.beginPath();
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 4;
        this.pcList.forEach(pc => {
            ctx.moveTo(pc.x, pc.y);
            ctx.lineTo(midX, midY);
        });
        ctx.stroke();

        // 2. Draw PCs
        this.pcList.forEach(pc => this.drawPC(ctx, pc.x, pc.y, pc.mac));

        // 3. Draw Central Device (Top Layer)
        const mode = document.getElementById('deviceSelect').value;
        this.drawDeviceNode(ctx, midX, midY, mode);
    },

    drawPC(ctx, x, y, mac) {
        // High Fidelity PC Vector
        // Monitor Bezel
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.roundRect(x - 30, y - 45, 60, 42, 5);
        ctx.fill();
        
        // Screen
        ctx.fillStyle = "#0ea5e9";
        ctx.fillRect(x - 26, y - 41, 52, 34);
        
        // Reflection on screen
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(x - 26, y - 41);
        ctx.lineTo(x + 10, y - 41);
        ctx.lineTo(x - 26, y - 10);
        ctx.fill();

        // Stand
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(x - 5, y - 3, 10, 8);
        ctx.fillRect(x - 18, y + 5, 36, 4);

        // MAC Label
        ctx.fillStyle = "#003366";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(mac.slice(-5), x, y + 22);
    },

    drawDeviceNode(ctx, x, y, type) {
        // High Fidelity Rack Device
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        
        // Main Chassis
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.roundRect(x - 70, y - 40, 140, 80, 5);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Front Panel
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 65, y - 35, 130, 70);

        // LED Indicators
        for(let i=0; i<8; i++){
            ctx.fillStyle = Math.random() > 0.3 ? "#22c55e" : "#1e293b";
            ctx.beginPath();
            ctx.arc(x - 55 + (i*15), y + 20, 2.5, 0, Math.PI*2);
            ctx.fill();
        }

        // Branding Label
        ctx.fillStyle = "#ffcc00";
        ctx.font = "bold 18px Poppins";
        ctx.textAlign = "center";
        ctx.fillText(type.toUpperCase(), x, y - 5);
        
        ctx.fillStyle = "#94a3b8";
        ctx.font = "7px Arial";
        ctx.fillText("ENTERPRISE EDITION", x, y + 5);
    },

    startSimulation() {
        if (this.isAnimating) return;
        const srcId = document.querySelector('input[name="srcMAC"]:checked')?.value;
        const destId = document.querySelector('input[name="destMAC"]:checked')?.value;
        
        if (srcId === undefined || destId === undefined) {
            this.showMsg("Input Missing", "Please select both Source and Destination addresses.", "⚠️");
            return;
        }
        if (srcId === destId) {
            this.showMsg("Collision Risk", "Source and Destination interfaces must be different to establish a link.", "❌");
            return;
        }

        this.isAnimating = true;
        this.runAnimation(parseInt(srcId), parseInt(destId));
    },

    async runAnimation(srcId, destId) {
        const canvas = document.getElementById('deviceCanvas');
        const ctx = canvas.getContext('2d');
        const mode = document.getElementById('deviceSelect').value;
        const src = this.pcList[srcId];
        const dest = this.pcList[destId];
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        // Packet Upload
        await this.animatePacket(ctx, src.x, src.y, midX, midY, "#0ea5e9", "FRAME");

        // Logic Wait
        const statusMsg = mode === 'hub' ? "FLOODING ALL PORTS..." : "LOOKING UP ADDRESS TABLE...";
        ctx.fillStyle = "#ffcc00";
        ctx.font = "bold 14px Arial";
        ctx.fillText(statusMsg, midX, midY - 60);
        await new Promise(r => setTimeout(r, 1200));

        // Forwarding
        if (mode === 'hub') {
            const others = this.pcList.filter(pc => pc.id !== srcId);
            const promises = others.map(pc => 
                this.animatePacket(ctx, midX, midY, pc.x, pc.y, pc.id === destId ? "#22c55e" : "#ef4444", pc.id === destId ? "ACCEPT" : "DROP")
            );
            await Promise.all(promises);
            this.showMsg("Hub Broadcast", "The Hub forwarded the signal to all connected ports. Every node received the frame, but only the destination accepted it.", "📡");
        } else {
            await this.animatePacket(ctx, midX, midY, dest.x, dest.y, "#22c55e", "MATCHED");
            this.showMsg("Intelligent Forwarding", `The ${mode.toUpperCase()} identified the target port and performed a secure unicast transmission.`, "✅");
        }

        this.isAnimating = false;
    },

    animatePacket(ctx, x1, y1, x2, y2, color, label) {
        return new Promise(resolve => {
            let progress = 0;
            const step = () => {
                progress += 0.025;
                if (progress > 1) {
                    resolve();
                    return;
                }
                this.drawBase(); 
                const cx = x1 + (x2 - x1) * progress;
                const cy = y1 + (y2 - y1) * progress;
                
                // Packet Visual (Envelope)
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(cx - 15, cy - 10, 30, 20, 3);
                ctx.fill();
                
                // Envelope Lines
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx - 15, cy - 10); ctx.lineTo(cx, cy); ctx.lineTo(cx + 15, cy - 10);
                ctx.stroke();

                // Small Label
                ctx.fillStyle = "#1e293b";
                ctx.font = "bold 9px Arial";
                ctx.fillText(label, cx, cy - 15);

                requestAnimationFrame(step);
            };
            step();
        });
    },

    loadQuiz() {
        const area = document.getElementById('device-quiz-area');
        area.innerHTML = this.quizQuestions.map((q, i) => `
            <div style="background:#f8fafc; padding:18px; border-radius:12px; margin-bottom:15px; border:1px solid #e2e8f0;">
                <p style="margin-top:0; font-weight:700; color:#003366;">${i+1}. ${q.q}</p>
                ${q.a.map((opt, oi) => `<label style="display:block; margin:10px 0; cursor:pointer; font-size:0.95rem;"><input type="radio" name="dq${i}" value="${oi}" style="margin-right:12px;"> ${opt}</label>`).join('')}
            </div>`).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((q, i) => {
            const sel = document.querySelector(`input[name="dq${i}"]:checked`);
            if (sel && parseInt(sel.value) === q.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.style.display = "block";
        res.innerHTML = `<h3>Assessment Result: ${score}/10</h3><p>${score >= 7 ? 'Excellent! You have mastered network hardware functioning.' : 'Review the theory and try again to improve your score.'}</p>`;
        res.style.background = score >= 7 ? "#dcfce7" : "#fee2e2";
        res.style.color = score >= 7 ? "#166534" : "#991b1b";
    }
};