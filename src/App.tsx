import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import Game, { GameStage } from './game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [itemCount, setItemCount] = useState(10);
  const [game, setGame] = useState<Game | null>(null);

  return (
    <div className="h-screen flex flex-col w-screen bg-neutral-950 text-white p-2 gap-2">
      <header className="flex flex-row gap-2 items-center">
        <h1 className="text-2xl leading-none font-display">Kim's Game</h1>
        <div className="flex-grow" />
        <a
          className="py-1 px-1.5 flex items-center gap-1 rounded-md hover:underline hover:underline-offset-2"
          target="_blank"
          rel="noreferrer nofollow"
          href=""
        >
          <FontAwesomeIcon icon={faQuestion} fixedWidth />
          About
        </a>
        <a
          className="py-1 px-1.5 flex items-center gap-1 rounded-md hover:underline hover:underline-offset-2"
          target="_blank"
          rel="noreferrer nofollow"
          href=""
        >
          <FontAwesomeIcon icon={faGithub} fixedWidth />
          Source Code
        </a>
      </header>
      <main className="flex-grow bg-neutral-900 rounded-md">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </main>
      <footer className="flex flex-row gap-4 items-center">
        {game == null ? (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="piecesInput">Number of Pieces:</label>
              <input
                id="piecesInput"
                type="numbers"
                className="py-1 px-1.5 rounded-md bg-neutral-800/50 focus:bg-opacity-100 outline-none border-none focus:ring-0"
                value={itemCount}
                onChange={(e) =>
                  setItemCount(parseInt(e.target.value, 10) || 1)
                }
                min={1}
                max={100}
              />
            </div>
            {/* <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="showHintCirclesInput"
                className="rounded w-4 h-4 text-white border-none bg-neutral-800 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="showHintCirclesInput">Show Hint Circles</label>
            </div> */}

            <button
              className="py-1 px-1.5 rounded-md bg-neutral-800 bg-opacity-50 hover:bg-opacity-100"
              onClick={() => {
                const _game = new Game(canvasRef, itemCount);
                _game.start();
                setGame(_game);
              }}
            >
              Start New Game
            </button>
          </>
        ) : game.stage === GameStage.VIEW ? (
          <>
            <button
              className="py-1 px-1.5 rounded-md bg-neutral-800 bg-opacity-50 hover:bg-opacity-100"
              onClick={() => game.beginGuessingStage()}
            >
              Shuffle!
            </button>
          </>
        ) : (
          <></>
        )}
      </footer>
    </div>
  );
}

export default App;
