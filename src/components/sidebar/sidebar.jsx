import React, {useState} from 'react'
import './sidebar.css'
import { assets } from '../../assets/assets'
import { FaBars } from "react-icons/fa";

const Sidebar = ({ onNewChat, recentChats = [], savedQuestions = [], onClearData, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('recent') // 'recent' yoki 'questions'

  const handleNewChat = () => {
    onNewChat && onNewChat()
    onToggle && onToggle() // Close sidebar after new chat
  }

  const handleQuestionClick = (questionData) => {
    // Savol va javobni chat ga yuklash
    const messages = [
      {
        role: 'user',
        content: questionData.question,
        timestamp: questionData.timestamp
      },
      {
        role: 'assistant',
        content: questionData.answer,
        timestamp: questionData.timestamp
      }
    ]
    
    const chat = {
      title: questionData.question.slice(0, 30) + '...',
      messages: messages,
      timestamp: new Date(questionData.timestamp)
    }
    
    onNewChat && onNewChat(chat)
    onToggle && onToggle() // Close sidebar after loading chat
  }

  const closeSidebar = () => {
    onToggle && onToggle()
  }

  return (
    <>
      {/* Overlay background */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'extended' : ''}`}>
        <div className="top">
          <FaBars className='menu' onClick={onToggle} />
          <div className="new_chat" onClick={handleNewChat}>
            <img src={assets.plus_icon} alt="" />
            {isOpen?<p>New Chat</p>:null}
          </div>
          {isOpen && (
            <div className="ai-info">
              <div className="ai-avatar-small">👻</div>
              <p>Powered by GhostIQ</p>
            </div>
          )}
          
          {isOpen && (
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTab('recent')}
              >
                💬 Recent
              </button>
              <button 
                className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                ❓ Questions
              </button>
            </div>
          )}

          {isOpen && activeTab === 'recent' && (
            <div className="recent">
              <p className='recent-title'>Recent Chats</p>
              {recentChats.length > 0 ? (
                recentChats.map((chat, index) => (
                  <div key={index} className="recent-entry" onClick={() => {
                    onNewChat && onNewChat(chat)
                    onToggle && onToggle() // Close sidebar after loading chat
                  }}>
                    <img src={assets.message_icon} alt="" />
                    <p>{chat.title || `Chat ${index + 1}`}</p>
                  </div>
                ))
              ) : (
                <div className="recent-entry">
                  <img src={assets.message_icon} alt="" />
                  <p>No recent chats</p>
                </div>
              )}
            </div>
          )}

          {isOpen && activeTab === 'questions' && (
            <div className="questions">
              <p className='questions-title'>Saved Questions</p>
              {savedQuestions.length > 0 ? (
                savedQuestions.map((questionData, index) => (
                  <div key={questionData.id} className="question-entry" onClick={() => handleQuestionClick(questionData)}>
                    <div className="question-icon">❓</div>
                    <div className="question-content">
                      <p className="question-text">{questionData.question.slice(0, 40)}...</p>
                      <p className="question-date">{questionData.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="question-entry">
                  <div className="question-icon">❓</div>
                  <div className="question-content">
                    <p className="question-text">No saved questions yet</p>
                    <p className="question-date">Ask something to save it here</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ma'lumotlarni tozalash tugmasi */}
          {isOpen && (
            <div className="clear-data-section">
              <button 
                className="clear-data-btn"
                onClick={() => {
                  onClearData()
                  onToggle && onToggle() // Close sidebar after clearing data
                }}
                title="Barcha ma'lumotlarni o'chirish"
              >
                🗑️ Clear All Data
              </button>
              <p className="clear-data-info">
                Bu tugma barcha saqlangan savollar, chatlar va ma'lumotlarni o'chiradi
              </p>
            </div>
          )}
        </div>
        <div className="bottom">
          <div className='bottom_item recent-entry'>
            <img src={assets.question_icon} alt="" />
            {isOpen?<p>Help</p>:null}
          </div>
          <div className='bottom_item recent-entry'>
            <img src={assets.history_icon} alt="" />
            {isOpen?<p>Activity</p>:null}
          </div>
          <div className='bottom_item recent-entry'>
            <img src={assets.setting_icon} alt="" />
            {isOpen?<p>Settings</p>:null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar