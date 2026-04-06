/**
 * topology-simulation.js - High Fidelity Interactive Builder
 * Uses Native Canvas Vector Drawing for 100% reliability.
 */

window.topologyExp = {
    title: "Experiment 4: Network Topologies",

    theory: `
        <div class="theory-content">
            <h3>1. Introduction</h3>
            <p>A network topology is a substantial arrangement of a network in which all the nodes are connected with each other using network links or connecting lines. Apart from just describing how the nodes are interconnected, network topology also explains how the data is transferred in a network.</p>

            <h3>2. Logical and Physical Network Topologies</h3>
            <p><strong>Logical Topology:</strong> Describes how signals act on a network and how data is transmitted from one node to another at a high level.</p>
            <p><strong>Physical Topology:</strong> Describes how nodes are physically connected using wires, wireless connectivity, and networking components.</p>

            <h3>3. Star Topology</h3>
            <p>In a star topology, each device has a dedicated point-to-point link only to a central controller, usually called a hub/switch. All data flows through the central node. Failure of one node will not affect the entire network, but if the central hub fails, the whole network goes down.</p>

            <h3>4. Bus Topology</h3>
            <p>Nodes are interconnected using a single backbone cable. Unidirectional data flow. Cost-effective for small setups, but if the backbone cable fails, the entire network fails.</p>

            <h3>5. Ring Topology</h3>
            <p>Devices are connected in a closed path. Data packets are transmitted in a circular manner. One malfunctioning node can collapse the whole network.</p>

            <h3>6. Mesh Topology</h3>
            <p>Every node has a point-to-point connection to every other node. Highly robust and secure. Routing and Flooding are the primary data transmission techniques.</p>
        </div>`,

    simulation: `
        <div class="simulator-wrapper">
            <div style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 10px;">
                <h3>Interactive Topology Builder</h3>
                <div style="background: #eef2f7; padding: 8px 15px; border-radius: 6px; border: 1px solid #ccd6e0;">
                    <label><strong>Goal:</strong></label>
                    <select id="topoTargetSelect" onchange="topologyExp.resetSimulation()" style="padding:5px; border-radius:4px; border: 1px solid #999;">
                        <option value="star">Star Topology</option>
                        <option value="bus">Bus Topology</option>
                        <option value="ring">Ring Topology</option>
                        <option value="mesh">Mesh Topology</option>
                    </select>
                </div>
            </div>
            
            <div class="canvas-container" style="background:#fff; border:2px solid #003366; position:relative; cursor: crosshair; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px 8px 0 0;">
                <canvas id="topologyCanvas" width="750" height="400" onclick="topologyExp.handleCanvasClick(event)"></canvas>
                <div id="builderStatus" style="position:absolute; top:15px; left:15px; padding:8px 15px; background:rgba(255,255,255,0.95); border:1px solid #003366; font-weight:bold; border-radius:6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #003366;">Status: Workspace Reset</div>
            </div>

            <!-- Professional Toolset Toolbar -->
            <div class="toolbar-container" style="display:flex; justify-content: center; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border: 2px solid #003366; border-top: none; border-radius: 0 0 8px 8px;">
                
                <div class="tool-group" style="display:flex; gap:10px; border-right: 2px solid #ddd; padding-right: 15px;">
                    <button class="tool-card" id="tool-pc" onclick="topologyExp.selectTool('pc')">
                        <div class="icon-preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>
                        <span>PC</span>
                    </button>
                    <button class="tool-card" id="tool-laptop" onclick="topologyExp.selectTool('laptop')">
                        <div class="icon-preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="12" rx="2"/><path d="M2 20h20M5 20v-4h14v4"/></svg></div>
                        <span>Laptop</span>
                    </button>
                    <button class="tool-card" id="tool-hub" onclick="topologyExp.selectTool('hub')">
                        <div class="icon-preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></svg></div>
                        <span>Switch</span>
                    </button>
                </div>

                <div class="tool-group" style="display:flex; gap:10px; border-right: 2px solid #ddd; padding-right: 15px;">
                    <button class="tool-card" id="tool-straight" onclick="topologyExp.selectTool('straight')">
                        <div class="icon-preview"><div style="width:30px; height:3px; background:#333;"></div></div>
                        <span>Straight</span>
                    </button>
                    <button class="tool-card" id="tool-cross" onclick="topologyExp.selectTool('cross')">
                        <div class="icon-preview"><div style="width:30px; height:3px; border-top:3px dashed #d32f2f;"></div></div>
                        <span>Cross</span>
                    </button>
                </div>

                <div class="tool-group" style="display:flex; gap:10px;">
                    <button class="action-btn-red" onclick="topologyExp.resetSimulation()">RESET</button>
                    <button class="action-btn-blue" onclick="topologyExp.checkTopology()">CHECK</button>
                </div>
            </div>
            
            <style>
                .tool-card { 
                    width: 70px; height: 80px; background: #fff; border: 1px solid #ccc; border-radius: 8px;
                    cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    transition: 0.2s; padding: 5px;
                }
                .tool-card:hover { border-color: #003366; background: #f0f7ff; }
                .tool-card.active { border-color: #003366; background: #003366; color: white; }
                .icon-preview { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
                .tool-card span { font-size: 10px; font-weight: bold; }
                .action-btn-red { background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 50px; font-weight: bold; cursor: pointer; }
                .action-btn-blue { background: #003366; color: white; border: none; padding: 10px 20px; border-radius: 50px; font-weight: bold; cursor: pointer; }
                .action-btn-red:hover, .action-btn-blue:hover { opacity: 0.8; transform: translateY(-2px); }
            </style>
        </div>`,

    quiz: `
        <div class="quiz-container">
            <h3>Assessment Quiz</h3>
            <div id="quiz-questions-area" style="max-height:400px; overflow-y:auto; padding-right:10px;"></div>
            <button class="gen-btn" style="margin-top:20px;" onclick="topologyExp.gradeQuiz()">Submit Quiz</button>
            <div id="quiz-result"></div>
        </div>`,

    quizQuestions: [
        { q: "Which topology is dependent on a central Hub/Switch?", a: ["Bus", "Ring", "Star"], c: 2 },
        { q: "What is the number of links in a full Mesh with 4 nodes?", a: ["4", "6", "8"], c: 1 },
        { q: "A single backbone cable is used in which topology?", a: ["Star", "Bus", "Mesh"], c: 1 },
        { q: "Which cable connects two similar devices?", a: ["Straight", "Crossover", "Fiber"], c: 1 },
        { q: "A 'drop line' is a term associated with which topology?", a: ["Mesh", "Star", "Bus"], c: 2 },
        { q: "In a Ring topology, data travels in:", a: ["One direction", "Both directions", "Randomly"], c: 0 },
        { q: "Which topology provides the highest security and robustness?", a: ["Bus", "Mesh", "Star"], c: 1 },
        { q: "If the central Hub fails in a Star topology:", a: ["One node fails", "The network is fine", "The whole network fails"], c: 2 },
        { q: "Which topology integration creates a Hybrid topology?", a: ["One type", "Two or more types", "Wireless only"], c: 1 },
        { q: "What is the link formula for Mesh?", a: ["n+1", "n(n-1)/2", "2n"], c: 1 }
    ],

    nodes: [],
    links: [],
    activeTool: null,
    linkStartNode: null,

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') this.redraw();
        if (part === 'quiz') this.loadQuiz();
    },

    selectTool(tool) {
        this.activeTool = tool;
        this.linkStartNode = null;
        document.querySelectorAll('.tool-card').forEach(b => b.classList.remove('active'));
        document.getElementById('tool-' + tool).classList.add('active');
        document.getElementById('builderStatus').innerText = "Status: " + tool.toUpperCase() + " Tool Selected";
    },

    handleCanvasClick(event) {
        if (!this.activeTool) return;
        const canvas = document.getElementById('topologyCanvas');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (['pc', 'laptop', 'hub'].includes(this.activeTool)) {
            this.nodes.push({ id: Date.now(), x, y, type: this.activeTool });
            this.redraw();
        } else if (['straight', 'cross'].includes(this.activeTool)) {
            const node = this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < 30);
            if (node) {
                if (!this.linkStartNode) {
                    this.linkStartNode = node;
                    document.getElementById('builderStatus').innerText = "Status: Select second node";
                } else {
                    if (this.linkStartNode.id !== node.id) {
                        this.links.push({ from: this.linkStartNode, to: node, type: this.activeTool });
                        this.linkStartNode = null;
                        document.getElementById('builderStatus').innerText = "Status: Cable Connected";
                        this.redraw();
                    }
                }
            }
        }
    },

    // CUSTOM VECTOR DRAWING (No external images needed)
    drawNodeIcon(ctx, type, x, y) {
        const size = 40;
        ctx.strokeStyle = type === 'hub' ? '#d32f2f' : '#003366';
        ctx.lineWidth = 2;
        ctx.fillStyle = "#fff";

        if (type === 'pc') {
            ctx.strokeRect(x - 20, y - 20, 40, 28); // Screen
            ctx.fillRect(x - 20, y - 20, 40, 28);
            ctx.beginPath(); // Stand
            ctx.moveTo(x - 5, y + 8); ctx.lineTo(x + 5, y + 8);
            ctx.lineTo(x + 10, y + 15); ctx.lineTo(x - 10, y + 15);
            ctx.closePath(); ctx.stroke(); ctx.fill();
        } else if (type === 'laptop') {
            ctx.strokeRect(x - 18, y - 15, 36, 24); // Screen
            ctx.fillRect(x - 18, y - 15, 36, 24);
            ctx.strokeRect(x - 22, y + 9, 44, 6); // Base
            ctx.fillRect(x - 22, y + 9, 44, 6);
        } else if (type === 'hub') {
            ctx.strokeRect(x - 25, y - 12, 50, 24); // Body
            ctx.fillRect(x - 25, y - 12, 50, 24);
            for (let i = -15; i <= 15; i += 15) {
                ctx.beginPath(); ctx.arc(x + i, y, 3, 0, Math.PI * 2); ctx.stroke(); // Ports
            }
        }
        
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = "bold 9px Arial";
        ctx.textAlign = "center";
        ctx.fillText(type.toUpperCase(), x, y + 30);
    },

    redraw() {
        const canvas = document.getElementById('topologyCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid pattern
        ctx.strokeStyle = "#f0f0f0"; ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=25) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
        for(let i=0; i<canvas.height; i+=25) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }

        // Draw Links
        this.links.forEach(l => {
            ctx.beginPath();
            ctx.setLineDash(l.type === 'cross' ? [5, 5] : []);
            ctx.strokeStyle = l.type === 'cross' ? "#d32f2f" : "#333";
            ctx.lineWidth = 2;
            ctx.moveTo(l.from.x, l.from.y);
            ctx.lineTo(l.to.x, l.to.y);
            ctx.stroke();
            ctx.setLineDash([]);
            // Port dots
            ctx.fillStyle = "#000";
            ctx.beginPath(); ctx.arc(l.from.x, l.from.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(l.to.x, l.to.y, 4, 0, Math.PI*2); ctx.fill();
        });

        // Draw Nodes
        this.nodes.forEach(n => this.drawNodeIcon(ctx, n.type, n.x, n.y));
    },

    resetSimulation() {
        this.nodes = []; this.links = []; this.activeTool = null; this.linkStartNode = null;
        this.redraw();
        document.getElementById('builderStatus').innerText = "Status: Workspace Reset";
        document.querySelectorAll('.tool-card').forEach(b => b.classList.remove('active'));
    },

    checkTopology() {
        const target = document.getElementById('topoTargetSelect').value;
        const status = document.getElementById('builderStatus');
        if (this.nodes.length < 3) { alert("Build a network first!"); return; }

        let ok = false; let msg = "";
        if (target === 'star') {
            const hub = this.nodes.filter(n => n.type === 'hub');
            const others = this.nodes.filter(n => n.type !== 'hub');
            if (hub.length === 1 && this.links.filter(l => l.from.id === hub[0].id || l.to.id === hub[0].id).length === others.length) ok = true;
            else msg = "Star requires 1 central Hub connected to all PCs.";
        } else if (target === 'mesh') {
            const linksReq = this.nodes.length * (this.nodes.length - 1) / 2;
            if (this.links.length === linksReq) ok = true;
            else msg = "Mesh requires every node connected to every other node.";
        } else if (target === 'ring') {
            if (this.nodes.every(n => this.links.filter(l => l.from.id === n.id || l.to.id === n.id).length === 2)) ok = true;
            else msg = "Ring requires a closed loop (each node has 2 links).";
        } else if (target === 'bus') {
            if (this.links.length === this.nodes.length - 1) ok = true;
            else msg = "Bus requires nodes connected in a sequence (N-1 links).";
        }

        status.innerHTML = ok ? `<span style='color:green'>Success: ${target.toUpperCase()} Correct!</span>` : `<span style='color:red'>Fail: ${msg}</span>`;
    },

    loadQuiz() {
        const area = document.getElementById('quiz-questions-area');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question"><p><strong>${i+1}. ${item.q}</strong></p>
                ${item.a.map((opt, oi) => `<label><input type="radio" name="topQ${i}" value="${oi}"> ${opt}</label>`).join('')}
            </div>`).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const sel = document.querySelector(`input[name="topQ${i}"]:checked`);
            if (sel && parseInt(sel.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.innerHTML = `You scored ${score}/10!`;
        res.style.padding = "10px"; res.style.background = score >= 7 ? "#d4edda" : "#f8d7da";
    }
};