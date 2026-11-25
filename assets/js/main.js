(function () {
  var nav = document.getElementById('nav');
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40 || menu.classList.contains('open')); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
    onScroll();
  }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    onScroll();
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Speisekarten-Tabs
  var tabs = document.querySelectorAll('.menu-tabs button');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', on);
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  // Reservierung (Demo: nichts wird wirklich gesendet)
  var form = document.getElementById('form');
  if (form) {
    var today = new Date().toISOString().slice(0, 10);
    if (form.datum) form.datum.min = today;
    var mail = form.getAttribute('data-mail');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      ['datum', 'zeit', 'name', 'kontakt'].forEach(function (n) {
        var f = form[n]; if (!f) return;
        var bad = !f.value.trim();
        f.classList.toggle('err', bad); if (bad) ok = false;
      });
      if (!ok) return;
      var p = form.datum.value.split('-');
      var datum = p[2] + '.' + p[1] + '.' + p[0];
      if (mail) {
        var body = 'Guten Tag,\n\nich möchte gern einen Tisch reservieren:\n\nDatum: ' + datum + '\nUhrzeit: ' + form.zeit.value +
          '\nPersonen: ' + form.personen.value + (form.nachricht.value ? '\n\n' + form.nachricht.value : '') +
          '\n\nViele Grüße\n' + form.name.value + '\n' + form.kontakt.value;
        window.location.href = 'mailto:' + mail + '?subject=' + encodeURIComponent('Tischreservierung ' + datum + ', ' + form.zeit.value + ' Uhr') + '&body=' + encodeURIComponent(body);
      }
      var msg = document.getElementById('ok');
      msg.textContent = 'Danke, ' + form.name.value + '! Ihre Anfrage für den ' + datum + ' um ' + form.zeit.value + ' Uhr (' + form.personen.value + ') ist vorgemerkt. (Demo – in der fertigen Website geht die Anfrage direkt an das Restaurant.)';
      msg.classList.add('show');
      form.reset();
    });
  }
})();
