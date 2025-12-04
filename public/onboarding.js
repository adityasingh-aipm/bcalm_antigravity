const ONBOARDING_KEY = 'bcalm_onboarding';

function getLocalOnboarding() {
  try {
    const data = sessionStorage.getItem(ONBOARDING_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function setLocalOnboarding(updates) {
  try {
    const current = getLocalOnboarding();
    const updated = { ...current, ...updates };
    sessionStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
}

async function getProfile() {
  try {
    const response = await fetch('/api/profile/me', {
      credentials: 'include'
    });
    if (!response.ok) {
      return getLocalOnboarding();
    }
    const serverProfile = await response.json();
    if (serverProfile && serverProfile.id) {
      return serverProfile;
    }
    return getLocalOnboarding();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return getLocalOnboarding();
  }
}

async function saveStatus(currentStatus) {
  setLocalOnboarding({ current_status: currentStatus });
  
  try {
    const response = await fetch('/api/profile/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ current_status: currentStatus })
    });
    return response.ok;
  } catch (error) {
    console.log('Saved status locally (not authenticated)');
    return true;
  }
}

async function saveRole(targetRole) {
  setLocalOnboarding({ target_role: targetRole });
  
  try {
    const response = await fetch('/api/profile/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ target_role: targetRole })
    });
    return response.ok;
  } catch (error) {
    console.log('Saved role locally (not authenticated)');
    return true;
  }
}

async function saveExperience(yearsExperience) {
  setLocalOnboarding({ years_experience: yearsExperience });
  
  try {
    const response = await fetch('/api/profile/experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ years_experience: yearsExperience })
    });
    return response.ok;
  } catch (error) {
    console.log('Saved experience locally (not authenticated)');
    return true;
  }
}

async function completeOnboarding() {
  setLocalOnboarding({ onboarding_completed: true });
  
  try {
    const response = await fetch('/api/profile/complete-onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ onboarding_completed: true })
    });
    return response.ok;
  } catch (error) {
    console.log('Marked onboarding complete locally (not authenticated)');
    return true;
  }
}

function formatExperience(years) {
  if (years === null || years === undefined) return 'Not specified';
  if (years === 0) return '0 years';
  if (years <= 2) return '1–2 years';
  if (years <= 5) return '3–5 years';
  if (years <= 9) return '6–9 years';
  return '10+ years';
}
