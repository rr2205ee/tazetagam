// Site-wide behavior. Loaded on every page from base.html.
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu: toggle button + close when a link is chosen
    var navlinks = document.getElementById('navlinks');
    var toggle = document.querySelector('.nav-toggle');
    if (toggle && navlinks) {
        toggle.addEventListener('click', function () {
            navlinks.classList.toggle('open');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navlinks) navlinks.classList.remove('open');
        });
    });

    // Back to top button
    var backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function () {
            backBtn.classList.toggle('show', window.scrollY > 300);
        });
        backBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll-reveal: cards and headings fade in as they enter the viewport.
    // The .reveal class is only added here, so without JS nothing is hidden.
    if ('IntersectionObserver' in window && !reducedMotion) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.feature, .stream, .farm, .section-head, .country-chip, .panel-stat').forEach(function (el, i) {
            el.classList.add('reveal');
            el.style.transitionDelay = (i % 4) * 90 + 'ms';
            revealObs.observe(el);
        });
    }

    // Count-up animation for the big statistics (e.g. 200,000 hens)
    if ('IntersectionObserver' in window && !reducedMotion) {
        var countObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                countObs.unobserve(entry.target);
                var el = entry.target;
                var raw = el.textContent.trim();
                var target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
                if (!target || target < 10) return;
                var useComma = raw.indexOf(',') !== -1;
                var start = null, dur = 1400;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    var val = Math.round(target * eased);
                    el.textContent = useComma ? val.toLocaleString('en-US') : String(val);
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = raw;
                }
                requestAnimationFrame(step);
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('.panel-stat .num').forEach(function (el) { countObs.observe(el); });
    }

    // Cookie consent banner. There is no server now, so the visitor's choice is
    // stored in localStorage and the banner is revealed only when no choice exists.
    var banner = document.getElementById('cookieBanner');
    if (banner) {
        var stored = null;
        try { stored = localStorage.getItem('cookies_consent'); } catch (e) { /* private mode */ }
        if (stored !== 'accepted' && stored !== 'rejected') {
            banner.style.display = 'flex';
        }
        document.querySelectorAll('.js-cookie-choice').forEach(function (btn) {
            btn.addEventListener('click', function () {
                try { localStorage.setItem('cookies_consent', btn.dataset.choice); } catch (e) { /* ignore */ }
                banner.style.display = 'none';
            });
        });
    }
});
