# SENIORDESIGN.SYS - Project Structure

## 📁 Complete File List

```
senior-design/
├── index.html          # Main application (Terminal UI)
├── styles.css          # Retro CRT styling
├── app.js              # Application logic & AI integration
├── favicon.svg         # Browser tab icon
├── README.md           # Complete documentation
├── DEPLOYMENT.md       # GitHub Pages deployment guide
├── LICENSE             # MIT License
├── .gitignore          # Git ignore rules
└── PROJECT_STRUCTURE.md # This file
```

## 🎯 What Each File Does

### Core Application Files (Required)

**index.html** (437 lines)
- Main application structure
- Terminal-inspired layout
- Multi-view navigation (Dashboard, Wizard, Detail, Settings)
- Boot sequence animation
- All UI components and forms

**styles.css** (824 lines)  
- Complete retro CRT aesthetic
- Three color schemes (Green, Amber, White)
- CRT effects (scanlines, glow, flicker)
- Responsive design
- Custom scrollbars and form elements
- Terminal-style components

**app.js** (695 lines)
- Application state management
- Navigation and routing
- Wizard workflow (3 steps)
- Claude AI integration
- Project scoring algorithm
- localStorage persistence
- Settings management
- Keyboard shortcuts

### Documentation Files (Recommended)

**README.md**
- Complete user guide
- Feature overview
- Installation instructions
- Usage walkthrough
- Troubleshooting guide
- Configuration options

**DEPLOYMENT.md**
- Step-by-step GitHub Pages setup
- Alternative hosting options
- Custom domain configuration
- Common deployment issues
- Performance optimization tips

**PROJECT_STRUCTURE.md** (This file)
- File organization
- Architecture overview
- Extension guidelines

### Supporting Files

**favicon.svg**
- Terminal/CPU icon for browser tab
- SVG format (scales perfectly)
- Matches retro aesthetic

**LICENSE**
- MIT License (very permissive)
- Free for personal and commercial use

**.gitignore**
- Prevents committing sensitive files
- Excludes OS and editor files
- Standard for Git projects

## 🏗️ Architecture Overview

### Frontend Stack

```
┌─────────────────────────────────────┐
│         User Interface              │
│  (HTML + CSS - Retro Terminal)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Application Logic              │
│  (Vanilla JavaScript)               │
│  • State Management                 │
│  • View Routing                     │
│  • Form Handling                    │
│  • Data Validation                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      AI Integration Layer           │
│  (Claude API via Fetch)             │
│  • Prompt Construction              │
│  • Response Parsing                 │
│  • Error Handling                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Data Persistence               │
│  (Browser localStorage)             │
│  • Projects                         │
│  • Settings                         │
│  • API Keys                         │
└─────────────────────────────────────┘
```

### Application Flow

```
START
  ↓
[Boot Sequence] (First visit only)
  ↓
[Dashboard View]
  ├─ Recent Projects List
  ├─ System Status
  └─ Menu Options
        ↓
[New Project Wizard]
  ├─ Step 1: API Configuration
  ├─ Step 2: Project Constraints
  └─ Step 3: Idea Generation
        ↓
[Project Detail View]
  ├─ Overview Tab
  ├─ Market Tab
  ├─ Feasibility Tab
  ├─ Components Tab
  └─ Timeline Tab
        ↓
[Save & Export]
  ↓
END
```

### View System

**Dashboard** (`#dashboardView`)
- Main menu
- Recent projects
- System status
- Quick actions

**Wizard** (`#wizardView`)
- 3-step process
- API setup → Constraints → Generation
- Progress indicators
- Form validation

**Detail** (`#detailView`)
- Tabbed interface
- 5 analysis tabs
- Action buttons
- Export options

**Settings** (`#settingsView`)
- API configuration
- Display preferences
- Data management

## 🔧 Extension Guidelines

### Adding New Features

**1. Add New View**

In `index.html`:
```html
<div id="newFeatureView" class="view">
    <div class="view-header">
        <h2>NEW FEATURE</h2>
        <button class="back-btn" onclick="showDashboard()">← BACK [ESC]</button>
    </div>
    <!-- Content here -->
</div>
```

In `app.js`:
```javascript
function showNewFeature() {
    showView('newFeature');
}
```

**2. Add Menu Item**

In `index.html` dashboard menu:
```html
<button class="menu-btn" onclick="showNewFeature()">
    <span class="menu-key">[F]</span> NEW FEATURE
</button>
```

**3. Add Keyboard Shortcut**

In `app.js` → `setupKeyboardShortcuts()`:
```javascript
if (e.key === 'f' || e.key === 'F') showNewFeature();
```

### Styling New Components

**Use Existing CSS Classes:**
```css
.panel           /* Content containers */
.panel-header    /* Section headers */
.form-group      /* Form elements */
.btn-primary     /* Primary actions */
.btn-secondary   /* Secondary actions */
.tech-badge      /* Tag-style buttons */
.status-item     /* Key-value pairs */
```

**Follow Color Variables:**
```css
var(--primary-color)   /* Main accent */
var(--bg-dark)         /* Background */
var(--border-color)    /* Borders */
var(--text-color)      /* Text */
var(--glow)            /* Glow effects */
```

### Adding New AI Prompts

Create prompt builder function:
```javascript
function buildNewAnalysisPrompt(params) {
    return `You are a [role description].
    
Analyze this project: ${params.projectTitle}

[Specific instructions]

Return structured JSON:
{
    "field1": "value",
    "field2": "value"
}`;
}
```

Call API:
```javascript
async function runNewAnalysis() {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': AppState.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: AppState.model,
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    
    const data = await response.json();
    // Parse and display results
}
```

## 📊 Data Models

### Project Object
```javascript
{
    id: 1234567890,               // Timestamp
    title: "Project Title",
    tagline: "Short description",
    description: "Full description",
    target_users: "User personas",
    innovation_score: 8.0,
    feasibility_score: 7.5,
    impact_score: 8.0,
    learning_score: 7.0,
    overall_score: 7.8,
    technologies: ["Tech1", "Tech2"],
    estimated_cost: "$500",
    timeline: "2 semesters",
    complexity: "Intermediate",
    key_features: ["Feature 1", "Feature 2"],
    risks: ["Risk 1", "Risk 2"],
    timestamp: "2026-02-01T12:00:00Z",
    constraints: {
        teamSize: 3,
        duration: 2,
        budget: "$200 - $500",
        complexity: "Intermediate",
        hwSwRatio: 50,
        technologies: ["AI/ML", "IoT"]
    }
}
```

### App State
```javascript
{
    apiKey: "",                    // User's API key
    model: "claude-sonnet-4-...",  // Selected model
    currentView: "dashboard",      // Active view
    currentWizardStep: 1,          // Wizard progress
    currentProject: null,          // Selected project
    projects: [],                  // All projects
    selectedTechnologies: [],      // Wizard selections
    settings: {
        crtEffect: true,
        colorScheme: "green"
    }
}
```

## 🚀 Performance

### Current Metrics
- **Initial Load**: < 1s (no build process)
- **Bundle Size**: ~50KB total (HTML+CSS+JS)
- **Dependencies**: 0 npm packages
- **API Latency**: 2-5s (Claude API response time)

### Optimization Tips

**Already Optimized:**
- ✅ Vanilla JS (no framework overhead)
- ✅ Minimal CSS (no Tailwind/Bootstrap)
- ✅ Local fonts (Google Fonts cached)
- ✅ localStorage (no database calls)
- ✅ Single page app (no reloads)

**Future Optimizations:**
- Lazy load analysis tabs
- Cache AI responses for 24h
- Compress localStorage data
- Add service worker for offline use

## 🔒 Security

### Current Implementation

**API Key Storage:**
- Stored in localStorage (browser-only)
- Never sent to any server except Anthropic
- User-managed (enter/clear themselves)

**Data Privacy:**
- All data stored locally
- No server-side tracking
- No cookies
- No analytics (unless you add)

**Best Practices:**
- ✅ HTTPS required (GitHub Pages enforces)
- ✅ No hardcoded secrets
- ✅ Input validation
- ✅ Error handling

## 📈 Future Roadmap

### Phase 1: Core Features (Done ✅)
- [x] Multi-step wizard
- [x] AI idea generation
- [x] Multi-criteria scoring
- [x] Project detail views
- [x] Settings management
- [x] Retro terminal UI

### Phase 2: Enhanced Analysis
- [ ] Deep market analysis (additional API calls)
- [ ] Component BOM generator
- [ ] Sprint planning timeline
- [ ] Risk mitigation strategies
- [ ] Skill gap assessment

### Phase 3: Collaboration
- [ ] Side-by-side project comparison
- [ ] PDF proposal export
- [ ] Share project via URL
- [ ] Team formation assistant
- [ ] Professor review checklist

### Phase 4: Advanced Features
- [ ] Alumni project database
- [ ] Lab equipment checker
- [ ] Code starter pack generator
- [ ] Industry mentor matching
- [ ] Patent prior art search

## 🤝 Contributing

### How to Extend

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-analysis`
3. **Make changes** following style guide
4. **Test thoroughly** in multiple browsers
5. **Commit**: `git commit -m "Add new analysis feature"`
6. **Push**: `git push origin feature/new-analysis`
7. **Create Pull Request**

### Style Guide

**JavaScript:**
- Use `const` and `let`, no `var`
- Descriptive function names
- Comment complex logic
- Handle errors gracefully

**CSS:**
- Use CSS variables for colors
- Follow BEM-like naming
- Mobile-first responsive
- Maintain retro aesthetic

**HTML:**
- Semantic elements
- Accessible forms (labels, ARIA)
- Consistent class naming
- Keyboard navigation support

## 📚 Learning Resources

### Technologies Used
- **Vanilla JavaScript**: https://javascript.info/
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **localStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Claude API**: https://docs.anthropic.com/

### Design Inspiration
- VT100 Terminal: https://vt100.net/
- DOS Aesthetics: https://int10h.org/oldschool-pc-fonts/
- CRT Effects: https://aleclownes.com/2017/02/01/crt-display.html

---

## 🎓 For Developers

This codebase is intentionally educational:

- **No frameworks** - Pure understanding of web fundamentals
- **Well-commented** - Learn from inline documentation
- **Modular** - Easy to understand each piece
- **Extensible** - Clear patterns for adding features

Perfect for:
- Learning vanilla JavaScript
- Understanding API integration
- Studying prompt engineering
- Building portfolio projects

---

**Questions?** Check README.md or create an issue on GitHub.

**Want to contribute?** We welcome improvements and new features!

*SENIORDESIGN.SYS v2.1 - Built with ❤️ for Computer Engineering Students*
