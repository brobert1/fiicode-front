import { Button, Link, MenuItem } from "@components";
import { useRef, useState, useEffect } from "react";
import { useDisclosure, useOnClickOutside, useQuery, useMutation } from "@hooks";
import { logout } from "@api/identity";
import { useRouter } from "next/router";
import { markConversationAsRead } from "@api/client";

const ActionButton = ({ children, onClick, className }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
  </button>
);

const MapLayoutPages = () => {
  const { isOpen, toggle, hide } = useDisclosure();
  const menuRef = useRef();
  const router = useRouter();
  useOnClickOutside(menuRef, hide);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Get conversations to calculate unread messages
  const { data: conversations, refetch } = useQuery("/client/conversations");

  // Mark messages as read mutation
  const { mutate: markAsRead } = useMutation(markConversationAsRead);

  // Handle when entering a conversation
  useEffect(() => {
    const isChatsPage = router.pathname.includes("/client/chats");
    const conversationId = router.query.conversationId;

    if (isChatsPage && conversationId) {
      markAsRead(conversationId);
    }
  }, [router.pathname, router.query.conversationId, markAsRead]);

  // Calculate total unread messages
  useEffect(() => {
    if (conversations && Array.isArray(conversations)) {
      const isChatsPage = router.pathname.includes("/client/chats");
      const currentConversationId = router.query.conversationId;

      const totalUnread = conversations.reduce((total, conversation) => {
        if (isChatsPage && currentConversationId && conversation._id === currentConversationId) {
          return total;
        }
        return total + (conversation.unreadCount || 0);
      }, 0);

      setUnreadMessagesCount(totalUnread);
    }
  }, [conversations, router.pathname, router.query.conversationId]);

  // Listen for WebSocket messages to update unread count
  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const data = event.detail;
      if (data.type === "messages_read" || data.type === "new_message") {
        refetch();
      }
    };

    window.addEventListener("websocket_message", handleWebSocketMessage);
    return () => {
      window.removeEventListener("websocket_message", handleWebSocketMessage);
    };
  }, [refetch]);

  const handleLogout = async () => {
    hide();
    await logout();
  };

  return (
    <>
      <MenuItem href="/client" className="flex items-center justify-center py-2">
        <i className="fa fa-house text-xl"></i>
      </MenuItem>
      <MenuItem href="/client/chats" className="flex items-center justify-center py-2 relative">
        <i className="fa fa-message text-xl"></i>
        {unreadMessagesCount > 0 && (
          <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
          </span>
        )}
      </MenuItem>
      <MenuItem href="/client/notifications" className="flex items-center justify-center py-2">
        <i className="fa fa-bell text-xl"></i>
      </MenuItem>

      <div className="relative inline-block" ref={menuRef}>
        <ActionButton className="menu-item cursor-pointer px-2 py-2 pl-6" onClick={toggle}>
          <i
            className={`fa fa-gear text-xl transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          ></i>
        </ActionButton>

        {isOpen && (
          <div
            className="
              absolute left-1/2 bottom-full mb-2
              min-w-max bg-white rounded-md shadow-lg py-1 z-20
              transform -translate-x-1/2
              transition-opacity duration-200 ease-in-out opacity-100
            "
          >
            <Link
              href="/client/friend-requests"
              className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100 whitespace-nowrap"
            >
              <i className="fas fa-user-friends w-6"></i>
              Friend Requests
            </Link>
            <Link
              href="/client/check-noise-pollution"
              className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100 whitespace-nowrap"
            >
              <i className="fas fa-ear-deaf w-6"></i>
              Check noise pollution
            </Link>
            <Link
              href="/client/todo"
              className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100 whitespace-nowrap"
            >
              <i className="fas fa-calendar w-6"></i>
              Plan your day
            </Link>
            <Button
              className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 whitespace-nowrap"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt w-6"></i>
              Logout
            </Button>
          </div>
        )}
      </div>

      <MenuItem href="/client/account" className="flex items-center justify-center py-2">
        <i className="fa fa-user text-xl"></i>
      </MenuItem>
    </>
  );
};

export default MapLayoutPages;
