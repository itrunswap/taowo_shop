/* ============================================================
   云超鲜 YUNXIAN · admin.js
   Renders shared sidebar + handles nav / toggles / toast
   ============================================================ */
(function () {
  'use strict';

  var I = {
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>',
    sched: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 9h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01" stroke-linecap="round"/></svg>',
    food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3v7a3 3 0 0 0 3 3v8M4 6M8 3v7M6 3v7M16 3c-1.5 2-2 4-2 6a3 3 0 0 0 3 3v8" stroke-linecap="round"/></svg>',
    order: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h9l4 4v16H6z" stroke-linejoin="round"/><path d="M9 8h7M9 12h7M9 16h4" stroke-linecap="round"/></svg>',
    member: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke-linecap="round"/><path d="M16 6l1.5 1.5L21 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mkt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l16-7v16L3 13z" stroke-linejoin="round"/><path d="M7 12v5a2 2 0 0 0 4 0" stroke-linecap="round"/></svg>',
    biz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l7-4 7 4v13M17 21V11l4 2v8M7 12h.01M7 16h.01M13 12h.01M13 16h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fran: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9l1-4h14l1 4M4 9v11h16V9M4 9h16M9 20v-6h6v6" stroke-linejoin="round"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2l-.4-2.6h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6z"/></svg>'
  };

  var NAV = [
    { group: '概览', items: [ { k: 'dashboard', t: '数据看板', i: I.dash, h: 'dashboard.html' } ] },
    { group: '餐饮运营', items: [
      { k: 'menu-schedule', t: '周菜单排期', i: I.sched, h: 'menu-schedule.html', badge: '5' },
      { k: 'products', t: '商品 / 套餐', i: I.food, h: 'products.html' },
      { k: 'orders', t: '订单管理', i: I.order, h: 'orders.html', badge: '23' }
    ]},
    { group: '用户增长', items: [
      { k: 'members', t: '会员管理', i: I.member, h: 'members.html' },
      { k: 'marketing', t: '营销活动', i: I.mkt, h: 'marketing.html' },
      { k: 'enterprise', t: '团餐企业', i: I.biz, h: 'enterprise.html' }
    ]},
    { group: '渠道拓展', items: [
      { k: 'franchise', t: '管家与加盟', i: I.fran, h: 'franchise.html', badge: '8' }
    ]},
    { group: '分析与设置', items: [
      { k: 'analytics', t: '数据报表', i: I.chart, h: 'analytics.html' },
      { k: 'settings', t: '系统设置', i: I.set, h: 'settings.html' }
    ]}
  ];

  function renderSidebar() {
    var el = document.getElementById('side'); if (!el) return;
    var cur = document.body.getAttribute('data-page');
    var h = '<div class="brand"><div class="logo">鲜</div><div><div class="bt">云超鲜运营台</div><div class="bs">YUNXIAN CONSOLE</div></div></div>';
    NAV.forEach(function (g) {
      h += '<div class="nav-group">' + g.group + '</div>';
      g.items.forEach(function (it) {
        var active = it.k === cur ? ' active' : '';
        var badge = it.badge ? '<span class="badge badge-brand">' + it.badge + '</span>' : '';
        h += '<a class="nav-item' + active + '" href="' + it.h + '">' + it.i + '<span>' + it.t + '</span>' + badge + '</a>';
      });
    });
    h += '<div class="side-foot"><div class="side-user"><div class="avatar" style="width:36px;height:36px;font-size:14px;">运</div><div style="flex:1"><div style="font-size:13.5px;font-weight:650;">运营管理员</div><div style="font-size:11.5px;color:var(--ink-3);">总部 · 超级管理员</div></div>'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round"/></svg></div></div>';
    el.innerHTML = h;
  }

  /* toast */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'toast'; toastEl.style.bottom = '40px'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1700);
  }
  window.toast = toast;

  function wire() {
    document.addEventListener('click', function (e) {
      var t;
      t = e.target.closest('[data-go]'); if (t) { e.preventDefault(); location.href = t.getAttribute('data-go'); return; }
      t = e.target.closest('[data-toast]'); if (t) { e.preventDefault(); toast(t.getAttribute('data-toast')); return; }
      t = e.target.closest('.switch'); if (t) { t.classList.toggle('on'); return; }
      t = e.target.closest('[data-tab]'); if (t) {
        var g = t.parentNode; [].forEach.call(g.querySelectorAll('[data-tab]'), function (x) { x.classList.remove('active'); }); t.classList.add('active');
        if (t.getAttribute('data-toast-on')) toast(t.getAttribute('data-toast-on')); return;
      }
      t = e.target.closest('[data-seg]'); if (t) {
        var gg = t.parentNode; [].forEach.call(gg.querySelectorAll('[data-seg]'), function (x) { x.classList.remove('active'); }); t.classList.add('active'); return;
      }
    });
  }

  function init() { renderSidebar(); wire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
