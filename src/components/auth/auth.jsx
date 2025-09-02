import React, { useState, useEffect } from 'react'
import './auth.css'

export default function Auth({ setCurrentUser }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const forbidden = [
    'ghost', 'ghostjon', 'ghostiq', 'ghosti', 'ghostik',
    'ghost ai', 'ghost-ai', 'ghost aiq', 'ghost app'
  ]

  const isForbidden = (value) => {
    const v = String(value || '').toLowerCase().trim()
    return forbidden.some(word => v.includes(word))
  }

  useEffect(() => {
    const saved = localStorage.getItem('ghostiq-username')
    if (saved) setName(saved)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Ism kiritish kerak')
      return
    }
    if (isForbidden(trimmed)) {
      setError('Bu so\'zlarni ishlatish taqiqlangan')
      return
    }
    const user = { name: trimmed }
    localStorage.setItem('ghostiq-username', trimmed)
    setCurrentUser(user)
  }

  const onChange = (e) => {
    const v = e.target.value
    setName(v)
    if (!v.trim()) {
      setError('')
      return
    }
    if (isForbidden(v)) setError('Bu so\'zlarni ishlatish taqiqlangan')
    else setError('')
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your name</h2>
        <p className="auth-hint">Ismingizni kiriting. AI sizni shu nom bilan murojaat qiladi.</p>
        <input
          type="text"
          placeholder="Masalan: Ali"
          value={name}
          onChange={onChange}
          className="auth-input"
        />
        {error ? <div className="auth-error">❌ {error}</div> : null}
        <button type="submit" className="auth-button" disabled={Boolean(error) || !name.trim()}>Continue</button>
      </form>
    </div>
  )
}


