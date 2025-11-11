// small interactive bits
document.getElementById('year').textContent = new Date().getFullYear();

// Live background animation
function createLiveBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'live-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-2';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 0.3)`
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  }

  function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  initParticles();
  animate();
}

createLiveBackground();

// Smooth scroll for anchors on home page only
document.querySelectorAll('a.nav-link[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    if(this.getAttribute('href').startsWith('#')){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Handle Register form
const regForm = document.querySelector('form[action="register"]') || document.querySelector('#registerForm');
if(regForm){
  regForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const pass = this.querySelectorAll('input[type="password"]')[0].value;
    const confirm = this.querySelectorAll('input[type="password"]')[1].value;
    if(pass !== confirm){
      alert('Passwords do not match');
      return;
    }
    const user = {name, email, pass};
    localStorage.setItem('wanderwave_user', JSON.stringify(user));
    alert('Registration successful! You can now login.');
    window.location.href = 'login.html';
  });
}

// Handle Login form
const loginForm = document.querySelector('form[action="login"]') || document.querySelector('#loginForm');
if(loginForm){
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value.trim();
    const pass = this.querySelector('input[type="password"]').value;
    const stored = localStorage.getItem('wanderwave_user');
    if(!stored){alert('No user found. Please register first.'); return;}
    const user = JSON.parse(stored);
    if(user.email === email && user.pass === pass){
      alert('Login successful! Welcome, ' + user.name);
      window.location.href = 'index.html';
    } else {
      alert('Invalid email or password');
    }
  });
}
