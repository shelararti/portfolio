// Highlight active nav link while scrolling
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navigation a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href").includes(current));
  });
});

document.querySelectorAll('.navigation a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));

    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

window.addEventListener("load", () => {
  document.querySelector(".hero").classList.add("show-content");
});


/*********************************
 * 1. Futuristic Floating Particles
 *********************************/
const canvas = document.getElementById("bg-particles");
const ctx = canvas.getContext("2d");

function resizeParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener("resize", resizeParticles);

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    glow: Math.random() * 15 + 5,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(125, 211, 252, 0.8)";
    ctx.shadowBlur = p.glow;
    ctx.shadowColor = "#38bdf8";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x > canvas.width || p.x < 0) p.dx *= -1;
    if (p.y > canvas.height || p.y < 0) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();



/*********************************
 * 2. Magnetic Buttons
 *********************************/
const magneticButtons = document.querySelectorAll(".hero .buttons a");

magneticButtons.forEach(btn => {
  btn.classList.add("magnetic");

  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

