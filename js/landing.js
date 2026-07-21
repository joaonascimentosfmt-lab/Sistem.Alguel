(function () {
  const revealElements = document.querySelectorAll(
    '.hero-badges, .hero-text-col h1, .hero-sub, .hero-cta, .hero-visual-col, ' +
    '.section-label, .section-title, .section-desc, ' +
    '.about-text, .about-grid, .dash-mockup, .screens-grid, ' +
    '.phones-row, .features-grid, .ai-card, .benefits-col, ' +
    '.security-grid, .plans-row, .footer'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((el) => {
    if (
      !el.classList.contains('hero-badges') &&
      !el.classList.contains('hero-visual-col') &&
      !el.classList.contains('msg')
    ) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(el);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((el) => {
    if (
      el.classList.contains('hero-badges') ||
      el.classList.contains('hero-visual-col')
    )
      return;
    revealObserver.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const msgs = document.querySelectorAll('.msg');
  if (msgs.length) {
    msgs.forEach((msg, i) => {
      msg.style.animationPlayState = 'paused';
    });
    const chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            msgs.forEach((msg) => {
              msg.style.animationPlayState = 'running';
            });
            chatObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    chatObserver.observe(document.querySelector('.chat'));
  }

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 60) {
      navbar.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  console.log('LocaFacil landing page ready.');
})();
