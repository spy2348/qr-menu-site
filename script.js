// Query parametresini al
function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

const view = getParam("view") || "today";

// menus.json dosyasından veri çek
fetch("menus.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON yüklenemedi");
    return res.json();
  })
  .then(data => {
    let container = document.getElementById("menu-container");

    if (view === "today") {
      document.getElementById("title").innerText = "Bugünün Menüsü";
      renderDayMenu(data, container);
    } 
    else if (view === "week") {
      document.getElementById("title").innerText = "Haftalık Menü";
      renderWeekMenu(data, container);
    }
    else if (view === "month") {
      document.getElementById("title").innerText = "Aylık Menü";
      renderMonthMenu(data, container);
    }
  })
  .catch(err => {
    document.getElementById("menu-container").innerHTML =
      "Veri yüklenirken hata oluştu: " + err;
  });


// Bugün menüsünü göster
function renderDayMenu(data, container) {
  const today = new Date().toISOString().slice(0, 10);  
  const menu = data[today];

  if (!menu) {
    container.innerHTML = "Bugüne ait menü bulunamadı.";
    return;
  }

  container.innerHTML = `
    <h2>${today}</h2>
    <ul>
      ${menu.items.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}


// Haftalık menü
function renderWeekMenu(data, container) {
  let html = "<h2>Haftalık Menü</h2>";

  for (let date in data) {
    html += `
      <h3>${date}</h3>
      <ul>
        ${data[date].items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    `;
  }

  container.innerHTML = html;
}


// Aylık menü
function renderMonthMenu(data, container) {
  let html = "<h2>Aylık Menü</h2>";

  for (let date in data) {
    html += `
      <h3>${date}</h3>
      <ul>
        ${data[date].items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    `;
  }

  container.innerHTML = html;
}
