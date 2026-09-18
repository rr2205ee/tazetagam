// Contact form submission. Posts to Web3Forms, which emails each enquiry.
// Translated strings come from data-* attributes on the form, so this file
// stays language-agnostic. The form also works without JavaScript: it is a
// plain POST to the same endpoint, which then redirects back with ?sent=1.
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var MSG = {
        sending: form.dataset.sending,
        send: form.dataset.send,
        error: form.dataset.error,
        conn: form.dataset.conn,
        success: form.dataset.success,
        missing: form.dataset.missing,
        invalidEmail: form.dataset.invalidEmail,
        short: form.dataset.short,
        long: form.dataset.long
    };

    var alertBox = document.getElementById('alert');

    function box(kind, text) {
        var ok = kind === 'ok';
        var bg = ok ? '#e4efe2' : '#f7e2e0', col = ok ? '#234d2c' : '#7a2820', br = ok ? '#bcd6b8' : '#e6b8b2';
        var div = document.createElement('div');
        div.setAttribute('style', 'background:' + bg + ';color:' + col + ';border:1px solid ' + br + ';padding:14px;border-radius:10px;margin-bottom:16px');
        div.textContent = text;
        return div;
    }

    // The no-JavaScript path lands back here with ?sent=1 after Web3Forms
    // redirects, so show the same confirmation the fetch path shows.
    if (/[?&]sent=1(&|$)/.test(window.location.search)) {
        alertBox.replaceChildren(box('ok', MSG.success));
        history.replaceState(null, '', window.location.pathname);
    }

    // Same rules the Flask server used to enforce. Returns an error string, or null.
    function validate(v) {
        if (!v.name || !v.email || !v.message) return MSG.missing;
        if (v.name.length > 200 || v.email.length > 200 || v.phone.length > 50 ||
            v.topic.length > 200 || v.message.length > 5000) return MSG.long;
        if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(v.email)) return MSG.invalidEmail;
        if (v.message.length < 10) return MSG.short;
        return null;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = document.getElementById('submitBtn');
        var values = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            topic: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        var problem = validate(values);
        if (problem) {
            alertBox.replaceChildren(box('err', problem));
            return;
        }

        btn.disabled = true; btn.textContent = MSG.sending; alertBox.innerHTML = '';
        try {
            var res = await fetch(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: form.querySelector('[name="access_key"]').value,
                    subject: form.querySelector('[name="subject"]').value,
                    from_name: form.querySelector('[name="from_name"]').value,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    topic: values.topic,
                    message: values.message
                })
            });
            var data = await res.json();
            if (res.ok && data.success) {
                // Show our own translated confirmation, not the service's English one.
                alertBox.replaceChildren(box('ok', MSG.success));
                form.reset();
            } else {
                alertBox.replaceChildren(box('err', MSG.error));
            }
        } catch (err) {
            alertBox.replaceChildren(box('err', MSG.conn));
        } finally {
            btn.disabled = false; btn.textContent = MSG.send;
        }
    });
});
