const ChatMessageUser = ({ text }) => {
  return (
    <div className="flex justify-end mb-4 items-end">
      <div className="max-w-[70%] flex flex-col">
        <div
          className="bg-secondary text-white px-4 py-3 rounded-2xl rounded-br-none shadow-sm"
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          <p className="text-sm md:text-base leading-relaxed">{text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 self-end mr-2">
          You
        </span>
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center ml-2 mb-6">
        <i className="fa-solid fa-user text-xs text-secondary"></i>
      </div>
    </div>
  );
};

export default ChatMessageUser;
