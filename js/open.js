// Open Page JavaScript - Decrypt and Display Time Capsule

// Global capsule data
let capsuleData = null;
let countdownInterval = null;
let storedPassword = null; // Store the correct password

document.addEventListener('DOMContentLoaded', () => {
  // Show intro with Shin-chan character
  showIntroWithCharacter();
  
  // Get encrypted data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const encryptedData = urlParams.get('capsule');
  
  if (!encryptedData) {
    showError();
    return;
  }
  
  try {
    // Decrypt the capsule data
    capsuleData = decryptCapsule(encryptedData);
    
    // Short delay for dramatic effect
    setTimeout(() => {
      processCapsule(capsuleData);
    }, 1500);
    
  } catch (e) {
    console.error('Decryption error:', e);
    showError();
  }
  
  // Initialize cursor glow
  initCursorGlow();
});

// Show intro with Shin-chan character
function showIntroWithCharacter() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;
  
  // Overlay is already visible by default
  // After 3 seconds, fade it out
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  }, 3000);
}

// Simple encryption/decryption using Base64 + character shift
function decryptCapsule(encrypted) {
  try {
    // Decode from Base64
    const decoded = atob(encrypted);
    
    // Reverse character shift
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) - 3);
    }
    
    return JSON.parse(decrypted);
  } catch (e) {
    throw new Error('Invalid capsule data');
  }
}

// Process the decrypted capsule
function processCapsule(data) {
  const unlockDate = new Date(data.date);
  const now = new Date();
  
  // Store the password for verification
  storedPassword = data.password;
  
  // Hide loading state
  document.getElementById('loadingState').style.display = 'none';
  
  // Show password entry (interrogation)
  showPasswordEntry(data);
}

// Show locked state with countdown
function showLockedState(data, unlockDate) {
  const lockedState = document.getElementById('lockedState');
  lockedState.style.display = 'block';
  
  // Populate info
  document.getElementById('lockedName').textContent = data.name;
  document.getElementById('unlockDate').textContent = formatDate(unlockDate);
  
  // Start countdown
  updateCountdown(unlockDate);
  countdownInterval = setInterval(() => {
    updateCountdown(unlockDate);
  }, 1000);
}

// Show password entry (interrogation)
function showPasswordEntry(data) {
  const passwordState = document.getElementById('passwordState');
  passwordState.style.display = 'block';
  
  // Focus on password input
  setTimeout(() => {
    document.getElementById('capsulePassword').focus();
  }, 500);
  
  // Interrogation dialogues
  const interrogations = [
    "🤨 Halt! This capsule is protected!",
    "🔍 Who are you? And how did you get this link?",
    "😒 I don't trust strangers... Prove yourself!",
    "👀 What's the secret word? Think carefully...",
    "🧐 Wrong answers make me very suspicious..."
  ];
  
  let dialogueIndex = 0;
  
  // Rotate through interrogation lines
  setInterval(() => {
    if (dialogueIndex < interrogations.length) {
      document.getElementById('interrogationText').textContent = interrogations[dialogueIndex];
      dialogueIndex++;
    }
  }, 3000);
}

// Verify password function
function verifyPassword() {
  const enteredPassword = document.getElementById('capsulePassword').value;
  const interrogationChar = document.querySelector('.interrogation-character');
  
  if (enteredPassword === storedPassword) {
    // Correct password - happy nod animation
    interrogationChar.classList.add('correct-password');
    interrogationChar.classList.remove('wrong-password');
    
    // Wait for nod animation then proceed
    setTimeout(() => {
      interrogationChar.classList.remove('correct-password');
      
      // Check date now
      const unlockDate = new Date(capsuleData.date);
      const now = new Date();
      
      if (now < unlockDate) {
        // Still locked - show countdown
        document.getElementById('passwordState').style.display = 'none';
        showLockedState(capsuleData, unlockDate);
      } else {
        // Unlocked - show gift opening
        document.getElementById('passwordState').style.display = 'none';
        showGiftOpening(capsuleData);
      }
    }, 600); // Wait for nod animation
    
  } else {
    // Wrong password - head shake animation
    interrogationChar.classList.add('wrong-password');
    interrogationChar.classList.remove('correct-password');
    
    const wrongMsg = document.getElementById('wrongPasswordMsg');
    wrongMsg.style.display = 'block';
    
    // Shin-chan gets more suspicious
    const angryDialogues = [
      "😠 WRONG! Nice try, but I'm watching you...",
      "🤨 That's not it! Are you even supposed to be here?",
      "😒 Three strikes and you're out! Just kidding... keep trying.",
      "👀 Suspicious... very suspicious..."
    ];
    
    const randomDialogue = angryDialogues[Math.floor(Math.random() * angryDialogues.length)];
    document.getElementById('interrogationText').textContent = randomDialogue;
    
    // Remove animation class after it completes so it can be triggered again
    setTimeout(() => {
      interrogationChar.classList.remove('wrong-password');
    }, 500);
    
    // Clear input
    document.getElementById('capsulePassword').value = '';
    document.getElementById('capsulePassword').focus();
  }
}

// Update countdown timer
function updateCountdown(unlockDate) {
  const now = new Date();
  const diff = unlockDate - now;
  
  if (diff <= 0) {
    // Time's up! Stop countdown and show gift
    clearInterval(countdownInterval);
    document.getElementById('lockedState').style.display = 'none';
    showGiftOpening(capsuleData);
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  document.getElementById('countDays').textContent = String(days).padStart(2, '0');
  document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
}

// Show gift opening animation
function showGiftOpening(data) {
  const giftState = document.getElementById('giftOpeningState');
  giftState.style.display = 'block';
  
  // Add click handler for opening
  const openBtn = document.getElementById('openGiftBtn');
  openBtn.addEventListener('click', () => {
    openGift(data);
  });
}

// Open the gift with animation
function openGift(data) {
  const giftBox = document.querySelector('.gift-box-3d');
  const openBtn = document.getElementById('openGiftBtn');
  
  // Hide button
  openBtn.style.opacity = '0';
  openBtn.style.pointerEvents = 'none';
  
  // Add opening animation
  giftBox.classList.add('opening');
  
  // Create massive confetti burst
  createMassiveConfetti();
  
  // After animation, show the message
  setTimeout(() => {
    document.getElementById('giftOpeningState').style.display = 'none';
    showRevealedMessage(data);
  }, 2000);
}

// Show the revealed message
function showRevealedMessage(data) {
  const unlockedState = document.getElementById('unlockedState');
  unlockedState.style.display = 'block';
  
  // Populate message info
  document.getElementById('revealedName').textContent = data.name;
  document.getElementById('revealedCreated').textContent = formatDate(new Date(data.createdAt));
  document.getElementById('revealedOpened').textContent = formatDate(new Date());
  document.getElementById('revealedMessage').textContent = data.message;
  
  // Trigger celebration effects
  setTimeout(() => {
    createCelebrationSparkles();
  }, 500);
}

// Show error state
function showError() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('errorState').style.display = 'block';
}

// Format date
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Massive confetti for gift opening
function createMassiveConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#d4af37', '#f4e4c1', '#ffd700', '#ff6b6b', '#4ade80', '#60a5fa', '#f472b6'];
  
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      const size = Math.random() * 15 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = 50 + (Math.random() - 0.5) * 30;
      const rotation = Math.random() * 720;
      
      confetti.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        top: 40%;
        left: ${startX}%;
        opacity: 1;
        pointer-events: none;
        z-index: 10000;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiExplode ${2 + Math.random() * 2}s ease-out forwards;
        --tx: ${(Math.random() - 0.5) * 200}vw;
        --ty: ${Math.random() * 100 + 50}vh;
        --rotation: ${rotation}deg;
      `;
      
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 10);
  }
  
  // Add animation if not exists
  if (!document.getElementById('confetti-explode-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-explode-styles';
    style.textContent = `
      @keyframes confettiExplode {
        0% {
          transform: translate(0, 0) rotate(0deg) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) rotate(var(--rotation)) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Celebration sparkles
function createCelebrationSparkles() {
  const colors = ['#d4af37', '#ffd700', '#f4e4c1'];
  
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      sparkle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        animation: sparkleAppear 1.5s ease-out forwards;
        box-shadow: 0 0 ${size * 2}px ${color};
      `;
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1500);
    }, i * 50);
  }
  
  // Add animation if not exists
  if (!document.getElementById('sparkle-appear-styles')) {
    const style = document.createElement('style');
    style.id = 'sparkle-appear-styles';
    style.textContent = `
      @keyframes sparkleAppear {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Cursor glow effect
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
}

// Particle trail effect
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.9) {
    const colors = ['#d4af37', '#f4e4c1', '#ffd700'];
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
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      opacity: 0.8;
      box-shadow: 0 0 ${size}px ${color};
      animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  }
});

// Add trail animation if not exists
if (!document.getElementById('trail-fade-styles')) {
  const style = document.createElement('style');
  style.id = 'trail-fade-styles';
  style.textContent = `
    @keyframes trailFade {
      0% { opacity: 0.8; transform: scale(1); }
      100% { opacity: 0; transform: scale(0) translateY(20px); }
    }
  `;
  document.head.appendChild(style);
}
