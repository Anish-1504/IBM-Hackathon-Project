// Profile / settings page
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.requireAuth()) return;
    initAppNav('profile');

    await loadProfile();

    document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProfile();
    });
});

async function loadProfile() {
    const user = Auth.getUser();
    const errorEl = document.getElementById('profileError');
    const successEl = document.getElementById('profileSuccess');

    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';

    if (user) {
        fillProfileForm(user);
    }

    try {
        const profile = await API.getProfile();
        fillProfileForm(profile);
        Auth.setUser(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        if (!user) {
            showError('profileError', error.message || 'Failed to load profile');
        }
    }
}

function fillProfileForm(user) {
    const emailEl = document.getElementById('email');
    const usernameEl = document.getElementById('username');
    const fullNameEl = document.getElementById('fullName');
    const githubTokenEl = document.getElementById('githubToken');
    const memberSinceEl = document.getElementById('memberSince');

    if (emailEl) emailEl.value = user.email || '';
    if (usernameEl) usernameEl.value = user.username || '';
    if (fullNameEl) fullNameEl.value = user.fullName || '';
    if (githubTokenEl) githubTokenEl.value = user.githubToken ? '••••••••' : '';
    if (memberSinceEl && user.createdAt) {
        memberSinceEl.textContent = formatDate(user.createdAt);
    }
}

async function saveProfile() {
    const fullName = document.getElementById('fullName').value.trim();
    const githubTokenInput = document.getElementById('githubToken').value.trim();

    const updateData = { fullName };
    if (githubTokenInput && githubTokenInput !== '••••••••') {
        updateData.githubToken = githubTokenInput;
    }

    try {
        setLoading('saveProfileBtn', true);
        const updated = await API.updateProfile(updateData);
        Auth.setUser(updated);
        fillProfileForm(updated);
        showSuccess('profileSuccess', 'Profile updated successfully');
    } catch (error) {
        console.error('Error saving profile:', error);
        showError('profileError', error.message || 'Failed to update profile');
    } finally {
        setLoading('saveProfileBtn', false);
    }
}
