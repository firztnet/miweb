/* ═══════════════════════════════════════════════════
   Firztnet · main.js — Rediseño 2026
   Pure JS · Sin frameworks
═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ────────────────────────────────
     NAVBAR — scroll effect
  ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () =>
    navbar?.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ────────────────────────────────
     HAMBURGER — mobile menu
  ──────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navLinks?.classList.toggle('open', !isOpen);
  });

  navLinks?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      hamburger?.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    })
  );

  /* ────────────────────────────────
     FADE-UP — IntersectionObserver
  ──────────────────────────────── */
  const fadeObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ────────────────────────────────
     COTIZADOR INTERACTIVO
  ──────────────────────────────── */

  // Price matrix — base min/max per issue type
  const priceMatrix = {
    lento:       { base: 35,  max: 65,  label: 'Optimización y eliminación de malware' },
    no_enciende: { base: 50,  max: 95,  label: 'Diagnóstico de placa base / fuente de alimentación' },
    calor:       { base: 30,  max: 55,  label: 'Limpieza térmica y sustitución de pasta' },
    pantalla:    { base: 65,  max: 130, label: 'Sustitución de pantalla / GPU' },
    disco:       { base: 45,  max: 85,  label: 'Ampliación SSD NVMe o RAM' },
    datos:       { base: 60,  max: 150, label: 'Recuperación de datos' },
  };

  // Device multipliers
  const deviceMultiplier = {
    portatil_std:    1.0,
    portatil_gaming: 1.15,
    pc_torre:        0.9,
    mac:             1.3,
    servidor:        1.5,
  };

  // Device labels for WA message
  const deviceLabel = {
    portatil_std:    'Portátil estándar',
    portatil_gaming: 'Portátil Gaming',
    pc_torre:        'PC Sobremesa',
    mac:             'Apple Mac',
    servidor:        'Servidor / Red empresa',
  };

  const calcDevice  = document.getElementById('calcDevice');
  const calcIssue   = document.getElementById('calcIssue');
  const calcUrgency = document.getElementById('calcUrgency');
  const calcPrice   = document.getElementById('calcPrice');
  const calcTime    = document.getElementById('calcTime');
  const calcWpBtn   = document.getElementById('calcWpBtn');

  const updateCalc = () => {
    const issue    = calcIssue?.value || 'lento';
    const device   = calcDevice?.value || 'portatil_std';
    const urgency  = calcUrgency?.value || 'estandar';
    const express  = urgency === 'express';
    const matrix   = priceMatrix[issue] || priceMatrix.lento;
    const multi    = deviceMultiplier[device] || 1;

    let minP = Math.round(matrix.base * multi);
    let maxP = Math.round(matrix.max  * multi);
    if (express) { minP += 20; maxP += 20; }

    // Time estimate
    const timeMap = {
      lento:       express ? '24h express' : '24 – 48h',
      no_enciende: express ? '24h express' : '24 – 72h',
      calor:       express ? '24h express' : '24h',
      pantalla:    express ? '24h express' : '24 – 48h',
      disco:       express ? '24h express' : '24h',
      datos:       '48 – 72h (no aplica express)',
    };
    const tiempo = issue === 'datos' ? '48 – 72h' : (express ? '24h express ⚡' : timeMap[issue] || '24 – 48h');

    if (calcPrice) calcPrice.textContent = `${minP}€ – ${maxP}€`;
    if (calcTime)  calcTime.textContent  = `⏱️ Plazo estimado: ${tiempo} · Con 90 días de garantía`;

    // Update WA link
    if (calcWpBtn) {
      const deviceName  = deviceLabel[device] || device;
      const issueLabel  = calcIssue?.options[calcIssue.selectedIndex]?.text || '';
      const urgLabel    = express ? 'Express 24h' : 'Estándar';
      const waMsg = encodeURIComponent(
        `Hola Firztnet 👋 Quiero solicitar diagnóstico para:\n` +
        `📱 Dispositivo: ${deviceName}\n` +
        `🔧 Problema: ${issueLabel}\n` +
        `⏱ Urgencia: ${urgLabel}\n` +
        `💶 Presupuesto estimado vuestro: ${minP}€ – ${maxP}€\n\n` +
        `¿Cuándo podéis atenderme?`
      );
      calcWpBtn.onclick = () => window.open(`https://wa.me/34913252525?text=${waMsg}`, '_blank', 'noopener');
    }
  };

  [calcDevice, calcIssue, calcUrgency].forEach(el =>
    el?.addEventListener('change', updateCalc)
  );
  updateCalc();

  /* ────────────────────────────────
     GALLERY — filtros + lightbox
  ──────────────────────────────── */
  const galleryFilters = document.getElementById('galleryFilters');
  const galleryItems   = document.querySelectorAll('.gallery-item');

  galleryFilters?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    galleryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.classList.contains(filter);
      item.classList.toggle('hidden', !show);
    });
  });

  // Lightbox
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCap    = document.getElementById('lightboxCaption');
  const lightboxClose  = document.getElementById('lightboxClose');

  const openLightbox = (src, caption) => {
    if (!lightbox || !src) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    if (lightboxCap) lightboxCap.textContent = caption || '';
    lightbox.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => lightbox.classList.add('active'));
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    setTimeout(() => {
      if (lightbox) lightbox.hidden = true;
      if (lightboxImg) lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 320);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('hidden')) return;
      openLightbox(item.dataset.src || item.querySelector('img')?.src, item.dataset.caption);
    });
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) closeLightbox();
  });

  /* ────────────────────────────────
     FAQ — acordeón + buscador
  ──────────────────────────────── */
  const faqItems  = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faqSearch');
  const faqList   = document.getElementById('faqList');

  // Accordion
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Search / filter
  let noResultsEl = null;
  faqSearch?.addEventListener('input', () => {
    const q = faqSearch.value.trim().toLowerCase();

    let visible = 0;
    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const show = !q || text.includes(q);
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Show "no results" message
    if (!noResultsEl) {
      noResultsEl = document.createElement('p');
      noResultsEl.className = 'faq-no-results';
      noResultsEl.textContent = 'No encontramos esa pregunta. Escríbenos por WhatsApp 👇';
      faqList?.appendChild(noResultsEl);
    }
    noResultsEl.style.display = visible === 0 ? '' : 'none';
  });

  /* ────────────────────────────────
     CONTACT FORM — validación básica
  ──────────────────────────────── */
  const form      = document.getElementById('contactForm');
  const formOk    = document.getElementById('formOk');
  const formErr   = document.getElementById('formErr');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', e => {
    e.preventDefault();

    // Reset msgs
    if (formOk)  formOk.hidden  = true;
    if (formErr) formErr.hidden = true;

    const nombre  = form.nombre?.value.trim();
    const email   = form.email?.value.trim();
    const mensaje = form.mensaje?.value.trim();

    if (!nombre || !email || !mensaje) {
      if (formErr) { formErr.textContent = 'Rellena los campos obligatorios marcados con *.'; formErr.hidden = false; }
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (formErr) { formErr.textContent = 'El email no parece válido.'; formErr.hidden = false; }
      return;
    }

    // Enviar al backend de gestión de Firztnet
    const telefono = form.telefono?.value.trim() || 'Sin teléfono (contactar por email)';
    const equipo   = form.equipo?.value || '';

    if (submitBtn) {
      submitBtn.disabled = true;
      const span = submitBtn.querySelector('span');
      if (span) span.textContent = 'Enviando…';
    }

    fetch('https://firztnet-backend-production.up.railway.app/api/seguimiento/solicitar-presupuesto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:   nombre,
        telefono: telefono,
        email:    email,
        mensaje:  equipo ? `[${equipo}] ${mensaje}` : mensaje,
        negocio:  'firztnet'
      })
    })
    .then(res => res.json().then(datos => ({ ok: res.ok, datos })))
    .then(({ ok, datos }) => {
      if (!ok) throw new Error(datos.error || 'Error del servidor');
      form.reset();
      if (formOk) formOk.hidden = false;
    })
    .catch(() => {
      if (formErr) {
        formErr.textContent = 'No se pudo enviar. Prueba de nuevo o escríbenos por WhatsApp.';
        formErr.hidden = false;
      }
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Enviar mensaje y recibir diagnóstico';
      }
    });
  });

  /* ────────────────────────────────
     ESTADÍSTICAS — visitas, eventos, secciones
  ──────────────────────────────── */
  const API_ESTADISTICAS = 'https://firztnet-backend-production.up.railway.app/api/estadisticas';
  const SITIO_ACTUAL     = 'firztnet';

  // Registrar visita al cargar la página
  fetch(API_ESTADISTICAS + '/visita', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sitio:       SITIO_ACTUAL,
      ruta:        window.location.pathname + window.location.hash,
      referido:    document.referrer || 'directo',
      dispositivo: window.innerWidth <= 768 ? 'movil' : 'escritorio',
    }),
  }).catch(() => {});

  // Función para registrar eventos de clic
  const registrarEvento = (tipo, etiqueta) => {
    fetch(API_ESTADISTICAS + '/evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sitio: SITIO_ACTUAL, tipo, etiqueta }),
    }).catch(() => {});
  };

  // Clics en botones con data-evento="..."
  document.querySelectorAll('[data-evento]').forEach(el => {
    el.addEventListener('click', () => {
      registrarEvento('clic', el.getAttribute('data-evento'));
    });
  });

  // Qué secciones ve el usuario al hacer scroll (una vez por sección)
  if ('IntersectionObserver' in window) {
    const obsSeccion = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          registrarEvento('seccion_vista', 'seccion_' + entry.target.id);
          obsSeccion.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(s => obsSeccion.observe(s));
  }

  /* ────────────────────────────────
     SMOOTH SCROLL — compensar navbar
  ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top   = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
