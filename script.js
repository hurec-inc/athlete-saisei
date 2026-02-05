document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');

  const animatedElements = document.querySelectorAll('[data-animate]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
    // continue to allow menu interactions even if reduce motion is on, but return early for scroll animations
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    document.body.classList.add('nav-enhanced');

    const setMenuAriaState = (isOpen) => {
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      siteNav.setAttribute('aria-hidden', String(!isOpen));
    };

    const closeMenu = () => {
      setMenuAriaState(false);
      siteNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    const openMenu = () => {
      setMenuAriaState(true);
      siteNav.classList.add('is-open');
      document.body.classList.add('nav-open');
    };

    const desktopMediaQuery = window.matchMedia('(min-width: 901px)');

    const syncWithViewport = () => {
      if (desktopMediaQuery.matches) {
        siteNav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        siteNav.removeAttribute('aria-hidden');
      } else {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          openMenu();
        } else {
          closeMenu();
        }
      }
    };

    syncWithViewport();

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    siteNav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element) {
        const link = target.closest('a');
        if (link) {
          closeMenu();
        }
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    const handleViewportChange = () => syncWithViewport();

    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', handleViewportChange);
    } else if (typeof desktopMediaQuery.addListener === 'function') {
      desktopMediaQuery.addListener(handleViewportChange);
    }

    window.addEventListener('resize', handleViewportChange);
  }

  // simplified: no stage control needed (flow-band covers intro -> solution)
});
