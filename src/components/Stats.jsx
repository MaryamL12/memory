import '../styles/Shared.css';

const GRID_LABELS   = { '2x2': '2 x 2', '3x3': '3 x 3', '4x4': '4 x 4' };
const SPEED_LABELS  = { slow: 'Slow', normal: 'Normal', fast: 'Fast' };
const COLOUR_LABELS = { pastel: 'Pastel', bright: 'Bright', dark: 'Dark' };

export default function Stats({ settings }) {
  return (
    <div className="d-flex gap-3">
      <div className="stat-pill flex-fill text-center p-3">
        <div className="stat-pill-label">Grid</div>
        <div className="stat-pill-value">{GRID_LABELS[settings.grid]}</div>
      </div>

      <div className="stat-pill flex-fill text-center p-3">
        <div className="stat-pill-label">Speed</div>
        <div className="stat-pill-value">{SPEED_LABELS[settings.speed]}</div>
      </div>

      <div className="stat-pill flex-fill text-center p-3">
        <div className="stat-pill-label">Colours</div>
        <div className="stat-pill-value">{COLOUR_LABELS[settings.colours]}</div>
      </div>
    </div>
  );
}