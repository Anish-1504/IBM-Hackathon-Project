// Reviews list page
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.requireAuth()) return;
    initAppNav('reviews');

    await loadAllReviews();

    document.getElementById('newReviewBtn')?.addEventListener('click', () => {
        window.location.href = 'review.html';
    });
});

async function loadAllReviews() {
    const container = document.getElementById('reviewsContainer');
    const emptyState = document.getElementById('emptyState');

    try {
        const response = await API.getReviews({ limit: 50, offset: 0 });
        const reviews = response.reviews || [];

        if (reviews.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        container.innerHTML = reviews.map((review) => createReviewListItem(review)).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        container.innerHTML = `<div class="error-message">Failed to load reviews: ${escapeHtml(error.message)}</div>`;
    }
}


function createReviewListItem(review) {
    const score = review.overallScore || 0;
    const scoreColor = getScoreColor(score);
    const date = formatDate(review.createdAt);
    const title = review.prTitle || `Review #${review.id.substring(0, 8)}`;

    return `
        <div class="review-list-item">
            <div class="review-list-main" onclick="viewReview('${review.id}')">
                <h3><i class="fas fa-code-branch" style="color: #0066cc;"></i> ${escapeHtml(title)}</h3>
                <p class="text-muted"><i class="fas fa-clock"></i> ${date}</p>
            </div>
            <div class="review-list-actions">
                <span class="review-score" style="color: ${scoreColor};">${Math.round(score)}</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewReview('${review.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button type="button" class="btn btn-secondary btn-sm btn-danger-outline" onclick="event.stopPropagation(); deleteReview('${review.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

async function deleteReview(id) {
    if (!confirm('Delete this review permanently?')) return;

    try {
        await API.deleteReview(id);
        await loadAllReviews();
    } catch (error) {
        alert(error.message || 'Failed to delete review');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
