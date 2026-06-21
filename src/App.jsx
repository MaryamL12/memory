import { useState } from 'react';
import Settings from './components/Settings';
import Grid from './components/Grid';
import End from './components/End';

function randomTile(size) {
  return Math.floor(Math.random() * size * size);
}

export default function App() {
  const [screen, setScreen] = useState('settings');

  const [settings, setSettings] = useState({ grid: '4x4', speed: 'normal', colours: 'bright' });

  const [round, setRound] = useState(1);

  const [sequence, setSequence] = useState([]);

  const [progress, setProgress] = useState(0);

  const [feedback, setFeedback] = useState(null);

  function handlePlay(chosenSettings) {
    const size = parseInt(chosenSettings.grid);
    setSettings(chosenSettings);
    setSequence([randomTile(size)]);
    setRound(1);
    setProgress(0);
    setFeedback(null);
    setScreen('game');
  }

  function handleTileSelect(index) {
    const expected = sequence[progress];

    if (index !== expected) {
      setFeedback('wrong');
      return;
    }

    if (progress + 1 === sequence.length) {
      setFeedback('correct');
      return;
    }

    setProgress(progress + 1);
  }

  function handleContinue(destination) {
    if (destination === 'settings') {
      resetGame();
      setScreen('settings');
      return;
    }

    if (feedback === 'correct') {
      const size = parseInt(settings.grid);
      const nextSequence = [...sequence, randomTile(size)];
      setSequence(nextSequence);
      setRound(round + 1);
      setProgress(0);
      setFeedback(null);
    }

    if (feedback === 'wrong') {
      setScreen('gameover');
    }
  }

  function handlePlayAgain() {
    resetGame();
    setScreen('settings');
  }

  function resetGame() {
    setSequence([]);
    setRound(1);
    setProgress(0);
    setFeedback(null);
  }

  if (screen === 'settings') {
    return <Settings onPlay={handlePlay} />;
  }

  if (screen === 'game') {
    return (
      <Grid
        settings={settings}
        round={round}
        sequence={sequence}
        feedback={feedback}
        onTileSelect={handleTileSelect}
        onContinue={handleContinue}
      />
    );
  }

  if (screen === 'gameover') {
    return (
      <End
        settings={settings}
        roundReached={round}
        onPlayAgain={handlePlayAgain}
      />
    );
  }
}