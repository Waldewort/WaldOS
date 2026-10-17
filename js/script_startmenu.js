document.addEventListener("DOMContentLoaded", function() {
  updateFrequentAppsList();

  document.querySelectorAll('.start-app-item').forEach(item => {
    item.addEventListener('click', () => {
      const nameSpan = item.querySelector('span');
      const img = item.querySelector('img');
      if (nameSpan && img) {
        registerAppUsage(nameSpan.innerText, img.getAttribute('src'), item.id);
      }
    });
  });
});

function registerAppUsage(appName, iconSrc, clickElementId) {
  let usage = JSON.parse(localStorage.getItem('waldos_app_usage') || '{}');
  
  if (!usage[appName]) {
    usage[appName] = { count: 0, icon: iconSrc, id: clickElementId };
  }
  
  usage[appName].count += 1;
  localStorage.setItem('waldos_app_usage', JSON.stringify(usage));
  updateFrequentAppsList();
}

function updateFrequentAppsList() {
  const container = document.getElementById('frequent-app-list');
  if (!container) return;

  let usage = JSON.parse(localStorage.getItem('waldos_app_usage') || '{}');
  
  // Sortiere nach Häufigkeit und nimm die Top 6 für das Kachel-Grid
  let sortedApps = Object.entries(usage)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  if (sortedApps.length === 0) {
    container.innerHTML = `<span style="color: #888; font-size: 12px; grid-column: span 3;">Noch keine Nutzungsdaten vorhanden</span>`;
    return;
  }

  container.innerHTML = '';
  sortedApps.forEach(([name, data]) => {
    const tile = document.createElement('div');
    tile.className = 'frequent-app-tile';
    tile.style.display = 'flex';
    tile.style.flexDirection = 'column';
    tile.style.alignItems = 'center';
    tile.style.justifyContent = 'center';
    tile.style.gap = '8px';
    tile.style.padding = '14px 10px';
    tile.style.background = 'rgba(255, 255, 255, 0.05)';
    tile.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    tile.style.borderRadius = '8px';
    tile.style.cursor = 'pointer';
    tile.style.transition = 'background 0.2s, transform 0.1s';

    tile.onmouseover = () => tile.style.background = 'rgba(255, 255, 255, 0.1)';
    tile.onmouseout = () => tile.style.background = 'rgba(255, 255, 255, 0.05)';

    tile.innerHTML = `
      <img src="${data.icon}" width="32" height="32" style="object-fit: contain;">
      <span style="font-size: 11px; color: #eee; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${name}</span>
    `;

    tile.addEventListener('click', () => {
      const targetEl = document.getElementById(data.id);
      if (targetEl) targetEl.click();
    });

    container.appendChild(tile);
  });
}