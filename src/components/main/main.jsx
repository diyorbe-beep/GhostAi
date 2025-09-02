import React, { useState, useRef, useEffect } from 'react'
import './main.css'
import { assets } from '../../assets/assets'
import { FaBars } from "react-icons/fa";
import { API_ENDPOINTS, ALTERNATIVE_CORS_PROXIES, BACKEND_URL } from '../../config/backend'
import { sendOpenAIMessage } from '../../config/openai'

const Main = ({ messages = [], onMessagesUpdate, onSaveQuestion, onToggleSidebar }) => {
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

        // Primary: OpenAI (ChatGPT)
        try {
            const aiText = await sendOpenAIMessage({ message: input, history: newMessages })
            const aiMessage = {
                role: 'assistant',
                content: aiText,
                timestamp: new Date().toLocaleTimeString()
            }
            const updatedMessages = [...newMessages, aiMessage]
            onMessagesUpdate(updatedMessages)
            if (onSaveQuestion) onSaveQuestion(input, aiText)
            return
        } catch (openAiPrimaryError) {
            console.log('OpenAI primary failed:', openAiPrimaryError.message)
        }

        // Fallback: Backend → Proxies → (existing OpenAI fallback remains)
        try {
            // Try direct connection first
            const response = await fetch(API_ENDPOINTS.CHAT, {
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
            console.error('Direct connection failed:', error)
            
            // If it's a CORS error, try alternative proxies
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('Unexpected token')) {
                console.log('CORS error detected, trying alternative proxies...')
                
                for (const proxy of ALTERNATIVE_CORS_PROXIES) {
                    try {
                        const proxyUrl = `${proxy}${BACKEND_URL}/api/chat`
                        console.log(`Trying proxy: ${proxy}`)
                        
                        const proxyResponse = await fetch(proxyUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message: input })
                        })
                        
                        if (proxyResponse.ok) {
                            let proxyData
                            try {
                                proxyData = await proxyResponse.json()
                            } catch (parseError) {
                                console.log('Failed to parse proxy response as JSON:', parseError)
                                continue
                            }
                            
                            if (proxyData && proxyData.response) {
                                const aiMessage = {
                                    role: 'assistant',
                                    content: proxyData.response,
                                    timestamp: new Date().toLocaleTimeString()
                                }
                                
                                const updatedMessages = [...newMessages, aiMessage]
                                onMessagesUpdate(updatedMessages)
                                
                                if (onSaveQuestion) {
                                    onSaveQuestion(input, proxyData.response)
                                }
                                
                                return // Success with proxy, exit the function
                            }
                        }
                    } catch (proxyError) {
                        console.log(`Proxy ${proxy} failed:`, proxyError.message)
                        continue
                    }
                }
                
                // If all proxies fail, try OpenAI fallback
                try {
                    const aiText = await sendOpenAIMessage({ message: input, history: newMessages })
                    const aiMessage = {
                        role: 'assistant',
                        content: aiText,
                        timestamp: new Date().toLocaleTimeString()
                    }
                    const updatedMessages = [...newMessages, aiMessage]
                    onMessagesUpdate(updatedMessages)
                    if (onSaveQuestion) onSaveQuestion(input, aiText)
                    return
                } catch (openAiErr) {
                    console.log('OpenAI fallback failed:', openAiErr.message)
                }
                // If everything fails
                setError('All connection methods failed (backend, proxies, OpenAI). Check settings.')
            } else {
                // Non-CORS error: attempt OpenAI fallback once
                try {
                    const aiText = await sendOpenAIMessage({ message: input, history: newMessages })
                    const aiMessage = {
                        role: 'assistant',
                        content: aiText,
                        timestamp: new Date().toLocaleTimeString()
                    }
                    const updatedMessages = [...newMessages, aiMessage]
                    onMessagesUpdate(updatedMessages)
                    if (onSaveQuestion) onSaveQuestion(input, aiText)
                    return
                } catch (openAiErr) {
                    console.log('OpenAI fallback failed:', openAiErr.message)
                    setError(error.message)
                }
            }
            
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
            // Try direct connection first
            const response = await fetch(API_ENDPOINTS.TEST_GEMINI)
            const data = await response.json()
            if (data.status === 'OK') {
                alert('✅ Gemini API is working correctly with direct connection!')
                return
            } else {
                alert('❌ Gemini API test failed')
            }
        } catch (error) {
            console.error('Direct connection failed, trying alternative proxies...')
            // Try alternative CORS proxies
            for (const proxy of ALTERNATIVE_CORS_PROXIES) {
                try {
                    const testUrl = `${proxy}${BACKEND_URL}/api/test-gemini`
                    console.log(`Trying proxy: ${proxy}`)
                    const response = await fetch(testUrl)
                    
                    if (response.ok) {
                        let data
                        try {
                            data = await response.json()
                        } catch (parseError) {
                            console.log('Failed to parse proxy response as JSON:', parseError)
                            continue
                        }
                        
                        if (data && data.status === 'OK') {
                            alert(`✅ Gemini API working with proxy: ${proxy}`)
                            return
                        }
                    }
                } catch (proxyError) {
                    console.log(`Proxy ${proxy} failed:`, proxyError.message)
                    continue
                }
            }
            alert('❌ Cannot connect to Gemini API with any method. Please check your backend.')
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
                    <FaBars className="menu-toggle" onClick={onToggleSidebar}  />
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
                                       <div></div>
                                    )}
                                </div>
                                <div className="message_content">
                                    <div className="message_header">
                                        <span className="role_name">
                                            {message.role === 'user' ? 'You' : ''}
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
                                </div>
                                <div className="message_content">
                                    <div className="message_header">
                                        <span className="role_name"></span>
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
