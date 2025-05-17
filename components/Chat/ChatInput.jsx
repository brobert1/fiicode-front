const ChatInput = ({ userInput, setUserInput, handleSend, handleKeyDown }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scrie un mesaj..."
        className="flex-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button 
        onClick={handleSend} 
        className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <i className="fa-light fa-paper-plane text-xl" />
      </button>
    </div>
  );
};

export default ChatInput;
