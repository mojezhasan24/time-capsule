document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('capsuleForm');
  
  // Add entrance animations
  animatePageEntrance();
  
  // Add ripple effect to buttons
  addRippleEffect();
  
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
  
  // Enhanced cursor glow effect
  function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;
    
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.style.opacity = '1';
      
      clearTimeout(cursorGlow.timeout);
      cursorGlow.timeout = setTimeout(() => {
        cursorGlow.style.opacity = '0.15';
      }, 1000);
    });
    
    // Interactive elements enhance glow
    const interactiveElements = document.querySelectorAll(
      '.cosmic-input, .cosmic-textarea, .btn-cosmic-primary, .cosmic-link'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent 70%)';
      });
    });
  }
  
  // Initialize cursor glow
  initCursorGlow();
  
  // Add ripple effect to buttons
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
  
  // Animate page entrance with flying cards effect
  function animatePageEntrance() {
    const card = document.querySelector('.cosmic-card');
    const title = document.querySelector('.cosmic-title');
    const subtitle = document.querySelector('.cosmic-subtitle');
    const inputs = document.querySelectorAll('.input-group-cosmic');
    const button = document.querySelector('.btn-cosmic-primary');
    
    // Initial state - off screen
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-100vh) rotate(-180deg) scale(0.3)';
    }
    
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateX(-200px)';
    }
    
    if (subtitle) {
      subtitle.style.opacity = '0';
      subtitle.style.transform = 'translateX(200px)';
    }
    
    inputs.forEach((input, index) => {
      input.style.opacity = '0';
      input.style.transform = `translateX(${-100 - index * 50}px)`;
    });
    
    if (button) {
      button.style.opacity = '0';
      button.style.transform = 'scale(0.5)';
    }
    
    // Animate in sequence
    setTimeout(() => {
      // Card flies in
      if (card) {
        card.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotate(0deg) scale(1)';
      }
      
      // Title slides in
      setTimeout(() => {
        if (title) {
          title.style.transition = 'all 0.6s ease-out';
          title.style.opacity = '1';
          title.style.transform = 'translateX(0)';
        }
        
        // Subtitle slides in
        setTimeout(() => {
          if (subtitle) {
            subtitle.style.transition = 'all 0.6s ease-out';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateX(0)';
          }
          
          // Inputs slide in one by one
          inputs.forEach((input, index) => {
            setTimeout(() => {
              input.style.transition = 'all 0.5s ease-out';
              input.style.opacity = '1';
              input.style.transform = 'translateX(0)';
            }, index * 100);
          });
          
          // Button scales in
          setTimeout(() => {
            if (button) {
              button.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
              button.style.opacity = '1';
              button.style.transform = 'scale(1)';
            }
          }, inputs.length * 100 + 200);
        }, 400);
      }, 600);
    }, 300);
  }
});
