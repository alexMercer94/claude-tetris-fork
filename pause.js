'use strict';

// ---- Menú de pausa ----
// Se carga antes de game.js: game.js usa `pauseMenu` y pause.js usa
// (en tiempo de ejecución) togglePause, init y startLevel de game.js.
const pauseMenu = (() => {
  const menu = document.getElementById('pause-menu');
  const resumeBtn = document.getElementById('pm-resume');
  const restartBtn = document.getElementById('pm-restart');
  const controlsBtn = document.getElementById('pm-controls');
  const controlsList = document.getElementById('pm-controls-list');
  const levelSel = document.getElementById('pm-level');
  const items = [resumeBtn, restartBtn, controlsBtn, levelSel];

  const down = new Set();      // teclas actualmente pulsadas
  const swallowed = new Set(); // teclas ignoradas hasta soltarlas

  const isOpen = () => !menu.classList.contains('hidden');

  function show() {
    controlsList.classList.add('hidden');
    controlsBtn.setAttribute('aria-expanded', 'false');
    levelSel.value = String(startLevel);
    menu.classList.remove('hidden');
    resumeBtn.focus();
  }

  function hide() {
    if (!isOpen()) return;
    menu.classList.add('hidden');
    if (menu.contains(document.activeElement)) document.activeElement.blur();
    // ignora teclas aún pulsadas hasta que se suelten
    down.forEach(code => swallowed.add(code));
  }

  // Llamado desde game.js: true si la tecla debe ignorarse
  function swallow(e) {
    return swallowed.has(e.code);
  }

  function move(delta) {
    const i = items.indexOf(document.activeElement);
    const n = items.length;
    items[(i + delta + n) % n].focus();
  }

  // Captura en window: corre antes que el handler de game.js
  window.addEventListener('keydown', e => {
    down.add(e.code);
    if (!isOpen()) return;
    // menú abierto: ninguna tecla llega al juego
    e.stopPropagation();
    if (e.code === 'KeyP' || e.code === 'Escape') {
      e.preventDefault();
      if (!e.repeat) togglePause();
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    }
  }, true);

  window.addEventListener('keyup', e => {
    down.delete(e.code);
    swallowed.delete(e.code);
  }, true);

  window.addEventListener('blur', () => { down.clear(); swallowed.clear(); });

  resumeBtn.addEventListener('click', () => { resumeBtn.blur(); togglePause(); });
  restartBtn.addEventListener('click', () => { restartBtn.blur(); init(); });
  controlsBtn.addEventListener('click', () => {
    const open = controlsList.classList.toggle('hidden') === false;
    controlsBtn.setAttribute('aria-expanded', String(open));
    controlsBtn.blur();
  });
  levelSel.addEventListener('change', () => {
    startLevel = parseInt(levelSel.value, 10) || 1;
    try { localStorage.setItem('startLevel', String(startLevel)); } catch (e) {}
    levelSel.blur();
  });

  return { show, hide, swallow, isOpen };
})();
