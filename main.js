// ── Navbar injection ──────────────────────────────────────────
const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'about.html', label: 'About' },
  { href: 'team.html',  label: 'Team' },
  { href: 'join.html',  label: 'Join' },
];

function currentPage() {
  const path = location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
}

function buildNavbar() {
  const page = currentPage();

  const desktopLinks = NAV_LINKS.map(({ href, label }) =>
    `<li><a href="${href}" class="${href === page ? 'active' : ''}">${label}</a></li>`
  ).join('');

  const mobileLinks = NAV_LINKS.map(({ href, label }) =>
    `<a href="${href}" class="${href === page ? 'active' : ''}">${label}</a>`
  ).join('');

  const navbar = document.createElement('nav');
  navbar.className = 'navbar';
  navbar.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">
        <img src="pwebicon.png" alt="PantherWeb" class="navbar-logo" />
      </a>
      <ul class="navbar-links">${desktopLinks}</ul>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">${mobileLinks}</div>
  `;

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.id = 'nav-backdrop';

  document.body.prepend(backdrop);
  document.body.prepend(navbar);

  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    backdrop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  backdrop.addEventListener('click', closeMenu);
}

// ── Typing animation (home page only) ────────────────────────
function startTyping(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;

  const text = '</pantherweb>';
  let i = 0;

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '|';

  const textNode = document.createTextNode('');
  el.appendChild(textNode);
  el.appendChild(cursor);

  setTimeout(() => {
    const interval = setInterval(() => {
      if (i <= text.length) {
        textNode.textContent = text.slice(0, i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
  }, 300);
}

// ── Join form validation ──────────────────────────────────────
function initJoinForm() {
  const form = document.getElementById('join-form');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id + '-error');
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const fullName = form.fullName.value.trim();
    const email    = form.email.value.trim();
    const major    = form.major.value.trim();
    const year     = form.year.value;
    const why      = form.why.value.trim();

    let valid = true;

    if (!fullName) { showError('fullName', 'Full name is required.'); valid = false; }
    if (!email)          { showError('email', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
    if (!major)    { showError('major', 'Major is required.'); valid = false; }
    if (!year)     { showError('year', 'Please select your year.'); valid = false; }
    if (!why)      { showError('why', 'Please tell us why you want to join.'); valid = false; }

    if (!valid) return;

    // Show thank you
    form.closest('.content').innerHTML = `
      <div class="thank-you">
        <h1>Thank You</h1>
        <p>Your application has been submitted. We'll be in touch soon!</p>
        <a href="join.html" class="btn">Submit Another</a>
      </div>
    `;
  });
}

// ── Track footer position as --floor CSS variable ────────────
function updateFloor() {
  const container = document.getElementById('bg-tags');
  const footer    = document.querySelector('.footer');
  if (!container || !footer) return;
  const top   = footer.getBoundingClientRect().top;
  const floor = Math.max(80, Math.min(top, window.innerHeight - 10));
  container.style.setProperty('--floor', `${floor}px`);
}

// ── Falling bg tags ──────────────────────────────────────────
function spawnBgTags() {
  const container = document.getElementById('bg-tags');
  if (!container) return;

  const tags = [
    '<html>', '</html>', '<div>', '</div>', '<p>', '</p>',
    '<span>', '<h1>', '</h1>', '<body>', '<header>', '</header>',
    '<nav>', '<section>', '<a>', '</a>', '<img />', '<input />',
    '.class {}', '#id', '{ }', 'color:', 'margin:', 'padding:',
    'display:', 'flex', 'grid', '@media', ':root',
    'const', 'let', 'var', '=>', 'function()', 'return',
    'import', 'export', '[ ]', '{ }', 'async', 'await',
  ];

  const count = 28;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'bg-tag';
    el.textContent = tags[i % tags.length];

    const size   = 0.65 + Math.random() * 0.6;          // 0.65–1.25rem
    const left   = Math.random() * 97;                   // 0–97%
    const dur    = 10 + Math.random() * 14;              // 10–24s
    const delay  = -(Math.random() * dur);               // start mid-fall
    const opacity = 0.055 + Math.random() * 0.07;        // 0.055–0.125

    el.style.cssText = `
      --op: ${opacity};
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(el);
  }
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  initJoinForm();
  spawnBgTags();
  updateFloor();
  window.addEventListener('scroll', updateFloor, { passive: true });
  window.addEventListener('resize', updateFloor, { passive: true });
});

// Typing runs on every page load/reload (including bfcache restores)
window.addEventListener('pageshow', () => {
  const el = document.getElementById('hero-title');
  if (!el) return;
  el.textContent = '';   // reset before re-typing
  startTyping('hero-title');
});
