import { format } from "date-fns";

const Message = ({ message, isMe }) => {
  const formattedTime = message.createdAt ? format(new Date(message.createdAt), "h:mm a") : "";

  const isRead = message.readBy && message.readBy.length > 1;

  if (isMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-secondary text-white px-4 py-2 rounded-2xl rounded-tr-sm">
            {message.content}
          </div>
          <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
            <span>{formattedTime}</span>
            {isRead && (
              <span className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-secondary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="mr-2 self-end">
        <img
          src={
            message.sender?.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || "User")}`
          }
          alt={message.sender?.name || "User"}
          width={30}
          height={30}
          className="rounded-full w-8 h-8 object-cover"
        />
      </div>
      <div className="max-w-[75%]">
        <div className="bg-primary text-white border border-gray-200 px-4 py-2 rounded-2xl rounded-tl-sm">
          {message.content}
        </div>
        <div className="mt-1 text-xs text-gray-500">{formattedTime}</div>
      </div>
    </div>
  );
};

export default Message;
