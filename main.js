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
    let lightningInterval;
    function changeSeason(season) {
      currentSeason = season;
      
      clearInterval(lightningInterval);
      if (season === 'autumn') {
        lightningInterval = setInterval(() => {
          if (Math.random() > 0.6) {
            const flash = document.querySelector('.lightning-flash');
            if (flash) {
              flash.classList.remove('flash-active');
              void flash.offsetWidth; 
              flash.classList.add('flash-active');
            }
          }
        }, 4000);
      }
    
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
          if (season === 'spring') { initSakuraRain(); initSpores(); }
          else if (season === 'summer') { initGreenLeaves(); initFireflies(); }
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
      
      // Strong wind drift for Autumn
      gsap.fromTo(leaf, 
        { 
          y: Math.random() * window.innerHeight - 200, 
          x: window.innerWidth + 100,
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.5 + 0.5
        },
        { 
          y: "+=" + (Math.random() * 400 + 100), 
          x: -100, 
          rotation: "-=" + (Math.random() * 1080), 
          opacity: 0,
          duration: Math.random() * 3 + 2.5, 
          ease: "power1.inOut", 
          repeat: -1, 
          delay: Math.random() * -5 
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

      const size = Math.random() * 5 + 1.5; 
      const startX = Math.random() * 100; 
      const fallDuration = Math.random() * 8 + 4; // Faster snow
      const delay = Math.random() * -15; 
      const sway = (Math.random() - 0.5) * 15; 

      snow.style.width = size + 'px';
      snow.style.height = size + 'px';
      snow.style.left = startX + 'vw';
      snow.style.opacity = Math.random() * 0.6 + 0.4;
      snow.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`; // Glow
      
      // Hardware-accelerated blur/depth sorting
      if (size < 3) {
        snow.style.filter = 'blur(1.5px)';
      }

      snow.style.setProperty('--sway-distance', sway + 'vw');
      snow.style.animation = `snow-fall ${fallDuration}s linear infinite`;
      snow.style.animationDelay = `${delay}s`;

      container.appendChild(snow);
    }
  }

  function initFireflies() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const firefly = document.createElement("div");
      firefly.classList.add("firefly");
      container.appendChild(firefly);
      
      gsap.fromTo(firefly, 
        { 
          y: window.innerHeight + 20, 
          x: Math.random() * window.innerWidth,
          opacity: 0,
          scale: Math.random() * 0.5 + 0.5
        },
        { 
          y: Math.random() * (window.innerHeight / 2), 
          x: "+=" + (Math.random() * 200 - 100),
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 4 + 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * -10 
        }
      );
    }
  }

  function initSpores() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const count = isMobile ? 20 : 50;
    for (let i = 0; i < count; i++) {
      const spore = document.createElement("div");
      spore.classList.add("spore");
      container.appendChild(spore);
      
      gsap.fromTo(spore, 
        { 
          y: Math.random() * window.innerHeight, 
          x: Math.random() * window.innerWidth,
          opacity: 0
        },
        { 
          y: "-=" + (Math.random() * 100 + 50), 
          x: "+=" + (Math.random() * 100 - 50),
          opacity: Math.random() * 0.6 + 0.1,
          duration: Math.random() * 5 + 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * -10 
        }
      );
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

  // --- Magic Space Interactions ---
  const magicSun = document.getElementById('magic-sun');

  if (magicSun) {
    magicSun.addEventListener('click', (e) => {
      // Prevent multiple clicks
      if (magicSun.classList.contains('spark-fired')) return;
      magicSun.classList.add('spark-fired');

      // 1. Get Sun position
      const sunRect = magicSun.getBoundingClientRect();
      const startX = sunRect.left + sunRect.width / 2;
      const startY = sunRect.top + sunRect.height / 2;

      // 2. Get Earth center
      const earthRect = document.querySelector('.space-earth-glow').getBoundingClientRect();
      const endX = earthRect.left + earthRect.width / 2;
      const endY = earthRect.top + earthRect.height / 2;

      // 3. Create the spark
      const spark = document.createElement('div');
      spark.className = 'magic-spark';
      document.getElementById('space-overlay').appendChild(spark);

      // 4. Set initial position
      gsap.set(spark, { x: startX - 7.5, y: startY - 7.5, scale: 0 });

      // 5. Animate the spark
      gsap.to(spark, { scale: 1, duration: 0.2 });
      gsap.to(spark, {
        x: endX - 7.5,
        y: endY - 7.5,
        duration: 1.5,
        ease: "power2.in",
        delay: 0.2,
        onComplete: () => {
          spark.remove();
          
          // Reset the sun so it can be clicked again
          setTimeout(() => {
            magicSun.classList.remove('spark-fired');
          }, 1000);
        }
      });
    });
  }

});


// --- 5. Parallax Core Engine (Hardware Accelerated Lerp) ---
const viewScale = {
  manor: 1,
  space: 0.15
};
const layers = document.querySelectorAll('.layer, .building-group, .fog-group, .title-group, .space-layer');
const parallaxViewport = document.getElementById('parallax-viewport');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

let targetWind = 0;
let currentWind = 0;
let lastMouseX = window.innerWidth / 2;

// Mouse coordinates logic
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  
  targetX = (cx - e.clientX) / 25;
  targetY = (cy - e.clientY) / 25;
  
  // Wind force calculation based on speed
  const speedX = e.clientX - lastMouseX;
  targetWind = speedX * 1.5;
  lastMouseX = e.clientX;
});

// Touch swipe logic (Mobile fallback helper)
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (cx - touch.clientX) / 12;
    targetY = (cy - touch.clientY) / 12;
    
    const speedX = touch.clientX - lastMouseX;
    targetWind = speedX * 2;
    lastMouseX = touch.clientX;
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
  const easing = 0.05;         
  const speedMultiplierX = 85;  
  const speedMultiplierY = 85;  

  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;
  
  currentWind += (targetWind - currentWind) * 0.1;
  document.documentElement.style.setProperty('--wind-x', `${currentWind}px`);
  targetWind *= 0.9; // auto-decelerate wind

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
