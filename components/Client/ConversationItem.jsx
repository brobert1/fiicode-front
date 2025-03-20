import { formatDistanceToNow } from "date-fns";
import { useProfile } from "@hooks";

const ConversationItem = ({ conversation, isActive, isOnline, onClick }) => {
  const { me } = useProfile();
  // Find the other participant (assuming 1-on-1 conversations)
  const otherParticipant = conversation.participants.find((p) => p._id !== me?.me);

  // Get last message preview and time
  const lastMessage = conversation.lastMessage;
  const messageTime = lastMessage?.createdAt
    ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
    : "";

  return (
    <div
      className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={
            otherParticipant?.image?.path ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              otherParticipant?.name || "User"
            )}`
          }
          alt={otherParticipant?.name || "User"}
          width={50}
          height={50}
          className="rounded-full w-12 h-12 object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{otherParticipant?.name || "User"}</h3>
          {lastMessage && <span className="text-xs text-gray-500">{messageTime}</span>}
        </div>

        <div className="flex items-center text-sm">
          <p className="text-gray-600 truncate">{lastMessage?.content || "No messages yet"}</p>

          {conversation.unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
