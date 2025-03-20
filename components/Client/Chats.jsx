import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ConversationItem from "./ConversationItem";
import { useWebSocket } from "contexts/WebSocketContext";
import { ChatDetails } from ".";
import { useQuery } from "@hooks";

const Chats = ({ conversations: initialConversations }) => {
  // Use the useQuery hook to have access to refetch functionality
  const { data: refreshedConversations, refetch } = useQuery("/client/conversations", {
    initialData: initialConversations,
  });

  const [activeConversation, setActiveConversation] = useState(null);
  const [allConversations, setAllConversations] = useState(initialConversations);
  const { onlineUsers } = useWebSocket();
  const router = useRouter();

  // Keep conversations updated with real-time data
  useEffect(() => {
    if (refreshedConversations) {
      setAllConversations(refreshedConversations);
    }
  }, [refreshedConversations]);

  // Check for conversationId in query params to set active conversation
  useEffect(() => {
    const { conversationId } = router.query;
    if (conversationId && allConversations) {
      const conversation = allConversations.find((c) => c._id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else {
      setActiveConversation(null);
    }
  }, [router.query, allConversations]);

  // Listen for messages_read events
  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const data = event.detail;

      if (data.type === "messages_read" || data.type === "new_message") {
        // Refetch conversations to get updated unread counts
        refetch();
      }
    };

    window.addEventListener("websocket_message", handleWebSocketMessage);

    return () => {
      window.removeEventListener("websocket_message", handleWebSocketMessage);
    };
  }, [refetch]);

  // Create a handler for when messages are marked as read
  const handleMessagesRead = () => {
    // Refetch conversations to update unread counts
    refetch();
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // Update URL with conversationId for sharing/direct access
    router.push(
      {
        pathname: router.pathname,
        query: { conversationId: conversation._id },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="w-full h-screen flex">
      <div
        className={`md:w-1/3 w-full border-r border-gray-200 overflow-y-auto ${
          activeConversation ? "hidden md:block" : "block"
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        {allConversations && allConversations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {allConversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isActive={activeConversation?._id === conversation._id}
                isOnline={conversation.participants.some(
                  (p) => p._id !== conversation.me && onlineUsers.has(p._id)
                )}
                onClick={() => handleSelectConversation(conversation)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet.</p>
          </div>
        )}
      </div>
      <div
        className={`md:w-2/3 w-full flex flex-col ${
          activeConversation ? "block" : "hidden md:flex"
        }`}
      >
        {activeConversation ? (
          <ChatDetails conversation={activeConversation} onMessagesRead={handleMessagesRead} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>or start a new one from your friends list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
