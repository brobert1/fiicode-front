import { validateNoisePollution } from "@api/client";
import { checkAuth, withAuth } from "@auth";
import { FloatingMenu } from "@components";
import BaseClientLayout from "@components/BaseClientLayout";
import { useMutation } from "@hooks";
import { toaster } from "@lib";
import { useState, useEffect, useRef } from "react";

const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [decibels, setDecibels] = useState(0);
  const [averageDecibels, setAverageDecibels] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [frequencyData, setFrequencyData] = useState([]);
  const [recordedDecibels, setRecordedDecibels] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);

  const mutation = useMutation(validateNoisePollution, {
    onSuccess: () => {
      setIsReviewing(false);
    }
  });

  // Get user's location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to access location. Please check permissions.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  // Get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (canvasRef.current && isRecording && frequencyData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      // Draw frequency line
      ctx.beginPath();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1 + audioLevel / 255;

      const sliceWidth = width / frequencyData.length;
      let x = 0;

      for (let i = 0; i < frequencyData.length; i++) {
        const v = frequencyData[i] / 128.0;
        const y = (height / 2) * (1 - v);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
  }, [frequencyData, isRecording, audioLevel]);

  // Store decibel value at regular intervals
  useEffect(() => {
    if (isRecording && decibels > 0) {
      // Store the value immediately upon first detection above 0
      if (recordedDecibels.length === 0) {
        setRecordedDecibels([decibels]);
      }

      // Sample the decibel value every second
      const sampleInterval = setInterval(() => {
        setRecordedDecibels((prev) => [...prev, decibels]);
      }, 1000);

      return () => clearInterval(sampleInterval);
    }
  }, [isRecording, decibels]);

  const startRecording = async () => {
    try {
      // Ensure we have the latest location data
      getCurrentLocation();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);

        setFrequencyData([...dataArray]);

        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average);

        // Convert to decibels (rough approximation)
        // Real-world formula: dB = 20 * log10(amplitude/reference)
        // We're using a simplified approach based on frequency data
        const maxValue = 255; // Max value from analyser
        const minDb = 0;
        const maxDb = 120;
        const scaledDb = minDb + (average / maxValue) * (maxDb - minDb);
        setDecibels(Math.round(scaledDb));

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
      setIsRecording(true);
      setIsReviewing(false);
      setRecordingTime(0);
      // Reset recorded decibels array when starting a new recording
      setRecordedDecibels([]);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);

    // Calculate average decibel level from recordings
    if (recordedDecibels.length === 0) {
      // If no decibels were recorded, we still want to show something
      setAverageDecibels(0);
    } else {
      const average =
        recordedDecibels.reduce((sum, value) => sum + value, 0) / recordedDecibels.length;
      setAverageDecibels(Math.round(average));
    }

    // IMPORTANT: Set review state before resetting other values
    setIsReviewing(true);

    // Reset these after setting the reviewing state
    setAudioLevel(0);
    setDecibels(0);
    setFrequencyData([]);
  };

  const handleSubmit = () => {
    if (!location) {
      toaster.error("Location data is required. Please enable location access.");
      return;
    }

    // Submit the data to the mutation including location
    mutation.mutate({
      noiseLevel: averageDecibels,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
    toaster.success("Contribution recorded successfully");
  };

  const cancelReview = () => {
    // Reset to initial state
    setIsReviewing(false);
    setAverageDecibels(0);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Determine noise level category based on decibels
  const getNoiseLevelCategory = (db) => {
    if (db < 40) return "Safe";
    if (db < 70) return "Moderate";
    if (db < 90) return "High";
    return "Dangerous";
  };

  // Get color based on noise level
  const getLevelColor = (category) => {
    switch (category) {
      case "Safe":
        return "bg-green-500";
      case "Moderate":
        return "bg-yellow-500";
      case "High":
        return "bg-orange-500";
      case "Dangerous":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get text color based on noise level
  const getLevelTextColor = (category) => {
    switch (category) {
      case "Safe":
        return "text-green-500";
      case "Moderate":
        return "text-yellow-500";
      case "High":
        return "text-orange-500";
      case "Dangerous":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const noiseLevel = isRecording ? getNoiseLevelCategory(decibels) : "Not recording";
  const noiseLevelColor = isRecording ? getLevelColor(noiseLevel) : "bg-gray-300";
  const noiseLevelTextColor = isRecording ? getLevelTextColor(noiseLevel) : "text-gray-500";

  const reviewNoiseLevelCategory = getNoiseLevelCategory(averageDecibels);
  const reviewNoiseLevelColor = getLevelTextColor(reviewNoiseLevelCategory);

  // Calculate progress percentage for progress bar
  const progressPercentage = () => {
    if (!isRecording) return 0;

    if (noiseLevel === "Safe") return 25;
    if (noiseLevel === "Moderate") return 50;
    if (noiseLevel === "High") return 75;
    if (noiseLevel === "Dangerous") return 100;
    return 0;
  };

  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="w-full flex bg-white flex-col items-center gap-8 py-6 px-4">
        <div className="w-full max-w-md">
          <div className="text-center w-full mb-4">
            <h2 className="text-3xl font-bold mb-2">Check Noise Pollution</h2>
            <p className="text-gray-600">Measure the noise pollution in your environment</p>
          </div>

          {locationError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {locationError}. Location data is required for submitting noise measurements.
            </div>
          )}

          <div className="bg-white rounded-lg w-full p-6 shadow-md border border-gray-200">
            {!isRecording && !isReviewing ? (
              <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-700 text-center text-lg px-6">
                  Press Start Recording to begin monitoring
                </p>
              </div>
            ) : isRecording ? (
              <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full absolute top-0 left-0"
                  width={500}
                  height={250}
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="text-gray-700 text-center mb-3">Recording Results</div>
                <div className={`text-4xl font-bold mb-4 ${reviewNoiseLevelColor}`}>
                  {averageDecibels} dB
                </div>
                <div className={`text-xl font-semibold mb-2 ${reviewNoiseLevelColor}`}>
                  {reviewNoiseLevelCategory}
                </div>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Average noise level during {formatTime(recordingTime)} of recording
                </p>
                {location && (
                  <p className="text-gray-500 text-xs text-center">
                    Location data will be included in your submission
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Current Level:</span>
                <span className={`font-bold text-lg ${noiseLevelTextColor}`}>
                  {isRecording ? `${decibels.toFixed(1)} dB - ${noiseLevel}` : "Not recording"}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${noiseLevelColor} transition-all duration-300`}
                  style={{
                    width: `${progressPercentage()}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-500">Safe</span>
                <span className="text-yellow-500">Moderate</span>
                <span className="text-orange-500">High</span>
                <span className="text-red-500">Dangerous</span>
              </div>
            </div>

            {isRecording && (
              <div className="text-center mt-6 text-gray-600 font-medium">
                Recording: {formatTime(recordingTime)}
              </div>
            )}

            {mutation.isLoading && (
              <div className="text-center mt-6 text-blue-600 font-medium">
                Processing your recording...
              </div>
            )}

            {/* Control buttons */}
            <div className="mt-6">
              {!isRecording && !isReviewing ? (
                <button
                  className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-md shadow hover:bg-blue-600 transition-colors flex items-center justify-center"
                  onClick={startRecording}
                  disabled={mutation.isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start Recording
                </button>
              ) : isRecording ? (
                <button
                  className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-md shadow hover:bg-red-600 transition-colors flex items-center justify-center"
                  onClick={stopRecording}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Stop Recording
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-md shadow hover:bg-green-600 transition-colors flex items-center justify-center"
                    onClick={handleSubmit}
                    disabled={mutation.isLoading || !location}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Submit Results
                  </button>

                  <button
                    className="w-full bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
                    onClick={cancelReview}
                    disabled={mutation.isLoading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-md  mb-20">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Noise Pollution Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Noise pollution is unwanted or harmful sound that can affect health and quality of
                life.
              </p>

              <div>
                <h3 className="font-bold text-gray-800 mb-1">Noise Levels:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="text-green-500 font-medium">Safe:</span> Below 40 dB -
                    Comfortable for all activities
                  </li>
                  <li>
                    <span className="text-yellow-500 font-medium">Moderate:</span> 40-70 dB - Normal
                    conversation level
                  </li>
                  <li>
                    <span className="text-orange-500 font-medium">High:</span> 70-90 dB - Can cause
                    stress over time
                  </li>
                  <li>
                    <span className="text-red-500 font-medium">Dangerous:</span> Above 90 dB -
                    Potential hearing damage
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-1">Examples:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">10-30 dB:</span> Whisper, quiet rural area
                  </li>
                  <li>
                    <span className="font-medium">40-60 dB:</span> Normal conversation, quiet office
                  </li>
                  <li>
                    <span className="font-medium">70-80 dB:</span> City traffic, vacuum cleaner
                  </li>
                  <li>
                    <span className="font-medium">90-100 dB:</span> Motorcycle, lawn mower
                  </li>
                  <li>
                    <span className="font-medium">110+ dB:</span> Rock concert, ambulance siren
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
