import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/sidebar/sidebar'
import Main from './components/main/main' // Main component ham kerak bo'ladi

export default function App() {
  const [messages, setMessages] = useState([])
  const [recentChats, setRecentChats] = useState([]) // qo'shildi
  const [currentUser, setCurrentUser] = useState(null) // qo'shildi
  const [savedQuestions, setSavedQuestions] = useState([]) // Yangi: saqlangan savollar
  const [sidebarOpen, setSidebarOpen] = useState(false) // Yangi: sidebar holati

  // localStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    // Saqlangan savollarni yuklash
    const savedQuestionsData = localStorage.getItem('ghostiq-saved-questions')
    if (savedQuestionsData) {
      try {
        setSavedQuestions(JSON.parse(savedQuestionsData))
      } catch (error) {
        console.error('Error loading saved questions:', error)
      }
    }

    // So'nggi chatlarni yuklash
    const recentChatsData = localStorage.getItem('ghostiq-recent-chats')
    if (recentChatsData) {
      try {
        setRecentChats(JSON.parse(recentChatsData))
      } catch (error) {
        console.error('Error loading recent chats:', error)
      }
    }

    // Joriy chat ni yuklash
    const currentChatData = localStorage.getItem('ghostiq-current-chat')
    if (currentChatData) {
      try {
        setMessages(JSON.parse(currentChatData))
      } catch (error) {
        console.error('Error loading current chat:', error)
      }
    }
  }, [])

  // Ma'lumotlarni localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('ghostiq-saved-questions', JSON.stringify(savedQuestions))
  }, [savedQuestions])

  useEffect(() => {
    localStorage.setItem('ghostiq-recent-chats', JSON.stringify(recentChats))
  }, [recentChats])

  useEffect(() => {
    localStorage.setItem('ghostiq-current-chat', JSON.stringify(messages))
  }, [messages])

  const handleNewChat = (chat = null) => {
    if (chat) {
      // Load existing chat
      setMessages(chat.messages || [])
    } else {
      // Start new chat
      setMessages([])
    }
  }

  const handleMessagesUpdate = (newMessages) => {
    setMessages(newMessages)

    // Update recent chats
    if (newMessages.length > 0) {
      const chatTitle = newMessages[0]?.content?.slice(0, 30) + '...'
      const existingChatIndex = recentChats.findIndex(
        (chat) =>
          chat.messages &&
          chat.messages.length > 0 &&
          chat.messages[0]?.content === newMessages[0]?.content
      )

      if (existingChatIndex === -1) {
        setRecentChats((prev) => [
          {
            title: chatTitle,
            messages: newMessages,
            timestamp: new Date(),
          },
          ...prev.slice(0, 4), // faqat oxirgi 5 ta chatni saqlash
        ])
      }
    }
  }

  // Yangi: Savol va javobni alohida saqlash
  const handleSaveQuestion = (question, answer) => {
    const newQuestion = {
      id: Date.now(),
      question: question,
      answer: answer,
      timestamp: new Date().toLocaleString(),
      date: new Date().toLocaleDateString()
    }
    
    setSavedQuestions(prev => [newQuestion, ...prev.slice(0, 19)]) // Oxirgi 20 ta savolni saqlash
  }

  // Ma'lumotlarni tozalash funksiyasi
  const clearAllData = () => {
    if (window.confirm('Barcha ma\'lumotlarni o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi.')) {
      setMessages([])
      setRecentChats([])
      setSavedQuestions([])
      localStorage.removeItem('ghostiq-saved-questions')
      localStorage.removeItem('ghostiq-recent-chats')
      localStorage.removeItem('ghostiq-current-chat')
      alert('Barcha ma\'lumotlar tozalandi!')
    }
  }

  // Sidebar toggle funksiyasi
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <>
      <Sidebar 
        onNewChat={handleNewChat} 
        recentChats={recentChats} 
        savedQuestions={savedQuestions}
        onClearData={clearAllData}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <Main 
        messages={messages} 
        currentUser={currentUser} 
        onMessagesUpdate={handleMessagesUpdate}
        onSaveQuestion={handleSaveQuestion}
        onToggleSidebar={toggleSidebar}
      />
      {/* Auth ham qo'shmoqchi bo'lsang shu yerga joylashtirasan */}
      {/* <Auth setCurrentUser={setCurrentUser} /> */}
    </>
  )
}
