/**
 * main.js - The central router for the Virtual Lab (Absolute Masterpiece v5.0)
 * Integrates Experiments 1-6 with Vidyalankar Institute of Technology branding.
 * Optimized for high-fidelity canvas rendering and modularity.
 */

const contentData = {
    home: `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2>List of Experiments</h2>
            <span style="background: var(--accent); color: var(--primary-dark); padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">
                8 Experiments Available
            </span>
        </div>
        <div class="exp-scroll-view">
            <div class="exp-card">
                <h3>1. Implementation of Line Encoding Schemes</h3>
                <p>Study how digital binary data is converted into digital signals using schemes like Unipolar, Polar NRZ, AMI, and Manchester.</p>
                <button class="start-btn" onclick="openExperiment('encoding')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>2. Stop & Wait ARQ Protocol</h3>
                <p>Implementation of flow control where the sender waits for an acknowledgement before sending the next packet.</p>
                <button class="start-btn" onclick="openExperiment('arq')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>3. Network Topologies</h3>
                <p>Demonstration of physical and logical layouts including Star, Mesh, Bus, and Ring topologies.</p>
                <button class="start-btn" onclick="openExperiment('topology')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>4. Go-Back-N ARQ Flow Control Protocol</h3>
                <p>Advanced flow control protocol demonstration involving sliding windows and cumulative acknowledgements.</p>
                <button class="start-btn" onclick="openExperiment('gbn')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>5. Client-Server Architecture</h3>
                <p>Visualization and simulation of Two-tier (Direct) and Three-tier (Middleware) communication models.</p>
                <button class="start-btn" onclick="openExperiment('clientServer')">Start Experiment</button>
            </div>
           <div class="exp-card">
                <h3>6. Multi-Protocol Internetworking</h3>
                <p>Trace an IP datagram across Ethernet, X.25 WAN, and Token Ring networks. Study hop-by-hop framing and end-to-end routing.</p>
                <button class="start-btn" style="background: var(--primary-dark);" onclick="openExperiment('multiprotocol')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>7. Dynamic Routing Protocol (RIP & OSPF)</h3>
                <p>Implementation of dynamic pathfinding using Bellman-Ford and Dijkstra algorithms with real-time table updates and path visualization.</p>
                <button class="start-btn" style="background: var(--primary-dark);" onclick="openExperiment('routing')">Start Experiment</button>
            </div>
            <div class="exp-card">
                <h3>8. Functioning of Network Devices</h3>
                <p>Demonstration of how Hubs, Switches, and Routers handle data packets based on MAC and IP addressing logic.</p>
                <button class="start-btn" style="background: var(--primary-dark);" onclick="openExperiment('device')">Start Experiment</button>
            </div>
        </div>`,
    objective: `
        <h2>Lab Objective</h2>
        <div class="theory-content">
            <p>The primary objectives of this Virtual Lab are:</p>
            <ul style="line-height: 2;">
                <li><strong>Remote Access:</strong> Provide an interactive platform for learning networking protocols without physical hardware.</li>
                <li><strong>Visualization:</strong> Make invisible signal transitions and packet encapsulation processes visible and intuitive.</li>
                <li><strong>Self-Paced Learning:</strong> Enable students to experiment, fail, and learn through guided simulations and assessments.</li>
            </ul>
        </div>`,
    target: `
        <h2>Target Audience</h2>
        <div class="theory-content">
            <p>Undergraduate students of <strong>Computer Engineering, Information Technology, and Electronics (EXTC)</strong> at Vidyalankar Institute of Technology and beyond.</p>
            <p>This lab is specifically tailored for the <em>Computer Networks</em> and <em>Data Communications</em> curriculum.</p>
        </div>`,
    feedback: `
        <h2>Feedback</h2>
        <div class="theory-content">
            <p>Your feedback helps us refine these simulations. Please contact the Department of Electronics and Computer Science for suggestions.</p>
            <button class="start-btn" onclick="window.location.href='mailto:lab-coordinator@vit.edu.in'">Email Feedback</button>
        </div>`
};

/**
 * Transition from Landing Page to Lab
 */
function enterLab() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-lab').classList.remove('hidden');
    loadContent('home');
}

/**
 * Global content loader for Sidebar Navigation
 */
function loadContent(key) {
    const main = document.getElementById('main-content');
    main.innerHTML = contentData[key];
    
    // Update Sidebar UI state
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    const navItem = document.getElementById(`nav-${key}`);
    if (navItem) navItem.classList.add('active');
    
    main.scrollTop = 0;
}

/**
 * Opens a specific experiment and initializes the Theory tab
 */
function openExperiment(expId) {
    const main = document.getElementById('main-content');
    const expData = window[`${expId}Exp`];
    
    if (!expData) {
        main.innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h2 style="color: var(--error);">Module Not Found</h2>
                <p>Experiment logic for <strong>${expId}</strong> could not be loaded. Please ensure the JS file is linked in index.html.</p>
                <button class="start-btn" onclick="loadContent('home')">Return to Home</button>
            </div>`;
        return;
    }

    main.innerHTML = `
        <div class="exp-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h2>${expData.title}</h2>
                <button onclick="loadContent('home')" style="background:none; border: 1px solid var(--primary); color: var(--primary); padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">✕ Close</button>
            </div>
            <div class="tab-bar">
                <div class="tab-btn active" id="tab-theory" onclick="switchTab(this, '${expId}', 'theory')">Theory</div>
                <div class="tab-btn" id="tab-simulation" onclick="switchTab(this, '${expId}', 'simulation')">Simulation</div>
                <div class="tab-btn" id="tab-quiz" onclick="switchTab(this, '${expId}', 'quiz')">Quiz</div>
            </div>
        </div>
        <div id="tab-display" class="tab-body" style="animation: fadeIn 0.4s ease;">
            ${expData.getContent('theory')}
        </div>
    `;
    
    if (expData.onTabLoad) expData.onTabLoad('theory');
}

/**
 * Handles Tab Switching and triggers necessary script re-initialization
 */
function switchTab(btn, expId, part) {
    const expData = window[`${expId}Exp`];
    if (!expData) return;

    // UI Tab Highlight Update
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const display = document.getElementById('tab-display');
    
    // Safety check for content retrieval
    const content = expData.getContent(part);
    display.innerHTML = content || `<p>Content for ${part} is currently unavailable.</p>`;
    
    // Handle script-heavy tab loads (like Canvas initializations)
    if (expData.onTabLoad) {
        // A 50ms delay ensures the DOM is painted before the logic tries to find element IDs
        setTimeout(() => expData.onTabLoad(part), 50);
    }
    
    document.getElementById('main-content').scrollTop = 0;
}
