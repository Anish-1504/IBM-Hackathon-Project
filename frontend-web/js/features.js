// Shared feature page logic
const FEATURE_SAMPLES = {
    security: `diff --git a/api.js b/api.js
--- a/api.js
+++ b/api.js
@@ -1,5 +1,6 @@
 const db = require('db');
-function getUser(id) {
-  return db.execute("SELECT * FROM users WHERE id = " + id);
+function getUser(id) {
+  const password = "admin123secret";
+  return db.execute("SELECT * FROM users WHERE id = " + id);
 }`,
    performance: `diff --git a/utils.js b/utils.js
--- a/utils.js
+++ b/utils.js
@@ -1,8 +1,12 @@
 function processItems(items) {
-  for (let i = 0; i < items.length; i++) {
-    for (let j = 0; j < items.length; j++) {
-      if (items[i].id === items[j].parentId) {
-        items[i].children.push(items[j]);
-      }
-    }
+  const map = new Map(items.map(x => [x.id, x]));
+  return items.filter(item => {
+    const parent = map.get(item.parentId);
+    if (parent) parent.children = parent.children || [];
+    return !item.parentId;
+  });
 }`,
    quality: `diff --git a/app.js b/app.js
--- a/app.js
+++ b/app.js
@@ -1,6 +1,8 @@
-function calc(x,y){
-  var r=x+y
-  return r
+function calculateTotal(price, taxRate) {
+  if (typeof price !== 'number' || typeof taxRate !== 'number') {
+    throw new Error('Invalid input');
+  }
+  return price * (1 + taxRate);
 }`,
    ai: `diff --git a/auth.js b/auth.js
--- a/auth.js
+++ b/auth.js
@@ -10,7 +10,7 @@ async function login(email, password) {
   const user = await User.findByEmail(email);
   if (!user) throw new Error('Not found');
-  return jwt.sign({ id: user.id });
+  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
 }`,
    fast: `diff --git a/hello.js b/hello.js
--- a/hello.js
+++ b/hello.js
@@ -1,3 +1,4 @@
-console.log("hello")
+export function greet(name) {
+  return \`Hello, \${name}!\`;
+}`
};

const FEATURE_META = {
    'ai-analysis': { sample: 'ai', focus: 'all', title: 'AI-Powered Analysis' },
    'security-scanning': { sample: 'security', focus: 'security', title: 'Security Scanning' },
    'performance-insights': { sample: 'performance', focus: 'performance', title: 'Performance Insights' },
    'code-quality': { sample: 'quality', focus: 'quality', title: 'Code Quality' },
    'fast-reviews': { sample: 'fast', focus: 'all', title: 'Fast Reviews' },
    'team-collaboration': { sample: 'ai', focus: 'team', title: 'Team Collaboration' }
};

function initFeaturePage(featureId) {
    const meta = FEATURE_META[featureId];
    if (!meta) return;

    initPublicNav('features');

    const sampleEl = document.getElementById('sampleCode');
    if (sampleEl && FEATURE_SAMPLES[meta.sample]) {
        sampleEl.value = FEATURE_SAMPLES[meta.sample];
    }

    document.getElementById('runDemoBtn')?.addEventListener('click', () => runFeatureDemo(featureId));
    document.getElementById('loadSampleBtn')?.addEventListener('click', () => {
        if (sampleEl && FEATURE_SAMPLES[meta.sample]) {
            sampleEl.value = FEATURE_SAMPLES[meta.sample];
        }
    });
    document.getElementById('goToReviewBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        goToFullReview(featureId);
    });
    document.getElementById('copyShareBtn')?.addEventListener('click', copyShareLink);

    updateFeatureCta();

    if (featureId === 'fast-reviews') {
        initFastReviewTimer();
    }

    if (featureId === 'team-collaboration') {
        if (Auth.isAuthenticated()) {
            loadTeamActivity();
            const teamPanel = document.getElementById('yourReviewsPanel');
            if (teamPanel) teamPanel.style.display = 'none';
        }
    } else if (Auth.isAuthenticated() && document.getElementById('userInsights')) {
        loadUserInsights(featureId);
    }
}

function updateFeatureCta() {
    const loginBtn = document.getElementById('featureLoginBtn');
    const reviewBtn = document.getElementById('featureReviewBtn');
    if (Auth.isAuthenticated()) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (reviewBtn) reviewBtn.style.display = 'inline-flex';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (reviewBtn) reviewBtn.style.display = 'none';
    }
}

async function runFeatureDemo(featureId) {
    const meta = FEATURE_META[featureId];
    const code = document.getElementById('sampleCode')?.value.trim();
    const resultsEl = document.getElementById('demoResults');
    const btn = document.getElementById('runDemoBtn');

    if (!code) {
        alert('Please paste or load sample code first.');
        return;
    }

    if (btn) setLoading('runDemoBtn', true);

    try {
        let result;

        if (Auth.isAuthenticated()) {
            result = await API.analyzeCode({
                prDiff: code,
                prTitle: `${meta.title} Demo`
            });
        } else {
            result = runOfflineDemo(code, meta.focus);
        }

        displayFeatureResults(result, meta.focus);
        if (resultsEl) {
            resultsEl.classList.add('visible');
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        if (featureId === 'fast-reviews' && result._durationMs !== undefined) {
            document.getElementById('timerValue').textContent = `${(result._durationMs / 1000).toFixed(1)}s`;
        }
    } catch (error) {
        console.error('Demo error:', error);
        alert(error.message || 'Demo analysis failed. Try logging in for full analysis.');
    } finally {
        if (btn) setLoading('runDemoBtn', false);
    }
}

function runOfflineDemo(code, focus) {
    const issues = [];
    const suggestions = [];

    if (/execute\s*\(.*\+|password\s*=\s*['"][^'"]+['"]|innerHTML\s*=/.test(code)) {
        issues.push({ type: 'security', severity: 'critical', description: 'Potential security vulnerability detected' });
        suggestions.push({ title: 'Use parameterized queries', description: 'Never concatenate user input into SQL or HTML.' });
    }
    if (/for\s*\([^)]*for\s*\(/.test(code)) {
        issues.push({ type: 'performance', severity: 'medium', description: 'Nested loops may cause performance issues on large datasets' });
        suggestions.push({ title: 'Optimize loops', description: 'Consider using hash maps or single-pass algorithms.' });
    }
    if (/var\s+\w+|function\s*\w+\s*\([^)]*\)\s*\{[^}]*\}/.test(code) && !/const |let /.test(code)) {
        issues.push({ type: 'code_quality', severity: 'low', description: 'Consider modern variable declarations and explicit return types' });
    }

    const securityScore = issues.some(i => i.type === 'security') ? 45 : 88;
    const perfScore = issues.some(i => i.type === 'performance') ? 62 : 85;
    const qualityScore = 78;

    return {
        overallScore: Math.round((securityScore + perfScore + qualityScore) / 3),
        _durationMs: 1200 + Math.random() * 800,
        analysis: {
            categories: {
                code_quality: { score: qualityScore, feedback: 'Style and maintainability check' },
                security: { score: securityScore, feedback: issues.length ? 'Security concerns found' : 'No obvious security issues' },
                maintainability: { score: perfScore, feedback: 'Structure and performance patterns reviewed' }
            },
            issues: filterIssuesByFocus(issues, focus),
            suggestions: filterSuggestionsByFocus(suggestions, focus, focus)
        }
    };
}

function filterIssuesByFocus(issues, focus) {
    if (focus === 'all' || focus === 'team') return issues;
    if (focus === 'security') return issues.filter(i => i.type === 'security');
    if (focus === 'performance') return issues.filter(i => i.type === 'performance');
    if (focus === 'quality') return issues.filter(i => i.type === 'code_quality' || i.severity === 'low');
    return issues;
}

function filterSuggestionsByFocus(suggestions, focus) {
    return suggestions;
}

function displayFeatureResults(result, focus) {
    const analysis = result.analysis || {};
    const overall = result.overallScore ?? 0;

    const overallEl = document.getElementById('demoOverallScore');
    if (overallEl) overallEl.textContent = Math.round(overall);

    const metricsEl = document.getElementById('demoMetrics');
    if (metricsEl && analysis.categories) {
        metricsEl.innerHTML = Object.entries(analysis.categories).map(([key, val]) => `
            <div class="metric-box">
                <div class="value">${val.score}</div>
                <div class="label">${key.replace(/_/g, ' ')}</div>
            </div>
        `).join('');
    }

    const issuesEl = document.getElementById('demoIssues');
    const issues = filterIssuesByFocus(analysis.issues || [], focus);
    if (issuesEl) {
        if (issues.length === 0) {
            issuesEl.innerHTML = '<p style="color: var(--success-color);"><i class="fas fa-check-circle"></i> No issues found in this scan.</p>';
        } else {
            issuesEl.innerHTML = issues.map(i => `
                <span class="issue-pill ${i.severity}">
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>${i.type}</strong>: ${escapeHtml(i.description)}
                </span>
            `).join('');
        }
    }

    const sugEl = document.getElementById('demoSuggestions');
    if (sugEl && analysis.suggestions?.length) {
        sugEl.innerHTML = '<ul class="benefit-list">' + analysis.suggestions.map(s =>
            `<li><strong>${escapeHtml(s.title)}:</strong> ${escapeHtml(s.description)}</li>`
        ).join('') + '</ul>';
    } else if (sugEl) {
        sugEl.innerHTML = '<p class="text-muted">Run analysis to see recommendations.</p>';
    }

    if (result.id) {
        const linkEl = document.getElementById('demoReviewLink');
        if (linkEl) {
            linkEl.href = `review-detail.html?id=${result.id}`;
            linkEl.style.display = 'inline-flex';
        }
    }
}

async function loadUserInsights(featureId) {
    const container = document.getElementById('userInsights');
    if (!container) return;

    try {
        const response = await API.getReviews({ limit: 10 });
        const reviews = response.reviews || [];

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-muted">No reviews yet. Run a demo or create a full review.</p>';
            return;
        }

        container.innerHTML = reviews.slice(0, 5).map(r => {
            const score = Math.round(r.overallScore || 0);
            return `
                <div class="activity-item" onclick="viewReview('${r.id}')">
                    <strong>${escapeHtml(r.prTitle || 'Code Review')}</strong>
                    <span style="float:right;color:${getScoreColor(score)}">${score}/100</span>
                    <p class="text-muted" style="margin:0.25rem 0 0;font-size:0.85rem">${formatDate(r.createdAt)}</p>
                </div>
            `;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="text-muted">Could not load your reviews.</p>';
    }
}

async function loadTeamActivity() {
    const container = document.getElementById('teamActivity');
    if (!container || !Auth.isAuthenticated()) return;

    try {
        const response = await API.getReviews({ limit: 8 });
        const reviews = response.reviews || [];

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-muted">No team reviews yet. Run a demo to get started.</p>';
            return;
        }

        container.innerHTML = reviews.map(r => {
            const score = Math.round(r.overallScore || 0);
            return `
                <div class="activity-item" onclick="viewReview('${r.id}')">
                    <strong>${escapeHtml(r.prTitle || 'Code Review')}</strong>
                    <span style="float:right;color:${getScoreColor(score)}">${score}/100</span>
                    <p class="text-muted" style="margin:0.25rem 0 0;font-size:0.85rem">${formatDate(r.createdAt)}</p>
                </div>
            `;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="text-muted">Could not load activity feed.</p>';
    }
}

function initFastReviewTimer() {
    const el = document.getElementById('timerValue');
    if (el) el.textContent = '< 3s';
}

function goToFullReview(featureId) {
    const code = document.getElementById('sampleCode')?.value || '';
    if (Auth.isAuthenticated()) {
        sessionStorage.setItem('pendingReviewDiff', code);
        window.location.href = 'review.html';
    } else {
        sessionStorage.setItem('pendingReviewDiff', code);
        window.location.href = 'login.html?redirect=review.html';
    }
}

function copyShareLink() {
    const input = document.getElementById('shareLink');
    if (!input) return;
    input.select();
    navigator.clipboard?.writeText(input.value).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        document.execCommand('copy');
        alert('Link copied!');
    });
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text || '';
    return d.innerHTML;
}
