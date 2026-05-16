// Dashboard page functionality
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.requireAuth()) return;
    initAppNav('dashboard');

    const user = Auth.getUser();
    const userNameEl = document.getElementById('userName');
    if (userNameEl && user) {
        userNameEl.textContent = user.fullName || user.username || user.email;
    }

    await loadDashboardData();
    await loadRecentReviews();
});

async function loadDashboardData() {
    try {
        const stats = await API.getReviewStats();

        // Update stats cards
        document.getElementById('totalReviews').textContent = stats.totalReviews || 0;
        document.getElementById('avgScore').textContent = (stats.averageScore || 0).toFixed(1);
        
        // Calculate this week's reviews (mock for now)
        const thisWeek = Math.min(stats.totalReviews, Math.floor(stats.totalReviews * 0.3));
        document.getElementById('thisWeek').textContent = thisWeek;
        
        // Calculate improvement (mock for now)
        const improvement = stats.averageScore > 70 ? '+15%' : '+5%';
        document.getElementById('improvement').textContent = improvement;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showError('dashboardError', 'Failed to load dashboard statistics');
    }
}

async function loadRecentReviews() {
    const container = document.getElementById('recentReviewsContainer');
    
    try {
        const response = await API.getReviews({ limit: 5, offset: 0 });
        const reviews = response.reviews || [];

        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>No reviews yet. Start by analyzing your first pull request!</p>
                    <a href="review.html" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i>
                        Create First Review
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = reviews.map(review => createReviewCard(review)).join('');

    } catch (error) {
        console.error('Error loading recent reviews:', error);
        container.innerHTML = `
            <div class="error-message">
                Failed to load recent reviews. Please try again later.
            </div>
        `;
    }
}

function createReviewCard(review) {
    const score = review.overallScore || 0;
    const scoreColor = getScoreColor(score);
    const scoreLabel = getScoreLabel(score);
    const date = formatDate(review.createdAt);
    const title = review.prTitle || `Review #${review.id.substring(0, 8)}`;

    return `
        <div class="review-card" style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;" onclick="viewReview('${review.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 0.5rem 0; color: #212529;">
                        <i class="fas fa-code-branch" style="color: #0066cc;"></i>
                        ${title}
                    </h3>
                    <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">
                        <i class="fas fa-clock"></i>
                        ${date}
                    </p>
                </div>
                <div style="text-align: center; min-width: 80px;">
                    <div style="font-size: 2rem; font-weight: bold; color: ${scoreColor};">
                        ${score}
                    </div>
                    <div style="font-size: 0.8rem; color: #6c757d;">
                        ${scoreLabel}
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                ${review.analysis && review.analysis.categories ? Object.entries(review.analysis.categories).slice(0, 3).map(([key, value]) => `
                    <div style="flex: 1; min-width: 100px;">
                        <div style="font-size: 0.8rem; color: #6c757d; text-transform: capitalize;">
                            ${key.replace(/_/g, ' ')}
                        </div>
                        <div style="font-weight: 500; color: ${getScoreColor(value.score)};">
                            ${value.score}/100
                        </div>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `;
}

// Made with Bob
