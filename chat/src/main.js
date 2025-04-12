const chatMessages = document.getElementById("chat-messages")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

// Bot responses
const botResponses = [
  "Hi there! How can I help you today?",
  "That's interesting! Tell me more.",
  "I understand. Let me think about that.",
  "Great question! I'm processing that now.",
  "I appreciate your patience. Let me respond to that.",
  "Thanks for sharing that with me!",
  "I'm here to assist with any questions you have.",
  "That's a good point. Let me elaborate...",
  "I'm still learning, but I'll do my best to help.",
  "Let me know if you need anything else!",
]

// Chat history
const chatHistory = []

// Initialize chat with a welcome message
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    addMessage("bot", "Hello! I'm ChatBot. How can I help you today?")
  }, 500)
})

// Handle form submission
messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const message = messageInput.value.trim()

  if (message) {
    // Add user message to chat
    addMessage("user", message)
    messageInput.value = ""

    // Simulate bot thinking with typing indicator
    showTypingIndicator()

    // Simulate bot response after a delay
    setTimeout(
      () => {
        removeTypingIndicator()
        const response = getRandomResponse()
        addMessage("bot", response)

        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight
      },
      1000 + Math.random() * 1000,
    )
  }
})

// Add a message to the chat
function addMessage(sender, text) {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Create message element
  const messageEl = document.createElement("div")
  messageEl.classList.add("message")

  // Different styling based on sender
  if (sender === "user") {
    messageEl.innerHTML = `
      <div class="flex justify-end">
        <div class="bg-emerald-500 text-white rounded-lg py-2 px-4 max-w-[80%] shadow-sm">
          <p>${text}</p>
          <span class="text-xs text-emerald-100 block text-right mt-1">${timestamp}</span>
        </div>
      </div>
    `
  } else {
    messageEl.innerHTML = `
      <div class="flex justify-start">
        <div class="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-[80%] shadow-sm">
          <p>${text}</p>
          <span class="text-xs text-gray-500 block mt-1">${timestamp}</span>
        </div>
      </div>
    `
  }

  // Add to DOM and chat history
  chatMessages.appendChild(messageEl)
  chatHistory.push({ sender, text, timestamp })

  // Auto scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Show typing indicator
function showTypingIndicator() {
  const typingEl = document.createElement("div")
  typingEl.id = "typing-indicator"
  typingEl.innerHTML = `
    <div class="flex justify-start">
      <div class="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 shadow-sm">
        <div class="flex space-x-1">
          <div class="typing-dot bg-gray-500"></div>
          <div class="typing-dot bg-gray-500 animation-delay-200"></div>
          <div class="typing-dot bg-gray-500 animation-delay-400"></div>
        </div>
      </div>
    </div>
  `
  chatMessages.appendChild(typingEl)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingEl = document.getElementById("typing-indicator")
  if (typingEl) {
    typingEl.remove()
  }
}

// Get a random bot response
function getRandomResponse() {
  return botResponses[Math.floor(Math.random() * botResponses.length)]
}
