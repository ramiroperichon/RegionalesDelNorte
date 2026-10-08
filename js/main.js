/* =========================================================
   Regionales del Norte — catálogo, pedido y formularios
   Sitio 100 % estático: el pedido se envía por WhatsApp.
   ========================================================= */

/* ---------- Configuración (DATOS A CONFIRMAR con la empresa) ---------- */
const CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  whatsapp: '5493773450740',
  email: 'administracion@regionalesdelnorte.com',
  // Año de inicio de la empresa: se usa para "Desde ..." y "+XX años".
  foundedYear: 1990,
};

/* ---------- Catálogo ----------
   Para agregar un producto, sumá un objeto a esta lista.
   - image: ruta a la foto. Si no hay foto, se dibuja un frasco ilustrativo
     con los colores de "label".
   - price: precio en pesos (número entero). Precios de ejemplo. */
const PRODUCTS = [
  {
    id: 'ciervo',
    name: 'Ciervo',
    style: 'Deshuesado en escabeche',
    category: 'monte',
    size: 'Frasco 375 g',
    price: 12500,
    image: 'img/ciervo.jpg',
    description: 'Carne magra de ciervo, deshuesada y cocida lentamente en escabeche de vinagre, aceite, laurel y pimienta. Ideal para picadas.',
  },
  {
    id: 'pavita',
    name: 'Pavita',
    style: 'Deshuesada en escabeche',
    category: 'aves',
    size: 'Frasco 375 g',
    price: 9800,
    image: 'img/pavita.jpg',
    description: 'Carne tierna de pavita, deshuesada, en un escabeche suave con verduras y especias. Una entrada clásica, lista para servir.',
  },
  {
    id: 'jabali',
    name: 'Jabalí',
    style: 'Deshuesado en escabeche',
    category: 'monte',
    size: 'Frasco 375 g',
    price: 12500,
    label: { bg: '#cfa556', band: '#5b2a17' },
    description: 'Sabor intenso de monte, equilibrado con la acidez del escabeche y un toque de ají. Para acompañar con pan casero.',
  },
  {
    id: 'carpincho',
    name: 'Carpincho',
    style: 'Deshuesado en escabeche',
    category: 'monte',
    size: 'Frasco 375 g',
    price: 11900,
    label: { bg: '#d5b660', band: '#1f5132' },
    description: 'Un clásico del Litoral: carne magra de carpincho de criadero, preparada con la receta tradicional correntina.',
  },
  {
    id: 'liebre',
    name: 'Liebre',
    style: 'Deshuesada en escabeche',
    category: 'monte',
    size: 'Frasco 375 g',
    price: 11500,
    label: { bg: '#d8c78e', band: '#6a3a1c' },
    description: 'Carne de liebre de sabor delicado, deshuesada y conservada en escabeche con cebolla, zanahoria y laurel.',
  },
  {
    id: 'codorniz',
    name: 'Codorniz',
    style: 'Deshuesada en escabeche',
    category: 'aves',
    size: 'Frasco 375 g',
    price: 10900,
    label: { bg: '#bfc56c', band: '#2c4a1c' },
    description: 'Codornices deshuesadas en un escabeche aromático y suave. Una opción distinta para entradas y tablas.',
  },
];

const CATEGORY_LABELS = { monte: 'Carnes de monte', aves: 'Aves' };
const STORAGE_KEY = 'rdn-pedido';
const MAX_QTY = 99;

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});
const formatPrice = (n) => money.format(n);

const escapeHTML = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const whatsappURL = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

const productById = (id) => PRODUCTS.find((p) => p.id === id);

let svgCounter = 0;

/* Frasco ilustrativo para productos sin foto (mismo estilo que las etiquetas reales) */
function jarSVG(p) {
  const uid = `${p.id}-${++svgCounter}`;
  const { bg, band } = p.label || { bg: '#cfa556', band: '#1f3d2c' };
  const name = p.name.toUpperCase();
  const fontSize = Math.min(28, 158 / (name.length * 0.68)).toFixed(1);

  return `
  <svg viewBox="0 0 240 230" role="img" aria-label="Frasco ilustrativo de ${escapeHTML(p.name)} en escabeche">
    <defs>
      <linearGradient id="content-${uid}" x1="0" x2="1">
        <stop offset="0" stop-color="#2f210e"/>
        <stop offset=".28" stop-color="#8a5f28"/>
        <stop offset=".55" stop-color="#b3803c"/>
        <stop offset=".82" stop-color="#6e4a1e"/>
        <stop offset="1" stop-color="#2f210e"/>
      </linearGradient>
      <linearGradient id="lid-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#d9d6cf"/>
      </linearGradient>
      <linearGradient id="shine-${uid}" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".35"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="220" rx="98" ry="7" fill="#000" opacity=".55"/>
    <path d="M58 58C34 62 26 76 26 96v94c0 18 12 26 32 26h124c20 0 32-8 32-26V96c0-20-8-34-32-38Z" fill="url(#content-${uid})"/>
    <rect x="56" y="46" width="128" height="16" rx="4" fill="#4a3518"/>
    <rect x="46" y="16" width="148" height="36" rx="9" fill="url(#lid-${uid})"/>
    <path d="M50 24h140M50 44h140" stroke="#bdb8ad" stroke-width="1"/>
    <rect x="106" y="14" width="28" height="86" fill="#74acdf"/>
    <rect x="114" y="14" width="12" height="86" fill="#fdfdfb"/>
    <rect x="26" y="96" width="188" height="94" fill="${bg}"/>
    <rect x="26" y="96" width="188" height="4" fill="${band}"/>
    <rect x="26" y="186" width="188" height="4" fill="${band}"/>
    <ellipse cx="120" cy="116" rx="40" ry="13" fill="#f6edd2" stroke="${band}" stroke-width="2"/>
    <text x="120" y="116.5" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-style="italic" font-weight="700" font-size="12" fill="${band}">Regionales</text>
    <text x="120" y="124.5" text-anchor="middle" font-family="'Source Sans 3', sans-serif" font-weight="600" font-size="6" letter-spacing=".8" fill="${band}">DEL NORTE</text>
    <rect x="26" y="134" width="188" height="32" fill="${band}"/>
    <text x="120" y="158.5" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="${fontSize}" fill="#fffaf0" letter-spacing="1">${escapeHTML(name)}</text>
    <text x="120" y="180" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-style="italic" font-weight="700" font-size="12" fill="${band}">${escapeHTML(p.style)}</text>
    <path d="M37 94c-3 32-3 66 1 100h9c-4-34-4-68-1-100Z" fill="url(#shine-${uid})"/>
  </svg>`;
}

function productMedia(p) {
  return p.image
    ? `<img src="${p.image}" alt="Frasco de ${escapeHTML(p.name)} ${escapeHTML(p.style.toLowerCase())}, Regionales del Norte" loading="lazy" width="460" height="460">`
    : jarSVG(p);
}

/* ---------- Años de trayectoria ---------- */
function fillYears() {
  const now = new Date().getFullYear();
  $$('[data-founded]').forEach((el) => { el.textContent = CONFIG.foundedYear; });
  $$('[data-years]').forEach((el) => { el.textContent = now - CONFIG.foundedYear; });
  $$('[data-current-year]').forEach((el) => { el.textContent = now; });
}

/* ---------- Catálogo ---------- */
function renderProducts() {
  const grid = $('#product-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="card" data-id="${p.id}" data-category="${p.category}">
      <div class="card__media">
        ${p.image ? '' : '<span class="card__badge">Imagen ilustrativa</span>'}
        ${productMedia(p)}
      </div>
      <div class="card__body">
        <p class="card__cat">${CATEGORY_LABELS[p.category] || ''}</p>
        <h3 class="card__title">${escapeHTML(p.name)} <em class="card__style">${escapeHTML(p.style.toLowerCase())}</em></h3>
        <p class="card__desc">${escapeHTML(p.description)}</p>
        <div class="card__meta">
          <span class="card__size">${escapeHTML(p.size)}</span>
          <span class="card__price">${formatPrice(p.price)}</span>
        </div>
        <div class="card__actions">
          <div class="qty" role="group" aria-label="Cantidad de ${escapeHTML(p.name)}">
            <button type="button" data-step="-1" aria-label="Restar uno"><svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <output data-qty aria-live="polite">1</output>
            <button type="button" data-step="1" aria-label="Sumar uno"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
          </div>
          <button type="button" class="btn btn--forest" data-add>Agregar</button>
        </div>
      </div>
    </article>`).join('');

  [...grid.children].forEach((card, i) => card.style.setProperty('--i', i));
  fadeInImages(grid);

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const out = $('[data-qty]', card);
    const stepBtn = e.target.closest('[data-step]');

    if (stepBtn) {
      const next = Math.min(MAX_QTY, Math.max(1, Number(out.textContent) + Number(stepBtn.dataset.step)));
      out.textContent = next;
      return;
    }
    if (e.target.closest('[data-add]')) {
      const qty = Number(out.textContent);
      Cart.add(card.dataset.id, qty);
      out.textContent = 1;
      const p = productById(card.dataset.id);
      toast(`Agregaste ${qty} × ${p.name} a tu pedido`);
    }
  });
}

function setupFilters() {
  const chips = $$('[data-filter]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      filterCards(f);
    });
  });
}

/* ---------- Pedido (carrito) ---------- */
const Cart = {
  items: {},

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      // Solo conservar productos que siguen existiendo en el catálogo
      Object.entries(saved).forEach(([id, qty]) => {
        if (productById(id) && Number(qty) > 0) this.items[id] = Math.min(MAX_QTY, Number(qty));
      });
    } catch (_) { /* almacenamiento no disponible */ }
  },

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)); } catch (_) { /* sin almacenamiento */ }
  },

  add(id, qty = 1) {
    this.items[id] = Math.min(MAX_QTY, (this.items[id] || 0) + qty);
    this.changed(true);
  },

  set(id, qty) {
    if (qty <= 0) delete this.items[id];
    else this.items[id] = Math.min(MAX_QTY, qty);
    this.changed();
  },

  count() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  },

  total() {
    return Object.entries(this.items).reduce((sum, [id, q]) => sum + productById(id).price * q, 0);
  },

  changed(bump = false) {
    this.save();
    renderCart();
    if (bump) {
      const badge = $('[data-cart-count]');
      badge.classList.remove('bump');
      void badge.offsetWidth; // reinicia la animación
      badge.classList.add('bump');
    }
  },
};

function renderCart() {
  const list = $('[data-cart-list]');
  const entries = Object.entries(Cart.items);
  const empty = entries.length === 0;

  $('[data-cart-count]').textContent = Cart.count();
  $('[data-cart-empty]').hidden = !empty;
  $('[data-cart-checkout]').hidden = empty;
  $('[data-cart-foot]').hidden = empty;
  $('[data-cart-total]').textContent = formatPrice(Cart.total());

  list.innerHTML = entries.map(([id, qty]) => {
    const p = productById(id);
    return `
      <li class="cart-item" data-id="${id}">
        <div class="cart-item__thumb">${productMedia(p)}</div>
        <div>
          <div class="cart-item__name">${escapeHTML(p.name)}</div>
          <div class="cart-item__price">${formatPrice(p.price)} c/u</div>
        </div>
        <div class="cart-item__subtotal">${formatPrice(p.price * qty)}</div>
        <div class="cart-item__controls">
          <div class="qty qty--sm" role="group" aria-label="Cantidad de ${escapeHTML(p.name)}">
            <button type="button" data-cart-step="-1" aria-label="Restar uno"><svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <span>${qty}</span>
            <button type="button" data-cart-step="1" aria-label="Sumar uno"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
          </div>
          <button type="button" class="cart-item__remove" data-cart-remove>
            <svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg> Quitar
          </button>
        </div>
      </li>`;
  }).join('');

  [...list.children].forEach((li, i) => li.style.setProperty('--i', i));
  fadeInImages(list);
}

function setupCartList() {
  $('[data-cart-list]').addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = item.dataset.id;
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      Cart.set(id, (Cart.items[id] || 0) + Number(step.dataset.cartStep));
      // Mantener el foco dentro del carrito después de re-renderizar
      const again = $(`.cart-item[data-id="${id}"] [data-cart-step="${step.dataset.cartStep}"]`);
      (again || $('#cart .drawer__head .icon-btn')).focus();
    } else if (e.target.closest('[data-cart-remove]')) {
      Cart.set(id, 0);
      $('#cart .drawer__head .icon-btn').focus();
    }
  });
}

/* ---------- Panel lateral ---------- */
const drawer = {
  el: null,
  overlay: null,
  lastFocus: null,

  open() {
    this.lastFocus = document.activeElement;
    $('[data-toast]').classList.remove('is-visible');
    this.overlay.hidden = false;
    requestAnimationFrame(() => {
      this.overlay.classList.add('is-open');
      this.el.classList.add('is-open');
    });
    this.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(() => $('.drawer__head .icon-btn', this.el).focus(), 50);
  },

  close() {
    if (!this.el.classList.contains('is-open')) return;
    this.el.classList.remove('is-open');
    this.overlay.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    setTimeout(() => { this.overlay.hidden = true; }, 300);
    if (this.lastFocus) this.lastFocus.focus();
  },

  init() {
    this.el = $('#cart');
    this.overlay = $('.drawer-overlay');

    $$('[data-cart-open]').forEach((b) => b.addEventListener('click', () => this.open()));
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-cart-close]')) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') { this.close(); return; }
      if (e.key !== 'Tab') return;
      // Mantener el foco dentro del panel
      const focusables = $$('a[href], button:not([disabled]), input, select, textarea', this.el)
        .filter((n) => n.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  },
};

/* ---------- Envío del pedido por WhatsApp ---------- */
function setupCheckout() {
  const form = $('#checkout');
  const error = $('.form-error', form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').trim();
    const localidad = (data.get('localidad') || '').trim();

    const missing = [[form.nombre, nombre], [form.localidad, localidad]].filter(([, v]) => !v);
    [form.nombre, form.localidad].forEach((input) => input.removeAttribute('aria-invalid'));
    missing.forEach(([input]) => input.setAttribute('aria-invalid', 'true'));
    error.hidden = missing.length === 0;
    if (missing.length) { missing[0][0].focus(); return; }

    const lines = Object.entries(Cart.items).map(([id, qty]) => {
      const p = productById(id);
      return `• ${qty} × ${p.name} ${p.style.toLowerCase()} — ${formatPrice(p.price * qty)}`;
    });

    const comentarios = (data.get('comentarios') || '').trim();
    const message = [
      '¡Hola, Regionales del Norte! Quiero hacer el siguiente pedido:',
      '',
      ...lines,
      '',
      `*Total estimado: ${formatPrice(Cart.total())}* (sin envío)`,
      '',
      `Nombre: ${nombre}`,
      `Localidad: ${localidad}`,
      `Entrega: ${data.get('entrega')}`,
      comentarios ? `Comentarios: ${comentarios}` : '',
      '',
      '¡Muchas gracias!',
    ].filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');

    window.open(whatsappURL(message), '_blank', 'noopener');
  });
}

/* ---------- Formulario de contacto (mail o WhatsApp) ---------- */
function setupContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const error = $('.form-error', form);
  let channel = 'mail';

  // Respaldo para navegadores sin SubmitEvent.submitter
  $$('[data-send]', form).forEach((b) => b.addEventListener('click', () => { channel = b.dataset.send; }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter && e.submitter.dataset.send) channel = e.submitter.dataset.send;

    const fields = ['nombre', 'contacto', 'mensaje'].map((n) => form.elements[n]);
    const missing = fields.filter((f) => !f.value.trim());
    fields.forEach((f) => f.removeAttribute('aria-invalid'));
    missing.forEach((f) => f.setAttribute('aria-invalid', 'true'));
    error.hidden = missing.length === 0;
    if (missing.length) { missing[0].focus(); return; }

    const nombre = form.elements.nombre.value.trim();
    const contacto = form.elements.contacto.value.trim();
    const motivo = form.elements.motivo.value;
    const mensaje = form.elements.mensaje.value.trim();
    const body = `${mensaje}\n\n—\nNombre: ${nombre}\nContacto: ${contacto}\nMotivo: ${motivo}`;

    if (channel === 'whatsapp') {
      window.open(whatsappURL(`Hola, soy ${nombre}. ${motivo}:\n\n${body}`), '_blank', 'noopener');
    } else {
      const subject = `${motivo} — ${nombre}`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  });
}

/* ---------- Enlaces directos a WhatsApp ---------- */
function setupWhatsappLinks() {
  $$('[data-whatsapp]').forEach((a) => {
    a.href = whatsappURL(a.dataset.whatsapp);
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ---------- Navegación ---------- */
function setupNav() {
  const toggle = $('.nav-toggle');
  const nav = $('#nav');

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // Resaltar la sección visible
  if (!('IntersectionObserver' in window)) return;
  const links = new Map($$('.nav__list a').map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      const link = links.get(entry.target.id);
      if (link) link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => io.observe(s));
}

/* ---------- Animaciones de entrada ---------- */
function setupReveal() {
  // Numera a los hijos para el escalonado y parte los títulos en palabras
  $$('.reveal--stagger').forEach((el) => indexChildren(el));
  $$('[data-split]').forEach((el) => splitWords(el));

  const items = $$('.reveal, [data-split]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* Asigna --i a cada hijo directo, para retrasar su entrada */
function indexChildren(el) {
  [...el.children].forEach((child, i) => child.style.setProperty('--i', i));
}

/* Envuelve cada palabra en un <span> conservando el marcado interno */
function splitWords(root) {
  if (root.dataset.splitDone) return;
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const text = child.nodeValue;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--i', i++);
          span.textContent = part;
          frag.appendChild(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(root);
  root.dataset.splitDone = '1';
}

/* =========================================================
   Movimiento: scroll, parallax, inclinación de tarjetas
   Todo comprueba "prefers-reduced-motion" antes de activarse.
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionOK = () => !reduceMotion.matches;

/* Barra de progreso + encabezado compacto, en un solo cálculo por cuadro */
function setupScrollEffects() {
  const bar = $('.scroll-progress span');
  const header = $('.header');
  const timeline = $('.timeline');
  let ticking = false;

  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (timeline) updateTimeline(timeline);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* La línea de la trayectoria se dibuja a medida que se baja */
function updateTimeline(el) {
  const rect = el.getBoundingClientRect();
  const start = window.innerHeight * 0.85;
  const span = rect.height + start - window.innerHeight * 0.25;
  const progress = Math.max(0, Math.min(1, (start - rect.top) / span));
  el.style.setProperty('--progress', progress.toFixed(3));

  const items = [...el.children];
  items.forEach((li, i) => {
    li.classList.toggle('is-passed', progress >= (i + 0.5) / items.length);
  });
}

/* Brillo que sigue al cursor y parallax del conjunto de frascos */
function setupHeroMotion() {
  const hero = $('.hero');
  const visual = $('[data-parallax]');
  if (!hero || !finePointer.matches) return;

  hero.addEventListener('pointerenter', () => hero.classList.add('is-lit'));
  hero.addEventListener('pointerleave', () => {
    hero.classList.remove('is-lit');
    if (!visual) return;
    visual.classList.remove('is-tracking');
    visual.style.setProperty('--px', '0px');
    visual.style.setProperty('--py', '0px');
  });

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    hero.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    hero.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    if (!visual || !motionOK()) return;
    visual.classList.add('is-tracking');
    visual.style.setProperty('--px', `${((x - 0.5) * -18).toFixed(1)}px`);
    visual.style.setProperty('--py', `${((y - 0.5) * -14).toFixed(1)}px`);
  });
}

/* Inclinación 3D de las tarjetas de producto */
function setupCardTilt() {
  const grid = $('#product-grid');
  if (!grid || !finePointer.matches) return;

  grid.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card');
    if (!card || !motionOK()) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.classList.add('is-tilting');
    card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(y * -7).toFixed(2)}deg`);
  });

  const reset = (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-tilting');
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
  };
  grid.addEventListener('pointerleave', reset, true);
  grid.addEventListener('pointerout', (e) => {
    if (e.relatedTarget && e.target.closest('.card') === e.relatedTarget.closest?.('.card')) return;
    reset(e);
  });
}

/* Botones que se acercan levemente al cursor */
function setupMagnetic() {
  if (!finePointer.matches) return;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (!motionOK()) return;
      const r = el.getBoundingClientRect();
      el.classList.add('is-tracking');
      el.style.setProperty('--mgx', `${((e.clientX - r.left) / r.width - 0.5) * 12}px`);
      el.style.setProperty('--mgy', `${((e.clientY - r.top) / r.height - 0.5) * 10}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tracking');
      el.style.setProperty('--mgx', '0px');
      el.style.setProperty('--mgy', '0px');
    });
  });
}

/* Los años de trayectoria cuentan hacia arriba al entrar en pantalla */
function setupCountUp() {
  const targets = $$('[data-years]');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const end = Number(entry.target.textContent);
      if (!Number.isFinite(end) || !motionOK()) return;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        entry.target.textContent = Math.round(end * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      entry.target.textContent = 0;
      requestAnimationFrame(step);
    });
  }, { threshold: 1 });
  targets.forEach((el) => io.observe(el));
}

/* Las fotos entran con un fundido cuando terminan de cargar */
function fadeInImages(root = document) {
  $$('img', root).forEach((img) => {
    if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
  });
}

/* Filtra el catálogo con una transición en lugar de un salto */
function filterCards(f) {
  const cards = $$('#product-grid .card');
  const show = (card) => f === 'todos' || card.dataset.category === f;

  if (!motionOK()) {
    cards.forEach((card) => { card.hidden = !show(card); });
    return;
  }

  cards.forEach((card) => { if (!card.hidden) card.classList.add('is-leaving'); });

  setTimeout(() => {
    let i = 0;
    cards.forEach((card) => {
      card.classList.remove('is-leaving', 'is-entering');
      card.hidden = !show(card);
      if (card.hidden) return;
      card.style.setProperty('--i', i++);
      // Reinicia la animación de entrada
      void card.offsetWidth;
      card.classList.add('is-entering');
    });
  }, 220);
}

/* ---------- Aviso breve ---------- */
let toastTimer;
function toast(text) {
  const el = $('[data-toast]');
  el.textContent = text;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

/* ---------- Inicio ---------- */
document.addEventListener('DOMContentLoaded', () => {
  fillYears();
  renderProducts();
  setupFilters();
  Cart.load();
  renderCart();
  setupCartList();
  drawer.init();
  setupCheckout();
  setupContactForm();
  setupWhatsappLinks();
  setupNav();
  setupReveal();
  setupScrollEffects();
  setupHeroMotion();
  setupCardTilt();
  setupMagnetic();
  setupCountUp();
  fadeInImages();
});
