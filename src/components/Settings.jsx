import { useState, useEffect } from 'react';
import '../styles/Shared.css';
import '../styles/Settings.css';

const GRID_OPTIONS = [{ label: '2 x 2', value: '2x2' }, { label: '3 x 3', value: '3x3' }, { label: '4 x 4', value: '4x4' }];
const SPEED_OPTIONS = [{ label: 'Slow', value: 'slow' }, { label: 'Normal', value: 'normal' }, { label: 'Fast', value: 'fast' }];
const COLOUR_OPTIONS = [{ label: 'Pastel', value: 'pastel' }, { label: 'Bright', value: 'bright' }, { label: 'Dark', value: 'dark' }];

function OptionBtn({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`option-btn py-2 ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function OptionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="mb-4">
      <p className="section-title text-center mb-2">{title}</p>
      <div className="d-flex justify-content-center gap-4">
        {options.map((opt) => (
          <OptionBtn
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Settings({ onPlay }) {
  const [grid,    setGrid]    = useState('4x4');
  const [speed,   setSpeed]   = useState('normal');
  const [colours, setColours] = useState('bright');

  function startGame() {
    onPlay({ grid, speed, colours });
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Enter') startGame();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [grid, speed, colours]);

  return (
    <div className="page">
      <div className="container py-5">
        <h1 className="page-title text-center mb-5">Order of Colours</h1>

        <div className="row g-4 align-items-stretch justify-content-center mb-4">
          <div className="col-lg-5">
            <div className="panel h-100 d-flex flex-column justify-content-center p-4">
              <OptionGroup title="Grid"    options={GRID_OPTIONS}   selected={grid}    onSelect={setGrid} />
              <OptionGroup title="Speed"   options={SPEED_OPTIONS}  selected={speed}   onSelect={setSpeed} />
              <OptionGroup title="Colours" options={COLOUR_OPTIONS} selected={colours} onSelect={setColours} />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="panel h-100 d-flex flex-column justify-content-center p-4">
              <p className="how-to-play-title text-center mb-4">How to play</p>
              <ol className="how-to-play-list ps-3 mb-0">
                <li className="mb-3">A sequence will play with tiles being lit up one-by-one.</li>
                <li className="mb-3">Select the tiles in the correct sequence that was displayed.</li>
                <li className="mb-3">Repeat. Each round adds one more tile to the sequence.</li>
                <li>Game ends when the wrong tile is selected.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6">
            <button type="button" className="play-btn w-100 py-3" onClick={startGame}>
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}