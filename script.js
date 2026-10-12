const sections = [...document.querySelectorAll('.panel')];
const body = document.body;
const scrollIndicator = document.querySelector('.scroll-indicator__line');

const setTheme = (theme) => {
  body.dataset.theme = theme;
};

const updateProgressBar = () => {
  const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = totalScrollable > 0 ? (window.scrollY / totalScrollable) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${Math.min(Math.max(progress, 0), 100)}%`);
  scrollIndicator.style.height = `${Math.min(Math.max(progress, 0), 100)}%`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: '0px 0px -8% 0px',
  }
);

sections.forEach((section) => {
  revealObserver.observe(section);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const theme = visible.target.dataset.theme || 'dawn';
    setTheme(theme);
  },
  {
    threshold: [0.45, 0.7],
    rootMargin: '-10% 0px -15% 0px',
  }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', updateProgressBar, { passive: true });
window.addEventListener('load', () => {
  updateProgressBar();
  const firstTheme = sections[0]?.dataset.theme || 'dawn';
  setTheme(firstTheme);
});

const handlePointer = (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  document.documentElement.style.setProperty('--pointer-x', `${x}px`);
  document.documentElement.style.setProperty('--pointer-y', `${y}px`);

  document.querySelectorAll('.orb').forEach((orb, index) => {
    const depth = (index + 1) * 0.6;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
};

window.addEventListener('pointermove', handlePointer, { passive: true });
