// Review detail page
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.requireAuth()) return;
    initAppNav('reviews');

    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    if (!reviewId) {
        window.location.href = 'reviews.html';
        return;
    }

    await loadReviewDetail(reviewId);

    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.location.href = 'reviews.html';
    });

    document.getElementById('newReviewBtn')?.addEventListener('click', () => {
        window.location.href = 'review.html';
    });
});

async function loadReviewDetail(reviewId) {
    const loadingEl = document.getElementById('loadingState');
    const contentEl = document.getElementById('detailContent');
    const errorEl = document.getElementById('detailError');

    try {
        const result = await API.getReview(reviewId);

        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'block';

        const metaEl = document.getElementById('reviewMeta');
        if (metaEl) {
            const title = result.prTitle || `Review #${reviewId.substring(0, 8)}`;
            metaEl.innerHTML = `
                <h1><i class="fas fa-file-code"></i> ${escapeHtml(title)}</h1>
                <p class="text-muted"><i class="fas fa-clock"></i> ${formatDate(result.createdAt)}</p>
                ${result.prNumber ? `<p class="text-muted"><i class="fas fa-hashtag"></i> PR #${result.prNumber}</p>` : ''}
            `;
        }

        displayResults(result);

        const diffEl = document.getElementById('reviewDiff');
        if (diffEl && result.prDiff) {
            diffEl.textContent = result.prDiff;
            document.querySelector('.diff-section')?.style.setProperty('display', 'block');
        }

        setupActionButtons(result);

        const deleteBtn = document.getElementById('deleteReviewBtn');
        if (deleteBtn) {
            deleteBtn.onclick = async () => {
                if (!confirm('Delete this review permanently?')) return;
                try {
                    await API.deleteReview(reviewId);
                    window.location.href = 'reviews.html';
                } catch (error) {
                    alert(error.message || 'Failed to delete review');
                }
            };
        }
    } catch (error) {
        console.error('Error loading review:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'none';
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.textContent = error.message || 'Review not found';
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
