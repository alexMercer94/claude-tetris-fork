'use strict';

// ---- Records locales (localStorage) ----
const RECORDS_KEY = 'tetrisRecords';
const NAME_KEY = 'tetrisLastName';
const MAX_TOP = 5;

const Records = {
  load() {
    const empty = { top: [], bestCombo: 0, maxLines: 0 };
    try {
      const data = JSON.parse(localStorage.getItem(RECORDS_KEY));
      if (!data || !Array.isArray(data.top)) return empty;
      return {
        top: data.top
          .filter(e => e && typeof e === 'object' && Number.isFinite(e.score))
          .map(e => ({
            name: String(e.name || 'Anónimo').slice(0, 12),
            score: e.score,
            lines: Number(e.lines) || 0,
            maxCombo: Number(e.maxCombo) || 0,
            date: String(e.date || ''),
          }))
          .slice(0, MAX_TOP),
        bestCombo: Number(data.bestCombo) || 0,
        maxLines: Number(data.maxLines) || 0,
      };
    } catch (e) {
      return empty;
    }
  },

  save(data) {
    try { localStorage.setItem(RECORDS_KEY, JSON.stringify(data)); } catch (e) {}
  },

  // ¿La puntuación entra en el top?
  qualifies(score) {
    if (score <= 0) return false;
    const { top } = this.load();
    return top.length < MAX_TOP || score > top[top.length - 1].score;
  },

  // Actualiza mejores marcas globales al terminar la partida
  updateBests(lines, maxCombo) {
    const data = this.load();
    data.bestCombo = Math.max(data.bestCombo, maxCombo);
    data.maxLines = Math.max(data.maxLines, lines);
    this.save(data);
  },

  // Añade una entrada; devuelve su fecha (id) para resaltarla
  add(name, score, lines, maxCombo) {
    const data = this.load();
    const entry = { name, score, lines, maxCombo, date: new Date().toISOString() };
    data.top.push(entry);
    data.top.sort((a, b) => b.score - a.score);
    data.top = data.top.slice(0, MAX_TOP);
    this.save(data);
    return entry.date;
  },

  reset() {
    try { localStorage.removeItem(RECORDS_KEY); } catch (e) {}
  },

  getLastName() {
    try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; }
  },

  setLastName(name) {
    try { localStorage.setItem(NAME_KEY, name); } catch (e) {}
  },

  // Pinta la tabla dentro de `el`; resalta la fila con fecha `highlightDate`
  render(el, highlightDate) {
    const data = this.load();
    el.textContent = '';
    const table = document.createElement('table');
    table.className = 'records-table';
    const head = table.createTHead().insertRow();
    ['#', 'Nombre', 'Puntos', 'Líneas'].forEach(t => {
      const th = document.createElement('th');
      th.textContent = t;
      head.appendChild(th);
    });
    const body = table.createTBody();
    if (!data.top.length) {
      const td = body.insertRow().insertCell();
      td.colSpan = 4;
      td.textContent = 'Sin records';
      td.className = 'records-empty';
    }
    data.top.forEach((e, i) => {
      const tr = body.insertRow();
      if (highlightDate && e.date === highlightDate) tr.className = 'records-highlight';
      [i + 1, e.name, e.score.toLocaleString(), e.lines].forEach(v => {
        tr.insertCell().textContent = v;
      });
    });
    el.appendChild(table);
    const stats = document.createElement('p');
    stats.className = 'records-stats';
    stats.textContent = `Mejor combo: ${data.bestCombo} · Máx. líneas: ${data.maxLines}`;
    el.appendChild(stats);
  },
};
