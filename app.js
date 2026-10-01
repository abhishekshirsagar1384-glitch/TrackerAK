// 1. Initial Data Structure
const defaultData = {
    streak: 0,
    lastLogDate: null,
    totalMinutes: 0,
    dailyNotes: "",
    arcEndDate: "2026-03-20", // Default end date
    expanded: {},
    history: [],
    topics: [
        {
            id: 1,
            title: "PortSwigger Academy",
            subtasks: [
                { id: '1-1', title: 'SQL Injection (18 labs)', link: 'https://portswigger.net/web-security/sql-injection', completed: false },
                { id: '1-2', title: 'Authentication (14 labs)', link: 'https://portswigger.net/web-security/authentication', completed: false },
                { id: '1-3', title: 'Path Traversal (6 labs)', link: 'https://portswigger.net/web-security/file-path-traversal', completed: false },
                { id: '1-4', title: 'Command Injection (5 labs)', link: 'https://portswigger.net/web-security/os-command-injection', completed: false },
                { id: '1-5', title: 'Business Logic Vulnerabilities (11 labs)', link: 'https://portswigger.net/web-security/logic-flaws', completed: false },
                { id: '1-6', title: 'Information Disclosure (5 labs)', link: 'https://portswigger.net/web-security/information-disclosure', completed: false },
                { id: '1-7', title: 'Access Control (13 labs)', link: 'https://portswigger.net/web-security/access-control', completed: false },
                { id: '1-8', title: 'File Upload Vulnerabilities (Varies)', link: 'https://portswigger.net/web-security/file-upload', completed: false },
                { id: '1-9', title: 'Server-Side Request Forgery / SSRF (Varies)', link: 'https://portswigger.net/web-security/ssrf', completed: false },
                { id: '1-10', title: 'XXE Injection (9 labs)', link: 'https://portswigger.net/web-security/xxe', completed: false },
                { id: '1-11', title: 'NoSQL Injection (4 labs)', link: 'https://portswigger.net/web-security/nosql-injection', completed: false },
                { id: '1-12', title: 'API Testing (5 labs)', link: 'https://portswigger.net/web-security/api-testing', completed: false },
                { id: '1-13', title: 'Web Cache Deception (5 labs)', link: 'https://portswigger.net/web-security/web-cache-deception', completed: false },
                { id: '1-14', title: 'Cross-Site Scripting / XSS (30 labs)', link: 'https://portswigger.net/web-security/cross-site-scripting', completed: false },
                { id: '1-15', title: 'Cross-Site Request Forgery / CSRF (12 labs)', link: 'https://portswigger.net/web-security/csrf', completed: false },
                { id: '1-16', title: 'Cross-Origin Resource Sharing / CORS (3 labs)', link: 'https://portswigger.net/web-security/cors', completed: false },
                { id: '1-17', title: 'Clickjacking (5 labs)', link: 'https://portswigger.net/web-security/clickjacking', completed: false },
                { id: '1-18', title: 'DOM-Based Vulnerabilities (7 labs)', link: 'https://portswigger.net/web-security/dom-based', completed: false },
                { id: '1-19', title: 'WebSockets (3 labs)', link: 'https://portswigger.net/web-security/websockets', completed: false },
                { id: '1-20', title: 'Race Conditions (Varies)', link: 'https://portswigger.net/web-security/race-conditions', completed: false },
                { id: '1-21', title: 'GraphQL API Vulnerabilities (Varies)', link: 'https://portswigger.net/web-security/graphql', completed: false },
                { id: '1-22', title: 'Server-Side Template Injection (7 labs)', link: 'https://portswigger.net/web-security/server-side-template-injection', completed: false },
                { id: '1-23', title: 'Web Cache Poisoning (13 labs)', link: 'https://portswigger.net/web-security/web-cache-poisoning', completed: false },
                { id: '1-24', title: 'HTTP Host Header Attacks (7 labs)', link: 'https://portswigger.net/web-security/host-header', completed: false },
                { id: '1-25', title: 'HTTP Request Smuggling (22 labs)', link: 'https://portswigger.net/web-security/request-smuggling', completed: false },
                { id: '1-26', title: 'OAuth Authentication (6 labs)', link: 'https://portswigger.net/web-security/oauth', completed: false },
                { id: '1-27', title: 'JWT Attacks (8 labs)', link: 'https://portswigger.net/web-security/jwt', completed: false },
                { id: '1-28', title: 'Prototype Pollution (10 labs)', link: 'https://portswigger.net/web-security/prototype-pollution', completed: false },
                { id: '1-29', title: 'Essential Skills (2 labs)', link: 'https://portswigger.net/web-security/essential-skills', completed: false }
            ]
        },
        {
            id: 2,
            title: "CompTIA Security+",
            subtasks: [
                { id: '2-1', title: '1.0 General Security Concepts (12%) - Controls, Cryptography, PKI', completed: false },
                { id: '2-2', title: '2.0 Threats, Vulnerabilities, & Mitigations (22%) - IAM, Vulnerability Mgmt', completed: false },
                { id: '2-3', title: '3.0 Security Architecture (18%) - Cloud, Network, Endpoint, AppSec', completed: false },
                { id: '2-4', title: '4.0 Security Operations (28%) - Incident Response, Forensics, Monitoring', completed: false },
                { id: '2-5', title: '5.0 Security Program Management (20%) - Governance, Risk, Compliance', completed: false },
                { id: '2-6', title: 'CompTIA Security+ Practice Exams & PBQs', completed: false }
            ]
        },
        {
            id: 3,
            title: "Agentic Security",
            subtasks: [
                { id: '3-1', title: 'Core Concepts & Frameworks (OWASP Agentic Top 10, ASDL)', completed: false },
                { id: '3-2', title: 'Threat Modeling & Risk (MAESTRO, Goal Hijacking, Prompt Injection)', completed: false },
                { id: '3-3', title: 'Identity, Access & Trust (Entra Agent ID, Zero Trust for AI)', completed: false },
                { id: '3-4', title: 'Runtime & Execution Security (Sandboxing, OATS, Aether-9)', completed: false },
                { id: '3-5', title: 'Governance, Compliance & Standards (MCP Security, Citadel)', completed: false },
                { id: '3-6', title: 'Supply Chain & Ecosystem Security', completed: false },
                { id: '3-7', title: 'Red Teaming & Testing (AI-VSS, Agentic SecOps)', completed: false },
                { id: '3-8', title: 'Enterprise Frameworks (AEGIS, Nvidia Open Agent Safety)', completed: false }
            ]
        },
        {
            id: 4,
            title: "OWASP Top 10",
            subtasks: [
                { id: '4-1', title: 'A01: Broken Access Control', completed: false },
                { id: '4-2', title: 'A02: Cryptographic Failures', completed: false },
                { id: '4-3', title: 'A03: Injection', completed: false },
                { id: '4-4', title: 'A04: Insecure Design', completed: false },
                { id: '4-5', title: 'A05: Security Misconfiguration', completed: false },
                { id: '4-6', title: 'A06: Vulnerable and Outdated Components', completed: false },
                { id: '4-7', title: 'A07: Identification and Authentication Failures', completed: false },
                { id: '4-8', title: 'A08: Software and Data Integrity Failures', completed: false },
                { id: '4-9', title: 'A09: Security Logging and Monitoring Failures', completed: false },
                { id: '4-10', title: 'A10: Server-Side Request Forgery (SSRF)', completed: false }
            ]
        },
        {
            id: 5,
            title: "Application Security",
            subtasks: [
                { id: '5-1', title: 'Secure SDLC, Threat Modeling, Architecture & Risk Assessment', completed: false },
                { id: '5-2', title: 'Security Testing & Tools (SAST, DAST, IAST, SCA, RASP, Fuzzing)', completed: false },
                { id: '5-3', title: 'Vulnerability Mgmt, Bug Bounty, Red/Blue/Purple Teaming', completed: false },
                { id: '5-4', title: 'DevSecOps, CI/CD Security, Supply Chain, SBOM, Secrets Mgmt', completed: false },
                { id: '5-5', title: 'Identity & Crypto (IAM, MFA, OAuth, JWT, TLS, PKI, Hashing)', completed: false },
                { id: '5-6', title: 'Core Vulnerabilities (XSS, SQLi, CSRF, SSRF, Deserialization)', completed: false },
                { id: '5-7', title: 'API, Microservices, Container, K8s, Serverless & Cloud Security', completed: false },
                { id: '5-8', title: 'WAF, Rate Limiting, DDoS, Logging, SIEM, SOAR, Threat Hunting', completed: false },
                { id: '5-9', title: 'Compliance & Standards (OWASP ASVS/SAMM, NIST SSDF, ISO 27001, SOC 2)', completed: false }
            ]
        },
        {
            id: 6,
            title: "AI Security",
            subtasks: [
                { id: '6-1', title: 'Adversarial Machine Learning & Model Theft', completed: false },
                { id: '6-2', title: 'Data Poisoning & Privacy in AI (Federated Learning)', completed: false },
                { id: '6-3', title: 'AI Governance, Ethics & Compliance', completed: false }
            ]
        },
        {
            id: 7,
            title: "Project: AI & Agentic AI",
            subtasks: [
                { id: '7-1', title: 'Define Scope & Architecture', completed: false },
                { id: '7-2', title: 'Build a basic AI Agent (LangChain/AutoGen)', completed: false },
                { id: '7-3', title: 'Add Authentication & AuthZ', completed: false },
                { id: '7-4', title: 'Perform a Security Audit on your Agent', completed: false },
                { id: '7-5', title: 'Deploy Project & Write Documentation', completed: false }
            ]
        }
    ]
};

let appData = JSON.parse(JSON.stringify(defaultData));

// 2. Load & Save Data
function loadData() {
    const saved = localStorage.getItem('winterArcLiveTracker');
    if (saved) {
        appData = JSON.parse(saved);
        if (!appData.expanded) appData.expanded = {};
        if (!appData.history) appData.history = [];
        if (appData.dailyNotes === undefined) appData.dailyNotes = "";
        if (!appData.arcEndDate) appData.arcEndDate = "2026-03-20";
    }
}

function saveData() {
    localStorage.setItem('winterArcLiveTracker', JSON.stringify(appData));
}

// 3. Core Rendering Logic
function renderApp() {
    renderStats();
    renderTopics();
}

function renderStats() {
    document.getElementById('streak-count').textContent = `🔥 ${appData.streak} Days`;
    const hours = (appData.totalMinutes / 60).toFixed(1);
    document.getElementById('total-time').textContent = `${hours} hrs`;

    // Dynamic countdown
    const endDate = new Date(appData.arcEndDate).getTime();
    const today = new Date().getTime();
    const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    const daysLeftEl = document.getElementById('days-left');
    if (daysLeftEl) daysLeftEl.textContent = `${daysLeft} Days`;

    let totalTasks = 0;
    let completedTasks = 0;

    appData.topics.forEach(topic => {
        topic.subtasks.forEach(sub => {
            totalTasks++;
            if (sub.completed) completedTasks++;
        });
    });

    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    document.getElementById('progress-percentage').textContent = `${percentage}%`;

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        if (appData.history.length === 0) {
            undoBtn.disabled = true;
            undoBtn.style.opacity = '0.5';
        } else {
            undoBtn.disabled = false;
            undoBtn.style.opacity = '1';
        }
    }
}

function renderTopics() {
    const container = document.getElementById('tracker-container');
    if (!container) return;
    container.innerHTML = '';

    appData.topics.forEach(topic => {
        const totalSubs = topic.subtasks.length;
        const incompleteSubs = topic.subtasks.filter(s => !s.completed);
        const completedSubs = totalSubs - incompleteSubs.length;
        const topicPercent = totalSubs === 0 ? 0 : Math.round((completedSubs / totalSubs) * 100);

        const card = document.createElement('div');
        const isExpanded = appData.expanded[topic.id] ? 'expanded' : '';
        card.className = `topic-card ${isExpanded}`;

        const header = document.createElement('div');
        header.className = 'topic-header';
        header.innerHTML = `
            <div class="topic-info">
                <span class="topic-title">${topic.title}</span>
                <div class="topic-progress-bar">
                    <div class="topic-progress-fill" style="width: ${topicPercent}%"></div>
                </div>
            </div>
            <span style="color: var(--text-muted); font-size: 0.8rem;">${completedSubs}/${totalSubs} Tasks</span>
        `;

        header.addEventListener('click', () => {
            appData.expanded[topic.id] = !appData.expanded[topic.id];
            saveData();
            renderTopics();
        });

        const subtasksDiv = document.createElement('div');
        subtasksDiv.className = 'subtasks';

        if (incompleteSubs.length === 0) {
            subtasksDiv.innerHTML = `<div style="text-align: center; padding: 1rem; color: var(--success); font-weight: bold;">🎉 Topic Mastered! Great job.</div>`;
        } else {
            const nextTasks = incompleteSubs.slice(0, 3);

            nextTasks.forEach(sub => {
                const subItem = document.createElement('div');
                subItem.className = 'subtask-item';

                const linkHTML = sub.link
                    ? `<a href="${sub.link}" target="_blank" class="subtask-link" onclick="event.stopPropagation()">🔗 Go to Lab</a>`
                    : '';

                subItem.innerHTML = `
                    <div class="subtask-checkbox"></div>
                    <div class="subtask-title">${sub.title}</div>
                    ${linkHTML}
                `;

                subItem.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') return;
                    e.stopPropagation();
                    sub.completed = true;
                    appData.history.push({ topicId: topic.id, subtaskId: sub.id });
                    saveData();
                    renderTopics();
                    renderStats();
                });

                subtasksDiv.appendChild(subItem);
            });

            if (incompleteSubs.length > 3) {
                const moreText = document.createElement('div');
                moreText.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); margin-top: 10px; text-align: center;';
                moreText.textContent = `+ ${incompleteSubs.length - 3} more tasks in queue...`;
                subtasksDiv.appendChild(moreText);
            }
        }

        card.appendChild(header);
        card.appendChild(subtasksDiv);
        container.appendChild(card);
    });
}

// 4. Undo, Reset, and Backup Logic
const undoBtn = document.getElementById('undo-btn');
if (undoBtn) {
    undoBtn.addEventListener('click', () => {
        if (appData.history.length === 0) return;
        const lastAction = appData.history.pop();
        const topic = appData.topics.find(t => t.id === lastAction.topicId);
        if (topic) {
            const sub = topic.subtasks.find(s => s.id === lastAction.subtaskId);
            if (sub) {
                sub.completed = false;
                appData.expanded[topic.id] = true;
                saveData(); renderTopics(); renderStats();
            }
        }
    });
}

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset ALL progress? This cannot be undone.")) {
            localStorage.removeItem('winterArcLiveTracker');
            appData = JSON.parse(JSON.stringify(defaultData));
            saveData(); renderApp();
            const notesBox = document.getElementById('daily-notes');
            if (notesBox) notesBox.value = '';
            const dateInput = document.getElementById('arc-end-date');
            if (dateInput) dateInput.value = appData.arcEndDate;
        }
    });
}

const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `winter_arc_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}

// 5. Reusable Log Session Function (Used by Quick Add and Pomodoro)
function logSession(minutes) {
    appData.totalMinutes += minutes;
    const today = new Date().toISOString().split('T')[0];

    if (appData.lastLogDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (appData.lastLogDate === yesterdayString) {
            appData.streak += 1;
        } else {
            appData.streak = 1;
        }
        appData.lastLogDate = today;
    }
    saveData();
    renderStats();
}

// 6. Quick Add Button Logic
document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        logSession(minutes);

        const originalText = e.target.textContent;
        e.target.textContent = '✓ Logged';
        e.target.style.background = 'var(--success)';
        e.target.style.color = 'white';

        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.background = '';
            e.target.style.color = '';
        }, 1000);
    });
});

// 7. Pomodoro Timer Logic
let timerInterval = null;
let timeLeft = 1500; // 25 minutes in seconds
let isTimerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');

function updateTimerDisplay() {
    if (!timerDisplay) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

if (timerStartBtn) {
    timerStartBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerStartBtn.textContent = '▶ Resume';
            timerStartBtn.classList.remove('running');
        } else {
            isTimerRunning = true;
            timerStartBtn.textContent = '⏸ Pause';
            timerStartBtn.classList.add('running');

            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timerStartBtn.textContent = '▶ Start';
                    timerStartBtn.classList.remove('running');
                    timeLeft = 1500; // Reset to 25 mins
                    updateTimerDisplay();

                    logSession(25);
                    alert("🍅 Pomodoro Complete! 25 minutes added to your tracker.");
                }
            }, 1000);
        }
    });
}

if (timerResetBtn) {
    timerResetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timeLeft = 1500;
        updateTimerDisplay();
        if (timerStartBtn) {
            timerStartBtn.textContent = '▶ Start';
            timerStartBtn.classList.remove('running');
        }
    });
}

// 8. Initialize App
function init() {
    loadData();
    renderApp();
    updateTimerDisplay();

    const notesBox = document.getElementById('daily-notes');
    if (notesBox) {
        if (appData.dailyNotes) notesBox.value = appData.dailyNotes;
        notesBox.addEventListener('input', (e) => {
            appData.dailyNotes = e.target.value;
            saveData();
        });
    }

    const dateInput = document.getElementById('arc-end-date');
    if (dateInput) {
        dateInput.value = appData.arcEndDate;
        dateInput.addEventListener('change', (e) => {
            appData.arcEndDate = e.target.value;
            saveData();
            renderStats();
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
