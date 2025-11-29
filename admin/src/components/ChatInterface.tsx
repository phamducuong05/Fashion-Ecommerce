import { useState } from 'react';
import { Send, Search } from 'lucide-react';

interface Message {
  id: number;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: Date;
}

interface Chat {
  id: number;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  unread: number;
  lastActive: Date;
  messages: Message[];
}

const initialChats: Chat[] = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    lastMessage: 'When will my order be delivered?',
    unread: 2,
    lastActive: new Date('2024-11-27T14:30:00'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Hi, I placed an order yesterday. Order #ORD-1003',
        timestamp: new Date('2024-11-27T14:25:00'),
      },
      {
        id: 2,
        sender: 'customer',
        text: 'When will my order be delivered?',
        timestamp: new Date('2024-11-27T14:30:00'),
      },
    ],
  },
  {
    id: 2,
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    lastMessage: 'Thank you for your help!',
    unread: 0,
    lastActive: new Date('2024-11-26T10:15:00'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'I need to change my shipping address',
        timestamp: new Date('2024-11-26T10:00:00'),
      },
      {
        id: 2,
        sender: 'admin',
        text: "I'd be happy to help! Could you provide your order number?",
        timestamp: new Date('2024-11-26T10:05:00'),
      },
      {
        id: 3,
        sender: 'customer',
        text: 'Order #ORD-1005',
        timestamp: new Date('2024-11-26T10:08:00'),
      },
      {
        id: 4,
        sender: 'admin',
        text: 'Address updated successfully!',
        timestamp: new Date('2024-11-26T10:12:00'),
      },
      {
        id: 5,
        sender: 'customer',
        text: 'Thank you for your help!',
        timestamp: new Date('2024-11-26T10:15:00'),
      },
    ],
  },
  {
    id: 3,
    customerName: 'Emma Davis',
    customerEmail: 'emma.davis@email.com',
    lastMessage: 'Do you ship internationally?',
    unread: 1,
    lastActive: new Date('2024-11-27T11:45:00'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Do you ship internationally?',
        timestamp: new Date('2024-11-27T11:45:00'),
      },
    ],
  },
];

export function ChatInterface() {
  const [chats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(selectedChat?.messages || []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'admin',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#3E2723] mb-2">Customer Chat</h2>
        <p className="text-[#6F4E37]">Communicate with your customers in real-time</p>
      </div>

      {/* Chat Container */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg border border-[#D4A574] overflow-hidden h-[600px] flex flex-col lg:flex-row">
        {/* Chat List Sidebar */}
        <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-[#D4A574] flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-[#D4A574]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0826D] w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#D4A574] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full p-4 text-left hover:bg-[#FFF8E7] transition-colors border-b border-[#F5EBD7] ${
                  selectedChat?.id === chat.id ? 'bg-[#FFF8E7]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#3E2723] truncate">{chat.customerName}</h4>
                    <p className="text-xs text-gray-500 truncate">{chat.customerEmail}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="ml-2 px-2 py-1 bg-[#8B6F47] text-white text-xs rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {chat.lastActive.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#D4A574] bg-gradient-to-r from-[#FFF8E7] to-[#F5DEB3]">
                <h3 className="text-[#3E2723]">{selectedChat.customerName}</h3>
                <p className="text-sm text-[#6F4E37]">{selectedChat.customerEmail}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-[#FFF8E7]/30 to-[#F5DEB3]/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'admin'
                          ? 'bg-gradient-to-br from-[#8B6F47] to-[#6F4E37] text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-[#F5DEB3]' : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#D4A574] bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
