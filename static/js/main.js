// Site-wide behaviour, loaded on every page.
// Everything here is an enhancement: without JavaScript all content is still visible.
(function () {
    var doc = document.documentElement;
    doc.classList.add('js');
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        // Header turns solid after scrolling; floating contact buttons appear after the hero.
        var header = document.querySelector('.site-header');
        var floaters = document.querySelectorAll('.action-bar, .wa-float');
        var ticking = false;
        function onScroll() {
            var y = window.scrollY;
            if (header) header.classList.toggle('is-scrolled', y > 40);
            floaters.forEach(function (el) { el.classList.toggle('is-visible', y > 420); });
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
        }, { passive: true });
        onScroll();

        // Mobile menu
        var menu = document.getElementById('mobile-menu');
        var openBtn = document.querySelector('.menu-toggle');
        var closeBtn = menu && menu.querySelector('.menu-close');
        function setMenu(open) {
            if (!menu) return;
            menu.classList.toggle('is-open', open);
            menu.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
            document.body.classList.toggle('menu-open', open);
            if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open && closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
            else if (!open && openBtn) openBtn.focus();
        }
        if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
        if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false);
        });

        // Reveal sections as they scroll into view
        var revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && !reducedMotion) {
            var revealObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        revealObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(function (el) { revealObs.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-in'); });
        }

        // Count-up for numbers marked with data-count (e.g. 200,000)
        var counters = document.querySelectorAll('[data-count]');
        if ('IntersectionObserver' in window && !reducedMotion) {
            var countObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    countObs.unobserve(entry.target);
                    var el = entry.target;
                    var finalText = el.textContent;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    var sep = el.getAttribute('data-sep') || '';
                    var start = null, dur = 1600;
                    function format(n) {
                        return sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n);
                    }
                    function step(ts) {
                        if (!start) start = ts;
                        var p = Math.min((ts - start) / dur, 1);
                        var eased = 1 - Math.pow(1 - p, 4);
                        el.textContent = format(Math.round(target * eased));
                        if (p < 1) requestAnimationFrame(step);
                        else el.textContent = finalText;
                    }
                    requestAnimationFrame(step);
                });
            }, { threshold: 0.5 });
            counters.forEach(function (el) { countObs.observe(el); });
        }

        // Certificate lightbox
        var box = document.getElementById('lightbox');
        if (box && typeof box.showModal === 'function') {
            var boxImg = box.querySelector('img');
            var boxCap = box.querySelector('p');
            document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    boxImg.src = btn.getAttribute('data-lightbox');
                    boxImg.alt = btn.getAttribute('data-caption') || '';
                    boxCap.textContent = btn.getAttribute('data-caption') || '';
                    box.showModal();
                });
            });
            box.querySelector('.lightbox__close').addEventListener('click', function () { box.close(); });
            box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
        } else {
            // Old browsers: open the full image directly.
            document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
                btn.addEventListener('click', function () { window.location.href = btn.getAttribute('data-lightbox'); });
            });
        }
    });
})();
