document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('capsule');
  const id = location.hash.replace('#', '');
  
  if (!id) {
    container.innerHTML = '<div class="alert alert-info">No capsule selected.</div>';
    return;
  }
  
  const raw = localStorage.getItem('capsule-' + id);
  if (!raw) {
    container.innerHTML = '<div class="alert alert-warning">Capsule not found.</div>';
    return;
  }
  
  const data = JSON.parse(raw);
  const unlockDate = new Date(data.date);
  const now = new Date();
  
  if (now < unlockDate) {
    // Show locked state with countdown
    renderLocked(container, data, unlockDate);
    // Update countdown every second
    setInterval(() => {
      renderLocked(container, data, unlockDate);
    }, 1000);
  } else {
    // Show unlocked capsule
    renderUnlocked(container, data, unlockDate);
  }
  
  function renderLocked(el, data, unlockDate) {
    const now = new Date();
    const diff = unlockDate - now;
    
    if (diff <= 0) {
      renderUnlocked(el, data, unlockDate);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    el.innerHTML = `
      <div class="text-center">
        <div class="locked-icon">🔒</div>
        <h5 class="mb-3">Message Locked from ${escapeHtml(data.name)}</h5>
        <p class="text-muted">Opens on <strong>${escapeHtml(data.date)}</strong></p>
        
        <div class="countdown-timer mt-4">
          <div class="countdown-label mb-3">Time until unlock</div>
          <div class="row g-2 justify-content-center">
            <div class="col-3">
              <div class="countdown-value">${days}</div>
              <div class="countdown-label">Days</div>
            </div>
            <div class="col-3">
              <div class="countdown-value">${String(hours).padStart(2, '0')}</div>
              <div class="countdown-label">Hours</div>
            </div>
            <div class="col-3">
              <div class="countdown-value">${String(minutes).padStart(2, '0')}</div>
              <div class="countdown-label">Minutes</div>
            </div>
            <div class="col-3">
              <div class="countdown-value">${String(seconds).padStart(2, '0')}</div>
              <div class="countdown-label">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  function renderUnlocked(el, data, unlockDate) {
    el.innerHTML = `
      <div>
        <div class="alert alert-success" role="alert">
          ✅ Time Capsule Unlocked!
        </div>
        <h5 class="mb-2">${escapeHtml(data.name)}</h5>
        <p class="text-muted small">Saved: ${new Date(data.createdAt).toLocaleString()} | Opens: ${escapeHtml(data.date)}</p>
        
        <div class="capsule-message mt-3">
          ${escapeHtml(data.message)}
        </div>
      </div>
    `;
  }
  
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
