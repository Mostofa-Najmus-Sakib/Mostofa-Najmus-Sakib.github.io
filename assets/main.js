const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

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
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 1001px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

let scrollQueued = false;
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

// Native dialogs handle focus trapping and return focus to the project card.
document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.dialog).showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === dialog && outside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
  });
});

const copyButton = document.querySelector('.copy-email');
const copyFeedback = document.querySelector('.copy-feedback');
copyButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('mostofa.najmus@gmail.com');
    copyButton.querySelector('span').textContent = 'Copied!';
    copyFeedback.textContent = 'Email address copied to clipboard.';
    setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy Email'; }, 3000);
  } catch {
    copyFeedback.textContent = 'Select the email address above to copy it, or choose Send an Email to open your email app.';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-link'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
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
  document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
}
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
