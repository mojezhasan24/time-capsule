// Landing Page Interactive JavaScript

// Smooth scrolling and section visibility
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.hero-section, .features-section, .how-it-works-section, .quote-section, .final-cta-section');
  const progressBar = document.querySelector('.progress-fill');
  
  // Intersection Observer for section animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate timeline items
        if (entry.target.classList.contains('how-it-works-section')) {
          animateTimelineItems();
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Scroll progress indicator
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
  
  // Parallax effect for floating objects
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const floatObjects = document.querySelectorAll('.float-object');
    
    floatObjects.forEach((obj, index) => {
      const speed = 0.1 + (index * 0.05);
      obj.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
  
  // Tilt effect for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width/ 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
  
  // Add particle effect on mouse move
  createParticleTrail();
  
  // Typewriter effect for hero title
  typewriterEffect();
});

// Navigate to create page
function navigateToCreate() {
  // Create exit animation
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// Scroll to features
function scrollToFeatures() {
  document.getElementById('features').scrollIntoView({
    behavior: 'smooth'
  });
}

// Animate timeline items sequentially
function animateTimelineItems() {
  const items = document.querySelectorAll('.timeline-item');
  
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, index * 300);
  });
}

// Particle trail effect
function createParticleTrail() {
  const colors = ['#d4af37', '#f4e4c1', '#8b4513', '#ffd700'];
  let lastX = 0;
  let lastY = 0;
  
  document.addEventListener('mousemove', (e) => {
    const distance = Math.sqrt(
      Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
    );
    
    if (distance > 20) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${e.clientX - size/2}px;
        top: ${e.clientY - size/2}px;
        opacity: ${Math.random() * 0.5 + 0.5};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: particleFade 1s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
      
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
  
  // Add particle animation styles
  if (!document.getElementById('particle-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
      @keyframes particleFade {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
       100% {
          opacity: 0;
          transform: translateY(20px) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Typewriter effect for hero title
function typewriterEffect() {
  const titleLines = document.querySelectorAll('.title-line');
  
  titleLines.forEach((line, lineIndex) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.borderRight = '3px solid #d4af37';
    
    setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          line.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          line.style.borderRight = 'none';
        }
      }, 100);
    }, lineIndex * 800);
  });
}

// Add magnetic effect to buttons
const buttons = document.querySelectorAll('.btn-cta-primary, .btn-cta-secondary, .btn-cta-large');
buttons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/ 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

// Add ripple effect on button click
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

// Add ripple animation
if (!document.getElementById('landing-ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'landing-ripple-styles';
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

// Cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent 70%);
  pointer-events: none;
  z-index: 9997;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  opacity: 0;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.opacity = '1';
  
  clearTimeout(cursorGlow.timeout);
  cursorGlow.timeout = setTimeout(() => {
    cursorGlow.style.opacity = '0';
  }, 1000);
});

// Add hover state to interactive elements
const interactiveElements = document.querySelectorAll('.feature-card, .btn-cta-primary, .btn-cta-secondary, .btn-cta-large, a');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0.15';
    cursorGlow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent 70%)';
  });
});

// Smooth reveal on load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 1s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    window.scrollBy({
      top: -window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  } else if (e.key === 'Enter' && e.target === document.body) {
    navigateToCreate();
  }
});
