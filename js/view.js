document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('capsule');
  const id= location.hash.replace('#', '');
  
  // Add ripple effect to buttons
  addRippleEffect();
  
  // Add mouse tracking for card glow effect
  addCardGlowEffect();
  
  if (!id) {
    container.innerHTML = '<div class="alert alert-info">✦ No capsule selected. Please choose a time capsule to view.</div>';
    return;
  }
  
  const raw = localStorage.getItem('capsule-' + id);
  if (!raw) {
    container.innerHTML = '<div class="alert alert-warning">✦ Capsule not found. It may have been removed or never existed.</div>';
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
    // Show unlocked capsule with dramatic reveal
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
      <div class="envelope-wrapper">
        <div class="text-center">
          <div class="wax-seal"></div>
          <div class="locked-icon">🔐</div>
          <h5 class="mb-3" style="font-family: 'Playfair Display', serif; color: #5d4037;">A Sealed Message from ${escapeHtml(data.name)}</h5>
          <p class="text-muted" style="font-style:italic;">This capsule shall open on <strong style="color: #8b4513;">${formatDate(unlockDate)}</strong></p>
          
          <div class="countdown-timer mt-4">
            <div class="countdown-label mb-3">⏳ Time Remaining Until Revelation ⏳</div>
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
            <p class="mt-3 small" style="opacity: 0.8; font-style:italic;">Patience is a virtue...</p>
          </div>
        </div>
      </div>
    `;
  }
  
  function renderUnlocked(el, data, unlockDate) {
    // Add unlock animation
    el.style.animation = 'fadeIn 1s ease-in';
    
    el.innerHTML = `
      <div>
        <div class="alert alert-success text-center" role="alert" style="font-size: 1.2rem; padding: 1.5rem;">
          <span style="font-size: 2rem;">✨</span><br>
          <strong>The Time Capsule Has Been Unlocked!</strong><br>
          <small style="opacity: 0.9;">The moment has arrived to read these words from the past</small>
        </div>
        
        <div class="date-display">
          <small>Written by <strong>${escapeHtml(data.name)}</strong></small><br>
          <small>Saved: ${formatDate(new Date(data.createdAt))}</small><br>
          <small>Opened: ${formatDate(now)}</small>
        </div>
        
        <div class="capsule-message mt-3">
          ${escapeHtml(data.message)}
        </div>
        
        <div class="text-center mt-4">
          <p class="text-muted small" style="font-style:italic;">
            "Time is the most valuable thing we have."<br>
            — Cherish this moment
          </p>
        </div>
      </div>
    `;
    
    // Celebration effect for unlocked capsule
    setTimeout(() => createSparkleEffect(), 500);
  }
  
  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  function createSparkleEffect() {
    const colors = ['#d4af37', '#ffd700', '#f4e4c1', '#8b4513'];
    for (let i = 0; i < 40; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        opacity: ${Math.random()};
        pointer-events: none;
        z-index: 9999;
        animation: sparkle 1.5s ease-out forwards;
      `;
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1500);
    }
    
    // Add sparkle animation if not exists
    if (!document.getElementById('sparkle-styles')) {
      const style = document.createElement('style');
      style.id = 'sparkle-styles';
      style.textContent = `
        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(2) rotate(180deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: ripple-effect 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Add ripple animation if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-effect {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
         100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Add mouse tracking for glowing border effect
  function addCardGlowEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }
});
