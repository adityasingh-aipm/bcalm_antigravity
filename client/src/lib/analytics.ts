function getUserId(): string {
  let uid = localStorage.getItem("uid");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("uid", uid);
  }
  return uid;
}

export async function trackEvent(eventName: string, data: Record<string, any> = {}) {
  try {
    const userId = getUserId();
    
    console.log('📊 Tracking event:', eventName, data);
    
    // Send to backend analytics endpoint
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        eventName,
        eventData: data
      })
    });

    if (!response.ok) {
      console.error("❌ Analytics tracking error:", response.statusText);
      return;
    }

    console.log('✅ Event tracked successfully:', eventName);
  } catch (error) {
    console.error("❌ Error tracking event:", error);
  }
}

// Get UTM parameters from URL
export function getUtmParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

// Get page path from current URL
export function getPagePath() {
  return window.location.pathname;
}

// Get page name from URL path
export function getPageName() {
  const path = getPagePath();
  if (path === '/') return 'landing_page';
  if (path === '/resources') return 'resources_page';
  if (path === '/ai-pm-readiness') return 'assessment_landing_page';
  if (path === '/ai-pm-readiness/start') return 'assessment_start_page';
  if (path === '/ai-pm-readiness/questions') return 'assessment_questions_page';
  if (path.includes('/ai-pm-readiness/results')) return 'assessment_results_page';
  if (path.includes('/ai-pm-readiness/share')) return 'assessment_share_page';
  return 'unknown_page';
}

// Get referrer (external URL from where user came from)
export function getReferrer() {
  return document.referrer || null;
}

// Track initial landing (fires once per session on first page load)
export function trackInitialLanding() {
  // Check if we've already tracked the initial landing in this session
  const sessionId = sessionStorage.getItem("__bcalm_session_tracked");
  if (sessionId) return;
  
  // Mark this session as tracked
  sessionStorage.setItem("__bcalm_session_tracked", "true");
  
  const utmParams = getUtmParams();
  const referrer = getReferrer();
  
  trackEvent("first_page_launch", {
    pageName: getPageName(),
    pageUrl: window.location.href,
    pagePath: getPagePath(),
    utm: utmParams,
    referrer: referrer
  });
}

// Track page-specific view with navigation source
export function trackPageView(navigationSource?: string) {
  const utmParams = getUtmParams();
  const pageName = getPageName();
  const pageSpecificEventName = pageName + "_view";
  
  trackEvent(pageSpecificEventName, {
    pagePath: getPagePath(),
    utm: utmParams,
    navigationSource: navigationSource || null
  });
}
