import { store } from "@auth";
import { toaster } from "@lib";
import { useRef, useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import InteractiveAvatar from "@components/Avatar";
import { truncate } from "@functions";

const ChatWindow = ({ onClose, isShortAnswer }) => {
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isStreaming, setStreaming] = useState(false);
  const [isAvatarMode, setIsAvatarMode] = useState(false);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const promptSuggestions = [
    {
      title: "XP",
      description: "How much xp do i need for the next badge?",
    },
    {
      title: "Iasi city center",
      description: "How can i get from Palas to the Iasi city center?",
    },
    {
      title: "Friends",
      description: "How many friends do i have?",
    },
    {
      title: "Favourite places",
      description: "Have i set any favourite places?",
    },
    {
      title: "Traffic",
      description: "How is the traffic right now?",
    },
  ];

  useEffect(() => {
    if (userInput.trim().length > 0 || messages.length > 0 || isAvatarMode) {
      setShowPromptSuggestions(false);
    } else {
      setShowPromptSuggestions(true);
    }
  }, [userInput, messages, isAvatarMode]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage = { text: userInput, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      setLoading(true);
      const response = await fetch(`${process.env.API_BASE_URL}/client/chat/chat-rag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${store.getState()}`,
        },
        body: JSON.stringify({
          question: newMessage.text,
          streamMode: true,
          isShortAnswer,
        }),
      });
      if (!response.body) {
        console.error("ReadableStream not supported in this browser.");
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let done = false;

      setLoading(false);
      setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
      setStreaming(true);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: true });
        if (chunk) {
          buffer += chunk;
          let index;
          while ((index = buffer.indexOf("\n\n")) >= 0) {
            const raw = buffer.slice(0, index);
            buffer = buffer.slice(index + 2);
            const lines = raw.split("\n");
            let event = null,
              data = "";
            for (const line of lines) {
              if (line.startsWith("event:")) event = line.slice(6).trim();
              if (line.startsWith("data:")) data += line.slice(5).trim();
            }
            if (event === "answer") {
              const text = JSON.parse(data);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].text += text;
                return updated;
              });
            } else if (event === "context") {
              const context = JSON.parse(data);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].context = context;
                return updated;
              });
            } else if (event === "end") {
              done = true;
              break;
            } else if (event === "error") {
              console.error("Error from server:", JSON.parse(data));
              toaster.error("Error from server");
              done = true;
              break;
            }
          }
        }
      }

      setStreaming(false);
    } catch (error) {
      console.error("Error while streaming:", error);
      toaster.error("Error while streaming");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handlePromptClick = (prompt) => {
    setUserInput(prompt.description);
    setShowPromptSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <ChatHeader
          onClose={onClose}
          isAvatarMode={isAvatarMode}
          onToggleMode={() => setIsAvatarMode((prev) => !prev)}
        />
      </div>

      <div className="flex-1 overflow-y-auto mb-24">
        {isAvatarMode ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              <InteractiveAvatar messages={messages} />
            </div>
          </div>
        ) : (
          <div className="px-4">
            <ChatMessages
              isLoading={isLoading}
              isStreaming={isStreaming}
              messages={messages}
              messagesEndRef={messagesEndRef}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto scrollbar-none">
          {showPromptSuggestions && (
            <div className="mb-3 overflow-x-auto scrollbar-none">
              <div className="flex space-x-2 pb-2">
                {promptSuggestions.map((prompt, index) => (
                  <div
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 rounded-2xl py-3 px-4 cursor-pointer transition-all"
                  >
                    <div className="text-sm text-gray-700 font-medium">{prompt.title}</div>
                    <div className="text-xs text-gray-500">{truncate(prompt.description, 30)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <ChatInput
            userInput={userInput}
            setUserInput={setUserInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
