/**
 * client-server-simulation.js - Two-Tier and Three-Tier Architecture Experiment
 * Updated with a tighter, more centered layout to avoid a sparse look.
 */

window.clientServerExp = {
    title: "Experiment 5: Client-Server Architecture",

    theory: `
        <div class="theory-content">
            <h3>1. Introduction</h3>
            <p>Client-server architecture is a computing model where the server hosts and manages resources consumed by the client. It is the foundation of the modern internet.</p>
            
            <h3>2. Two-Tier Architecture</h3>
            <p>In a <strong>Two-Tier</strong> architecture, the client communicates <strong>directly</strong> with the server. There is no intermediate layer.</p>
            <ul>
                <li><strong>Client:</strong> User interface and request initiator.</li>
                <li><strong>Server:</strong> Processes requests and manages data.</li>
            </ul>

            <h3>3. Three-Tier Architecture</h3>
            <p>A <strong>Three-Tier</strong> architecture adds an <strong>Application Layer (Middleware)</strong> to handle logic, separating the presentation from the data storage.</p>
            <ul>
                <li><strong>Presentation Tier:</strong> The Web Browser / UI.</li>
                <li><strong>Application Tier:</strong> Business Logic (Python/Java).</li>
                <li><strong>Database Tier:</strong> Data storage (MySQL).</li>
            </ul>
        </div>`,

    simulation: `
        <div class="simulator-wrapper" style="position: relative;">
            <!-- Custom Modal Overlay -->
            <div id="cs-modal-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; justify-content: center; align-items: center; border-radius: 16px;">
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 400px; width: 90%; text-align: center; border-top: 5px solid var(--primary);">
                    <div id="cs-modal-icon" style="font-size: 45px; margin-bottom: 15px;">ℹ️</div>
                    <h4 id="cs-modal-title" style="margin: 0 0 10px 0; color: var(--primary); font-size: 1.2rem;">Message</h4>
                    <p id="cs-modal-text" style="margin: 0 0 20px 0; color: #555; line-height: 1.5; font-size: 1rem;"></p>
                    <button class="start-btn" style="margin-top: 0; width: 100%;" onclick="clientServerExp.closeModal()">Dismiss</button>
                </div>
            </div>

            <div style="margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 15px;">
                <label style="font-weight: bold; color: var(--primary);">Select Architecture:</label>
                <select id="archSelect" onchange="clientServerExp.switchArch(this.value)" style="padding:10px; border-radius:8px; border: 1px solid var(--border); width: 280px; font-size: 1rem; background: #fff;">
                    <option value="two">Two-Tier Architecture</option>
                    <option value="three">Three-Tier Architecture</option>
                </select>
            </div>

            <div id="sim-container" style="background:#fff; border:2px solid var(--primary); border-radius:16px; padding:40px; position:relative; min-height: 500px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <!-- Dynamic Content will be injected here -->
            </div>
            
            <div style="margin-top:25px; display:flex; gap:15px; justify-content: center;">
                <button class="action-btn-red" onclick="clientServerExp.resetSim()">Reset Simulation</button>
            </div>
        </div>`,

    quiz: `
        <div class="quiz-container">
            <h3>Architecture Assessment</h3>
            <div id="cs-quiz-area" style="max-height:450px; overflow-y:auto; padding-right:10px;"></div>
            <button class="gen-btn" style="margin-top:20px; width: 100%;" onclick="clientServerExp.gradeQuiz()">Submit Quiz</button>
            <div id="quiz-result"></div>
        </div>`,

    quizQuestions: [
        { q: "What defines a Two-Tier architecture?", a: ["Client-Middleware-DB", "Direct Client-Server communication", "Only browser based"], c: 1 },
        { q: "Which tier in Three-Tier architecture handles business logic?", a: ["Presentation Tier", "Application Tier", "Database Tier"], c: 1 },
        { q: "What is the main advantage of Three-Tier over Two-Tier?", a: ["Lower Cost", "Better Scalability", "Easier implementation"], c: 1 },
        { q: "Which languages are typically used for the Presentation Tier?", a: ["Java, Python", "HTML, CSS, JS", "SQL, PL/SQL"], c: 1 },
        { q: "What happens to data in the Database Tier?", a: ["It is formatted for UI", "It is stored for later retrieval", "It is executed as logic"], c: 1 },
        { q: "Tight coupling is a characteristic of:", a: ["Two-Tier", "Three-Tier", "Hybrid Tier"], c: 0 },
        { q: "In Three-Tier, how does the Presentation Tier communicate with the Database Tier?", a: ["Directly", "Via Application Tier", "Via Internet only"], c: 1 },
        { q: "Which architecture is best for massive enterprises like Amazon?", a: ["Two-Tier", "Three-Tier", "Single-Tier"], c: 1 },
        { q: "A local Excel file is an example of:", a: ["Two-Tier", "Three-Tier", "Neither (Stand-alone)"], c: 2 },
        { q: "Middleware is another name for:", a: ["Database Layer", "Presentation Layer", "Application Layer"], c: 2 }
    ],

    dbStore: [],
    faqs: {
        "What is client?": "A client is a device or software that initiates requests for services from a server.",
        "What is client-server architecture?": "A computing model where the server hosts and manages resources consumed by clients.",
        "What is server?": "A powerful computer that processes client requests and sends back required information.",
        "What is internet?": "A global network connecting clients and servers for data exchange.",
        "What is computer network?": "A set of computers sharing resources located on or provided by network nodes."
    },

    getContent(part) { return this[part]; },

    onTabLoad(part) {
        if (part === 'simulation') this.switchArch('two');
        if (part === 'quiz') this.loadQuiz();
    },

    showMsg(title, text, icon = "ℹ️") {
        document.getElementById('cs-modal-title').innerText = title;
        document.getElementById('cs-modal-text').innerText = text;
        document.getElementById('cs-modal-icon').innerText = icon;
        document.getElementById('cs-modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('cs-modal-overlay').classList.add('hidden');
    },

    switchArch(val) {
        const container = document.getElementById('sim-container');
        if (val === 'two') {
            container.innerHTML = `
                <div style="width: 100%; max-width: 800px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; height:300px;">
                        <div id="node-client" style="text-align:center; width: 200px;">
                            <div style="font-size: 85px;">💻</div>
                            <strong style="display:block; margin: 10px 0; color: var(--primary);">Client</strong>
                            <div id="request-input-box" class="hidden">
                                <select id="cs-query" style="width:100%; padding:10px; border-radius:6px; border: 1px solid #ccc; font-size: 0.9rem;">
                                    <option value="">-- Select Question --</option>
                                    ${Object.keys(this.faqs).map(q => `<option value="${q}">${q}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div style="flex:1; border-bottom:4px dashed #cbd5e0; margin:0 20px; position:relative;">
                            <div id="cs-packet" class="hidden" style="position:absolute; top:-35px; left:0; transition: left 1.5s linear; font-size: 35px;">✉️</div>
                        </div>
                        <div id="node-server" style="text-align:center; width: 200px;">
                            <div style="font-size: 85px;">🖥️</div>
                            <strong style="display:block; margin: 10px 0; color: var(--primary);">Server</strong>
                            <div id="response-box" class="hidden" style="margin-top:10px; background:#f0f7ff; border:2px solid var(--primary); padding:15px; border-radius:10px; font-size: 0.9rem; text-align:left; box-shadow: var(--shadow-sm);"></div>
                        </div>
                    </div>
                    <div style="text-align:center; margin-top:40px;">
                        <button id="cs-btn-request" class="action-btn-blue" onclick="clientServerExp.showRequestInput()">Send Request</button>
                        <button id="cs-btn-send" class="action-btn-blue hidden" onclick="clientServerExp.startTwoTierRequest()">Initiate Transfer</button>
                        <button id="cs-btn-response" class="action-btn-blue hidden" onclick="clientServerExp.sendResponseTwo()">Process Response</button>
                        <div id="cs-guide" style="margin-top:20px; font-weight:bold; color:var(--primary); font-size: 1.1rem;">Click 'Send Request' to start.</div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="width: 100%; max-width: 950px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; height:300px; position:relative; margin-bottom: 30px;">
                        <div style="text-align:center; width:180px;">
                            <div style="font-size: 75px;">🌐</div>
                            <strong style="color: var(--primary); font-size: 1.1rem;">Presentation</strong>
                            <div id="form-container" class="hidden" style="background:#fff; border:1px solid #ccc; padding:15px; border-radius:8px; margin-top:15px; text-align:left; box-shadow: var(--shadow-sm);">
                                <label style="font-size: 0.8rem; font-weight: bold;">Name:</label>
                                <input id="3t-name" type="text" style="width:100%; padding:5px; margin-bottom:8px;">
                                <label style="font-size: 0.8rem; font-weight: bold;">Email:</label>
                                <input id="3t-email" type="text" style="width:100%; padding:5px; margin-bottom:8px;">
                                <label style="font-size: 0.8rem; font-weight: bold;">Query:</label>
                                <select id="3t-msg" style="width:100%; padding:5px;">
                                    <option value="Access Account">Access Account</option>
                                    <option value="Validate Payment">Validate Payment</option>
                                    <option value="Update Profile">Update Profile</option>
                                </select>
                            </div>
                        </div>
                        <div style="text-align:center; width:180px;">
                            <div style="font-size: 75px;">⚙️</div>
                            <strong style="color: var(--primary); font-size: 1.1rem;">Application</strong>
                            <div id="app-status" style="font-size:1rem; color:#666; margin-top:15px; font-style: italic;">Idle</div>
                        </div>
                        <div style="text-align:center; width:180px;">
                            <div style="font-size: 75px;">🗄️</div>
                            <strong style="color: var(--primary); font-size: 1.1rem;">Database</strong>
                            <div id="db-view" style="font-size:0.85rem; height:70px; overflow:auto; background:#f7fafc; padding:10px; margin-top:15px; border: 1px solid #ddd; border-radius: 6px;">Empty</div>
                        </div>
                        <div id="3t-packet" class="hidden" style="position:absolute; top:30%; transition: all 1s linear; font-size:40px; z-index:10;">📦</div>
                    </div>

                    <div style="display:flex; gap:30px; border-top: 2px solid #edf2f7; padding-top: 30px;">
                        <div style="flex:1;">
                            <button class="action-btn-blue" id="btn-3t-req" onclick="clientServerExp.showFormThree()">Create Request</button>
                            <button class="action-btn-blue hidden" id="btn-3t-submit" onclick="clientServerExp.startThreeTierFlow()">Submit to Middleware</button>
                            <button class="action-btn-blue hidden" id="btn-3t-resp" onclick="clientServerExp.processResponseThree()">Get Response</button>
                            
                            <div style="margin-top:25px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <label style="font-weight:bold; font-size: 1rem; color: var(--primary);">Retrieve via Middleware:</label>
                                <div style="display:flex; gap:10px; margin-top:10px;">
                                    <input type="text" id="fetch-email" placeholder="Enter Email" style="padding:10px; flex:1; border-radius: 6px; border: 1px solid #ccc;">
                                    <button onclick="clientServerExp.fetchData()" class="start-btn" style="padding: 10px 20px; margin: 0;">Fetch</button>
                                </div>
                            </div>
                        </div>
                        <div style="width:380px; background:#fff; border:1px solid #ccc; font-size:0.9rem; max-height:180px; overflow:auto; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                            <table id="3t-table" style="width:100%; text-align:left; border-collapse: collapse;">
                                <tr style="background:#edf2f7; color: var(--primary); position: sticky; top: 0;">
                                    <th style="padding:12px; border-bottom: 2px solid #ddd;">Name</th>
                                    <th style="padding:12px; border-bottom: 2px solid #ddd;">Email</th>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    showRequestInput() {
        document.getElementById('request-input-box').classList.remove('hidden');
        document.getElementById('cs-btn-request').classList.add('hidden');
        document.getElementById('cs-btn-send').classList.remove('hidden');
        document.getElementById('cs-guide').innerText = "Select a question and click 'Initiate Transfer'.";
    },

    startTwoTierRequest() {
        const query = document.getElementById('cs-query').value;
        if (!query) { this.showMsg("Input Required", "Please select a question from the dropdown.", "⚠️"); return; }
        
        document.getElementById('cs-btn-send').classList.add('hidden');
        const packet = document.getElementById('cs-packet');
        packet.classList.remove('hidden');
        packet.style.left = '10%';
        document.getElementById('cs-guide').innerText = "Data packet moving to Server...";

        setTimeout(() => {
            packet.style.left = '85%';
            setTimeout(() => {
                packet.classList.add('hidden');
                document.getElementById('cs-guide').innerText = "Request received. Click 'Process Response'.";
                document.getElementById('cs-btn-response').classList.remove('hidden');
            }, 1600);
        }, 50);
    },

    sendResponseTwo() {
        const query = document.getElementById('cs-query').value;
        const packet = document.getElementById('cs-packet');
        packet.classList.remove('hidden');
        packet.style.left = '85%';
        document.getElementById('cs-guide').innerText = "Server responding directly to Client...";

        setTimeout(() => {
            packet.style.left = '10%';
            setTimeout(() => {
                packet.classList.add('hidden');
                const respBox = document.getElementById('response-box');
                respBox.classList.remove('hidden');
                respBox.innerHTML = `<strong>Response:</strong><br>${this.faqs[query]}`;
                document.getElementById('cs-guide').innerText = "Simulation Complete.";
                document.getElementById('cs-btn-response').classList.add('hidden');
            }, 1600);
        }, 50);
    },

    showFormThree() {
        document.getElementById('form-container').classList.remove('hidden');
        document.getElementById('btn-3t-req').classList.add('hidden');
        document.getElementById('btn-3t-submit').classList.remove('hidden');
    },

    async startThreeTierFlow() {
        const name = document.getElementById('3t-name').value;
        const email = document.getElementById('3t-email').value;
        const msg = document.getElementById('3t-msg').value;
        if (!name || !email) { this.showMsg("Form Incomplete", "Please enter both name and email to proceed.", "⚠️"); return; }

        document.getElementById('btn-3t-submit').classList.add('hidden');
        const packet = document.getElementById('3t-packet');
        packet.classList.remove('hidden');
        
        // P -> A
        packet.style.left = '10%';
        await this.delay(100);
        packet.style.left = '45%';
        await this.delay(1100);
        document.getElementById('app-status').innerText = "Logic: Processing...";

        // A -> D
        packet.style.left = '80%';
        await this.delay(1100);
        packet.classList.add('hidden');
        
        this.dbStore.push({ name, email, msg });
        document.getElementById('db-view').innerText = "Database: Entry saved for " + email;
        this.updateTable();
        document.getElementById('btn-3t-resp').classList.remove('hidden');
    },

    async processResponseThree() {
        const packet = document.getElementById('3t-packet');
        packet.classList.remove('hidden');
        packet.style.left = '80%';
        await this.delay(100);
        
        // D -> A
        packet.style.left = '45%';
        await this.delay(1100);
        document.getElementById('app-status').innerText = "Logic: Formatting Response...";
        
        // A -> P
        packet.style.left = '10%';
        await this.delay(1100);
        packet.classList.add('hidden');
        document.getElementById('app-status').innerText = "Idle";
        document.getElementById('btn-3t-resp').classList.add('hidden');
        document.getElementById('btn-3t-req').classList.remove('hidden');
        
        this.showMsg("Flow Complete", "The Application Tier (Middleware) successfully handled the request and isolated the Database.", "✅");
    },

    fetchData() {
        const email = document.getElementById('fetch-email').value;
        if (!email) { this.showMsg("Input Error", "Please enter an email address to query.", "⚠️"); return; }
        
        const record = this.dbStore.find(r => r.email === email);
        
        if (record) {
            this.showMsg("Middleware Result", `Record Found:\n\nName: ${record.name}\nEmail: ${record.email}\nAction: ${record.msg}`, "📂");
        } else {
            this.showMsg("Access Error", "Middleware could not find a matching record for this email in the database.", "❌");
        }
    },

    updateTable() {
        const table = document.getElementById('3t-table');
        const rows = this.dbStore.map(r => `<tr><td style="padding:10px; border-bottom:1px solid #eee;">${r.name}</td><td style="padding:10px; border-bottom:1px solid #eee;">${r.email}</td></tr>`).join('');
        table.innerHTML = `<tr style="background:#edf2f7; color: var(--primary); position: sticky; top: 0;"><th style="padding:12px;">Name</th><th style="padding:12px;">Email</th></tr>` + rows;
    },

    resetSim() { 
        this.dbStore = []; 
        this.switchArch(document.getElementById('archSelect').value); 
    },
    
    delay(ms) { return new Promise(res => setTimeout(res, ms)); },

    loadQuiz() {
        const area = document.getElementById('cs-quiz-area');
        area.innerHTML = this.quizQuestions.map((item, i) => `
            <div class="question">
                <p><strong>${i+1}. ${item.q}</strong></p>
                ${item.a.map((opt, oi) => `
                    <label style="display:block; padding:10px; cursor:pointer; border-radius: 6px;"><input type="radio" name="csQ${i}" value="${oi}"> ${opt}</label>
                `).join('')}
            </div>
        `).join('');
    },

    gradeQuiz() {
        let score = 0;
        this.quizQuestions.forEach((item, i) => {
            const selected = document.querySelector(`input[name="csQ${i}"]:checked`);
            if (selected && parseInt(selected.value) === item.c) score++;
        });
        const res = document.getElementById('quiz-result');
        res.innerHTML = `Final Score: ${score}/10`;
        res.style.background = score >= 7 ? "#d4edda" : "#f8d7da";
        res.style.color = score >= 7 ? "#155724" : "#721c24";
        res.style.display = "block";
    }
};