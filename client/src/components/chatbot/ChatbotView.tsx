import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Bot,
  ChevronLeft,
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  Menu,
  Trash2,
  Loader2,
} from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";

// --- CONFIG ---
const API_BASE_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- TYPES ---
interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  products?: Product[];
  createdAt: string;
}

interface ChatSessionSummary {
  id: string;
  title: string;
  updatedAt: string;
}

interface ChatSessionDetail extends ChatSessionSummary {
  messages: ChatMessage[];
}

interface ChatbotViewProps {
  onBack: () => void;
}

export function ChatbotView({ onBack }: ChatbotViewProps) {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSessionDetail | null>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // --- API ACTIONS ---

  // 1. GET ALL Sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await api.get("/chat/sessions");
      setSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // 2. GET ONE Session Detail
  const loadSessionDetail = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await api.get(`/chat/sessions/${sessionId}`);
      setCurrentSession(res.data);
      if (window.innerWidth < 768) setShowSidebar(false);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // 3. CREATE New Chat
  const handleNewChat = async () => {
    try {
      setIsLoadingMessages(true);
      // Tạo session mới, title mặc định bên server là "New Chat"
      const res = await api.post("/chat/sessions"); 
      const newSession = res.data; 

      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession({ ...newSession, messages: [] });
      setShowSidebar(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // 4. SEND Message (Tự động cập nhật Title ở Backend)
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    const userContent = inputValue;
    setInputValue("");
    setIsSending(true);

    // Optimistic UI: Hiện tin nhắn user ngay lập tức
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
      createdAt: new Date().toISOString(),
    };

    setCurrentSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, tempUserMsg] } : null
    );

    try {
      const res = await api.post(`/chat/sessions/${currentSession.id}/messages`, {
        content: userContent,
      });
      
      const botResponse = res.data; // Server trả về tin nhắn Bot

      // Cập nhật Bot Message vào UI
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, botResponse],
            }
          : null
      );

      // QUAN TRỌNG: Reload lại danh sách Sessions để cập nhật Title mới 
      // (Nếu đây là tin nhắn đầu tiên, Server đã đổi title rồi)
      fetchSessions();

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // 5. DELETE Chat
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await api.delete(`/chat/sessions/${sessionId}`);
      
      const newSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(newSessions);

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        if (newSessions.length > 0) {
          loadSessionDetail(newSessions[0].id);
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, isSending]);

  const handleProductClick = (productId: string) => {
    navigate(`/productdetail/${productId}`);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col h-full relative bg-gray-50">
      {/* HEADER */}
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-md relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:bg-indigo-500 p-1.5 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden hover:bg-indigo-500 p-1.5 rounded">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
             {isLoadingMessages ? <Loader2 className="w-4 h-4 animate-spin"/> : <Bot className="w-5 h-5" />}
             <div>
                <span className="block text-sm font-bold leading-none">AI Stylist</span>
                <span className="text-[10px] opacity-80 leading-none truncate max-w-[150px]">
                    {currentSession?.title || "New Conversation"}
                </span>
             </div>
          </div>
        </div>

        <button onClick={handleNewChat} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-full text-sm font-medium shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR LIST (Đã bỏ chức năng Edit) */}
        <div className={`
            absolute inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 flex flex-col shadow-xl md:shadow-none md:relative md:transform-none
            ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}>
          
          {isLoadingSessions ? (
            <div className="flex justify-center mt-10"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin"/></div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {sessions.length === 0 && <div className="text-center text-gray-400 mt-5 text-sm">No history.</div>}
               {sessions.map((session) => (
                 <div
                   key={session.id}
                   onClick={() => loadSessionDetail(session.id)}
                   className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                     currentSession?.id === session.id 
                       ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                       : "bg-white border-transparent hover:bg-gray-50"
                   }`}
                 >
                    <MessageSquare className={`w-4 h-4 shrink-0 ${currentSession?.id === session.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    
                    <div className="flex-1 min-w-0">
                        {/* Chỉ hiển thị Title, không có Input edit */}
                        <h4 className={`text-sm font-medium truncate ${currentSession?.id === session.id ? 'text-gray-900' : 'text-gray-600'}`}>
                            {session.title}
                        </h4>
                        <p className="text-[10px] text-gray-400">{formatDate(session.updatedAt)}</p>
                    </div>

                    {/* Chỉ còn nút Delete */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleDeleteSession(e, session.id)} className="p-1.5 hover:bg-white text-gray-400 hover:text-red-600 rounded">
                            <Trash2 className="w-3 h-3"/>
                        </button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* OVERLAY MOBILE */}
        {showSidebar && <div className="absolute inset-0 bg-black/30 z-20 md:hidden" onClick={() => setShowSidebar(false)} />}

        {/* MAIN CHAT AREA (Giữ nguyên) */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {!currentSession ? (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><Sparkles className="w-8 h-8 text-indigo-300"/></div>
                <p>Start a new conversation.</p>
                <button onClick={handleNewChat} className="text-indigo-600 font-semibold hover:underline">Create Chat</button>
             </div>
          ) : (
            <>
                <div className="flex-1 p-4 bg-gradient-to-b from-indigo-50/30 to-white overflow-y-auto">
                    {currentSession.messages.map((message) => (
                    <div key={message.id} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {message.role === "bot" ? (
                        <div className="flex gap-3 max-w-3xl">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-800 leading-relaxed">
                                    {message.content}
                                </div>
                                {message.products && message.products.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {message.products.map((p) => (
                                            <div key={p.id} onClick={() => handleProductClick(p.id)} className="cursor-pointer hover:scale-[1.02] transition-transform">
                                                <ProductCard product={p} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        ) : (
                        <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-md text-sm max-w-[85%] leading-relaxed">
                                {message.content}
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                    
                    {isSending && (
                        <div className="flex gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><Loader2 className="w-4 h-4 text-indigo-600 animate-spin"/></div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-400 italic">AI is typing...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="relative max-w-4xl mx-auto">
                    <input
                        type="text"
                        placeholder="Ask for suggestions..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        disabled={isSending}
                        className="w-full pl-5 pr-12 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isSending}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
                    </button>
                    </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}