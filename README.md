# Connectify

[![GitHub stars](https://img.shields.io/github/stars/SaiyyedKaif/Connectify.svg)](https://github.com/SaiyyedKaif/Connectify/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SaiyyedKaif/Connectify.svg)](https://github.com/SaiyyedKaif/Connectify/network)
[![GitHub issues](https://img.shields.io/github/issues/SaiyyedKaif/Connectify.svg)](https://github.com/SaiyyedKaif/Connectify/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 💬 **Real-time Chat Application with WebSockets**

Connectify is a modern, real-time chat application built with Node.js, Express, and Socket.io. Featuring a clean, custom UI created with vanilla JavaScript, HTML, and CSS, this application enables seamless instant messaging between multiple users without the need for page refreshes.

## 🚀 Features

### 🔗 Real-time Communication
- **Instant Messaging**: Send and receive messages in real-time using WebSocket technology
- **Multiple Users**: Support for multiple concurrent users in the same chat room
- **Live Updates**: Messages appear instantly across all connected clients
- **Connection Status**: Real-time indication of user connections and disconnections

### 🎨 User Interface
- **Custom Design**: Handcrafted UI with pure CSS for optimal performance
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean & Modern**: Intuitive interface focusing on user experience
- **No External Dependencies**: Lightweight frontend with vanilla JavaScript

### ⚡ Performance & Reliability
- **WebSocket Fallback**: Automatic fallback to polling if WebSockets are unavailable
- **Low Latency**: Optimized for minimal message delivery delay
- **Scalable Architecture**: Built to handle multiple concurrent connections
- **Error Handling**: Robust error handling for connection issues

## 🛠️ Technology Stack

### Backend (JavaScript - 30.6%)
- **Node.js**: Runtime environment for server-side JavaScript
- **Express.js**: Fast, unopinionated web framework for Node.js
- **Socket.io**: Real-time bidirectional event-based communication library
- **HTTP Module**: Built-in Node.js module for creating HTTP servers

### Frontend (HTML - 37.3% | CSS - 32.1%)
- **Vanilla JavaScript**: Pure JavaScript for client-side functionality
- **HTML5**: Semantic markup for structure and accessibility
- **CSS3**: Custom styling with modern CSS features
- **Socket.io Client**: Client-side Socket.io library for WebSocket communication

## 📁 Project Structure

```
Connectify/
├── public/                 # Static files
│   ├── index.html         # Main chat interface
│   ├── styles.css         # Custom CSS styling
│   └── client.js          # Client-side JavaScript
├── server.js              # Main server file
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Modern web browser with WebSocket support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaiyyedKaif/Connectify.git
   cd Connectify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Open multiple tabs or browsers to test real-time messaging
   - Start chatting instantly!

## 💻 Usage

### Getting Started
1. **Launch the App**: Navigate to `http://localhost:3000` in your web browser
2. **Enter Your Name**: Type your username in the name field
3. **Start Chatting**: Type your message and hit Enter or click Send
4. **Real-time Experience**: Watch messages appear instantly for all connected users

### Features in Action

#### Sending Messages
```javascript
// Client-side message sending
socket.emit('chat message', {
    username: currentUser,
    message: messageText,
    timestamp: new Date().toISOString()
});
```

#### Receiving Messages
```javascript
// Client-side message receiving
socket.on('chat message', (data) => {
    displayMessage(data.username, data.message, data.timestamp);
});
```

#### Connection Management
```javascript
// Handle user connections
socket.on('user connected', (username) => {
    showNotification(`${username} joined the chat`);
});

socket.on('user disconnected', (username) => {
    showNotification(`${username} left the chat`);
});
```

## 🏗️ Architecture Overview

### Server-Side Architecture
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle incoming messages
    socket.on('chat message', (data) => {
        // Broadcast to all connected clients
        io.emit('chat message', data);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
```

### Client-Side Architecture
```javascript
// Initialize Socket.io connection
const socket = io();

// DOM elements
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');

// Send message on form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message) {
        socket.emit('chat message', {
            username: currentUser,
            message: message,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

// Listen for incoming messages
socket.on('chat message', (data) => {
    displayMessage(data);
});
```

## 🎨 Customization

### Styling
The application uses custom CSS for styling. Key style files:

```css
/* Chat container styling */
.chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
}

/* Message styling */
.message {
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Input styling */
.message-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
}
```

### Adding Features
Extend the application with additional features:

#### User Typing Indicators
```javascript
// Client-side typing detection
let typingTimer;
messageInput.addEventListener('keypress', () => {
    socket.emit('typing', currentUser);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stop typing', currentUser);
    }, 1000);
});
```

#### Message Timestamps
```javascript
// Display formatted timestamps
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:

```env
PORT=3000
NODE_ENV=development
```

### Server Configuration
```javascript
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Connectify server running on port ${PORT}`);
    console.log(`🌐 Access the app at http://localhost:${PORT}`);
});
```

## 🧪 Testing

### Manual Testing
1. Open multiple browser windows/tabs
2. Navigate to `http://localhost:3000` in each
3. Send messages from different windows
4. Verify real-time message delivery

### Load Testing
Test with multiple concurrent users:
```bash
# Install artillery for load testing
npm install -g artillery

# Create test script
artillery quick --count 10 --num 5 http://localhost:3000
```

## 🚀 Deployment

### Heroku Deployment
1. **Prepare for deployment**
   ```bash
   # Add start script to package.json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Digital Ocean/VPS Deployment
1. **Set up server**
   ```bash
   # Install Node.js and npm
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Configure process manager**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start server.js --name connectify
   pm2 startup
   pm2 save
   ```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Test your changes across different browsers
- Update documentation for new features
- Keep commits focused and descriptive

### Ideas for Contributions
- **User Authentication**: Add login/signup functionality
- **Chat Rooms**: Implement multiple chat rooms
- **File Sharing**: Enable image and file uploads
- **Emoji Support**: Add emoji picker and reactions
- **Message History**: Implement persistent message storage
- **Private Messaging**: Add direct message capabilities

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
```javascript
// Add connection error handling
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    showNotification('Connection failed. Retrying...', 'error');
});
```

#### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### WebSocket Issues
- Ensure firewall allows WebSocket connections
- Check for proxy/firewall blocking WebSocket protocols
- Verify Socket.io client version compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.io Team**: For the excellent real-time communication library
- **Express.js**: For the robust web framework
- **Node.js Community**: For continuous innovation in server-side JavaScript
- **Open Source Contributors**: For inspiration and shared knowledge

## 📞 Contact

**Saiyyed Kaif** - [@SaiyyedKaif](https://github.com/SaiyyedKaif)

Project Link: [https://github.com/SaiyyedKaif/Connectify](https://github.com/SaiyyedKaif/Connectify)

---

⭐ **Star this repository if you find it helpful!** ⭐

Built with ❤️ by [Saiyyed Kaif](https://github.com/SaiyyedKaif)
