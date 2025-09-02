import React, { useState, useEffect } from 'react'
import './auth.css'

export default function Auth({ setCurrentUser }) {
  const [name, setName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('ghostiq-username')
    if (saved) setName(saved)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const user = { name: trimmed }
    localStorage.setItem('ghostiq-username', trimmed)
    setCurrentUser(user)
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
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Continue</button>
      </form>
    </div>
  )
}


