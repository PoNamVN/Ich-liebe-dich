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
      const canvas = document.getElementById('space-canvas');
      if(canvas) canvas.style.display = 'block';
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
          const canvas = document.getElementById('space-canvas');
          if(canvas) canvas.style.display = 'none';
          // Reset scroll effect if it exists
          if (typeof window.resetSpaceScroll === 'function') {
            window.resetSpaceScroll();
          }
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

  // --- 4.5 Space Cinematic Canvas Effects ---
  const canvas = document.getElementById('space-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let targetSpaceScrollProgress = 0;
  let spaceScrollProgress = 0;
  let textParticles = [];
  let stars = [];
  let textPoints = [];
  
  // Expose reset function for return button
  window.resetSpaceScroll = () => {
    targetSpaceScrollProgress = 0;
    spaceScrollProgress = 0;
    const earthWrapper = document.querySelector('.space-earth-wrapper');
    const bgLayer = document.querySelector('.space-bg');
    const nebula = document.querySelector('.space-nebula');
    if (earthWrapper) earthWrapper.style.opacity = 1;
    if (bgLayer) bgLayer.style.opacity = 1;
    if (nebula) {
      nebula.style.filter = `hue-rotate(0deg)`;
      nebula.style.opacity = 1;
    }
    if (canvas && typeof initParticles === 'function') {
       initParticles(); // reset particles to scattered positions
    }
  };
  
  const initParticles = () => {
    if(!canvas) return;
    stars = [];
    const numStars = textPoints.length + 1200; // Lots of purely background stars
    for (let i = 0; i < numStars; i++) {
      const dest = i < textPoints.length ? textPoints[i] : null;
      
      // Random 3D space coords relative to center (0,0)
      const x = (Math.random() - 0.5) * canvas.width * 4;
      const y = (Math.random() - 0.5) * canvas.height * 4;
      const z = Math.random() * 2000 + 100;
      
      // Dest is in screen coords, so we center it around 0 for 3D math
      const dX = dest ? dest.x - canvas.width/2 : (Math.random() - 0.5) * canvas.width * 2;
      const dY = dest ? dest.y - canvas.height/2 : (Math.random() - 0.5) * canvas.height * 2;
      const dZ = dest ? 300 : Math.random() * 800 + 100; // Text forms at a focal depth of 300
      
      stars.push({
        x: x, y: y, z: z,
        originX: x, originY: y, originZ: z,
        destX: dX, destY: dY, destZ: dZ,
        size: Math.random() * 1.5 + 0.5,
        baseSize: dest ? Math.random() * 1.5 + 1.5 : Math.random() * 1 + 0.5,
        isTextPart: dest !== null,
        hue: dest ? (190 + Math.random() * 30) : (220 + Math.random() * 60), // Cyan/Blue palette
        offset: Math.random() * 100
      });
    }
  };

  if (canvas && ctx) {
    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      getTextPoints();
    };
    
    // Extract pixel coordinates for the text
    const getTextPoints = () => {
      textPoints = [];
      const tempCanvas = document.createElement('canvas');
      const tCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      tCtx.fillStyle = 'white';
      // Responsive font size
      let fontSize = window.innerWidth < 768 ? 55 : 130; // Made text even larger
      tCtx.font = `bold ${fontSize}px "Merriweather", serif`;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      
      // Multiline text if mobile
      if (window.innerWidth < 768) {
         tCtx.fillText("Will You be", tempCanvas.width / 2, tempCanvas.height / 2 - 40);
         tCtx.fillText("my girlfriend?", tempCanvas.width / 2, tempCanvas.height / 2 + 40);
      } else {
         tCtx.fillText("Will You be my girlfriend?", tempCanvas.width / 2, tempCanvas.height / 2);
      }
      
      const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
      // Sample every Nth pixel to create particles
      // Increasing step reduces the number of particles, creating a true constellation look and reducing glare
      const step = window.innerWidth < 768 ? 5 : 8;
      for (let y = 0; y < tempCanvas.height; y += step) {
        for (let x = 0; x < tempCanvas.width; x += step) {
          const alpha = imgData[(y * tempCanvas.width + x) * 4 + 3];
          if (alpha > 128) {
            // Add slight randomness to points for natural look
            textPoints.push({ 
                x: x + (Math.random() - 0.5) * 2, 
                y: y + (Math.random() - 0.5) * 2 
            });
          }
        }
      }
      
      initParticles();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
    
    // Scroll handling (0 to 1) target update
    const updateScrollProgress = (deltaY) => {
      if (!isSpaceView) return;
      let speed = window.innerWidth < 768 ? 0.005 : 0.003;
      
      // Cinematic slow down for Solar System and Milky Way (0.0 -> 0.80)
      if (targetSpaceScrollProgress < 0.80) {
          speed *= 0.10; // Scroll EXTREMELY slowly to admire the phases
      } else {
          speed *= 0.02; // Very slow down for text formation to make the effect last longer
      }
      
      targetSpaceScrollProgress += deltaY * speed;
      targetSpaceScrollProgress = Math.max(0, Math.min(1, targetSpaceScrollProgress));
    };
    
    // Smooth DOM updater (called every frame)
    const updateDOMForScroll = () => {
      // Lerp smooth scroll
      spaceScrollProgress += (targetSpaceScrollProgress - spaceScrollProgress) * 0.12;
      if (Math.abs(targetSpaceScrollProgress - spaceScrollProgress) < 0.001) {
          spaceScrollProgress = targetSpaceScrollProgress;
      }
      
      // DOM Elements
      const earthWrapper = document.querySelector('.space-earth-wrapper');
      const solarSystemWrapper = document.querySelector('.solar-system-wrapper');
      const milkyWayWrapper = document.querySelector('.milky-way-wrapper');
      const spaceCaption = document.querySelector('.space-caption');
      const bgLayer = document.querySelector('.space-bg');
      const nebula = document.querySelector('.space-nebula');
      
      // Calculate continuous Earth orbit angle for camera tracking
      const time = Date.now();
      const earthAngleDeg = (time % 30000) / 30000 * 360;
      const earthAngleRad = earthAngleDeg * Math.PI / 180;
      
      const orbitEarth = document.querySelector('.orbit-earth');
      if (orbitEarth) {
          // Keep Earth physically rotating around the Sun
          orbitEarth.style.transform = `translate(-50%, -50%) rotate(${earthAngleDeg}deg)`;
      }
      
      // Phase 0: 0.00 -> 0.15 (Earth -> Solar System)
      if (earthWrapper && solarSystemWrapper) {
          if (spaceScrollProgress <= 0.15) {
              const p = spaceScrollProgress / 0.15;
              earthWrapper.style.transform = `scale(${1 - p})`;
              earthWrapper.style.opacity = Math.max(0, 1 - p * 2);
              
              solarSystemWrapper.style.transform = `scale(${15 - 14 * p})`;
              solarSystemWrapper.style.opacity = Math.min(1, p * 2);
          } else {
              earthWrapper.style.opacity = 0;
          }
      }
      
      const sunSystemContainer = document.querySelector('.sun-system-container');
      if (solarSystemWrapper && milkyWayWrapper && sunSystemContainer) {
         
         if (spaceScrollProgress <= 0.15) {
             // Phase 0: Zoom out to Solar System
             milkyWayWrapper.style.opacity = 0;
         } else if (spaceScrollProgress <= 0.25) {
             // Phase 1: Admire Solar System (0.15 -> 0.25)
             solarSystemWrapper.style.transform = `scale(1)`;
             solarSystemWrapper.style.opacity = 1;
             milkyWayWrapper.style.opacity = 0;
         } else if (spaceScrollProgress <= 0.35) {
             // Phase 2: Solar System Shrinks (0.25 -> 0.35)
             const p = (spaceScrollProgress - 0.25) / 0.10;
             solarSystemWrapper.style.transform = `scale(${1 - p})`;
             solarSystemWrapper.style.opacity = Math.max(0, 1 - p * 2);
             milkyWayWrapper.style.opacity = 0;
         } else if (spaceScrollProgress <= 0.45) {
             // Phase 3: Milky Way Appears (0.35 -> 0.45)
             solarSystemWrapper.style.opacity = 0;
             const p = (spaceScrollProgress - 0.35) / 0.10;
             milkyWayWrapper.style.transform = `scale(${4 - 3 * p})`;
             milkyWayWrapper.style.opacity = p;
         } else if (spaceScrollProgress <= 0.55) {
             // Phase 4: Admire Milky Way (0.45 -> 0.55)
             solarSystemWrapper.style.opacity = 0;
             milkyWayWrapper.style.transform = `scale(1)`;
             milkyWayWrapper.style.opacity = 1;
         } else if (spaceScrollProgress <= 0.65) {
             // Phase 5: Milky Way Shrinks (0.55 -> 0.65)
             const p = (spaceScrollProgress - 0.55) / 0.10;
             solarSystemWrapper.style.opacity = 0;
             milkyWayWrapper.style.transform = `scale(${1 - p})`;
             solarSystemWrapper.style.opacity = Math.max(0, 1 - p * 2);
         } else {
             solarSystemWrapper.style.opacity = 0;
             milkyWayWrapper.style.opacity = 0;
         }
         
         // Apply Geocentric Camera Tracking dynamically - ALWAYS LOCKED TO EARTH!
         sunSystemContainer.style.transform = `translate(${-12 * Math.cos(earthAngleRad)}vw, ${-12 * Math.sin(earthAngleRad)}vw)`;
      }

      if (spaceCaption) {
        const captionOpacity = 1 - Math.min(1, spaceScrollProgress / 0.15);
        spaceCaption.style.opacity = Math.max(0, captionOpacity);
      }
      
      if (bgLayer) {
        bgLayer.style.opacity = 1 - spaceScrollProgress * 0.5;
      }
      
      if (nebula) {
        nebula.style.filter = `hue-rotate(${spaceScrollProgress * 180}deg)`;
        const pN = Math.max(0, spaceScrollProgress - 0.4) / 0.6;
        nebula.style.opacity = 1 - pN;
      }
    };
    
    window.addEventListener('wheel', (e) => {
      if (isSpaceView) {
        updateScrollProgress(e.deltaY);
      }
    }, { passive: true });
    
    let lastTouchY = 0;
    window.addEventListener('touchstart', (e) => {
      lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isSpaceView) {
        const deltaY = lastTouchY - e.touches[0].clientY;
        lastTouchY = e.touches[0].clientY;
        updateScrollProgress(deltaY * 3);
      }
    }, { passive: true });
    
    const focalLength = 300;
    const time = { current: 0 };

    // Animation Loop
    const drawCanvas = () => {
      if (!isSpaceView) {
        requestAnimationFrame(drawCanvas);
        return;
      }
      time.current += 0.016; // Approx 60fps time delta
      
      // Update DOM elements smoothly
      updateDOMForScroll();
      
      // Clear entirely for true DOM overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use Additive Blending for Cinematic Glow
      // NOTE: 'lighter' triggers massive GPU overdraw on thousands of elements, causing lag!
      // Switching back to 'source-over' for smooth 60fps performance while retaining aesthetics.
      ctx.globalCompositeOperation = 'source-over';
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Phase 0: 0.0 - 0.2 (Zoom out planets)
      // Phase 1: 0.2 - 0.4 (Zoom out Solar System)
      // Phase 2: 0.4 - 0.55 (Zoom out Milky Way)
      // Phase 3: 0.55 - 0.70 (Warp speed)
      // Phase 4: 0.70 - 0.85 (Cosmic Web)
      // Phase 5: 0.85 - 1.0 (Form Text) - Slower and longer

      // Draw subtle radial gradient behind text if forming
      if (spaceScrollProgress > 0.85) {
          const textFactor = (spaceScrollProgress - 0.85) / 0.15;
          const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width/3);
          bgGradient.addColorStop(0, `rgba(10, 30, 60, ${textFactor * 0.3})`);
          bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.globalCompositeOperation = 'source-over'; // Normal blend for bg
          ctx.fillStyle = bgGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'lighter'; // Back to Additive
      }

      stars.forEach((star, i) => {
        let drawX, drawY, drawZ, scale;
        
        if (spaceScrollProgress < 0.65) {
          // --- Phase 0-5: Hide Canvas stars, wait for Milky Way to shrink ---
          star.originX = star.x;
          star.originY = star.y;
          star.originZ = star.z;
          
        } else if (spaceScrollProgress < 0.75) {
          // --- Phase 6: Warp Speed (0.65 -> 0.75) ---
          const p1 = (spaceScrollProgress - 0.65) / 0.10; // 0 to 1
          const warpFactor = (1 - p1) * 6 + 0.2; // max at 0, slow at 1
          
          // Move forward in Z space
          star.z -= 50 * warpFactor;
          
          // Reset if passed camera
          if (star.z < 10) {
             star.z = 2000;
             star.x = (Math.random() - 0.5) * canvas.width * 4;
             star.y = (Math.random() - 0.5) * canvas.height * 4;
          }
          
          scale = focalLength / star.z;
          const px = star.x * scale + cx;
          const py = star.y * scale + cy;
          
          // Calculate previous position for streak
          const prevZ = star.z + 100 * warpFactor;
          const prevScale = focalLength / prevZ;
          const ppx = star.x * prevScale + cx;
          const ppy = star.y * prevScale + cy;
          
          // Fade in based on local progress
          const alpha = Math.max(0, Math.min(1, p1 * 5) * (1 - star.z/2000));
          
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = star.baseSize * scale * 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ppx, ppy);
          ctx.stroke();
          
          // Store origin for next phase
          star.originX = star.x;
          star.originY = star.y;
          star.originZ = star.z;
          
        } else if (spaceScrollProgress < 0.80) {
          // --- Phase 7: Fluid Cosmic Web (0.75 -> 0.80) ---
          // Fluid motion using sine waves
          star.originX += Math.sin(time.current + star.offset) * 0.5;
          star.originY += Math.cos(time.current * 0.8 + star.offset) * 0.5;
          star.originZ += Math.sin(time.current * 0.5 + star.offset) * 1.0;
          
          scale = focalLength / star.originZ;
          drawX = star.originX * scale + cx;
          drawY = star.originY * scale + cy;
          
          const alpha = Math.max(0, 1 - (star.originZ / 2000));
          
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          const size = star.baseSize * scale * 2;
          ctx.fillRect(drawX - size/2, drawY - size/2, size, size);
          
          // Draw Web Lines occasionally
          if (i % 8 === 0 && i < stars.length - 10) {
              const neighbor = stars[i+3];
              const nScale = focalLength / neighbor.originZ;
              const nX = neighbor.originX * nScale + cx;
              const nY = neighbor.originY * nScale + cy;
              const dist = Math.hypot(drawX - nX, drawY - nY);
              
              if (dist < 80) {
                  ctx.globalAlpha = alpha * (1 - dist/80) * 0.5;
                  ctx.lineWidth = 0.5;
                  ctx.beginPath();
                  ctx.moveTo(drawX, drawY);
                  ctx.lineTo(nX, nY);
                  ctx.stroke();
              }
          }
          
        } else {
          // --- Phase 8: Magnetic Constellation Text & Galaxy Swirl (0.80 -> 1.0) ---
          const textFactor = (spaceScrollProgress - 0.80) / 0.20; // 0 to 1
          
          // Expo InOut easing for magnetic snap
          const ease = textFactor < 0.5 ? 2 * textFactor * textFactor : 1 - Math.pow(-2 * textFactor + 2, 2) / 2;
          
          // Fluid drift overlay
          const driftX = Math.sin(time.current * 2 + star.offset) * 10 * (1 - ease);
          const driftY = Math.cos(time.current * 2 + star.offset) * 10 * (1 - ease);
          
          // Parabolic swirl intensity: 0 at start (no snapping), peaks at 1 (middle), 0 at end
          const swirlIntensity = 4 * ease * (1 - ease);
          
          // Swirl Trajectory
          const distToDest = 1 - ease;
          const spinAngle = distToDest * Math.PI * 3; // 1.5 rotations
          let swirlX = 0, swirlY = 0, swirlZ = 0;
          
          if (star.isTextPart) {
              swirlX = Math.cos(spinAngle + star.offset) * 300 * swirlIntensity;
              swirlY = Math.sin(spinAngle + star.offset) * 300 * swirlIntensity;
              swirlZ = Math.sin(spinAngle * 0.5 + star.offset) * 400 * swirlIntensity;
          } else {
              // Background stars form a massive swirling galaxy around the text
              swirlX = Math.cos(spinAngle * 0.5 + star.offset) * 800 * swirlIntensity;
              swirlY = Math.sin(spinAngle * 0.5 + star.offset) * 800 * swirlIntensity;
          }
          
          const curX = star.originX + (star.destX - star.originX) * ease + driftX + swirlX;
          const curY = star.originY + (star.destY - star.originY) * ease + driftY + swirlY;
          const curZ = star.originZ + (star.destZ - star.originZ) * ease + swirlZ;
          
          if (curZ < 5) return; // Fix: Prevent negative radius error when stars swirl behind the camera
          
          scale = focalLength / curZ;
          drawX = curX * scale + cx;
          drawY = curY * scale + cy;
          
          let alpha = 1 - (curZ / 2000);
          if (!star.isTextPart) alpha *= (1 - ease * 0.5); // Fade background stars slightly, but keep them visible
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fillStyle = '#ffffff';
          
          const baseDrawSize = star.baseSize * scale * (star.isTextPart ? 1 + ease * 0.5 : 1);
          
          if (star.isTextPart && textFactor > 0.7) {
              // Fast Node Glowing
              const glowStrength = (textFactor - 0.7) / 0.3; // 0 to 1
              const glowSize = baseDrawSize * 3;
              
              ctx.globalAlpha = Math.max(0, alpha * 0.2 * glowStrength);
              ctx.fillRect(drawX - glowSize/2, drawY - glowSize/2, glowSize, glowSize);
              ctx.globalAlpha = Math.max(0, alpha);
          }
          
          ctx.fillRect(drawX - baseDrawSize/2, drawY - baseDrawSize/2, baseDrawSize, baseDrawSize);
          
          // Draw Constellation Lines
          if (star.isTextPart && textFactor > 0.85 && i % 2 === 0 && i < stars.length - 1) {
              const nextStar = stars[i+1];
              if (nextStar && nextStar.isTextPart) {
                  // Swirl Z for the next star to connect accurately
                  const nSwirlZ = Math.sin(spinAngle * 0.5 + nextStar.offset) * 400 * distToDest;
                  const nCurZ = nextStar.originZ + (nextStar.destZ - nextStar.originZ) * ease + nSwirlZ;
                  if (nCurZ < 5) return;
                  
                  const nScale = focalLength / nCurZ;
                  
                  const nSwirlX = Math.cos(spinAngle + nextStar.offset) * 300 * distToDest;
                  const nSwirlY = Math.sin(spinAngle + nextStar.offset) * 300 * distToDest;
                  const nDriftX = Math.sin(time.current * 2 + nextStar.offset) * 10 * (1 - ease);
                  const nDriftY = Math.cos(time.current * 2 + nextStar.offset) * 10 * (1 - ease);
                  
                  const nDrawX = (nextStar.originX + (nextStar.destX - nextStar.originX) * ease + nDriftX + nSwirlX) * nScale + cx;
                  const nDrawY = (nextStar.originY + (nextStar.destY - nextStar.originY) * ease + nDriftY + nSwirlY) * nScale + cy;
                  
                  const distNode = Math.hypot(drawX - nDrawX, drawY - nDrawY);
                  
                  if (distNode < 120 * (1 - ease * 0.5)) {
                      ctx.globalAlpha = Math.max(0, alpha * (1 - distNode/120) * 0.6);
                      ctx.fillStyle = '#ffffff';
                      const lineW = 1;
                      // Fast line using narrow rect
                      const angle = Math.atan2(nDrawY - drawY, nDrawX - drawX);
                      ctx.save();
                      ctx.translate(drawX, drawY);
                      ctx.rotate(angle);
                      ctx.fillRect(0, -lineW/2, distNode, lineW);
                      ctx.restore();
                  }
              }
          }
        }
      });
      
      // Reset composite for next frame
      ctx.globalCompositeOperation = 'source-over';
      
      requestAnimationFrame(drawCanvas);
    };
    
    // Start loop
    drawCanvas();
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
