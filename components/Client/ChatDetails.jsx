import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useProfile } from "@hooks";
import Message from "./Message";
import { sendMessage, markConversationAsRead } from "@api/client";
import { useWebSocket } from "contexts/WebSocketContext";
import { useRouter } from "next/router";
import { Input } from "@components/Fields";
import { Button } from "@components";

const ChatDetails = ({ conversation, onMessagesRead = () => {} }) => {
  const router = useRouter();
  const { me } = useProfile();
  const { onlineUsers, sendWebSocketMessage } = useWebSocket();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef();
  const typingTimeout = useRef();
  const [localMessages, setLocalMessages] = useState([]);

  // Find the other participant (assuming 1-on-1 conversations)
  const otherParticipant = conversation.participants.find((p) => p._id !== me?.me);
  const isOnline = onlineUsers.has(otherParticipant._id);

  const {
    data: messages,
    status,
    refetch,
  } = useQuery(`/client/conversations/${conversation._id}/messages`);

  // Mark messages as read mutation
  const { mutate: markAsRead } = useMutation(() => markConversationAsRead(conversation._id), {
    onSuccess: () => {
      // Call the callback to refresh unread counts
      onMessagesRead();
    },
  });

  const { mutate: sendMessageMutation } = useMutation(sendMessage);

  // Set up websocket message listeners for real-time updates
  useEffect(() => {
    // Mark messages as read when conversation is opened
    if (conversation?._id) {
      markAsRead();

      // Send read_messages notification via WebSocket
      sendWebSocketMessage({
        type: "read_messages",
        conversationId: conversation._id,
      });
    }

    // Set up event listener for websocket messages
    const handleWebSocketMessage = (event) => {
      try {
        const data = event.detail; // Use event.detail for CustomEvent

        if (data.conversationId === conversation._id) {
          switch (data.type) {
            case "new_message":
              // Refresh messages when we receive a new message
              refetch();
              // Also mark as read immediately
              markAsRead();
              break;

            case "typing":
              setTypingUsers((prev) => new Set([...prev, data.userId]));
              break;

            case "stop_typing":
              setTypingUsers((prev) => {
                const newSet = new Set([...prev]);
                newSet.delete(data.userId);
                return newSet;
              });
              break;
          }
        }
      } catch (error) {
        console.error("Error handling websocket message:", error);
      }
    };

    // Add event listener for WebSocket messages
    window.addEventListener("websocket_message", handleWebSocketMessage);

    // For immediate message refresh when a message is sent
    const handleSentMessage = () => {
      refetch();
    };

    window.addEventListener("message_sent", handleSentMessage);

    // Cleanup function
    return () => {
      window.removeEventListener("websocket_message", handleWebSocketMessage);
      window.removeEventListener("message_sent", handleSentMessage);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [conversation._id, refetch, markAsRead, sendWebSocketMessage]);

  // Combine server messages with local temporary messages for display
  const displayMessages = useMemo(() => {
    // Check if messages exists and has data property that is an array
    if (!messages || !messages.data || !Array.isArray(messages.data)) return localMessages;

    return [...messages.data, ...localMessages.filter((m) => m.isTemp)].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [messages, localMessages]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (displayMessages.length > 0) {
      scrollToBottom();
    }
  }, [displayMessages]);

  // Automatic periodic refresh to ensure messages are up to date
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (conversation?._id) {
        refetch();
      }
    }, 10000); // Refresh every 10 seconds as a fallback

    return () => clearInterval(refreshInterval);
  }, [conversation?._id, refetch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const messageContent = message.trim();
    // Clear the input field immediately for better UX
    setMessage("");

    // Create a temporary message object for immediate display
    const tempMessageId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempMessageId,
      content: messageContent,
      createdAt: new Date().toISOString(),
      sender: { _id: me?.me, name: "You" },
      isTemp: true,
    };

    // Add the temporary message to the local messages
    setLocalMessages((prev) => [...prev, tempMessage]);

    // Force scroll to bottom for the new message
    setTimeout(scrollToBottom, 50);

    sendMessageMutation(
      {
        conversationId: conversation._id,
        content: messageContent,
      },
      {
        onSuccess: () => {
          // Remove temp message when we get success
          setLocalMessages((prev) => prev.filter((m) => m._id !== tempMessageId));
          // Refresh messages from server
          refetch();
          stopTyping();
        },
        onError: () => {
          // Show error and restore message in input
          setMessage(messageContent);
          // Remove the temporary message
          setLocalMessages((prev) => prev.filter((m) => m._id !== tempMessageId));
          alert("Failed to send message. Please try again.");
        },
      }
    );
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);

      sendWebSocketMessage({
        type: "typing",
        conversationId: conversation._id,
      });
    }

    // Clear previous timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout
    typingTimeout.current = setTimeout(stopTyping, 3000);
  };

  const stopTyping = () => {
    setIsTyping(false);

    // Send stop typing notification
    sendWebSocketMessage({
      type: "stop_typing",
      conversationId: conversation._id,
    });
  };

  const handleBackToList = () => {
    // Update URL by removing the conversationId query parameter
    router.push(
      {
        pathname: router.pathname,
        query: {},
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button
          onClick={handleBackToList}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 md:hidden"
          aria-label="Back to conversations"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="relative">
          <img
            src={
              otherParticipant?.image?.path ||
              `https://ui-avatars.com/api/?name=${otherParticipant?.name}`
            }
            alt={otherParticipant?.name || "User"}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium">{otherParticipant?.name}</h3>
          <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {status === "loading" && (
          <div className="text-center py-4 text-gray-500">Loading messages...</div>
        )}

        {status === "error" && (
          <div className="text-center py-4 text-red-500">
            Failed to load messages. Please try again.
          </div>
        )}

        {status === "success" &&
          (!messages?.data || !Array.isArray(messages.data) || messages.data.length === 0) &&
          localMessages.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          )}

        {status === "success" &&
          displayMessages.length > 0 &&
          displayMessages.map((msg) => (
            <Message key={msg._id} message={msg} isMe={msg.sender._id === me?.me} />
          ))}

        {typingUsers.size > 0 && (
          <div className="text-sm text-gray-500 italic">{otherParticipant.name} is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 bg-white z-10">
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex items-center">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="ml-2 bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatDetails;
