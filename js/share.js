// Share Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Get encrypted capsule data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const encryptedData = urlParams.get('data');
  
  if (!encryptedData) {
    // No data, redirect to create page
    window.location.href = 'index.html';
    return;
  }
  
  try {
    // Decrypt to get display info (same as open.js decryption)
    const decoded = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) - 3);
    }
    const info = JSON.parse(decrypted);
    
    // Display capsule info
    document.getElementById('capsuleName').textContent = info.name;
    document.getElementById('capsuleDate').textContent = formatDate(new Date(info.date));
    
    // Generate the shareable link (pass the same encrypted data to open.html)
    // Handle both localhost server and file:// protocol
    let shareLink;
    const currentUrl = window.location.href;
    
    if (window.location.protocol === 'file:') {
      // Running from file system - generate full path
      const currentPath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
      shareLink = `${currentPath}open.html?capsule=${encodeURIComponent(encryptedData)}`;
    } else {
      // Running on a server (localhost or deployed) - proper URL
      const baseUrl = currentUrl.replace('share.html', 'open.html').split('?')[0];
      shareLink = `${baseUrl}?capsule=${encodeURIComponent(encryptedData)}`;
    }
    
    document.getElementById('shareLink').value = shareLink;
    
    // Trigger success confetti
    setTimeout(() => {
      createSuccessConfetti();
    }, 500);
    
  } catch (e) {
    console.error('Error parsing capsule data:', e);
    window.location.href = 'index.html';
  }
});

// Copy link to clipboard
function copyLink() {
  const linkInput = document.getElementById('shareLink');
  const copyBtn = document.getElementById('copyBtn');
  const copySuccess = document.getElementById('copySuccess');
  
  // Select and copy
  linkInput.select();
  linkInput.setSelectionRange(0, 99999); // For mobile
  
  navigator.clipboard.writeText(linkInput.value).then(() => {
    // Update button state
    copyBtn.classList.add('copied');
    copyBtn.querySelector('.copy-text').textContent = 'Copied!';
    copyBtn.querySelector('.copy-icon').textContent = '✓';
    
    // Show success message
    copySuccess.classList.add('show');
    
    // Create celebration effect
    createCopyConfetti();
    
    // Reset after 3 seconds
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('.copy-text').textContent = 'Copy';
      copyBtn.querySelector('.copy-icon').textContent = '📋';
      copySuccess.classList.remove('show');
    }, 3000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    document.execCommand('copy');
  });
}

// Format date nicely
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Success confetti animation
function createSuccessConfetti() {
  const colors = ['#d4af37', '#f4e4c1', '#ffd700', '#4ade80', '#22c55e'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        top: -20px;
        left: ${Math.random() * 100}vw;
        opacity: 1;
        pointer-events: none;
        z-index: 9999;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
  
  // Add confetti animation if not exists
  if (!document.getElementById('share-confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'share-confetti-styles';
    style.textContent = `
      @keyframes confettiFall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Copy button confetti
function createCopyConfetti() {
  const copyBtn = document.getElementById('copyBtn');
  const rect = copyBtn.getBoundingClientRect();
  const colors = ['#4ade80', '#22c55e', '#d4af37', '#ffd700'];
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = Math.random() * 100 + 50;
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      opacity: 1;
      pointer-events: none;
      z-index: 9999;
      border-radius: 50%;
      animation: particleBurst 0.8s ease-out forwards;
      --tx: ${Math.cos(angle) * velocity}px;
      --ty: ${Math.sin(angle) * velocity}px;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 800);
  }
  
  // Add burst animation if not exists
  if (!document.getElementById('burst-styles')) {
    const style = document.createElement('style');
    style.id = 'burst-styles';
    style.textContent = `
      @keyframes particleBurst {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Cursor glow effect
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
  });
}
