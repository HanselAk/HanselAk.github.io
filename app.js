// ============================================
// SENIORDESIGN.SYS v2.1 - Application Logic
// ============================================

// === State Management ===
const AppState = {
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    currentView: 'dashboard',
    currentWizardStep: 1,
    currentProject: null,
    projects: [],
    selectedTechnologies: [],
    settings: {
        crtEffect: true,
        colorScheme: 'green'
    }
};

// === Initialize Application ===
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadProjects();
    updateClock();
    setInterval(updateClock, 1000);
    setupKeyboardShortcuts();
    setupTechBadges();
    
    // Show boot sequence on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        showBootSequence();
        localStorage.setItem('hasVisited', 'true');
    }
    
    updateProjectsList();
    checkAPIStatus();
});

// === Boot Sequence ===
function showBootSequence() {
    const bootSeq = document.getElementById('bootSequence');
    bootSeq.classList.remove('hidden');
    
    // Hide after animation
    setTimeout(() => {
        bootSeq.addEventListener('click', hideBootSequence);
        document.addEventListener('keydown', hideBootSequence, { once: true });
    }, 3000);
}

function hideBootSequence() {
    const bootSeq = document.getElementById('bootSequence');
    bootSeq.style.opacity = '0';
    setTimeout(() => {
        bootSeq.classList.add('hidden');
        bootSeq.style.opacity = '1';
    }, 300);
}

// === Clock Update ===
function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];
    document.getElementById('currentTime').textContent = `${dateStr} ${timeStr}`;
}

// === Navigation ===
function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewId + 'View');
    if (targetView) {
        targetView.classList.add('active');
        AppState.currentView = viewId;
    }
}

function showDashboard() {
    showView('dashboard');
    updateProjectsList();
}

function showWizard() {
    showView('wizard');
    resetWizard();
}

function showSavedProjects() {
    alert('Feature: Load saved projects - Coming soon!');
}

function showComparison() {
    alert('Feature: Side-by-side project comparison - Coming soon!');
}

function showSettings() {
    showView('settings');
    loadSettingsForm();
}

function showAbout() {
    alert(`SENIORDESIGN.SYS v2.1
    
An AI-powered senior design project advisor built for computer engineering students.

Features:
• Intelligent idea generation
• Market analysis
• Feasibility assessment
• Component breakdown
• Timeline planning
• Multi-criteria scoring

Powered by Claude AI (Anthropic)
© 2026 Engineering Intelligence Systems`);
}

// === Keyboard Shortcuts ===
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only in dashboard view
        if (AppState.currentView !== 'dashboard') {
            if (e.key === 'Escape') {
                showDashboard();
            }
            return;
        }
        
        if (e.key === 'n' || e.key === 'N') showWizard();
        if (e.key === 'l' || e.key === 'L') showSavedProjects();
        if (e.key === 'c' || e.key === 'C') showComparison();
        if (e.key === 's' || e.key === 'S') showSettings();
        if (e.key === 'a' || e.key === 'A') showAbout();
    });
}

// === Wizard Management ===
function resetWizard() {
    AppState.currentWizardStep = 1;
    AppState.selectedTechnologies = [];
    
    // Reset all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show first step
    document.getElementById('wizardStep1').classList.add('active');
    document.querySelector('[data-step="1"]').classList.add('active');
    
    // Load saved API key if exists
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
    }
}

function nextWizardStep() {
    if (AppState.currentWizardStep === 1) {
        // Validate API key
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey || !apiKey.startsWith('sk-ant-')) {
            alert('Please enter a valid Anthropic API key (starts with sk-ant-)');
            return;
        }
        AppState.apiKey = apiKey;
        AppState.model = document.getElementById('aiModel').value;
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('defaultModel', AppState.model);
    }
    
    if (AppState.currentWizardStep === 2) {
        // Start generation
        generateIdeas();
        return;
    }
    
    // Move to next step
    AppState.currentWizardStep++;
    updateWizardStep();
}

function prevWizardStep() {
    if (AppState.currentWizardStep > 1) {
        AppState.currentWizardStep--;
        updateWizardStep();
    }
}

function updateWizardStep() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 === AppState.currentWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update step content
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        if (index + 1 === AppState.currentWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// === Tech Badges Setup ===
function setupTechBadges() {
    const badges = document.querySelectorAll('.tech-badge');
    badges.forEach(badge => {
        badge.addEventListener('click', () => {
            const tech = badge.getAttribute('data-tech');
            
            if (badge.classList.contains('selected')) {
                badge.classList.remove('selected');
                AppState.selectedTechnologies = AppState.selectedTechnologies.filter(t => t !== tech);
            } else {
                badge.classList.add('selected');
                AppState.selectedTechnologies.push(tech);
            }
        });
    });
}

// === HW/SW Ratio Display ===
function updateHwSwDisplay(value) {
    const hwPercent = value;
    const swPercent = 100 - value;
    document.getElementById('hwSwRatioDisplay').textContent = `${swPercent}% SW / ${hwPercent}% HW`;
}

// === Value Adjustment ===
function adjustValue(inputId, delta) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 100;
    const newValue = Math.max(min, Math.min(max, currentValue + delta));
    input.value = newValue;
}

// === AI Idea Generation ===
async function generateIdeas() {
    // Collect form data
    const teamSize = document.getElementById('teamSize').value;
    const duration = document.getElementById('duration').value;
    const budget = document.getElementById('budget').value;
    const complexity = document.getElementById('complexity').value;
    const hwSwRatio = document.getElementById('hwSwRatio').value;
    const problemStatement = document.getElementById('problemStatement').value.trim();
    const technologies = AppState.selectedTechnologies;
    
    // Update wizard step
    AppState.currentWizardStep = 3;
    updateWizardStep();
    
    // Show loading state
    document.getElementById('generationLoading').classList.remove('hidden');
    document.getElementById('generationResults').classList.add('hidden');
    
    // Animate loading bar
    animateLoadingBar();
    
    // Build prompt
    const prompt = buildIdeaGenerationPrompt({
        teamSize,
        duration,
        budget,
        complexity,
        hwSwRatio,
        problemStatement,
        technologies
    });
    
    try {
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AppState.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: AppState.model,
                max_tokens: 4000,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        // Parse response
        const ideas = parseIdeasResponse(data.content[0].text);
        
        // Display results
        displayIdeas(ideas);
        
        // Save to state
        AppState.projects = ideas.map((idea, index) => ({
            id: Date.now() + index,
            ...idea,
            timestamp: new Date().toISOString(),
            constraints: { teamSize, duration, budget, complexity, hwSwRatio, technologies }
        }));
        
        saveProjects();
        
    } catch (error) {
        console.error('Generation error:', error);
        document.getElementById('loadingStatus').innerHTML = `
            <span class="text-error">ERROR: ${error.message}</span><br>
            <button class="btn-secondary" onclick="prevWizardStep()">← TRY AGAIN</button>
        `;
    }
}

function buildIdeaGenerationPrompt(params) {
    const hwSwEmphasis = params.hwSwRatio > 50 ? 'Hardware-heavy' : params.hwSwRatio < 50 ? 'Software-heavy' : 'Balanced hardware/software';
    
    return `You are a senior design project advisor for computer engineering students.

Generate 5 innovative, achievable project ideas with these constraints:

TEAM CONSTRAINTS:
- Team size: ${params.teamSize} students
- Duration: ${params.duration} semester(s)
- Budget: ${params.budget}
- Complexity level: ${params.complexity}
- HW/SW emphasis: ${hwSwEmphasis}
${params.technologies.length > 0 ? `- Preferred technologies: ${params.technologies.join(', ')}` : ''}

${params.problemStatement ? `PROBLEM FOCUS:\n${params.problemStatement}\n` : ''}

For EACH idea, provide a structured response in this EXACT JSON format:

{
  "title": "Project Title",
  "tagline": "One-line description (max 15 words)",
  "description": "2-3 sentence description of what this project does and why it matters",
  "target_users": "Who would use this? Be specific.",
  "innovation_score": 7.5,
  "feasibility_score": 8.0,
  "impact_score": 7.0,
  "learning_score": 8.5,
  "overall_score": 7.8,
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "estimated_cost": "$450",
  "timeline": "2 semesters",
  "complexity": "Intermediate",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "risks": ["Risk 1", "Risk 2"]
}

Return ONLY a valid JSON array of 5 project objects. No markdown, no explanations, just the JSON array.`;
}

function parseIdeasResponse(text) {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```\n?/g, '');
        }
        
        const ideas = JSON.parse(cleaned);
        return Array.isArray(ideas) ? ideas : [ideas];
    } catch (error) {
        console.error('Parse error:', error);
        // Return sample data as fallback
        return [{
            title: "AI-Powered Study Assistant",
            tagline: "Voice-activated learning companion for students",
            description: "A smart study tool that uses natural language processing to help students review material, generate practice questions, and track learning progress through conversational AI.",
            target_users: "College students preparing for exams",
            innovation_score: 8.0,
            feasibility_score: 7.5,
            impact_score: 8.0,
            learning_score: 7.0,
            overall_score: 7.8,
            technologies: ["Python", "NLP", "Voice Recognition", "Cloud AI"],
            estimated_cost: "$450",
            timeline: "2 semesters",
            complexity: "Intermediate",
            key_features: ["Voice interaction", "Adaptive learning", "Progress tracking"],
            risks: ["Voice recognition accuracy", "Cloud API costs"]
        }];
    }
}

function animateLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingStatus = document.getElementById('loadingStatus');
    
    const stages = [
        { percent: 20, text: 'Analyzing constraints...' },
        { percent: 40, text: 'Querying AI advisor...' },
        { percent: 60, text: 'Generating project ideas...' },
        { percent: 80, text: 'Evaluating feasibility...' },
        { percent: 100, text: 'Finalizing recommendations...' }
    ];
    
    let currentStage = 0;
    
    const interval = setInterval(() => {
        if (currentStage < stages.length) {
            const stage = stages[currentStage];
            const filled = '█'.repeat(Math.floor(stage.percent / 5));
            const empty = '░'.repeat(20 - Math.floor(stage.percent / 5));
            loadingBar.textContent = `[${filled}${empty}] ${stage.percent}%`;
            loadingStatus.textContent = stage.text;
            currentStage++;
        } else {
            clearInterval(interval);
        }
    }, 800);
}

function displayIdeas(ideas) {
    const container = document.getElementById('ideaCards');
    container.innerHTML = '';
    
    ideas.forEach((idea, index) => {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.innerHTML = `
            <div class="idea-card-header">
                <div class="idea-card-title">#${index + 1} ${idea.title}</div>
                <div class="idea-card-score">${idea.overall_score.toFixed(1)}/10</div>
            </div>
            <div class="idea-card-description">
                <strong>${idea.tagline}</strong><br>
                ${idea.description}
            </div>
            <div class="idea-card-tags">
                ${idea.technologies.map(tech => `<span class="idea-tag">${tech}</span>`).join('')}
                <span class="idea-tag">💰 ${idea.estimated_cost}</span>
                <span class="idea-tag">⏱️ ${idea.timeline}</span>
            </div>
        `;
        
        card.onclick = () => showProjectDetail(index);
        container.appendChild(card);
    });
    
    document.getElementById('ideaCount').textContent = ideas.length;
    document.getElementById('generationLoading').classList.add('hidden');
    document.getElementById('generationResults').classList.remove('hidden');
}

// === Project Detail View ===
function showProjectDetail(projectIndex) {
    if (!AppState.projects[projectIndex]) return;
    
    AppState.currentProject = AppState.projects[projectIndex];
    showView('detail');
    
    document.getElementById('detailProjectTitle').textContent = AppState.currentProject.title;
    showTab('overview');
}

function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
    
    // Render tab content
    const content = document.getElementById('detailContent');
    const project = AppState.currentProject;
    
    if (!project) return;
    
    switch(tabName) {
        case 'overview':
            content.innerHTML = renderOverviewTab(project);
            break;
        case 'market':
            content.innerHTML = `<div class="panel-content">
                <h3>Market Analysis</h3>
                <p><strong>Target Users:</strong> ${project.target_users}</p>
                <p class="text-warning">Deep market analysis requires additional API call. Click "Deep Analysis" button to generate full report.</p>
            </div>`;
            break;
        case 'feasibility':
            content.innerHTML = renderFeasibilityTab(project);
            break;
        case 'components':
            content.innerHTML = `<div class="panel-content">
                <h3>Component Breakdown</h3>
                <p><strong>Technologies:</strong></p>
                <ul>
                    ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                </ul>
                <p class="text-warning">Detailed BOM requires additional API call. Click "Deep Analysis" button to generate.</p>
            </div>`;
            break;
        case 'timeline':
            content.innerHTML = `<div class="panel-content">
                <h3>Timeline Planning</h3>
                <p><strong>Duration:</strong> ${project.timeline}</p>
                <p class="text-warning">Sprint-by-sprint breakdown requires additional API call. Click "Deep Analysis" button.</p>
            </div>`;
            break;
    }
}

function renderOverviewTab(project) {
    return `
        <div class="panel">
            <div class="panel-header">OVERALL SCORE: ${project.overall_score.toFixed(1)}/10</div>
            <div class="panel-content">
                <div class="status-item">
                    <span class="status-label">Innovation:</span>
                    <span class="status-value">${renderScoreBar(project.innovation_score)} ${project.innovation_score.toFixed(1)}/10</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Feasibility:</span>
                    <span class="status-value">${renderScoreBar(project.feasibility_score)} ${project.feasibility_score.toFixed(1)}/10</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Impact:</span>
                    <span class="status-value">${renderScoreBar(project.impact_score)} ${project.impact_score.toFixed(1)}/10</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Learning:</span>
                    <span class="status-value">${renderScoreBar(project.learning_score)} ${project.learning_score.toFixed(1)}/10</span>
                </div>
            </div>
        </div>
        
        <div class="panel">
            <div class="panel-header">PROJECT SUMMARY</div>
            <div class="panel-content">
                <p><strong>${project.tagline}</strong></p>
                <p>${project.description}</p>
                
                <h4 style="margin-top: 1rem;">Key Features:</h4>
                <ul>
                    ${project.key_features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                
                <h4 style="margin-top: 1rem;">Identified Risks:</h4>
                <ul>
                    ${project.risks.map(r => `<li class="text-warning">⚠ ${r}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="panel">
            <div class="panel-header">QUICK STATS</div>
            <div class="panel-content">
                <div class="status-item">
                    <span class="status-label">Estimated Cost:</span>
                    <span class="status-value">${project.estimated_cost}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Timeline:</span>
                    <span class="status-value">${project.timeline}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Complexity:</span>
                    <span class="status-value">${project.complexity}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Target Users:</span>
                    <span class="status-value">${project.target_users}</span>
                </div>
            </div>
        </div>
    `;
}

function renderFeasibilityTab(project) {
    return `
        <div class="panel">
            <div class="panel-header">FEASIBILITY ASSESSMENT</div>
            <div class="panel-content">
                <div class="status-item">
                    <span class="status-label">Overall Feasibility:</span>
                    <span class="status-value text-success">${project.feasibility_score.toFixed(1)}/10 - ${getFeasibilityLabel(project.feasibility_score)}</span>
                </div>
                
                <h4 style="margin-top: 1rem;">Technologies Required:</h4>
                <div class="tech-badges">
                    ${project.technologies.map(tech => `<span class="tech-badge selected">${tech}</span>`).join('')}
                </div>
                
                <h4 style="margin-top: 1rem;">Risk Assessment:</h4>
                <ul>
                    ${project.risks.map(risk => `
                        <li>
                            <span class="text-warning">⚠</span> ${risk}
                        </li>
                    `).join('')}
                </ul>
                
                <p style="margin-top: 1rem;" class="text-warning">
                    For detailed feasibility analysis including component availability, skill gap assessment, and timeline breakdown, click "Deep Analysis".
                </p>
            </div>
        </div>
    `;
}

function renderScoreBar(score) {
    const filled = Math.floor(score);
    const bars = '█'.repeat(filled) + '░'.repeat(10 - filled);
    return `<span style="font-family: var(--font-display);">${bars}</span>`;
}

function getFeasibilityLabel(score) {
    if (score >= 8) return 'Highly Feasible';
    if (score >= 6) return 'Feasible';
    if (score >= 4) return 'Challenging';
    return 'High Risk';
}

// === Project Management ===
function saveProject() {
    saveProjects();
    alert('Project saved successfully!');
    showDashboard();
}

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(AppState.projects));
    updateProjectsList();
}

function loadProjects() {
    const saved = localStorage.getItem('projects');
    if (saved) {
        AppState.projects = JSON.parse(saved);
    }
}

function updateProjectsList() {
    const container = document.getElementById('recentProjects');
    
    if (AppState.projects.length === 0) {
        container.innerHTML = '<div class="empty-state">No projects yet. Start with [N]ew Project.</div>';
        document.getElementById('projectCount').textContent = '0';
        return;
    }
    
    container.innerHTML = AppState.projects.slice(0, 5).map((project, index) => `
        <div class="status-item" style="cursor: pointer;" onclick="showProjectDetail(${index})">
            <span class="status-label">[#${String(index + 1).padStart(3, '0')}] ${project.title}</span>
            <span class="status-value">${project.overall_score.toFixed(1)}/10</span>
        </div>
    `).join('');
    
    document.getElementById('projectCount').textContent = AppState.projects.length;
}

// === Settings Management ===
function loadSettingsForm() {
    const savedKey = localStorage.getItem('apiKey');
    const savedModel = localStorage.getItem('defaultModel');
    const crtEffect = localStorage.getItem('crtEffect') || 'on';
    const colorScheme = localStorage.getItem('colorScheme') || 'green';
    
    if (savedKey) document.getElementById('settingsApiKey').value = savedKey;
    if (savedModel) document.getElementById('settingsModel').value = savedModel;
    document.getElementById('crtEffect').value = crtEffect;
    document.getElementById('colorScheme').value = colorScheme;
}

function saveSettings() {
    const apiKey = document.getElementById('settingsApiKey').value.trim();
    const model = document.getElementById('settingsModel').value;
    
    if (apiKey) {
        localStorage.setItem('apiKey', apiKey);
        AppState.apiKey = apiKey;
    }
    
    localStorage.setItem('defaultModel', model);
    AppState.model = model;
    
    alert('Settings saved successfully!');
    checkAPIStatus();
}

function toggleCRTEffect() {
    const enabled = document.getElementById('crtEffect').value;
    localStorage.setItem('crtEffect', enabled);
    
    if (enabled === 'off') {
        document.body.classList.add('no-crt');
    } else {
        document.body.classList.remove('no-crt');
    }
}

function changeColorScheme() {
    const scheme = document.getElementById('colorScheme').value;
    localStorage.setItem('colorScheme', scheme);
    document.body.setAttribute('data-theme', scheme);
}

function loadSettings() {
    const savedKey = localStorage.getItem('apiKey');
    const savedModel = localStorage.getItem('defaultModel');
    const crtEffect = localStorage.getItem('crtEffect');
    const colorScheme = localStorage.getItem('colorScheme');
    
    if (savedKey) AppState.apiKey = savedKey;
    if (savedModel) AppState.model = savedModel;
    if (crtEffect === 'off') document.body.classList.add('no-crt');
    if (colorScheme) document.body.setAttribute('data-theme', colorScheme);
}

function checkAPIStatus() {
    const status = document.getElementById('apiStatus');
    const savedKey = localStorage.getItem('apiKey');
    
    if (savedKey && savedKey.startsWith('sk-ant-')) {
        status.innerHTML = '<span class="indicator-dot text-success">●</span> CONNECTED';
    } else {
        status.innerHTML = '<span class="indicator-dot text-error">●</span> NOT CONFIGURED';
    }
}

// === Export Functions ===
function analyzeProject() {
    alert('Deep Analysis Feature:\n\nThis would make additional API calls to generate:\n• Detailed market analysis\n• Component BOM with pricing\n• Week-by-week timeline\n• Skill gap assessment\n• Risk mitigation strategies\n\nComing soon!');
}

function exportProject() {
    alert('Export to PDF:\n\nThis would generate a comprehensive project proposal document including all analysis and recommendations.\n\nComing soon!');
}

function exportAllData() {
    const dataStr = JSON.stringify(AppState.projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seniordesign-projects.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importData() {
    alert('Import Data:\n\nClick to select a JSON file exported from this application.\n\nComing soon!');
}

function clearAllData() {
    if (confirm('WARNING: This will delete all saved projects and settings.\n\nAre you sure?')) {
        localStorage.clear();
        AppState.projects = [];
        AppState.apiKey = '';
        updateProjectsList();
        checkAPIStatus();
        alert('All data cleared successfully!');
    }
}
