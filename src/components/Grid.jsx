import { useState, useEffect } from 'react';
import '../styles/Shared.css';
import '../styles/Grid.css';
import Stats from './Stats';

const KEY_LAYOUT = [
  ['1', '2', '3', '4'],
  ['Q', 'W', 'E', 'R'],
  ['A', 'S', 'D', 'F'],
  ['Z', 'X', 'C', 'V'],
];

const PALETTES = {
  bright: [
    '#4F6BE0', '#E0532B', '#2ECC71', '#D6147A',
    '#F5C518', '#A85FE3', '#128080', '#EC4899',
    '#C0392B', '#5DADE2', '#9ACD32', '#B65FDB',
    '#F2A33D', '#1F7A47', '#5F4FE0', '#E08C14',
  ],
  pastel: [
    '#A8C0F5', '#F5C2A8', '#A8F0C9', '#F5A8C9',
    '#F5E8A8', '#C9A8F5', '#A8D9D9', '#F0A8A8',
    '#D9F0A8', '#D6A8F0', '#F5D5A8', '#A8D0F5',
    '#F5A8D0', '#C2D9A0', '#D9B89A', '#A8F0E8',
  ],
  dark: [
    '#1F3A7A', '#7A2E16', '#1F7A47', '#7A0F47',
    '#7A6418', '#4A1F7A', '#0A3D3D', '#5C0F0F',
    '#54641F', '#7A1F4A', '#1F4A7A', '#4A2808',
    '#1F5C54', '#5C1F7A', '#7A5418', '#1F2E0A',
  ],
};

const SPEED = {
  slow: { on: 1000, off: 500 },
  normal: { on: 700,  off: 300 },
  fast: { on: 400,  off: 150 },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Grid({ settings, round, sequence, feedback, onTileSelect, onContinue }) {
  const [phase, setPhase] = useState('watching');

  const [litIndex, setLitIndex] = useState(-1);

  const [activeIndex, setActiveIndex] = useState(-1);

  const size = parseInt(settings.grid);

  const tiles = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      tiles.push({
        key: KEY_LAYOUT[row][col],
        color: PALETTES[settings.colours][index],
      });
    }
  }

  useEffect(() => {
    if (sequence.length === 0) return;

    let cancelled = false;
    const timing = SPEED[settings.speed] || SPEED.normal;

    async function playSequence() {
      setPhase('watching');
      setLitIndex(-1);
      await wait(800);

      for (let i = 0; i < sequence.length; i++) {
        if (cancelled) return;
        setLitIndex(sequence[i]); //light up

        await wait(timing.on);

        if (cancelled) return;
        setLitIndex(-1); //turn off

        await wait(timing.off);
      }

      //sequence done, player turn
      if (!cancelled) setPhase('input');
    }

    playSequence();

    return () => { cancelled = true; setLitIndex(-1); };

  }, [sequence, settings.speed]);

  function handleTileClick(index) {
    //ignore input
    if (phase !== 'input') return;
    if (feedback !== null) return;

    setActiveIndex(index);
    setTimeout(() => setActiveIndex(-1), 150);

    onTileSelect(index);
  }

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toUpperCase();

      const tileIndex = tiles.findIndex((t) => t.key === key);
      if (tileIndex !== -1) {
        handleTileClick(tileIndex);
      }

      if (e.key === 'Enter' && feedback !== null) {
        onContinue();
      }

      if (e.key === 'Escape') {
        onContinue('settings');
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tiles, phase, feedback]);

  function StatusArea() {
    if (feedback === 'correct') {
      return (
        <button type="button" className="feedback-btn correct w-100" onClick={onContinue}>
          Correct — Press Enter or click for Next Round
        </button>
      );
    }
    if (feedback === 'wrong') {
      return (
        <button type="button" className="feedback-btn wrong w-100" onClick={onContinue}>
          Wrong — Press Enter or click for Game Over
        </button>
      );
    }

    return (
      <div className="status-box w-100 d-flex align-items-center justify-content-center p-3">
        {phase === 'watching'
          ? '👀 Watch the sequence carefully…'
          : '🧠 Your turn! Select the tiles in order.'}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container py-5">
        <h1 className="page-title text-center mb-5">Order of Colours</h1>

        <div className="row g-4 align-items-start">
          <div className="col-lg-6">
            <div
              className="tile-grid mx-auto"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, maxWidth: 520 }}
            >
              {tiles.map((tile, i) => {

                let tileClass = 'tile';
                if (phase === 'watching')       tileClass += ' watching';
                if (i === litIndex)             tileClass += ' lit';
                if (i === activeIndex)          tileClass += ' active';
                if (feedback === 'wrong')       tileClass += ' game-over';
                if (settings.colours === 'dark') tileClass += ' light-text';

                return (
                  <button
                    key={tile.key}
                    type="button"
                    className={tileClass}
                    style={{ backgroundColor: tile.color }}
                    onClick={() => handleTileClick(i)}
                  >
                    {tile.key}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-lg-6 d-flex flex-column gap-3" style={{ minHeight: 520 }}>
            <Stats settings={settings} />

            <div className="round-panel text-center text-white py-4">
              <div className="round-title">Round</div>
              <div className="round-number">{round}</div>
            </div>

            <StatusArea />

            <button
              type="button"
              className="back-btn w-100 py-3 mt-auto"
              onClick={() => onContinue('settings')}
            >
              ← Back to Settings (Esc)
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}