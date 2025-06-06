import { Layout, Toggle } from "@components";
import ChatWindow from "@components/Chat/ChatWindow";
import { useState } from "react";

const Page = () => {
  const [isShortAnswer, setIsShortAnswer] = useState(false);

  const toggleComponent = (
    <Toggle
      label="Short answer"
      initialState={false}
      onToggle={() => setIsShortAnswer((prev) => !prev)}
      extraClass="peer-checked:bg-secondary"
    />
  );

  return (
    <Layout title="Chat" toggleComponent={toggleComponent}>
      <div className="max-w-full h-5/6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Q&A with ChatBot Starter</h2>
            <p>This is the place to test ChatBot Starter's performance.</p>
          </div>
          <div className="hidden sm:block">{toggleComponent}</div>
        </div>
        <ChatWindow isShortAnswer={isShortAnswer} />
      </div>
    </Layout>
  );
};

export default Page;
