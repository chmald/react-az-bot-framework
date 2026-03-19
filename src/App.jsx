import ChatBot from './ChatBot'
import './App.css'

function App() {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2 className="chat-header-title">Chat Assistant</h2>
      </div>
      <div className="chat-container">
        <ChatBot />
      </div>
    </div>
  )
}

export default App
