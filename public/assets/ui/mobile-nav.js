(() => {
  function init() {
    if (document.querySelector('.purpo-mobile-nav')) return;
    const nav = document.createElement('nav');
    nav.className = 'purpo-mobile-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'purpo-mobile-nav__toggle';
    toggle.setAttribute('aria-label', 'Open PURPO menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'purpo-mobile-menu');
    const logo = document.createElement('img');
    logo.src = '/assets/ui/purpo-logo-white.png';
    logo.alt = 'PURPO';
    toggle.append(logo);
    const panel = document.createElement('div');
    panel.id = 'purpo-mobile-menu';
    panel.className = 'purpo-mobile-nav__panel';
    panel.hidden = true;
    const path = location.pathname;
    const items = [
      ['/sa-gitna-ng-lahat/', '/assets/ui/sa-gitna-white.png', 'Sa Gitna ng Lahat EP'],
      ['/fade-away/', '/assets/ui/fade-away-white.png', 'Fade Away EP'],
      ['/mallig/', '/assets/ui/malilig-white.png', 'Mallig LP'],
    ];
    const sound = document.getElementById('soundToggle');
    if (sound) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'purpo-mobile-nav__sound';
      const icon = document.createElement('img');
      icon.alt = '';
      button.append(icon);
      const sync = () => {
        const on = sound.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-label', on ? 'Turn ambient sound off' : 'Turn ambient sound on');
        button.setAttribute('aria-pressed', String(on));
        icon.src = on ? '/assets/ui/sound-on.png' : '/assets/ui/sound-off.png';
      };
      button.addEventListener('click', () => { sound.click(); sync(); });
      new MutationObserver(sync).observe(sound, { attributes: true, attributeFilter: ['aria-pressed'] });
      sync();
      panel.append(button);
    }
    for (const [href, src, label] of items) {
      const a = document.createElement('a');
      a.className = 'purpo-mobile-nav__item';
      a.href = href;
      a.setAttribute('aria-label', label);
      if (path === href || path === href + 'index.html') a.setAttribute('aria-current', 'page');
      const img = document.createElement('img');
      img.src = src;
      img.alt = label;
      a.append(img);
      panel.append(a);
    }
    for (const [src, label] of [
      ['/assets/ui/visuals-white.png', 'Visuals'],
      ['/assets/ui/about-white.png', 'About'],
    ]) {
      const item = document.createElement('span');
      item.className = 'purpo-mobile-nav__item is-unavailable';
      item.setAttribute('aria-label', label + ' — coming soon');
      const img = document.createElement('img');
      img.src = src;
      img.alt = label;
      item.append(img);
      panel.append(item);
    }
    nav.append(toggle, panel);
    document.body.append(nav);
    const close = (restoreFocus = false) => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open PURPO menu');
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close PURPO menu' : 'Open PURPO menu');
    });
    document.addEventListener('click', event => { if (!nav.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) close(true); });
    for (const type of ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointerup']) {
      nav.addEventListener(type, event => event.stopPropagation(), { passive: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
