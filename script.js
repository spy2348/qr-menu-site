// basit, tarayıcıda çalışan menü yükleyici
async function fetchMenus() {
  const r = await fetch('/data/menus.json');
  if (!r.ok) throw new Error('menus.json yüklenemedi');
  return r.json();
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function formatDate(d) {
  // yyyy-mm-dd
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}

function renderDay(container, dateStr, data, kitchenName) {
  container.innerHTML = `
    <h2>${kitchenName} — ${dateStr}</h2>
    <div class="menu-card">
      <p><strong>Ana Yemek:</strong> ${data.main || '-'}</p>
      <p><strong>Yardımcı:</strong> ${data.side || '-'}</p>
      <p><strong>Çorba:</strong> ${data.soup || '-'}</p>
      <p><strong>Salata:</strong> ${data.salad || '-'}</p>
      <p><strong>Tatlı:</strong> ${data.dessert || '-'}</p>
    </div>
  `;
}

function renderWeek(container, startDate, monthObj, kitchenName) {
  // startDate is Date object (monday assumed)
  let html = `<h2>${kitchenName} — Hafta: ${formatDate(startDate)}</h2>`;
  for (let i=0;i<7;i++){
    const d = new Date(startDate);
    d.setDate(startDate.getDate()+i);
    const ds = formatDate(d);
    const dayData = monthObj[ds] || {};
    html += `<div class="menu-card"><strong>${ds}</strong>
      <div>Ana: ${dayData.main || '-'}</div>
      <div>Çorba: ${dayData.soup || '-'}</div>
    </div>`;
  }
  container.innerHTML = html;
}

function renderMonth(container, yearMonth, monthlyObj, kitchenName) {
  let html = `<h2>${kitchenName} — Ay: ${yearMonth}</h2><div class="month-grid">`;
  // iterate days present in monthlyObj
  for (const dateStr of Object.keys(monthlyObj).sort()) {
    const d = monthlyObj[dateStr];
    html += `<div class="menu-card small"><strong>${dateStr}</strong><div>${d.main||'-'}</div></div>`;
  }
  html += `</div>`;
  container.innerHTML = html;
}

function getMonday(d) {
  // given date object, return monday of that week (ISO)
  const day = d.getDay(); // 0 Sun - 6 Sat
  const diff = (day + 6) % 7; // days since Monday
  const monday = new Date(d);
  monday.setDate(d.getDate()-diff);
  monday.setHours(0,0,0,0);
  return monday;
}

(async function init(){
  try {
    const menus = await fetchMenus();
    const kitchenId = getQueryParam('kitchen') || '1'; // default kitchen 1
    const view = getQueryParam('view') || 'today'; // today/week/month
    const container = document.getElementById('menu-container');
    const kitchen = menus.kitchens[kitchenId];
    if (!kitchen) {
      container.innerHTML = `<p>Bu mutfak tanımlı değil: ${kitchenId}</p>`;
      return;
    }
    const today = new Date();
    const yearMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;
    const monthly = kitchen.monthly[yearMonth] || {};

    if (view === 'today') {
      const dateStr = formatDate(today);
      const dayData = monthly[dateStr] || {};
      renderDay(container, dateStr, dayData, kitchen.name);
    } else if (view === 'week') {
      const monday = getMonday(today);
      renderWeek(container, monday, monthly, kitchen.name);
    } else if (view === 'month') {
      renderMonth(container, yearMonth, monthly, kitchen.name);
    }

    // update title text if exists
    const title = document.getElementById('title');
    if (title) {
      title.innerText = view === 'today' ? 'Bugünün Menüsü' : view === 'week' ? 'Haftalık Menü' : 'Aylık Menü';
    }

  } catch (err) {
    console.error(err);
    const c = document.getElementById('menu-container');
    c.innerHTML = `<p style="color:red">Hata: ${err.message}</p>`;
  }
})();
