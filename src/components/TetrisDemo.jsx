import { useEffect, useRef, useState } from 'react'
import { Leaderboard, ScoreForm, scoresConfigured } from './Leaderboard'

export default function TetrisDemo() {
  const [loaded, setLoaded] = useState(false)
  const [pendingScore, setPendingScore] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!loaded || !scoresConfigured) return

    function handleMessage(event) {
      // Only trust messages from our own game iframe, on our own origin.
      if (event.origin !== window.location.origin) return
      if (event.source !== frameRef.current?.contentWindow) return

      const data = event.data
      if (data?.type !== 'tetris-game-over') return
      if (Number.isInteger(data.score) && data.score > 0) setPendingScore(data.score)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [loaded])

  return (
    <>
      <div className="demo-frame">
        {!loaded && (
          <div className="demo-placeholder">
            <p>Arrow keys to move/soft drop, Z to rotate, X to hard drop.</p>
            <button className="btn btn-purple" onClick={() => setLoaded(true)}>
              Load game
            </button>
          </div>
        )}
        {loaded && (
          <iframe
            ref={frameRef}
            className="demo-iframe"
            src="/games/tetris/tetris.html"
            title="Tetris"
            // Give the game keyboard focus as soon as it loads, so the player doesn't have to click inside it first.
            onLoad={() => frameRef.current?.contentWindow?.focus()}
          />
        )}
      </div>

      {pendingScore !== null && (
        <ScoreForm
          score={pendingScore}
          onSaved={() => {
            setPendingScore(null)
            setRefreshKey((k) => k + 1)
          }}
          onSkip={() => setPendingScore(null)}
        />
      )}

      <Leaderboard refreshKey={refreshKey} />
    </>
  )
}
