// Review page functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireAuth()) return;
    initAppNav('review');

    const pendingDiff = sessionStorage.getItem('pendingReviewDiff');
    if (pendingDiff) {
        const prDiffEl = document.getElementById('prDiff');
        if (prDiffEl) prDiffEl.value = pendingDiff;
        sessionStorage.removeItem('pendingReviewDiff');
    }

    const reviewForm = document.getElementById('reviewForm');
    const clearBtn = document.getElementById('clearBtn');
    const newReviewBtn = document.getElementById('newReviewBtn');
    const resultsSection = document.getElementById('resultsSection');

    // Handle form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await analyzeCode();
        });
    }

    // Handle clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the form?')) {
                reviewForm.reset();
            }
        });
    }

    // Handle new review button
    if (newReviewBtn) {
        newReviewBtn.addEventListener('click', () => {
            if (reviewForm) {
                reviewForm.reset();
                reviewForm.style.display = 'block';
            }
            if (resultsSection) resultsSection.style.display = 'none';
        });
    }
});

async function analyzeCode() {
    const prDiff = document.getElementById('prDiff').value.trim();
    const prTitle = document.getElementById('prTitle').value.trim();
    const prNumber = document.getElementById('prNumber').value;

    if (!prDiff) {
        showError('reviewError', 'Please provide code diff');
        return;
    }

    try {
        setLoading('analyzeBtn', true);

        const reviewData = {
            prDiff,
            prTitle: prTitle || undefined,
            prNumber: prNumber ? parseInt(prNumber) : undefined
        };

        const result = await API.analyzeCode(reviewData);

        const form = document.getElementById('reviewForm');
        if (form) form.style.display = 'none';
        displayResults(result);

    } catch (error) {
        console.error('Analysis error:', error);
        showError('reviewError', error.message || 'Analysis failed. Please try again.');
    } finally {
        setLoading('analyzeBtn', false);
    }
}

function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const analysis = result.analysis || {};
    const overallScore = result.overallScore || 0;

    // Update overall score
    document.getElementById('overallScore').textContent = Math.round(overallScore);
    document.getElementById('scoreLabel').textContent = getScoreLabel(overallScore);
    
    // Update score card color
    const scoreCard = document.querySelector('.score-card');
    if (scoreCard) {
        scoreCard.style.background = `linear-gradient(135deg, ${getScoreColor(overallScore)} 0%, ${getScoreColor(overallScore)}dd 100%)`;
    }

    // Display category scores
    displayCategoryScores(analysis.categories || {});

    // Display issues
    displayIssues(analysis.issues || []);

    // Display suggestions
    displaySuggestions(analysis.suggestions || []);

    // Store review ID for later use
    if (result.id) {
        resultsSection.dataset.reviewId = result.id;
    }

    // Show results section
    resultsSection.style.display = 'block';

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Setup action buttons
    setupActionButtons(result);
}

function displayCategoryScores(categories) {
    const container = document.getElementById('categoryScores');
    
    if (Object.keys(categories).length === 0) {
        container.innerHTML = '<p style="color: #6c757d;">No category scores available</p>';
        return;
    }

    container.innerHTML = Object.entries(categories).map(([key, value]) => {
        const score = value.score || 0;
        const color = getScoreColor(score);
        const name = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return `
            <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: #212529;">${name}</strong>
                    <span style="font-size: 1.2rem; font-weight: bold; color: ${color};">${score}/100</span>
                </div>
                <div style="height: 8px; background: #dee2e6; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${score}%; background: ${color}; transition: width 0.3s ease;"></div>
                </div>
                ${value.feedback ? `<p style="margin-top: 0.5rem; color: #6c757d; font-size: 0.9rem;">${value.feedback}</p>` : ''}
            </div>
        `;
    }).join('');
}

function displayIssues(issues) {
    const container = document.getElementById('issuesList');
    
    if (issues.length === 0) {
        container.innerHTML = '<p style="color: #28a745;"><i class="fas fa-check-circle"></i> No issues found! Great job!</p>';
        return;
    }

    const severityColors = {
        critical: '#dc3545',
        high: '#fd7e14',
        medium: '#ffc107',
        low: '#17a2b8'
    };

    const severityIcons = {
        critical: 'fa-exclamation-circle',
        high: 'fa-exclamation-triangle',
        medium: 'fa-info-circle',
        low: 'fa-lightbulb'
    };

    container.innerHTML = issues.map(issue => {
        const color = severityColors[issue.severity] || '#6c757d';
        const icon = severityIcons[issue.severity] || 'fa-circle';

        return `
            <div style="margin-bottom: 1rem; padding: 1rem; border-left: 4px solid ${color}; background: #f8f9fa; border-radius: 4px;">
                <div style="display: flex; align-items: start; gap: 0.5rem;">
                    <i class="fas ${icon}" style="color: ${color}; margin-top: 0.25rem;"></i>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <strong style="color: #212529;">${issue.type || 'Issue'}</strong>
                            <span style="background: ${color}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">
                                ${issue.severity}
                            </span>
                        </div>
                        <p style="margin: 0; color: #495057;">${issue.description}</p>
                        ${issue.line ? `<p style="margin: 0.5rem 0 0 0; color: #6c757d; font-size: 0.9rem;"><i class="fas fa-map-marker-alt"></i> Line ${issue.line}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function displaySuggestions(suggestions) {
    const container = document.getElementById('suggestionsList');
    
    if (suggestions.length === 0) {
        container.innerHTML = '<p style="color: #6c757d;">No additional suggestions</p>';
        return;
    }

    container.innerHTML = suggestions.map(suggestion => `
        <div style="margin-bottom: 1rem; padding: 1rem; background: #e7f3ff; border-left: 4px solid #0066cc; border-radius: 4px;">
            <div style="display: flex; align-items: start; gap: 0.5rem;">
                <i class="fas fa-lightbulb" style="color: #0066cc; margin-top: 0.25rem;"></i>
                <div style="flex: 1;">
                    <strong style="color: #212529; display: block; margin-bottom: 0.5rem;">${suggestion.title || 'Suggestion'}</strong>
                    <p style="margin: 0; color: #495057;">${suggestion.description}</p>
                    ${suggestion.example ? `
                        <pre style="margin-top: 0.5rem; padding: 0.5rem; background: white; border-radius: 4px; overflow-x: auto; font-size: 0.85rem;"><code>${escapeHtml(suggestion.example)}</code></pre>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function setupActionButtons(result) {
    const viewDetailsBtn = document.getElementById('viewDetailsBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');

    if (viewDetailsBtn && result.id) {
        viewDetailsBtn.onclick = () => {
            window.location.href = `review-detail.html?id=${result.id}`;
        };
    }

    if (downloadReportBtn) {
        downloadReportBtn.onclick = () => {
            downloadReport(result);
        };
    }
}

function downloadReport(result) {
    const report = generateReportText(result);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-${result.id || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateReportText(result) {
    const analysis = result.analysis || {};
    let report = '=== AI Code Review Report ===\n\n';
    report += `Overall Score: ${result.overallScore}/100\n`;
    report += `Date: ${new Date().toLocaleString()}\n\n`;

    if (result.prTitle) {
        report += `PR Title: ${result.prTitle}\n\n`;
    }

    report += '=== Category Scores ===\n';
    Object.entries(analysis.categories || {}).forEach(([key, value]) => {
        report += `${key}: ${value.score}/100\n`;
        if (value.feedback) {
            report += `  ${value.feedback}\n`;
        }
    });

    report += '\n=== Issues ===\n';
    (analysis.issues || []).forEach((issue, i) => {
        report += `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.type}\n`;
        report += `   ${issue.description}\n`;
        if (issue.line) {
            report += `   Line: ${issue.line}\n`;
        }
        report += '\n';
    });

    report += '=== Suggestions ===\n';
    (analysis.suggestions || []).forEach((suggestion, i) => {
        report += `${i + 1}. ${suggestion.title}\n`;
        report += `   ${suggestion.description}\n\n`;
    });

    return report;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Made with Bob
