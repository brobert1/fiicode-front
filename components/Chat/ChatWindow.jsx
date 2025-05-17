/**
 * Streaming mode is not straightforward for a RAG chain with sources.
 * The context attachment step in the RAG chain breaks the stream.
 * As such, the API indicates the end of the stream by sending specific events.
 * We are gracefully handling receiving the context here and attaching it to the message.
 */

import { store } from "@auth";
import { classnames, toaster } from "@lib";
import { useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import InteractiveAvatar from "@components/Avatar";

const ChatWindow = ({ onClose, isShortAnswer }) => {
  // Existing states…
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isStreaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  // Add avatar mode state
  const [isAvatarMode, setIsAvatarMode] = useState(false);

  // ... your handleSend remains largely the same.
  // When streaming the answer, update messages as before.
  // (We'll later pass the answer text to the avatar component if needed.)

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

      // Add an empty bot message to display the streaming response
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
            const rawMessage = buffer.slice(0, index);
            buffer = buffer.slice(index + 2);
            const lines = rawMessage.split("\n");
            let event = null;
            let data = "";
            for (const line of lines) {
              if (line.startsWith("event:")) {
                event = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                data += line.slice(5).trim();
              }
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
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <ChatHeader 
          onClose={onClose} 
          isAvatarMode={isAvatarMode} 
          onToggleMode={() => setIsAvatarMode(prev => !prev)} 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto mb-24">
        {isAvatarMode ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              <InteractiveAvatar messages={messages} />
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                <div className="absolute bottom-4 left-0 right-0 px-4">
                  <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-2xl mx-auto text-center">
                    {messages[messages.length - 1].text}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-4">
            <ChatMessages {...{ isLoading, isStreaming, messages, messagesEndRef }} />
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
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
