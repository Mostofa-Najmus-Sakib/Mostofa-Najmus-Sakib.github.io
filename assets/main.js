const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const filterButtons = document.querySelectorAll('.filter-button');
const publications = document.querySelectorAll('.publication');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedYear = button.dataset.year;
    let count = 0;
    publications.forEach((publication) => {
      const visible = selectedYear === 'all' || publication.dataset.year === selectedYear;
      publication.hidden = !visible;
      if (visible) count += 1;
    });
    filterButtons.forEach((filter) => {
      const active = filter === button;
      filter.setAttribute('aria-pressed', String(active));
      filter.classList.toggle('is-active', active);
    });
    document.querySelector('#publication-count').textContent = `${count} selected publication${count === 1 ? '' : 's'}`;
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
});

const copyButton = document.querySelector('.copy-email');
const copyFeedback = document.querySelector('.copy-feedback');
copyButton.addEventListener('click', async () => {
  const email = 'mostofa.najmus@gmail.com';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    copyButton.querySelector('span').textContent = 'Copied!';
    copyFeedback.textContent = 'Email address copied to clipboard.';
    setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy email'; }, 3000);
  } catch {
    copyFeedback.textContent = 'Select the email address above to copy it, or use Say hello to open your email app.';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-link'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section));
}

document.documentElement.classList.add('js-ready');
