document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.getElementById('nav-toggle');
    const navContainer = document.getElementById('nav-container');
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    const htmlElement = document.documentElement;
    const scrollTopBtn = document.getElementById('scroll-to-top');

    const citationData = {
        "ref-1": `<strong>Dysregulation of dopamine receptors linked to suicide, study finds</strong><br>Dolan, E. W. (2024, May 22). <i>PsyPost</i>.`,
        "ref-2": `<strong>SSRIs and Benzodiazepines for General Anxiety Disorders (GAD)</strong><br>Gomez, A. F., & Hofmann, S. G. (n.d.). Anxiety and Depression Association of America.`,
        "ref-3": `<strong>Profile: John H. Krystal, MD</strong><br>Yale School of Medicine. (n.d.).`,
        "ref-4": `<strong>Rapid-acting glutamatergic antidepressants: The path to ketamine and beyond</strong><br>Krystal, J. H., Sanacora, G., & Duman, R. S. (2013). <i>Biological Psychiatry, 73</i>(12), 1133–1141.`,
        "ref-5": `<strong>People with obsessive-compulsive disorder have an imbalance of brain chemicals...</strong><br>Robbins, T., Sahakian, B. J., & Biria, M. (2023, June 28). <i>The Conversation</i>.`,
        "ref-6": `<strong>Research: People with obsessive-compulsive disorder have an imbalance of brain chemicals</strong><br>University College London. (2023, June 28). <i>UCL News</i>.`
    };

    let popupTimeout;
    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    document.body.appendChild(popup);

    const showPopup = (link) => {
        clearTimeout(popupTimeout);
        
        const href = link.getAttribute('href');
        const refId = href.includes('#') ? href.split('#')[1] : null;
        
        if (!refId || !citationData[refId]) return;

        popup.innerHTML = citationData[refId];
        popup.style.display = 'block';
        popup.style.opacity = '1';

        const linkRect = link.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = linkRect.top - popupRect.height - 10; 
        let left = linkRect.left + (linkRect.width / 2) - (popupRect.width / 2);

        if (top < 10) { 
            top = linkRect.bottom + 10; 
        }

        if (left < 10) left = 10;
        if (left + popupRect.width > viewportWidth - 10) {
            left = viewportWidth - popupRect.width - 10;
        }

        popup.style.top = `${top + window.scrollY}px`;
        popup.style.left = `${left + window.scrollX}px`;
    };

    const hidePopup = () => {
        popupTimeout = setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.style.opacity === '0') {
                    popup.style.display = 'none';
                }
            }, 200);
        }, 300);
    };

    document.querySelectorAll('.citation-link').forEach(link => {
        link.addEventListener('mouseenter', () => showPopup(link));
        link.addEventListener('mouseleave', hidePopup);
        link.addEventListener('focus', () => showPopup(link));
        link.addEventListener('blur', hidePopup);
    });

    popup.addEventListener('mouseenter', () => clearTimeout(popupTimeout));
    popup.addEventListener('mouseleave', hidePopup);

    const setActiveNavLink = () => {
        // remove .html if present
        const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const navLinks = document.querySelectorAll('.main-nav .nav-link');

        navLinks.forEach(link => {
            // Clean link: remove .html if present
            const linkPath = link.href.split('/').pop().replace('.html', '') || 'index';
            
            // Match 'index' to '' or 'index'
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const handleNavToggle = () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        body.classList.toggle('nav-open');
    };

    if (navToggle && navContainer) {
        navToggle.addEventListener('click', handleNavToggle);
        
        navContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('nav-open')) {
                    handleNavToggle();
                }
            });
        });
    }

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

    themeToggles.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

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

    const initPageNavObserver = () => {
        const pageNav = document.getElementById('page-nav');
        if (!pageNav) return;

        const navLinks = Array.from(pageNav.querySelectorAll('a'));
        const sections = navLinks.map(link => {
            const id = link.getAttribute('href').substring(1);
            return document.getElementById(id);
        }).filter(Boolean);

        if (sections.length === 0) return;

        const options = { root: null, rootMargin: '0px 0px -80% 0px', threshold: 0 };

        const observer = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                const id = entry.target.id;
                const navLink = pageNav.querySelector(`a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, options);
        
        sections.forEach(section => observer.observe(section));
        
        const introSection = document.getElementById('intro');
        if (introSection && window.scrollY < 100) {
             navLinks.forEach(link => link.classList.remove('active'));
             const introLink = pageNav.querySelector(`a[href="#intro"]`);
             if(introLink) introLink.classList.add('active');
        }
    };

    setActiveNavLink();
    initializeTheme();
    fadeInSections();
    initPageNavObserver();
});
