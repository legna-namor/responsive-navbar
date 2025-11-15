(function () {
    'use strict';

    const menuButton = document.getElementById('menuButton');
    const panel = document.querySelector('.mobile-panel');

    if (!menuButton || !panel) return;

    function setOpen(open) {
        panel.setAttribute('data-open', String(open));
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    menuButton.addEventListener('click', () => {
        const isOpen = panel.getAttribute('data-open') === 'true';
        setOpen(!isOpen);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setOpen(false);
        }
    });

    document.addEventListener('mousedown', (e) => {
        const isOpen = panel.getAttribute('data-open') === 'true';
        if (!isOpen) return;

        if (!panel.contains(e.target) && !menuButton.contains(e.target)) {
            setOpen(false);
        }
    });

    panel.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A') {
            setOpen(false);
        }
    });

    const media = window.matchMedia('(min-width: 768px)');
    media.addEventListener('change', () => setOpen(false));

    const navLinks = Array.from(
        document.querySelectorAll('a[data-nav-link]')
    );

    if (navLinks.length === 0) return;

    const sectionMap = new Map();

    navLinks.forEach((link) => {
        const id = link.getAttribute('href');
        if (!id || !id.startsWith('#')) return;

        const section = document.querySelector(id);
        if (!section) return;

        sectionMap.set(section, id);
    });

    const sections = Array.from(sectionMap.keys());

    if (sections.length === 0) return;

    function setActiveLinkById(id) {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            let visibleEntry = null;

            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!visibleEntry || entry.intersectionRatio > visibleEntry.intersectionRatio) {
                        visibleEntry = entry;
                    }
                }
            }

            if (visibleEntry) {
                const id = sectionMap.get(visibleEntry.target);
                if (id) setActiveLinkById(id);
            }
        },
        {
            root: null,
            threshold: 0.4,
            rootMargin: '0px 0px -20% 0px',
        }
    );

    sections.forEach((section) => observer.observe(section));
})();
