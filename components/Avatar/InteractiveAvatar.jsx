import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { useEffect, useRef, useState } from 'react';

import { store } from '@auth';
import { Button } from '@components';

export default function InteractiveAvatar({ messages }) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState();
  const [data, setData] = useState('');
  const mediaStream = useRef(null);
  const avatar = useRef(null);

  // Refs for buffering streaming text
  const textBufferRef = useRef('');
  const lastProcessedRef = useRef('');

  async function fetchAccessToken() {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/admin/avatar/get-access-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${store.getState()}`,
        },
      });
      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
    return '';
  }

  async function startSession() {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log('Avatar started talking', e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log('Avatar stopped talking', e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log('Stream disconnected');
      endSession();
    });
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      console.log('>>>>> Stream ready:', event.detail);
      setStream(event.detail);
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: 'Tyler-incasualsuit-20220721',
        knowledgeId: '', // Or use a custom `knowledgeBase`.
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.SOOTHING,
        },
        language: 'ro',
        disableIdleTimeout: true,
        video_encoding: 'VP8',
      });
      setData(res);
    } catch (error) {
      console.error('Error starting avatar session:', error);
    } finally {
      setIsLoadingSession(false);
    }
  }

  // Process new streaming text by buffering and splitting it into complete sentences.
  const processStreamingText = (newText) => {
    // Compute the new delta (portion not yet processed)
    const previousText = lastProcessedRef.current;
    const delta = newText.substring(previousText.length);
    lastProcessedRef.current = newText;
    if (!delta) return;

    // Append delta to our buffer
    textBufferRef.current += delta;

    // Split the buffer at sentence boundaries (period, exclamation or question mark followed by whitespace)
    const sentences = textBufferRef.current.split(/(?<=[.!?])\s+/);
    // The last element might be incomplete; put it back in the buffer
    textBufferRef.current = sentences.pop() || '';

    // Speak each complete sentence asynchronously
    sentences.forEach((sentence) => {
      if (sentence.trim().length > 0 && avatar.current) {
        avatar.current
          .speak({
            text: sentence,
            taskType: TaskType.REPEAT,
            taskMode: TaskMode.ASYNC,
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  // When messages updates, if the length is even then the last message is a response.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    if (lastMessage.sender === 'user') {
      // A new question has been sent, so clear any previous buffered text.
      textBufferRef.current = '';
      lastProcessedRef.current = '';
    } else if (lastMessage.sender === 'bot') {
      // Process the bot's answer as it streams in.
      const currentAnswer = lastMessage.text;
      processStreamingText(currentAnswer);
    }
  }, [messages]);

  async function handleInterrupt() {
    if (!avatar.current) {
      console.log('Avatar API not initialized');
      return;
    }
    try {
      textBufferRef.current = '';
      lastProcessedRef.current = '';
      await avatar.current.interrupt();
    } catch (e) {
      console.log(e.message);
    }
  }

  async function endSession() {
    textBufferRef.current = '';
    lastProcessedRef.current = '';
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current.play();
        console.log('Playing');
      };
    }
  }, [stream]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
        {stream ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              <track kind="captions" />
            </video>
            
            {/* Control buttons */}
            <div className="absolute bottom-4 right-4 flex flex-col sm:flex-row gap-2">
              <Button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={handleInterrupt}
              >
                <i className="fas fa-stop mr-2" />
                Stop
              </Button>
              <Button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={endSession}
              >
                <i className="fas fa-times mr-2" />
                End
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors text-lg shadow-lg"
              onClick={startSession}
              disabled={isLoadingSession}
            >
              {isLoadingSession ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2 bg-blue-600" />
                  Start Avatar Session
                </>
              )}
            </Button>
          </div>
        )}

        {/* Current message overlay */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-2xl mx-auto">
              <p className="text-center text-lg leading-relaxed">
                {messages[messages.length - 1].text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
