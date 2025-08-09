// Año en footer
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil (solo afecta a móviles)
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
}));

// Carrusel testimonios
const track = document.querySelector('.carousel-track');
const prev = document.querySelector('.carousel .prev');
const next = document.querySelector('.carousel .next');
function updateButtons(){
  if(!track) return;
  const maxScroll = track.scrollWidth - track.clientWidth;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= maxScroll - 1;
}
function scrollCard(dir=1){
  if(!track) return;
  const width = track.clientWidth;
  track.scrollBy({ left: dir * width, behavior: 'smooth' });
  setTimeout(updateButtons, 280);
}
prev?.addEventListener('click', () => scrollCard(-1));
next?.addEventListener('click', () => scrollCard(1));
track?.addEventListener('scroll', updateButtons);
updateButtons();

// Validación del formulario
const form = document.getElementById('contact-form');
const ok = document.getElementById('form-ok');
function setError(input, message){
  const small = input.parentElement?.querySelector('.error');
  if (small) small.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}
function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = form.nombre;
  const email = form.email;
  const telefono = form.telefono;
  const mensaje = form.mensaje;

  let valid = true;
  if (!nombre.value.trim()) { setError(nombre, 'Escribe tu nombre'); valid = false; } else setError(nombre, '');
  if (!validateEmail(email.value)) { setError(email, 'Email no válido'); valid = false; } else setError(email, '');
  if (telefono.value && !/^[0-9+()\-\s]{7,}$/.test(telefono.value)) { setError(telefono, 'Teléfono no válido'); valid = false; } else setError(telefono, '');
  if (!mensaje.value.trim()) { setError(mensaje, 'Cuéntanos tu problema'); valid = false; } else setError(mensaje, '');

  if (!valid) return;
  ok.hidden = false;
  form.reset();
  form.querySelectorAll('.error').forEach(s => s.textContent = '');
});


// === Contact Modal logic ===
(function(){
  const modal = document.getElementById('contact-modal');
  const fab = document.getElementById('contact-fab');
  const openers = document.querySelectorAll('a[href="#contacto"], #contact-fab');
  const closeEls = modal ? modal.querySelectorAll('[data-close="true"]') : [];

  function openModal(e){
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    const fabBtn = document.getElementById('contact-fab');
    if (fabBtn) fabBtn.setAttribute('aria-expanded','true');
    // Focus first field if exists
    const firstInput = modal.querySelector('#contact-form input, #contact-form textarea, #contact-form button');
    firstInput?.focus();
  }
  function closeModal(e){
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    const fabBtn = document.getElementById('contact-fab');
    if (fabBtn) fabBtn.setAttribute('aria-expanded','false');
    fab?.focus();
  }

  openers.forEach(el => el.addEventListener('click', openModal));
  closeEls && closeEls.forEach(el => el.addEventListener('click', closeModal));
  // Close on overlay click
  modal?.addEventListener('click', (ev) => {
    if ((ev.target).getAttribute && (ev.target).getAttribute('data-close') === 'true') closeModal(ev);
  });
  // Escape key
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal?.classList.contains('open')) closeModal(ev);
  });
})();

