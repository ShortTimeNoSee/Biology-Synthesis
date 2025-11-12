document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.getElementById('nav-toggle');
    const navContainer = document.getElementById('nav-container');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const scrollTopBtn = document.getElementById('scroll-to-top');

    // 1. active page link highlighter
    const setActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav .nav-link');

        navLinks.forEach(link => {
            const linkPath = link.href.split('/').pop();
            if (linkPath === currentPath) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    // 2. mobile navigation
    const handleNavToggle = () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        body.classList.toggle('nav-open');
    };

    if (navToggle && navContainer) {
        navToggle.addEventListener('click', handleNavToggle);
    }

    // 3. theme toggler (light/dark)
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 4. scroll-to-top button
    const checkScroll = () => {
        if (!scrollTopBtn) return;
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (scrollTopBtn) {
        window.addEventListener('scroll', checkScroll);
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // 5. fade-in sections on scroll
    const fadeInSections = () => {
        const sections = document.querySelectorAll('.content-section');
        const options = { root: null, rootMargin: '0px', threshold: 0.1 };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
    };

    // 6. sticky nav active section highlighter
    const initPageNavObserver = () => {
        const pageNav = document.getElementById('page-nav');
        if (!pageNav) return;

        const navLinks = Array.from(pageNav.querySelectorAll('a'));
        const sections = navLinks.map(link => {
            const id = link.getAttribute('href').substring(1);
            return document.getElementById(id);
        }).filter(Boolean); // remove nulls

        if (sections.length === 0) return;

        const options = { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
    };


    // run initializers
    setActiveNavLink();
    initializeTheme();
    fadeInSections();
    initPageNavObserver();
});
