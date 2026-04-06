/**
 * routing-simulation.js - Optimized RIP and OSPF Visualization
 * Fixes: Prevented overlapping weights, added label masking, and improved collision logic.
 */

window.routingExp = {
    title: "Experiment 7: Dynamic Routing Protocols",

    theory: `
        <div class="theory-content custom-scrollbar" style="max-height: 500px; overflow-y: auto; padding: 25px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top:0;">1. Introduction to Dynamic Routing</h3>
            <p>Dynamic routing protocols allow routers to automatically discover and maintain routes in a changing network topology. This ensures packets always take the most efficient path to their destination.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin:20px 0;">
                <div style="background:#f0f7ff; padding:20px; border-radius:12px; border-left:5px solid #003366;">
                    <h4 style="color:#003366;">RIP (Distance Vector)</h4>
                    <p>Uses <strong>Hop Count</strong> as the primary metric. Based on the <strong>Bellman-Ford Algorithm</strong>, it shares routing tables with neighbors periodically.</p>
                </div>
                <div style="background:#fff9e6; padding:20px; border-radius:12px; border-left:5px solid #ffcc00;">
                    <h4 style="color:#003366;">OSPF (Link State)</h4>
                    <p>Uses <strong>Cost</strong> (based on bandwidth). Based on <strong>Dijkstra's Algorithm</strong>, it builds a complete topological map of the entire network area.</p>
                </div>
            </div>

            <h3>2. Key Algorithms</h3>
            <p><strong>Bellman-Ford:</strong> Calculates shortest paths from a single source to all destinations by iteratively relaxing edges: $D(v) = \min \{ c(u,v) + D(u) \}$.</p>
            <p><strong>Dijkstra:</strong> Greedily selects the nearest unvisited node to build a shortest-path tree, providing faster convergence in large networks.</p>
        </div>`,

    simulation: `
        <div class="simulator-wrapper">
            <!-- Top Control Bar -->
            <div style="background:#f1f5f9; padding:20px; border-radius:15px; border: 1px solid #cbd5e1; margin-bottom:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; gap: 20px;">
                    <div style="display:flex; align-items:center; gap: 10px;">
                        <label style="font-weight:bold; color:#003366;">Protocol:</label>
                        <select id="protocolSelect" onchange="routingExp.resetSim()" style="padding:10px; border-radius:8px; border:1px solid #999; background: white; font-weight: bold;">
                            <option value="rip">RIP Protocol (Distance Vector)</option>
                            <option value="ospf">OSPF Protocol (Link State)</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="start-btn" onclick="routingExp.generateNewGraph()" style="margin:0; background:#64748b;">New Graph</button>
                        <button class="start-btn" id="updateBtn" onclick="routingExp.updateTables()" style="margin:0; background:#2e7d32;">▶ Update Tables</button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div style="background:white; padding:12px; border-radius:10px; border:1px solid #cbd5e1;">
                        <label style="font-size:0.85rem; font-weight:bold; color:#003366; display:block; margin-bottom:8px;">Add Edge (Connectivity):</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="edgeSrc" placeholder="Node A" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px; text-transform:uppercase;">
                            <input type="text" id="edgeDest" placeholder="Node B" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px; text-transform:uppercase;">
                            <input type="number" id="edgeWeight" placeholder="Cost" style="width:60px; padding:8px; border:1px solid #ccc; border-radius:6px;">
                            <button onclick="routingExp.addEdge()" style="padding:8px 15px; cursor:pointer; background:#003366; color:white; border:none; border-radius:6px; font-weight:bold;">Add</button>
                        </div>
                    </div>
                    <div style="background:white; padding:12px; border-radius:10px; border:1px solid #cbd5e1;">
                        <label style="font-size:0.85rem; font-weight:bold; color:#003366; display:block; margin-bottom:8px;">Routing Diagnostic (Send Packet):</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="msgSrc" placeholder="Source" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px; text-transform:uppercase;">
                            <input type="text" id="msgDest" placeholder="Dest" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px; text-transform:uppercase;">
                            <button onclick="routingExp.sendMessage()" style="padding:8px 15px; background:#d32f2f; color:white; border:none; cursor:pointer; border-radius:6px; font-weight:bold;">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Workspace: Graph and Table -->
            <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:20px; height: 500px;">
                <div class="canvas-container" style="background:#fff; border:3px solid #003366; border-radius:15px; position:relative; overflow:hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                    <div style="position:absolute; top:10px; left:15px; font-size: 0.75rem; font-weight: bold; color: #94a3b8; letter-spacing: 1px;">NETWORK TOPOLOGY VIEWER</div>
                    <canvas id="routingCanvas" width="700" height="500" style="width:100%; height:100%; display:block;"></canvas>
                </div>
                <div id="routingTables" class="custom-scrollbar" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:15px; padding:20px; overflow-y:auto; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);">
                    <h4 style="margin:0 0 15px 0; color:#003366; font-size: 1.1rem; border-bottom: 2px solid #ffcc00; padding-bottom: 5px;">Live Routing Tables</h4>
                    <div id="tablesContainer"></div>
                </div>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container custom-scrollbar" style="max-height: 500px; overflow-y: auto; padding: 25px;">
            <h3 style="color:#003366;">Routing & Intelligence Assessment</h3>
            <div id="routing-quiz-area"></div>
            <button class="gen-btn" style="margin-top:20px; width:100%; height:45px;" onclick="routingExp.gradeQuiz()">Submit Assessment</button>
            <div id="quiz-result" style="display:none; margin-top:15px; padding:15px; border-radius:10px; text-align:center; font-weight:bold;"></div>
        </div>`,

    quizQuestions: [
        { q: "Which algorithm is the foundation for the RIP protocol?", a: ["Dijkstra", "Bellman-Ford", "Flooding"], c: 1 },
        { q: "OSPF is classified as which type of routing protocol?", a: ["Distance Vector", "Link State", "Path Vector"], c: 1 },
        { q: "What is the metric used by RIP to determine the best path?", a: ["Bandwidth", "Hop Count", "Delay"], c: 1 },
        { q: "In RIP, a hop count of 16 is considered:", a: ["Short Path", "Infinite (Unreachable)", "Optimal"], c: 1 },
        { q: "Which protocol is more suitable for large, hierarchical networks?", a: ["RIP", "OSPF", "Neither"], c: 1 },
        { q: "Which protocol uses flooding to share link-state information with all routers in an area?", a: ["RIP", "BGP", "OSPF"], c: 2 },
        { q: "What is the default Administrative Distance for OSPF?", a: ["120", "110", "90"], c: 1 },
        { q: "RIP sends updates to its neighbors approximately every:", a: ["10 seconds", "30 seconds", "90 seconds"], c: 1 },
        { q: "Which protocol has a faster convergence time?", a: ["RIP", "OSPF", "Static Routing"], c: 1 },
        { q: "In a Distance Vector protocol, routers share their:", a: ["Link states", "Full routing tables", "Topology maps"], c: 1 }
    ],

    nodes: ['A', 'B', 'C', 'D', 'E'],
    coords: {
        'A': {x: 120, y: 120}, 'B': {x: 580, y: 120}, 'C': {x: 350, y: 250},
        'D': {x: 120, y: 380}, 'E': {x: 580, y: 380}
    },
    graph: [],
    routingTables: {},
    pathHighlight: [],

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') {
            setTimeout(() => this.resetSim(), 50);
        }
        if (part === 'quiz') this.loadQuiz();
    },

    resetSim() {
        this.generateNewGraph();
    },

    generateNewGraph() {
        const templates = [
            [{s:'A',d:'B',w:4}, {s:'B',d:'C',w:2}, {s:'C',d:'D',w:3}, {s:'D',d:'E',w:1}, {s:'E',d:'A',w:7}, {s:'A',d:'C',w:5}],
            [{s:'A',d:'C',w:2}, {s:'C',d:'B',w:1}, {s:'B',d:'D',w:4}, {s:'D',d:'E',w:2}, {s:'E',d:'A',w:8}, {s:'C',d:'E',w:4}],
            [{s:'A',d:'B',w:5}, {s:'B',d:'E',w:2}, {s:'E',d:'D',w:3}, {s:'D',d:'C',w:1}, {s:'C',d:'A',w:4}, {s:'B',d:'D',w:6}]
        ];
        this.graph = templates[Math.floor(Math.random() * templates.length)];
        this.pathHighlight = [];
        this.initTables();
        this.draw();
    },

    initTables() {
        this.routingTables = {};
        this.nodes.forEach(n => {
            this.routingTables[n] = {};
            this.nodes.forEach(dest => {
                if (n === dest) this.routingTables[n][dest] = {cost: 0, next: 'Local'};
                else {
                    const edge = this.graph.find(e => (e.s === n && e.d === dest) || (e.d === n && e.s === dest));
                    if (edge) this.routingTables[n][dest] = {cost: edge.w, next: dest};
                    else this.routingTables[n][dest] = {cost: Infinity, next: '-'};
                }
            });
        });
        this.renderTables();
    },

    updateTables() {
        const protocol = document.getElementById('protocolSelect').value;
        if (protocol === 'rip') {
            for(let step=0; step<this.nodes.length; step++) {
                this.nodes.forEach(i => {
                    this.nodes.forEach(j => {
                        this.nodes.forEach(k => {
                            const edgeIK = this.graph.find(e => (e.s === i && e.d === k) || (e.d === i && e.s === k));
                            if (edgeIK) {
                                const newDist = edgeIK.w + this.routingTables[k][j].cost;
                                if (newDist < this.routingTables[i][j].cost) {
                                    this.routingTables[i][j] = {cost: newDist, next: k};
                                }
                            }
                        });
                    });
                });
            }
        } else {
            this.nodes.forEach(src => {
                let dist = {}; let prev = {}; let pq = [...this.nodes];
                this.nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
                dist[src] = 0;
                while (pq.length > 0) {
                    pq.sort((a,b) => dist[a] - dist[b]);
                    let u = pq.shift();
                    if (dist[u] === Infinity) break;
                    const neighbors = this.graph.filter(e => e.s === u || e.d === u);
                    neighbors.forEach(e => {
                        let v = e.s === u ? e.d : e.s;
                        let alt = dist[u] + e.w;
                        if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
                    });
                }
                this.nodes.forEach(dest => {
                    if (src !== dest) {
                        let curr = dest; let nextHop = dest;
                        while (prev[curr] && prev[curr] !== src) { curr = prev[curr]; nextHop = curr; }
                        this.routingTables[src][dest] = {cost: dist[dest], next: dist[dest] === Infinity ? '-' : nextHop};
                    }
                });
            });
        }
        this.renderTables();
    },

    addEdge() {
        const s = document.getElementById('edgeSrc').value.toUpperCase();
        const d = document.getElementById('edgeDest').value.toUpperCase();
        const w = parseInt(document.getElementById('edgeWeight').value);
        
        if (!this.nodes.includes(s) || !this.nodes.includes(d) || isNaN(w) || s === d) return;
        
        // Prevent duplicate edges by updating if it exists
        const existing = this.graph.find(e => (e.s === s && e.d === d) || (e.s === d && e.d === s));
        if (existing) {
            existing.w = w;
        } else {
            this.graph.push({s, d, w});
        }
        
        this.initTables();
        this.draw();
    },

    sendMessage() {
        const s = document.getElementById('msgSrc').value.toUpperCase();
        const d = document.getElementById('msgDest').value.toUpperCase();
        if (s === d || !this.nodes.includes(s) || !this.nodes.includes(d)) return;
        this.pathHighlight = [];
        let curr = s;
        while (curr !== d && curr !== '-') {
            let entry = this.routingTables[curr][d];
            if (entry.cost === Infinity) break;
            this.pathHighlight.push({s: curr, d: entry.next});
            curr = entry.next;
        }
        this.draw();
    },

    renderTables() {
        const container = document.getElementById('tablesContainer');
        if (!container) return;
        container.innerHTML = this.nodes.map(n => `
            <div style="margin-bottom:15px; background:white; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
                <h5 style="margin:0 0 8px 0; color:#003366;">Router ${n}</h5>
                <table style="width:100%; font-size:0.75rem; border-collapse:collapse; text-align:center;">
                    <tr style="background:#f1f5f9; border-bottom: 1px solid #e2e8f0;">
                        <th style="padding:4px;">Dest</th><th style="padding:4px;">Cost</th><th style="padding:4px;">Next</th>
                    </tr>
                    ${this.nodes.map(d => `
                        <tr>
                            <td style="padding:4px;">${d}</td>
                            <td style="padding:4px; font-weight:bold;">${this.routingTables[n][d].cost === Infinity ? '∞' : this.routingTables[n][d].cost}</td>
                            <td style="padding:4px;">${this.routingTables[n][d].next}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('');
    },

    draw() {
        const canvas = document.getElementById('routingCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Edges
        this.graph.forEach(e => {
            const p1 = this.coords[e.s], p2 = this.coords[e.d];
            const isHigh = this.pathHighlight.some(h => (h.s === e.s && h.d === e.d) || (h.s === e.d && h.d === e.s));
            ctx.beginPath();
            ctx.strokeStyle = isHigh ? '#d32f2f' : '#94a3b8'; 
            ctx.lineWidth = isHigh ? 6 : 3;
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });

        // 2. Draw Weight Labels with "Masking" (White circle behind text to prevent overlap)
        this.graph.forEach(e => {
            const p1 = this.coords[e.s], p2 = this.coords[e.d];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            // Draw white background circle for the weight
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(midX, midY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw Weight Text
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e.w, midX, midY);
        });

        // 3. Draw Nodes
        this.nodes.forEach(n => {
            const p = this.coords[n];
            ctx.beginPath();
            ctx.fillStyle = '#003366'; 
            ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.arc(p.x, p.y, 25, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n, p.x, p.y);
        });
    },

    loadQuiz() {
        const area = document.getElementById('routing-quiz-area');
        area.innerHTML = this.quizQuestions.map((q, i) => `
            <div style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:12px; border:1px solid #e2e8f0;">
                <p style="margin-top:0;"><strong>${i+1}. ${q.q}</strong></p>
                ${q.a.map((opt, oi) => `<label style="display:block; margin:8px 0; cursor:pointer;"><input type="radio" name="rq${i}" value="${oi}" style="margin-right:10px;"> ${opt}</label>`).join('')}
            </div>
        `).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((q, i) => {
            const sel = document.querySelector(`input[name="rq${i}"]:checked`);
            if (sel && parseInt(sel.value) === q.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.style.display = "block";
        res.innerHTML = `Assessment Result: ${score}/5 ${score >= 3 ? ' - Excellent Proficiency!' : ' - Needs Review.'}`;
        res.style.background = score >= 3 ? '#dcfce7' : '#fee2e2';
        res.style.color = score >= 3 ? '#166534' : '#991b1b';
    }
};