gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// ADD ALL YOUR PHOTOS HERE! 
// You can add as many as you want ("photo9.jpg", "photo10.jpg", etc.)
// The gallery will automatically resize and fit them perfectly!
// ----------------------------------------------------
const myPhotos = [
  "photo1.jpg",
  "photo2.jpg",
  "photo3.jpg",
  "photo4.jpg",
  "photo5.jpg",
  "photo6.jpg",
  "photo7.jpg",
  "photo8.jpg"
];

// ----------------------------------------------------
// 1. THREE.JS CINEMATIC 3D BACKGROUND ANIMATION
// ----------------------------------------------------
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const colorAccent = new THREE.Color('#B600A8'); 
const colorWhite = new THREE.Color('#ffffff');

for(let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i+1] = (Math.random() - 0.5) * 100;
    posArray[i+2] = (Math.random() - 0.5) * 100;
    
    const mixedColor = Math.random() > 0.8 ? colorAccent : colorWhite;
    colorsArray[i] = mixedColor.r;
    colorsArray[i+1] = mixedColor.g;
    colorsArray[i+2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.01;
    particlesMesh.rotation.y += 0.05 * (mouseX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (mouseY - particlesMesh.rotation.x);
    camera.position.y = -window.scrollY * 0.01;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------------------------------------------
// 2. INFINITE MARQUEE IMAGES
// ----------------------------------------------------
const row1Images = [...myPhotos, ...myPhotos, ...myPhotos, ...myPhotos];
const reversedPhotos = [...myPhotos].reverse();
const row2Images = [...reversedPhotos, ...reversedPhotos, ...reversedPhotos, ...reversedPhotos];

const createImgHTML = (src) => `<img src="${src}" class="h-[250px] md:h-[300px] w-auto rounded-2xl shrink-0 transition-all duration-500 hover:scale-[1.02] shadow-md hover:shadow-xl" loading="lazy">`;

document.querySelector('.marquee-row-1').innerHTML = row1Images.map(createImgHTML).join('');
document.querySelector('.marquee-row-2').innerHTML = row2Images.map(createImgHTML).join('');

gsap.to('.marquee-row-1', {
  x: () => -400 + window.scrollY * 0.3,
  ease: "none",
  scrollTrigger: { trigger: "#marquee", start: "top bottom", end: "bottom top", scrub: true }
});
gsap.to('.marquee-row-2', {
  x: () => 400 - window.scrollY * 0.3,
  ease: "none",
  scrollTrigger: { trigger: "#marquee", start: "top bottom", end: "bottom top", scrub: true }
});

// ----------------------------------------------------
// 3. EXPERTISE DATA
// ----------------------------------------------------
const services = [
  { num: "01", name: "Lead Actor", desc: "Commanding screen presence with the ability to carry full feature films and deliver powerful emotional performances." },
  { num: "02", name: "Character Acting", desc: "Transformative ability to completely embody unique characters, from intense villains to charismatic supporting roles." },
  { num: "03", name: "Theater & Stage", desc: "Classically trained stage actor with a strong vocal projection and live audience connection." }
];

document.getElementById('services-list').innerHTML = services.map(s => `
  <div class="service-item flex flex-col md:flex-row items-start md:items-center py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] last:border-0 opacity-0 translate-y-8">
    <span class="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)] leading-none md:w-1/3 mb-4 md:mb-0">${s.num}</span>
    <div class="md:w-2/3 flex flex-col gap-2 md:gap-4">
      <h3 class="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)]">${s.name}</h3>
      <p class="font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60 text-[#0C0C0C]">${s.desc}</p>
    </div>
  </div>
`).join('');

// ----------------------------------------------------
// 4. MASONRY GALLERY (UNLIMITED PHOTOS)
// ----------------------------------------------------
const container = document.getElementById('projects-container');
container.className = "max-w-7xl mx-auto w-full px-2";
container.innerHTML = `
  <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 w-full">
    ${myPhotos.map((src) => `
      <div class="gallery-photo break-inside-avoid relative group rounded-[30px] overflow-hidden cursor-pointer shadow-2xl border border-white/10" onclick="openLightbox('${src}')">
        <img src="${src}" class="w-full h-auto transition-all duration-700 transform group-hover:scale-105" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 pointer-events-none">
            <span class="text-white font-bold tracking-widest uppercase text-xs border border-white/30 rounded-full px-4 py-2 backdrop-blur-sm">View Shot</span>
        </div>
      </div>
    `).join('')}
  </div>
`;

// Animate photos fading up as you scroll to them
const galleryPhotos = document.querySelectorAll('.gallery-photo');
galleryPhotos.forEach((photo) => {
  gsap.from(photo, {
    y: 80, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out",
    scrollTrigger: { 
        trigger: photo, 
        start: "top bottom-=50",
        toggleActions: "play none none reverse"
    }
  });
});

// ----------------------------------------------------
// 5. ABOUT TEXT & GENERAL ANIMATIONS
// ----------------------------------------------------
const textEl = document.getElementById('animated-text');
const text = textEl.innerText;
textEl.innerHTML = '';
text.split('').forEach(char => {
  if (char === ' ') {
    textEl.appendChild(document.createTextNode(' '));
  } else {
    const span = document.createElement('span');
    span.innerText = char;
    span.className = 'char inline-block';
    textEl.appendChild(span);
  }
});

gsap.to('.char', {
  opacity: 1, stagger: 0.02,
  scrollTrigger: { trigger: "#animated-text", start: "top 80%", end: "top 30%", scrub: true }
});

gsap.from('.gs-fade-in-down', { y: -20, opacity: 0, duration: 0.7, ease: "power2.out" });
gsap.from('.gs-fade-in-up-delay-1', { y: 40, opacity: 0, duration: 0.7, delay: 0.15, ease: "power2.out" });
gsap.from('.gs-fade-in-up-delay-2', { y: 20, opacity: 0, duration: 0.7, delay: 0.35, ease: "power2.out" });
gsap.from('.gs-fade-in-up-delay-3', { y: 30, opacity: 0, duration: 0.7, delay: 0.6, ease: "power2.out" });
gsap.from('.gs-fade-up', { y: 40, opacity: 0, duration: 0.7, scrollTrigger: "#about" });

gsap.to('.service-item', {
  y: 0, opacity: 1, stagger: 0.1, duration: 0.7,
  scrollTrigger: { trigger: "#services-list", start: "top 80%" }
});

// Magnetic Image Hover Effect
const magnetEl = document.querySelector('.magnet-element');
let isHovering = false;
let xTo = gsap.quickTo(magnetEl, "x", {duration: 0.4, ease: "power3"});
let yTo = gsap.quickTo(magnetEl, "y", {duration: 0.4, ease: "power3"});

document.addEventListener("mousemove", (e) => {
  const rect = magnetEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distX = e.clientX - centerX;
  const distY = e.clientY - centerY;
  const distance = Math.sqrt(distX**2 + distY**2);
  
  if (distance < rect.width / 2 + 150) {
    isHovering = true;
    xTo(distX / 5); 
    yTo(distY / 5);
  } else if (isHovering) {
    isHovering = false;
    gsap.to(magnetEl, {x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)"});
  }
});

// --- Lightbox Logic ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

window.openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
    // slight delay to allow display block to apply before animating opacity
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightboxImg.classList.remove('scale-95');
        lightboxImg.classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    lightboxImg.classList.remove('scale-100');
    lightboxImg.classList.add('scale-95');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }, 300);
};

if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}
