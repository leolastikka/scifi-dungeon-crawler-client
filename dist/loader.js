window.onload = () => {
  const loaderGui = document.createElement('div');
  loaderGui.id = 'load-state';
  loaderGui.innerHTML = `
  <ul>
    <li>Scifi Dungeon Crawler</li>
    <li></li>
    <li id="load-progress">Loading bundle...</li>
  </ul>
  `;
  document.body.appendChild(loaderGui);
  const bundle = document.createElement('script');
  bundle.onload = () => {
    document.body.removeChild(loaderGui);
  };
  bundle.src = 'bundle.js';
  document.body.append(bundle);
};
