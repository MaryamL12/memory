import { useEffect } from 'react';
import '../styles/Shared.css';
import '../styles/End.css';
import Stats from './Stats';

function getResultMessage(round) {
  if (round <= 2) return "Good start! Keep practicing and you'll improve your memory fast.";
  if (round <= 5) return "Nice effort! You're building a solid memory. Play again to push further!";
  if (round <= 9) return "You played very well! I'm impressed by your skills. Can you beat your own score?";
  return "Incredible memory! You are a sequence master. Can you beat your own record?";
}

export default function End({ settings, roundReached, onPlayAgain }) {
  //Enter to play again
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Enter') {
        onPlayAgain();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onPlayAgain]);

  return (
    <div className="page">
      <div className="container py-5">
        <h1 className="page-title text-center mb-5">Order of Colours</h1>
        <div className="row justify-content-center">
          <div className="col-lg-7 mb-4">
            <p className="result-message text-center">
              {getResultMessage(roundReached)}
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6 d-flex flex-column gap-3">
            <Stats settings={settings} />

            <div className="round-reached-box text-center py-4">
              <div className="round-reached-label">Round Reached</div>
              <div className="round-reached-number">{roundReached}</div>
            </div>

            <button type="button" className="play-again-btn w-100 py-3" onClick={onPlayAgain}>
              Play Again
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}