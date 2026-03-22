/**
 * Abdullah's Portfolio AI Chatbot
 * Floating bubble chat widget - Vanilla JavaScript
 * Include this file and it automatically creates the chat UI
 */

(function() {
  'use strict';

  // Chatbot Configuration
  const config = {
    apiEndpoint: '/api/claude-proxy',
    botName: 'Abdullah\'s AI Assistant',
    botAvatar: '🤖',
    primaryColor: '#8b5cf6', // Purple
    secondaryColor: '#1e1b4b', // Dark indigo
    accentColor: '#a78bfa', // Light purple
    position: 'right'
  };

  // Conversation history
  let conversationHistory = [];
  let isOpen = false;
  let isTyping = false;

  // Create and inject styles
  function injectStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      /* Chatbot Container */
      #abdullah-chatbot {
        --chat-primary: ${config.primaryColor};
        --chat-secondary: ${config.secondaryColor};
        --chat-accent: ${config.accentColor};
        --chat-bg: #0f0f1a;
        --chat-surface: #1a1a2e;
        --chat-text: #ffffff;
        --chat-text-secondary: #a0a0b0;
        --chat-border: rgba(139, 92, 246, 0.3);

        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        position: fixed;
        bottom: 20px;
        ${config.position === 'right' ? 'right: 20px;' : 'left: 20px;'}
        z-index: 10000;
      }

      /* Floating Bubble Button */
      #chatbot-bubble {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--chat-primary), var(--chat-accent));
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4),
                    0 0 40px rgba(139, 92, 246, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      #chatbot-bubble:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 6px 30px rgba(139, 92, 246, 0.5),
                    0 0 60px rgba(139, 92, 246, 0.3);
      }

      #chatbot-bubble:active {
        transform: scale(0.95);
      }

      /* Pulse animation ring */
      #chatbot-bubble::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid var(--chat-primary);
        animation: pulse-ring 2s ease-out infinite;
      }

      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.5); opacity: 0; }
      }

      /* Notification dot */
      #chatbot-bubble::after {
        content: '';
        position: absolute;
        top: 5px;
        right: 5px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid var(--chat-bg);
      }

      /* Chat Window */
      #chatbot-window {
        position: absolute;
        bottom: 75px;
        ${config.position === 'right' ? 'right: 0;' : 'left: 0;'}
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 550px;
        max-height: calc(100vh - 100px);
        background: var(--chat-bg);
        border-radius: 20px;
        border: 1px solid var(--chat-border);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 100px rgba(139, 92, 246, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.9) translateY(20px);
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      #chatbot-window.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: all;
      }

      /* Header */
      #chatbot-header {
        background: linear-gradient(135deg, var(--chat-secondary), var(--chat-primary));
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid var(--chat-border);
      }

      #chatbot-avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      #chatbot-info {
        flex: 1;
      }

      #chatbot-name {
        color: var(--chat-text);
        font-weight: 600;
        font-size: 16px;
        margin: 0;
      }

      #chatbot-status {
        color: #10b981;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      #chatbot-status::before {
        content: '';
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: status-pulse 2s ease-in-out infinite;
      }

      @keyframes status-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      #chatbot-close {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: var(--chat-text);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.2s;
      }

      #chatbot-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }

      /* Messages Container */
      #chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        scroll-behavior: smooth;
      }

      #chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }

      #chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      #chatbot-messages::-webkit-scrollbar-thumb {
        background: var(--chat-primary);
        border-radius: 3px;
      }

      /* Message Bubbles */
      .chatbot-message {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.5;
        animation: message-fade-in 0.3s ease-out;
        word-wrap: break-word;
      }

      @keyframes message-fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chatbot-message.user {
        align-self: flex-end;
        background: linear-gradient(135deg, var(--chat-primary), var(--chat-accent));
        color: white;
        border-bottom-right-radius: 4px;
      }

      .chatbot-message.bot {
        align-self: flex-start;
        background: var(--chat-surface);
        color: var(--chat-text);
        border: 1px solid var(--chat-border);
        border-bottom-left-radius: 4px;
      }

      /* Typing Indicator */
      #chatbot-typing {
        align-self: flex-start;
        background: var(--chat-surface);
        border: 1px solid var(--chat-border);
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        padding: 16px 20px;
        display: none;
        align-items: center;
        gap: 4px;
      }

      #chatbot-typing.visible {
        display: flex;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--chat-primary);
        border-radius: 50%;
        animation: typing-bounce 1.4s ease-in-out infinite;
      }

      .typing-dot:nth-child(1) { animation-delay: 0s; }
      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      /* Input Area */
      #chatbot-input-area {
        padding: 15px 20px;
        border-top: 1px solid var(--chat-border);
        background: var(--chat-surface);
        display: flex;
        gap: 10px;
        align-items: center;
      }

      #chatbot-input {
        flex: 1;
        background: var(--chat-bg);
        border: 1px solid var(--chat-border);
        border-radius: 25px;
        padding: 12px 18px;
        color: var(--chat-text);
        font-size: 14px;
        outline: none;
        transition: all 0.2s;
      }

      #chatbot-input::placeholder {
        color: var(--chat-text-secondary);
      }

      #chatbot-input:focus {
        border-color: var(--chat-primary);
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
      }

      #chatbot-send {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--chat-primary), var(--chat-accent));
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      #chatbot-send:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      }

      #chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Welcome Message */
      .chatbot-welcome {
        text-align: center;
        padding: 20px 10px;
        color: var(--chat-text-secondary);
        font-size: 13px;
      }

      .chatbot-welcome strong {
        color: var(--chat-primary);
        display: block;
        margin-bottom: 5px;
        font-size: 16px;
      }

      /* Mobile Responsive */
      @media (max-width: 480px) {
        #abdullah-chatbot {
          bottom: 10px;
          ${config.position === 'right' ? 'right: 10px;' : 'left: 10px;'}
        }

        #chatbot-window {
          width: calc(100vw - 20px);
          height: calc(100vh - 90px);
          max-height: none;
          border-radius: 15px;
          bottom: 70px;
          ${config.position === 'right' ? 'right: 0;' : 'left: 0;'}
        }

        #chatbot-bubble {
          width: 55px;
          height: 55px;
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  // Create chatbot HTML structure
  function createChatbot() {
    const container = document.createElement('div');
    container.id = 'abdullah-chatbot';
    container.innerHTML = `
      <!-- Floating Bubble Button -->
      <button id="chatbot-bubble" aria-label="Open chat">
        ${config.botAvatar}
      </button>

      <!-- Chat Window -->
      <div id="chatbot-window">
        <!-- Header -->
        <div id="chatbot-header">
          <div id="chatbot-avatar">${config.botAvatar}</div>
          <div id="chatbot-info">
            <h3 id="chatbot-name">${config.botName}</h3>
            <span id="chatbot-status">Online</span>
          </div>
          <button id="chatbot-close" aria-label="Close chat">×</button>
        </div>

        <!-- Messages -->
        <div id="chatbot-messages">
          <div class="chatbot-welcome">
            <strong>👋 Welcome!</strong>
            I'm here to tell you about Abdullah's amazing work.
            Ask me anything about his skills and services!
          </div>
        </div>

        <!-- Typing Indicator -->
        <div id="chatbot-typing">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>

        <!-- Input Area -->
        <div id="chatbot-input-area">
          <input
            type="text"
            id="chatbot-input"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button id="chatbot-send" aria-label="Send message">
            ➤
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }

  // Add a message to the chat
  function addMessage(content, role) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add to history
    conversationHistory.push({ role, content });

    // Limit history to last 20 messages to prevent token overflow
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }
  }

  // Show/hide typing indicator
  function setTyping(typing) {
    isTyping = typing;
    const typingIndicator = document.getElementById('chatbot-typing');
    const sendButton = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    if (typing) {
      typingIndicator.classList.add('visible');
      sendButton.disabled = true;
      input.disabled = true;
    } else {
      typingIndicator.classList.remove('visible');
      sendButton.disabled = false;
      input.disabled = false;
      input.focus();
    }

    // Scroll to bottom
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message to API
  async function sendMessage(message) {
    if (!message.trim() || isTyping) return;

    // Check if running locally (file:// protocol)
    if (window.location.protocol === 'file:') {
      addMessage(
        "I\'m designed to work on a web server (like Netlify). Please deploy the site to see me in action! 🤖",
        'bot'
      );
      console.warn('[Chatbot] Running locally (file://). Chatbot requires a web server to function.');
      return;
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    const input = document.getElementById('chatbot-input');
    input.value = '';

    // Show typing indicator
    setTyping(true);

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          history: conversationHistory.slice(0, -1) // Exclude the message we just added
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response
      addMessage(data.response, 'bot');

    } catch (error) {
      console.error('Chatbot error:', error);
      addMessage(
        'Sorry, I\'m having trouble connecting right now. Please try again later!',
        'bot'
      );
    } finally {
      setTyping(false);
    }
  }

  // Toggle chat window
  function toggleChat() {
    const window = document.getElementById('chatbot-window');
    isOpen = !isOpen;

    if (isOpen) {
      window.classList.add('open');
      document.getElementById('chatbot-input').focus();
    } else {
      window.classList.remove('open');
    }
  }

  // Close chat window
  function closeChat() {
    const window = document.getElementById('chatbot-window');
    isOpen = false;
    window.classList.remove('open');
  }

  // Event listeners
  function attachEvents() {
    // Bubble button
    document.getElementById('chatbot-bubble').addEventListener('click', toggleChat);

    // Close button
    document.getElementById('chatbot-close').addEventListener('click', closeChat);

    // Send button
    document.getElementById('chatbot-send').addEventListener('click', () => {
      const input = document.getElementById('chatbot-input');
      sendMessage(input.value);
    });

    // Enter key
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage(e.target.value);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      const chatbot = document.getElementById('abdullah-chatbot');
      if (isOpen && !chatbot.contains(e.target)) {
        closeChat();
      }
    });
  }

  // Initialize chatbot
  function init() {
    // Prevent multiple initializations
    if (document.getElementById('abdullah-chatbot')) {
      return;
    }

    injectStyles();
    createChatbot();
    attachEvents();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
