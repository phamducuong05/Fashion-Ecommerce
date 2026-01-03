import { useState, useEffect } from 'react';
import { Send, Search, MessageSquare } from 'lucide-react';
import { socketService } from '../services/socket';

interface Message {
  id: number;
  sender: 'CUSTOMER' | 'ADMIN';
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  userId: number;
  status: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  messages: Message[];
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get admin info from localStorage OR use default admin
    const adminData = localStorage.getItem('user');
    let admin;
    
    if (adminData) {
      admin = JSON.parse(adminData);
      console.log('👤 Using admin from localStorage:', admin);
    } else {
      // Default admin for testing (you should replace this with your actual admin ID)
      admin = {
        id: 1, // Change this to match your admin user ID in the database
        name: 'Admin User',
        email: 'admin@store.com',
        role: 'ADMIN'
      };
      console.log('👤 Using default admin:', admin);
      console.warn('⚠️ No user in localStorage, using default admin ID: 1. Change this in ChatInterface.tsx if needed.');
    }
    
    // Connect to socket
    socketService.connect(admin.id, admin.name || admin.email);
    setIsConnected(true);

    // Load all conversations after a short delay to ensure socket is connected
    setTimeout(() => {
      console.log('📋 Requesting conversations...');
      loadConversations();
    }, 1000);

    // Listen for new messages
    const handleNewMessage = (message: any) => {
      console.log('📨 Admin received new message:', message);
      
      // Update conversations list
      loadConversations();
      
      // If this message is for the currently selected conversation, add it to messages
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some(m => m.id === message.id);
          if (exists) {
            console.log("⚠️ Message already exists, skipping:", message.id);
            return prev;
          }
          console.log("✅ Adding message to admin list:", message.id);
          return [...prev, message];
        });
      }
    };

    socketService.onMessageReceived(handleNewMessage);

    // Cleanup on unmount
    return () => {
      socketService.offMessageReceived(handleNewMessage);
    };
  }, [selectedConversation]);

  const loadConversations = () => {
    socketService.getAllConversations((data) => {
      console.log('📋 Conversations loaded:', data);
      setConversations(data);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    console.log('📤 Admin sending message:', messageText);

    const messageToSend = messageText;
    setMessageText('');

    socketService.sendMessage({
      conversationId: selectedConversation.id,
      message: messageToSend,
      sender: 'ADMIN',
    });

    // Message will be added via message:received event
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Load messages for this conversation
    socketService.getMessages(conversation.id, (data) => {
      console.log('💬 Messages loaded:', data);
      setMessages(data);
    });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLastMessage = (conv: Conversation) => {
    if (conv.messages && conv.messages.length > 0) {
      return conv.messages[0].content;
    }
    return 'No messages yet';
  };

  const getLastActiveTime = (conv: Conversation) => {
    const date = new Date(conv.updatedAt);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Customer Chat</h2>
        <p className="text-gray-600">
          Communicate with your customers in real-time
          {isConnected && (
            <span className="ml-2 text-green-600 text-sm">● Connected</span>
          )}
          {!isConnected && (
            <span className="ml-2 text-red-600 text-sm">● Disconnected</span>
          )}
          <button 
            onClick={loadConversations}
            className="ml-4 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            🔄 Refresh Conversations
          </button>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col lg:flex-row">
        <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No conversations yet</p>
                <button 
                  onClick={loadConversations}
                  className="mt-2 text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation?.id === conv.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 truncate">
                        {conv.user.name || 'Customer'}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{conv.user.email}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{getLastMessage(conv)}</p>
                  <p className="text-xs text-gray-400 mt-1">{getLastActiveTime(conv)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-gray-900">
                  {selectedConversation.user.name || 'Customer'}
                </h3>
                <p className="text-sm text-gray-600">{selectedConversation.user.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'ADMIN' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'ADMIN'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'ADMIN' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}