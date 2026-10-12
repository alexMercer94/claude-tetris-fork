'use strict';

// ---- Skins visuales ----
// Cada skin: { name, colors[], boardBg, grid, drawBlock(ctx, x, y, color, size, alpha) }
// boardBg/grid null = usar el CSS / tema claro-oscuro.

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const SKINS = {
  retro: {
    name: 'Retro',
    colors: [
      null,
      '#4dd0e1', // I - cyan
      '#ffd54f', // O - yellow
      '#ba68c8', // T - purple
      '#81c784', // S - green
      '#e57373', // Z - red
      '#90caf9', // J - pale blue
      '#ffb74d', // L - orange
      '#b0bec5', // N - tuerca (gris metal)
    ],
    boardBg: null,
    grid: null,
    drawBlock(ctx, x, y, color, size, alpha) {
      ctx.globalAlpha = alpha ?? 1;
      ctx.fillStyle = color;
      ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(x * size + 1, y * size + 1, size - 2, 4);
      ctx.globalAlpha = 1;
    },
  },

  neon: {
    name: 'Neon',
    colors: [
      null,
      '#00e5ff', '#ffee00', '#d500f9', '#00ff6a',
      '#ff1744', '#448aff', '#ff9100', '#cfd8dc',
    ],
    boardBg: '#000000',
    grid: '#16162a',
    drawBlock(ctx, x, y, color, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha ?? 1;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x * size + 3, y * size + 3, size - 6, size - 6);
      ctx.fillStyle = color;
      ctx.globalAlpha = (alpha ?? 1) * 0.35;
      ctx.fillRect(x * size + 3, y * size + 3, size - 6, size - 6);
      ctx.restore();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    },
  },

  pastel: {
    name: 'Pastel',
    colors: [
      null,
      '#a8e6ef', '#fff1a8', '#d9b8f0', '#b9eac0',
      '#f7b8b8', '#b8d4f7', '#fbd3a3', '#d5dde0',
    ],
    boardBg: null,
    grid: null,
    drawBlock(ctx, x, y, color, size, alpha) {
      const px = x * size + 2, py = y * size + 2, s = size - 4;
      ctx.globalAlpha = alpha ?? 1;
      roundRectPath(ctx, px, py, s, s, 7);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // brillo suave
      roundRectPath(ctx, px + 4, py + 4, s - 8, 4, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
      ctx.globalAlpha = 1;
    },
  },

  pixel: {
    name: 'Pixel art',
    colors: [
      null,
      '#29b6f6', '#fdd835', '#ab47bc', '#66bb6a',
      '#ef5350', '#5c8df0', '#ffa726', '#90a4ae',
    ],
    boardBg: null,
    grid: null,
    drawBlock(ctx, x, y, color, size, alpha) {
      const bx = x * size + 1, by = y * size + 1, s = size - 2, p = 3;
      ctx.globalAlpha = alpha ?? 1;
      ctx.fillStyle = color;
      ctx.fillRect(bx, by, s, s);
      // damero de pixeles
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let i = p; i < s - p; i += p * 2)
        for (let j = p; j < s - p; j += p * 2)
          if (((i + j) / p) % 4 === 0 || ((i - j) / p) % 4 === 0)
            ctx.fillRect(bx + i, by + j, p, p);
      // luz arriba/izquierda
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(bx, by, s, p);
      ctx.fillRect(bx, by, p, s);
      // sombra abajo/derecha
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(bx, by + s - p, s, p);
      ctx.fillRect(bx + s - p, by, p, s);
      ctx.globalAlpha = 1;
    },
  },
};
