import { useEffect, useState } from 'react'
import './Leaderboard.css'

//Lambda function URL
const API_URL = import.meta.env.VITE_SCORES_API_URL

export const scoresConfigured = Boolean(API_URL)

async function fetchScores(signal) {
  const res = await fetch(API_URL, { signal })
  if (!res.ok) throw new Error('Could not load the leaderboard.')
  return res.json()
}

async function postScore(name, score) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score }),
  })
  if (!res.ok) {
    // Returns { error: "..." } for bad input
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Could not save your score.')
  }
}

export function Leaderboard({ refreshKey = 0 }) {
  const [scores, setScores] = useState(null) // null = still loading
  const [error, setError] = useState('')

  // Reload whenever refreshKey changes
  useEffect(() => {
    if (!API_URL) return
    const controller = new AbortController()
    setError('')
    fetchScores(controller.signal)
      .then(setScores)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
    return () => controller.abort()
  }, [refreshKey])

  if (!API_URL) {
    return (
      <section className="leaderboard">
        <h3>Leaderboard</h3>
        <p className="leaderboard-note">The leaderboard isn't connected yet.</p>
      </section>
    )
  }

  return (
    <section className="leaderboard">
      <h3>Leaderboard</h3>

      {error && <p className="leaderboard-note">{error}</p>}
      {!error && scores === null && <p className="leaderboard-note">Loading…</p>}
      {!error && scores?.length === 0 && (
        <p className="leaderboard-note">No scores yet. Be the first!</p>
      )}

      {!error && scores?.length > 0 && (
        <ol className="leaderboard-list">
          {scores.map((entry, i) => (
            <li key={`${entry.name}-${entry.score}-${entry.date}-${i}`}>
              <span className="lb-rank">{i + 1}</span>
              <span className="lb-name">{entry.name}</span>
              <span className="lb-score">{entry.score.toLocaleString()}</span>
              <span className="lb-date">{new Date(entry.date * 1000).toLocaleDateString()}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function ScoreForm({ score, onSaved, onSkip }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Enter a name first.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await postScore(trimmed, score)
      onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="score-form" onSubmit={handleSubmit}>
      <p className="score-form-title">
        Game over. You scored <strong>{score.toLocaleString()}</strong>.
      </p>

      <div className="score-form-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          placeholder="Your name"
          aria-label="Your name"
          disabled={saving}
          autoFocus
        />
        <button className="btn btn-purple" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save score'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onSkip} disabled={saving}>
          Skip
        </button>
      </div>

      {error && (
        <p className="score-form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
