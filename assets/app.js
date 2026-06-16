/* ============================================================
   云鲜 YUNXIAN · app.js  (framework-free, file:// safe)
   Cart state, toast, steppers, sheets, favorites, nav helpers
   ============================================================ */
(function () {
  'use strict';

  /* ---------- tiny store (localStorage w/ memory fallback) ---------- */
  var mem = {};
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }
      catch (e) { return mem[k] == null ? d : mem[k]; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; }
    }
  };

  var CART_KEY = 'yx_cart';
  function getCart() { return store.get(CART_KEY, {}); }
  function setCart(c) { store.set(CART_KEY, c); paintCart(); }
  function cartCount() { var c = getCart(), n = 0; for (var k in c) n += c[k].qty; return n; }
  function cartTotal() { var c = getCart(), t = 0; for (var k in c) t += c[k].qty * c[k].price; return t; }

  /* expose */
  window.YX = {
    store: store, getCart: getCart, setCart: setCart, cartCount: cartCount, cartTotal: cartTotal,
    toast: toast, go: go, back: back,
    addItem: addItem, setQty: setQty
  };

  function addItem(item, delta) {
    var c = getCart();
    var ex = c[item.id];
    var qty = (ex ? ex.qty : 0) + (delta == null ? 1 : delta);
    if (qty <= 0) { delete c[item.id]; }
    else { c[item.id] = { id: item.id, name: item.name, price: +item.price, emoji: item.emoji || '🍱', grad: item.grad || 'g-warm', qty: qty }; }
    setCart(c);
    return qty;
  }
  function setQty(id, qty) {
    var c = getCart(); if (!c[id]) return; if (qty <= 0) delete c[id]; else c[id].qty = qty; setCart(c);
  }

  /* ---------- navigation ---------- */
  function go(url) { if (url) window.location.href = url; }
  function back() { if (history.length > 1) history.back(); else go('home.html'); }

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1700);
  }

  /* ---------- paint cart badges & totals ---------- */
  function paintCart() {
    var n = cartCount(), t = cartTotal();
    [].forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
      el.textContent = n; el.style.display = n > 0 ? '' : 'none';
    });
    [].forEach.call(document.querySelectorAll('[data-cart-total]'), function (el) {
      el.textContent = '¥' + t.toFixed(2);
    });
    [].forEach.call(document.querySelectorAll('[data-cart-empty]'), function (el) {
      el.style.display = n > 0 ? 'none' : '';
    });
    [].forEach.call(document.querySelectorAll('[data-cart-when-items]'), function (el) {
      el.style.display = n > 0 ? '' : 'none';
    });
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { count: n, total: t } }));
  }

  /* ---------- status bar clock ---------- */
  function clock() {
    [].forEach.call(document.querySelectorAll('[data-clock]'), function (el) { el.textContent = '9:41'; });
  }

  /* ---------- wire data-attribute interactions ---------- */
  function wire() {
    document.addEventListener('click', function (e) {
      var t;

      /* navigation */
      t = e.target.closest('[data-go]');
      if (t) { e.preventDefault(); go(t.getAttribute('data-go')); return; }
      t = e.target.closest('[data-back]');
      if (t) { e.preventDefault(); back(); return; }

      /* toast */
      t = e.target.closest('[data-toast]');
      if (t) { e.preventDefault(); toast(t.getAttribute('data-toast')); return; }

      /* favorite toggle */
      t = e.target.closest('[data-fav]');
      if (t) {
        e.preventDefault(); e.stopPropagation();
        t.classList.toggle('on');
        toast(t.classList.contains('on') ? '已收藏' : '已取消收藏');
        return;
      }

      /* add to cart (single +) */
      t = e.target.closest('[data-add]');
      if (t) {
        e.preventDefault(); e.stopPropagation();
        var item = JSON.parse(t.getAttribute('data-add'));
        addItem(item, 1);
        bumpStepper(t, item);
        toast('已加入购物车');
        flyHint(t);
        return;
      }

      /* stepper +/- */
      t = e.target.closest('[data-step]');
      if (t) {
        e.preventDefault(); e.stopPropagation();
        var dir = +t.getAttribute('data-step');
        var box = t.closest('[data-stepper]');
        var item = JSON.parse(box.getAttribute('data-item'));
        var q = addItem(item, dir);
        renderStepper(box, q);
        return;
      }

      /* sheet open/close */
      t = e.target.closest('[data-sheet-open]');
      if (t) { e.preventDefault(); openSheet(t.getAttribute('data-sheet-open')); return; }
      t = e.target.closest('[data-sheet-close]');
      if (t) { e.preventDefault(); closeSheet(); return; }

      /* segmented / chip / rail toggle (visual only) */
      t = e.target.closest('[data-toggle-group]');
      if (t) {
        var g = t.getAttribute('data-toggle-group');
        [].forEach.call(document.querySelectorAll('[data-toggle-group="' + g + '"]'), function (el) { el.classList.remove('active'); });
        t.classList.add('active');
        if (t.getAttribute('data-toast')) toast(t.getAttribute('data-toast'));
      }
    });
  }

  /* stepper that lives next to an add button (list rows) */
  function bumpStepper(addBtn, item) {
    var box = addBtn.closest('[data-stepper]');
    if (!box) return;
    var c = getCart(); var q = c[item.id] ? c[item.id].qty : 1;
    renderStepper(box, q);
  }
  function renderStepper(box, q) {
    var qtyEl = box.querySelector('.qty');
    var minus = box.querySelector('.minus');
    if (qtyEl) { qtyEl.textContent = q; qtyEl.classList.toggle('hidden', q <= 0); }
    if (minus) minus.classList.toggle('hidden', q <= 0);
  }

  /* little fly animation hint */
  function flyHint(btn) {
    var dot = document.createElement('div');
    var r = btn.getBoundingClientRect();
    dot.style.cssText = 'position:fixed;left:' + (r.left + r.width / 2) + 'px;top:' + (r.top) + 'px;width:14px;height:14px;border-radius:50%;background:#FF5A4D;z-index:9999;pointer-events:none;transition:all .55s cubic-bezier(.4,0,.2,1);opacity:.9';
    document.body.appendChild(dot);
    requestAnimationFrame(function () {
      dot.style.top = (window.innerHeight - 60) + 'px';
      dot.style.left = '60px';
      dot.style.opacity = '0';
      dot.style.transform = 'scale(.3)';
    });
    setTimeout(function () { dot.remove(); }, 600);
  }

  /* ---------- bottom sheet ---------- */
  function ensureMask() {
    var m = document.querySelector('.sheet-mask');
    if (!m) {
      m = document.createElement('div'); m.className = 'sheet-mask';
      (document.querySelector('.screen') || document.body).appendChild(m);
      m.addEventListener('click', closeSheet);
    }
    return m;
  }
  function openSheet(id) {
    var s = document.getElementById(id); if (!s) return;
    ensureMask().classList.add('show');
    s.classList.add('show');
  }
  function closeSheet() {
    var m = document.querySelector('.sheet-mask'); if (m) m.classList.remove('show');
    [].forEach.call(document.querySelectorAll('.sheet.show'), function (s) { s.classList.remove('show'); });
  }
  window.YX.openSheet = openSheet; window.YX.closeSheet = closeSheet;

  /* ---------- init ---------- */
  function init() {
    clock(); wire(); paintCart();
    /* hydrate steppers from cart */
    [].forEach.call(document.querySelectorAll('[data-stepper]'), function (box) {
      try {
        var item = JSON.parse(box.getAttribute('data-item'));
        var c = getCart(); renderStepper(box, c[item.id] ? c[item.id].qty : 0);
      } catch (e) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
