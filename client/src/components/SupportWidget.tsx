import { useState } from "react";
import { MessageCircle, Bot, User, X, ChevronLeft, Send } from "lucide-react";
import { ChatbotView } from "./chatbot/ChatbotView";

type ViewState = "MENU" | "CHATBOT" | "ADMIN";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("MENU");

  // Reset về menu khi đóng
  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setCurrentView("MENU"), 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* VIEW: MENU */}
          {currentView === "MENU" && (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-black text-white text-center">
                <h3 className="text-xl">Support Center</h3>
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
                    <h4 className="text-gray-900">AI Stylist</h4>
                    <p className="text-xs text-gray-500">
                      Get instant product suggestions
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView("ADMIN")}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 bg-gray-100 text-gray-900 rounded-full group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-gray-900">Chat with Admin</h4>
                    <p className="text-xs text-gray-500">
                      Support for orders & returns
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: CHATBOT */}
          {currentView === "CHATBOT" && (
            <ChatbotView
              onBack={() => setCurrentView("MENU")}
            />
          )}

          {/* VIEW: ADMIN CHAT */}
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
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                    </div>
                    <div>
                      <span className="block text-sm">Customer Support</span>
                      <span className="text-[10px] text-gray-300 block leading-none">
                        Typically replies in 5m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Chat */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-400">Today, 10:23 AM</span>
                </div>
                <div className="text-center text-gray-500 text-sm mt-20">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Start a conversation with our support team</p>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button className="absolute right-2 top-1.5 p-1 text-black hover:bg-gray-200 rounded-full">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nút trigger */}
      <button
        onClick={toggleOpen}
        className="group flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="pr-1">Support Messages</span>
          </>
        )}
      </button>
    </div>
  );
}
