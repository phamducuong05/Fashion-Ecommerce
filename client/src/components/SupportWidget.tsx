import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  MessageCircle,
  Bot,
  User,
  X,
  ChevronLeft,
  Send,
  Sparkles,
} from "lucide-react";
import { socketService } from "../services/socket";
import { ChatbotView } from "./chatbot/ChatbotView";
import { useToast } from "./Toast";

type ViewState = "MENU" | "CHATBOT" | "ADMIN";

interface Message {
  id: number;
  conversationId: number;
  sender: "CUSTOMER" | "ADMIN";
  content: string;
  createdAt: string;
  isRead: boolean;
}

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("MENU");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Handler to check if user is logged in before opening admin chat
  const handleAdminChatClick = () => {
    const userDataString = localStorage.getItem("user");
    
    if (!userDataString) {
      // User not logged in - close widget and redirect to login
      setIsOpen(false);
      showToast("Please login to chat with support", 'warning');
      navigate("/signin");
      return;
    }

    // User is logged in - proceed to admin chat
    setCurrentView("ADMIN");
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to Socket.IO when user opens admin chat
  useEffect(() => {
    if (currentView === "ADMIN" && !isConnected) {
      // Get user info from localStorage (set during login)
      const userDataString = localStorage.getItem("user");
      let userData;
      
      if (userDataString) {
        userData = JSON.parse(userDataString);
      } else {
        // If no user in localStorage, silently go back to menu
        console.error("❌ No user data found in localStorage. User must be logged in to use chat.");
        setCurrentView("MENU");
        return;
      }
      
      console.log("👤 Connecting with user:", userData);
      
      // Connect to socket
      socketService.connect(userData.id, userData.name || userData.email);
      setIsConnected(true);

      // Load existing conversation and message history
      setTimeout(() => {
        console.log("� Loading conversation history...");
        socketService.getMyConversation((data) => {
          console.log("✅ Loaded conversation:", data.conversation.id, "with", data.messages.length, "messages");
          setConversationId(data.conversation.id);
          setMessages(data.messages);
        });
      }, 1000);

      // Listen for incoming messages
      const handleNewMessage = (message: Message) => {
        console.log("📨 New message received:", message);
        
        // Set conversationId if not already set
        if (message.conversationId && !conversationId) {
          console.log("✅ Setting conversationId from new message:", message.conversationId);
          setConversationId(message.conversationId);
        }
        
        // Add new message to the list (avoid duplicates)
        setMessages((prev) => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) {
            console.log("⚠️ Message already exists, skipping:", message.id);
            return prev;
          }
          console.log("✅ Adding message to list:", message.id);
          return [...prev, message];
        });
      };

      socketService.onMessageReceived(handleNewMessage);

      return () => {
        socketService.offMessageReceived(handleNewMessage);
      };
    }
  }, [currentView]); // Only re-run when view changes

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const messageData = {
      conversationId,
      message: messageText,
      sender: "CUSTOMER" as const,
    };

    console.log("📤 Sending message:", messageData);

    setMessageText("");

    // Send to server - message will be added via message:received event
    socketService.sendMessage(messageData);
  };

  // Reset về menu khi đóng
  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setCurrentView("MENU"), 300); // Reset view sau khi đóng
    } else {
      // Check login before opening
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        showToast("Please login to access support", 'warning');
        navigate("/signin");
        return;
      }
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* --- CỬA SỔ CHAT (Hiện ra khi isOpen = true) --- */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* 1. VIEW: MENU LỰA CHỌN */}
          {currentView === "MENU" && (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-black text-white text-center">
                <h3 className="text-xl font-bold">Support Center</h3>
                <p className="text-sm text-gray-300 mt-1">
                  How can we help you today?
                </p>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-center gap-4 bg-gray-50">
                <button
                  onClick={() => setCurrentView("CHATBOT")}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">AI Stylist</h4>
                    <p className="text-xs text-gray-500">
                      Get instant product suggestions
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleAdminChatClick}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 bg-gray-100 text-gray-900 rounded-full group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chat with Admin</h4>
                    <p className="text-xs text-gray-500">
                      Support for orders & returns
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 2. VIEW: CHATBOT AI */}
          {currentView === "CHATBOT" && (
            <ChatbotView onBack={() => setCurrentView("MENU")} />
          )}

          {/* 3. VIEW: ADMIN CHAT (Real-time with Socket.IO) */}
          {currentView === "ADMIN" && (
            <div className="flex flex-col h-full">
              {/* Header Admin */}
              <div className="p-4 bg-black text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView("MENU")}
                    className="hover:bg-gray-800 p-1 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <User className="w-5 h-5" />
                      {isConnected && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold block text-sm">
                        Customer Support
                      </span>
                      <span className="text-[10px] text-gray-300 block leading-none">
                        {isConnected ? "Connected" : "Connecting..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Chat - Real-time messages */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <User className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      Start a conversation with our support team
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div key={message.id || index} className="mb-4">
                        <div
                          className={`flex ${
                            message.sender === "CUSTOMER"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              message.sender === "CUSTOMER"
                                ? "bg-black text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "CUSTOMER"
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input with real-time send */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="absolute right-2 top-1.5 p-1 text-black hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- NÚT BẤM KÍCH HOẠT (TRIGGER BUTTON) --- */}
      <button
        onClick={toggleOpen}
        className="group flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="font-semibold pr-1">Support Messages</span>
          </>
        )}
      </button>
    </div>
  );
}
