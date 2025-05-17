import { useState, useEffect } from 'react';

const ChatInput = ({ userInput, setUserInput, handleSend, handleKeyDown }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ro-RO';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setUserInput(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [setUserInput]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSendWithMicStop = () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
    handleSend();
  };

  const handleKeyDownWithMicStop = (e) => {
    if (e.key === 'Enter' && isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
    handleKeyDown(e);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDownWithMicStop}
        placeholder="Start a convesation with Mara..."
        className="flex-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        title={isListening ? 'Stop recording' : 'Start recording'}
      >
        <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-xl`} />
      </button>
      <button
        onClick={handleSendWithMicStop}
        className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <i className="fa-light fa-paper-plane text-xl" />
      </button>
    </div>
  );
};

export default ChatInput;
