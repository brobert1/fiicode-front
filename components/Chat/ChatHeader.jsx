import { Toggle } from "@components";

const ChatHeader = ({ isAvatarMode, onToggleMode }) => {
  return (
    <div className="my-8 bg-darkGray sm:rounded-lg text-black py-3 px-4 mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Chat with ChatBot Starter</h3>
        <Toggle
          label={isAvatarMode ? "Avatar" : "Text"}
          initialState={isAvatarMode}
          onToggle={onToggleMode}
          extraClass="peer-checked:bg-secondary"
        />
      </div>
      <p>Use SuportBot to assist you with Customer Support requests.</p>
    </div>
  );
};

export default ChatHeader;
