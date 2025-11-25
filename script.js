document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.getElementById('nav-toggle');
    const navContainer = document.getElementById('nav-container');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const scrollTopBtn = document.getElementById('scroll-to-top');

    // --- CITATION DATA ---
    const citationData = {
        "ref-1": `<strong>Dysregulation of dopamine receptors linked to suicide, study finds</strong><br>Dolan, E. W. (2024, May 22). <i>PsyPost</i>.`,
        "ref-2": `<strong>SSRIs and Benzodiazepines for General Anxiety Disorders (GAD)</strong><br>Gomez, A. F., & Hofmann, S. G. (n.d.). Anxiety and Depression Association of America.`,
        "ref-3": `<strong>Profile: John H. Krystal, MD</strong><br>Yale School of Medicine. (n.d.).`,
        "ref-4": `<strong>Rapid-acting glutamatergic antidepressants: The path to ketamine and beyond</strong><br>Krystal, J. H., Sanacora, G., & Duman, R. S. (2013). <i>Biological Psychiatry, 73</i>(12), 1133–1141.`,
        "ref-5": `<strong>People with obsessive-compulsive disorder have an imbalance of brain chemicals...</strong><br>Robbins, T., Sahakian, B. J., & Biria, M. (2023, June 28). <i>The Conversation</i>.`,
        "ref-6": `<strong>Research: People with obsessive-compulsive disorder have an imbalance of brain chemicals</strong><br>University College London. (2023, June 28). <i>UCL News</i>.`
    };

    // --- POPUP LOGIC ---
    let popupTimeout;
    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    document.body.appendChild(popup);

    const showPopup = (link) => {
        clearTimeout(popupTimeout);
        
        // 1. ID from href (e.g., "about.html#ref-1" -> "ref-1")
        const refId = link.getAttribute('href').split('#')[1];
        if (!citationData[refId]) return;

        // 2. Set content
        popup.innerHTML = citationData[refId];
        popup.style.display = 'block';
        popup.style.opacity = '1';

        // 3. Positioning logic
        const linkRect = link.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Default: center above the link
        let top = linkRect.top - popupRect.height - 10; 
        let left = linkRect.left + (linkRect.width / 2) - (popupRect.width / 2);

        // Check top edge (Flip to bottom if cut off)
        if (top < 10) { 
            // 10px buffer from top
            top = linkRect.bottom + 10; 
        }

        // Check horizontal edges (clamp)
        if (left < 10) left = 10;
        if (left + popupRect.width > viewportWidth - 10) {
            left = viewportWidth - popupRect.width - 10;
        }

        // Apply absolute positions (adjusted for scroll)
        popup.style.top = `${top + window.scrollY}px`;
        popup.style.left = `${left + window.scrollX}px`;
    };

    const hidePopup = () => {
        popupTimeout = setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                // Only hide display after fade out if opacity is still 0
                if (popup.style.opacity === '0') {
                    popup.style.display = 'none';
                }
            }, 200);
        }, 300); // 300ms grace period to move mouse to popup
    };

    // Attach events to all citation links
    document.querySelectorAll('.citation-link').forEach(link => {
        link.addEventListener('mouseenter', () => showPopup(link));
        link.addEventListener('mouseleave', hidePopup);
        // Accessibility: Show on focus
        link.addEventListener('focus', () => showPopup(link));
        link.addEventListener('blur', hidePopup);
    });

    // Keep popup open when hovering over the popup itself
    popup.addEventListener('mouseenter', () => clearTimeout(popupTimeout));
    popup.addEventListener('mouseleave', hidePopup);


    // --- STANDARD SITE LOGIC (Navigation, Theme, etc.) ---

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
        
        navContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('nav-open')) {
                    handleNavToggle();
                }
            });
        });
    }

    // 3. theme toggler
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

    // 5. fade-in sections
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

    // Run initializers
    setActiveNavLink();
    initializeTheme();
    fadeInSections();
    initPageNavObserver();
});
