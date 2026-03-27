document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('capsuleForm');
  
  // Add mouse tracking for card glow effect
  addCardGlowEffect();
  
  // Encryption function - shifts characters and encodes to base64
  function encryptCapsule(data) {
    const jsonStr = JSON.stringify(data);
    let encrypted = '';
    for (let i = 0; i < jsonStr.length; i++) {
      encrypted += String.fromCharCode(jsonStr.charCodeAt(i) + 3);
    }
    return btoa(encrypted);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fd = new FormData(form);
    const payload = {
      id: Date.now().toString(),
      name: fd.get('name'),
      message: fd.get('message'),
      date: fd.get('date'),
      password: fd.get('password'), // Add password
      createdAt: new Date().toISOString()
    };
    
    // Also save to localStorage as backup
    localStorage.setItem('capsule-' + payload.id, JSON.stringify(payload));
    
    // Encrypt the capsule data for shareable link
    const encryptedData = encryptCapsule(payload);
    
    // Show vintage-style success toast
    const toast = document.createElement('div');
    toast.className = 'toast-custom position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <span style="font-size: 1.5rem; margin-right: 0.5rem;">✦</span>
        <div>
          <strong>Your time capsule has been sealed!</strong><br>
          <small style="opacity: 0.8;">Opening on ${payload.date}</small>
        </div>
        <button type="button" class="btn-close ms-3" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Add celebration animation
    createConfetti();
    
    // Redirect to share page with encrypted data
    setTimeout(() => {
      location.href = 'share.html?data=' + encodeURIComponent(encryptedData);
    }, 1500);
  });
  
  // Vintage confetti effect
  function createConfetti() {
    const colors = ['#8b4513', '#d4af37', '#a0522d', '#c9a87c'];
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        opacity: ${Math.random()};
        pointer-events: none;
        z-index: 9999;
        animation: fall ${2 + Math.random() * 2}s linear forwards;
      `;
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }
  }
  
  // Add confetti animation styles
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add mouse tracking for glowing border effect
  function addCardGlowEffect() {
    const cards = document.querySelectorAll('.cosmic-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    });
  }
});
