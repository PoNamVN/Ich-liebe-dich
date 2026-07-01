import './style.css'
import gsap from 'gsap'

// Active season state
let currentSeason = 'spring';

// --- 1. DOM Content Loaded Setup ---
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;

  // Star Generator (Background sky stars)
  const starContainer = document.getElementById('star-container');
  if (starContainer) {
    const starCount = isMobile ? 30 : 65; 
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 70) + '%'; 
      const size = (Math.random() * 1.8) + 0.8;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.animationDuration = (Math.random() * 3 + 3) + 's';
      star.style.animationDelay = (Math.random() * 4) + 's';
      star.style.opacity = (Math.random() * 0.5) + 0.3;
      
      starContainer.appendChild(star);
    }
  }

  // Preloader Logic
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
        playHeroIntro();
      }, 1000); 
    }
  });

  // Hero Text Intro Reveal Animation
  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Scale up viewport slightly for dramatic entry
    tl.fromTo("#parallax-viewport", 
      { scale: 1.05 },
      { scale: 1, duration: 2.2 }
    );

    // Fade in navbar
    tl.fromTo(".navbar", 
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      0.3
    );

    // Circular text reveal
    tl.fromTo(".nav-arc-wrapper", 
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.5)" },
      0.5
    );

    // Title reveal
    tl.fromTo(".title-content h1", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5 },
      0.7
    );

    // Subtitle reveal
    tl.fromTo(".title-content h3", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      0.9
    );

    // Divider reveal
    tl.fromTo(".divider", 
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2 },
      1.1
    );

    // Poem text reveal
    tl.fromTo(".poem-text", 
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5 },
      1.3
    );

    // Footer signature reveal
    tl.fromTo(".footer-copyright", 
      { opacity: 0 },
      { opacity: 1, duration: 1.2 },
      1.5
    );

    // Start Sakura Rain (default Spring)
    setTimeout(() => {
      initSakuraRain();
    }, 800);
  }

  // --- 2. Dynamic Change Season Event Interceptors ---
  const seasonLinks = document.querySelectorAll('.season-link');
  seasonLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSeason = link.getAttribute('data-season');
      if (targetSeason && targetSeason !== currentSeason) {
        changeSeason(targetSeason);
      }
    });
  });

  // Change Season Manager (Lerp & Particle Swaps)
  function changeSeason(season) {
    currentSeason = season;
    
    // 1. Highlight links on circle wheel
    seasonLinks.forEach(l => {
      if (l.getAttribute('data-season') === season) {
        l.classList.add('active-season');
      } else {
        l.classList.remove('active-season');
      }
    });

    // 2. Subtle cinematic camera breath (scale) effect
    gsap.fromTo('#parallax-viewport', 
      { scale: 1 },
      { scale: 0.985, duration: 0.6, ease: "power2.inOut", yoyo: true, repeat: 1 }
    );

    // 3. Swaps classes on body (this triggers the CSS cross-fade of sky, ridges, and front-shell)
    document.body.classList.remove('spring', 'summer', 'autumn', 'winter');
    document.body.classList.add(season);

    // 4. Smooth particle fade and swap
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
      gsap.to(particleContainer, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.killTweensOf(particleContainer.children);
          particleContainer.innerHTML = '';
          
          // Fire up the corresponding particle system
          if (season === 'spring') initSakuraRain();
          else if (season === 'summer') initGreenLeaves();
          else if (season === 'autumn') initAutumnLeaves();
          else if (season === 'winter') initSnowflakes();

          // Fade new particles in
          gsap.to(particleContainer, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    }
  }

  // --- 3. Seasonal Particle Systems (Sakura, Leaves, Autumn, Snow) ---

  // Spring: Sakura Rain (top-right to bottom-left)
  function initSakuraRain() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 18 : 60;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("div");
      petal.classList.add("sakura-petal");
      const size = Math.random() * 12 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      
      container.appendChild(petal);
      
      gsap.fromTo(petal, 
        { 
          y: -50, 
          x: Math.random() * (window.innerWidth + 200),
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.4
        },
        { 
          y: window.innerHeight + 50, 
          x: "-=" + (Math.random() * 300 + 200), 
          rotation: "+=" + (Math.random() * 720), 
          opacity: 0,
          duration: Math.random() * 8 + 6, 
          ease: "none", 
          repeat: -1, 
          delay: Math.random() * -15 
        }
      );
    }
  }

  // Summer: Green Leaves (top-right to bottom-left)
  function initGreenLeaves() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 12 : 35;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.classList.add("green-leaf");
      const size = Math.random() * 16 + 10;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      
      container.appendChild(leaf);
      
      gsap.fromTo(leaf, 
        { 
          y: -50, 
          x: Math.random() * (window.innerWidth + 200),
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.4
        },
        { 
          y: window.innerHeight + 50, 
          x: "-=" + (Math.random() * 300 + 150), 
          rotation: "+=" + (Math.random() * 540), 
          opacity: 0,
          duration: Math.random() * 9 + 7, 
          ease: "none", 
          repeat: -1, 
          delay: Math.random() * -15 
        }
      );
    }
  }

  // Autumn: Yellow Leaves (top-right to bottom-left)
  function initAutumnLeaves() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 15 : 45;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.classList.add("fall-leaf");
      const size = Math.random() * 16 + 10;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      
      container.appendChild(leaf);
      
      gsap.fromTo(leaf, 
        { 
          y: -50, 
          x: Math.random() * (window.innerWidth + 200),
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.4
        },
        { 
          y: window.innerHeight + 50, 
          x: "-=" + (Math.random() * 350 + 150), 
          rotation: "+=" + (Math.random() * 720), 
          opacity: 0,
          duration: Math.random() * 9 + 6, 
          ease: "none", 
          repeat: -1, 
          delay: Math.random() * -15 
        }
      );
    }
  }

  // Winter: Snowflakes (Hardware Accelerated Native CSS Animation loops)
  function initSnowflakes() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 40 : 100;
    for (let i = 0; i < count; i++) {
      const snow = document.createElement("div");
      snow.classList.add("css-snowflake");

      const size = Math.random() * 4 + 1; 
      const startX = Math.random() * 100; 
      const fallDuration = Math.random() * 10 + 6; 
      const delay = Math.random() * -15; 
      const sway = (Math.random() - 0.5) * 12; 

      snow.style.width = size + 'px';
      snow.style.height = size + 'px';
      snow.style.left = startX + 'vw';
      snow.style.opacity = Math.random() * 0.5 + 0.3;
      
      // Hardware-accelerated blur/depth sorting
      if (size < 2.5) {
        snow.style.filter = 'blur(1px)';
      }

      snow.style.setProperty('--sway-distance', sway + 'vw');
      snow.style.animation = `snow-fall ${fallDuration}s linear infinite`;
      snow.style.animationDelay = `${delay}s`;

      container.appendChild(snow);
    }
  }

  // --- 4. Space View Transition Logic (Fly-to-space & Return) ---
  const moons = document.querySelectorAll('.moon-bg');
  const spaceOverlay = document.getElementById('space-overlay');
  const btnReturn = document.getElementById('btn-return-manor');
  const manorElements = document.querySelectorAll('.layer, .building-group, .fog-group, .title-group');
  
  let isSpaceView = false;



  moons.forEach(moon => {
    moon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isSpaceView) return;
      isSpaceView = true;

      // 1. Zoom out/fade out manor elements
      gsap.to(manorElements, {
        opacity: 0,
        duration: 1.8,
        ease: "power4.inOut",
        pointerEvents: 'none'
      });
      gsap.to(viewScale, {
        manor: 2.5,
        duration: 1.8,
        ease: "power4.inOut"
      });

      // 2. Show space overlay
      spaceOverlay.style.display = 'block';
      gsap.fromTo(spaceOverlay, 
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" }
      );

      // 3. Zoom in Earth from tiny to normal
      gsap.to(viewScale, {
        space: 1,
        duration: 2.0,
        ease: "power3.out",
        delay: 0.2
      });

      // 4. Slide up moon surface rocky foreground
      gsap.fromTo('.space-moon-surface-wrapper', 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.8, ease: "power3.out", delay: 0.4 }
      );

      // 5. Fade in Space UI (Return button & Caption)
      gsap.fromTo('.space-ui', 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 1.1 }
      );
    });
  });

  if (btnReturn) {
    btnReturn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isSpaceView) return;
      isSpaceView = false;

      // 1. Fade out Space UI & surface
      gsap.to('.space-ui', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.in"
      });

      gsap.to('.space-moon-surface-wrapper', {
        y: 80,
        opacity: 0,
        duration: 1.0,
        ease: "power3.in"
      });

      gsap.to(viewScale, {
        space: 0.15,
        duration: 1.2,
        ease: "power3.in"
      });

      // 2. Fade out Space Overlay
      gsap.to(spaceOverlay, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          spaceOverlay.style.display = 'none';
        }
      });

      // 3. Fade in/Restore manor elements to normal
      gsap.to(manorElements, {
        opacity: 1,
        duration: 1.6,
        ease: "power4.out", 
        clearProps: "opacity,pointerEvents",
        delay: 0.2
      });
      gsap.to(viewScale, {
        manor: 1,
        duration: 1.6,
        ease: "power4.out",
        delay: 0.2
      });
    });
  }
});


// --- 5. Parallax Core Engine (Hardware Accelerated Lerp & Gyroscope) ---
const viewScale = {
  manor: 1,
  space: 0.15
};
const layers = document.querySelectorAll('.layer, .building-group, .fog-group, .title-group, .space-layer');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// Mouse coordinates logic
window.addEventListener('mousemove', (e) => {
  targetX = (window.innerWidth / 2 - e.clientX) / 25;
  targetY = (window.innerHeight / 2 - e.clientY) / 25;
});

// Touch swipe logic (Mobile fallback helper)
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    targetX = (window.innerWidth / 2 - touch.clientX) / 12;
    targetY = (window.innerHeight / 2 - touch.clientY) / 12;
  }
}, { passive: true });

// Gyroscope orientation logic for Mobile Devices
window.addEventListener('deviceorientation', (e) => {
  const xTilt = e.gamma; 
  const yTilt = e.beta;  
  
  if (xTilt !== null && yTilt !== null) {
    const sensitivity = 2.6; 
    targetX = xTilt / sensitivity;
    targetY = (yTilt - 45) / sensitivity; 
  }
}, true);

// Unified requestAnimationFrame Loop (Calculated per screen refresh frame)
function animateParallax() {
  const easing = 0.05;         // Snappy but heavy slide response (similar to alfoart settings)
  const speedMultiplierX = 85;  // Horizontal 3D depth multiplier
  const speedMultiplierY = 85;  // Vertical 3D depth multiplier

  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;

  layers.forEach(layer => {
    if (!layer) return; 
    const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
    
    // Independent coordinates calculation
    const xOffset = currentX * depth * speedMultiplierX; 
    const yOffset = currentY * depth * speedMultiplierY;
    
    // Check if the layer belongs to space view or manor view
    const isSpaceLayer = layer.classList.contains('space-layer') || layer.id === 'space-overlay';
    const currentScale = isSpaceLayer ? viewScale.space : viewScale.manor;
    
    // Hardware-accelerated translate3d rendering with combined scale
    layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${currentScale})`;
  });

  requestAnimationFrame(animateParallax);
}

// Start core engine
animateParallax();
