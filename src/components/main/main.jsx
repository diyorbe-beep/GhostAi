import React, { useState, useRef, useEffect } from 'react'
import './main.css'
import { assets } from '../../assets/assets'

const Main = ({ messages = [], onMessagesUpdate, onSaveQuestion }) => {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const messagesEndRef = useRef(null)

    // localStorage dan input ni yuklash
    useEffect(() => {
        const savedInput = localStorage.getItem('ghostiq-current-input')
        if (savedInput) {
            setInput(savedInput)
        }
    }, [])

    // Input ni localStorage ga saqlash
    useEffect(() => {
        if (input.trim()) {
            localStorage.setItem('ghostiq-current-input', input)
        } else {
            localStorage.removeItem('ghostiq-current-input')
        }
    }, [input])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async () => {
        if (!input.trim()) return

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        }

        const newMessages = [...messages, userMessage]
        onMessagesUpdate(newMessages)
        
        // Input ni tozalash va localStorage dan o'chirish
        setInput('')
        localStorage.removeItem('ghostiq-current-input')
        
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Network response was not ok')
            }

            const data = await response.json()
            
            const aiMessage = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toLocaleTimeString()
            }

            const updatedMessages = [...newMessages, aiMessage]
            onMessagesUpdate(updatedMessages)
            
            // Save the question to sidebar
            if (onSaveQuestion) {
                onSaveQuestion(input, data.response)
            }
        } catch (error) {
            console.error('Error:', error)
            setError(error.message)
            
            const errorMessage = {
                role: 'assistant',
                content: `Kechirasiz, xatolik yuz berdi: ${error.message}`,
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            }
            const updatedMessages = [...newMessages, errorMessage]
            onMessagesUpdate(updatedMessages)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleCardClick = (suggestion) => {
        setInput(suggestion)
    }

    const testGeminiConnection = async () => {
        try {
            const response = await fetch('/api/test-gemini')
            const data = await response.json()
            if (data.status === 'OK') {
                alert('✅ Gemini API is working correctly!')
            } else {
                alert('❌ Gemini API test failed')
            }
        } catch (error) {
            alert('❌ Cannot connect to Gemini API')
        }
    }

    const formatMessageContent = (content) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < content.split('\n').length - 1 && <br />}
                </React.Fragment>
            ))
    }

    return (
        <div className='main'>
                                    <div className="nav">
                            <div className="brand">
                                <p>GhostIQ</p>
                            </div>
                <div className="nav-controls">
                    <img src={assets.user_icon} alt="" />
                </div>
            </div>
            <div className="main_container">
                {messages.length === 0 ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, I'm GhostIQ</span></p>
                            <p>I'm an intelligent AI ghost powered by Google Gemini. How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick("Write a creative story about a magical forest")}>
                                <p>Write a creative story about a magical forest</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Explain quantum computing in simple terms")}>
                                <p>Explain quantum computing in simple terms</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Help me plan a healthy meal for the week")}>
                                <p>Help me plan a healthy meal for the week</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Create a workout routine for beginners")}>
                                <p>Create a workout routine for beginners</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="chat_messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.role} ${message.isError ? 'error' : ''}`}>
                                <div className="message_avatar">
                                    {message.role === 'user' ? (
                                        <img src={assets.user_icon} alt="User" />
                                    ) : (
                                        <div className="ai-avatar">🤖</div>
                                    )}
                                </div>
                                <div className="message_content">
                                    <div className="message_header">
                                        <span className="role_name">
                                            {message.role === 'user' ? 'You' : 'GhostIQ'}
                                        </span>
                                        <span className="timestamp">{message.timestamp}</span>
                                    </div>
                                    <div className="message_text">
                                        {formatMessageContent(message.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message_avatar">
                                    <div className="ai-avatar">🤖</div>
                                </div>
                                <div className="message_content">
                                    <div className="message_header">
                                        <span className="role_name">GhostIQ</span>
                                        <span className="timestamp">typing...</span>
                                    </div>
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search_box">
                        <input 
                            type="text" 
                            placeholder="Message GhostIQ..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <div className="input_controls">
                            <button 
                                className="send-button"
                                onClick={handleSubmit}
                                disabled={!input.trim() || isLoading}
                            >
                                <img src={assets.send_icon} alt="Send" />
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}
                    <p className="bottom_info">
                        GhostIQ may display inaccurate info, including about people, so double-check its responses. 
                        <br />
                        Your privacy and GhostIQ Apps are protected. 👻✨
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
