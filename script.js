async function loadMenu(type) {
    const response = await fetch('data/menus.json');
    const menus = await response.json();

    let selectedMenu = menus[type];

    document.getElementById("menu-container").innerHTML =
        selectedMenu.map(item => `<div class="menu-item">${item}</div>`).join('');

    document.getElementById("title").innerText =
        type === "today" ? "Bugünün Menüsü" :
        type === "week" ? "Haftalık Menü" :
        "Aylık Menü";
}

loadMenu('today');
