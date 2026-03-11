(() => {
  const body = document.body;
  const focusable = 'a[href],button:not([disabled]),input:not([disabled])';
  let activeTrap = null;

  const lockScroll = (on) => { body.style.overflow = on ? 'hidden' : ''; };
  const trapFocus = (el) => {
    activeTrap = el;
    const nodes = [...el.querySelectorAll(focusable)];
    if (nodes[0]) nodes[0].focus();
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.dataset.trap = 'on';
    el.addEventListener('keydown', handler);
    el._trapHandler = handler;
  };
  const releaseFocus = (el) => {
    if (!el || !el._trapHandler) return;
    el.removeEventListener('keydown', el._trapHandler);
    delete el._trapHandler;
    activeTrap = null;
  };

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-wrap').forEach(w => { if (!w.contains(e.target)) w.classList.remove('open'); });
  });

  const drawer = document.querySelector('.mobile-drawer');
  const menuBtn = document.querySelector('.menu-btn');
  const closeDrawerBtn = document.querySelector('.drawer-close');
  const closeDrawer = () => { drawer?.classList.remove('open'); lockScroll(false); releaseFocus(drawer); };
  const openDrawer = () => { drawer?.classList.add('open'); lockScroll(true); trapFocus(drawer); };
  menuBtn?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelector('.drawer-backdrop')?.addEventListener('click', closeDrawer);

  const modal = document.getElementById('privacy-modal');
  const openModalBtn = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.querySelectorAll('[data-close-modal]');
  const closeModal = () => { modal?.classList.remove('open'); lockScroll(false); releaseFocus(modal); };
  openModalBtn.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); modal?.classList.add('open'); lockScroll(true); trapFocus(modal); }));
  closeModalBtn.forEach(btn => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  document.querySelectorAll('.faq-item .faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      document.querySelectorAll('.faq-item').forEach(f => { if (f !== item) f.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-confirm');
      if (msg) msg.textContent = 'After you sign up, you will see a clear setup checklist. We may send a short email to confirm your details.';
      form.reset();
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card, .visual').forEach(el => {
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'transform .35s ease';
    io.observe(el);
  });
})();
