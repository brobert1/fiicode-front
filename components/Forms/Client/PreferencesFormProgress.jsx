import { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const PreferencesFormProgress = ({ numSteps, precision = 1, step: currentStep }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progress = (currentStep / numSteps) * 100;
    setProgress(Math.round(progress * Math.pow(10, precision)) / Math.pow(10, precision));
  }, [currentStep, numSteps]);

  return (
    <div className="flex w-full flex-col gap-2">
      <p>Progres înregistrare:</p>
      <ProgressBar now={progress} label={`${progress}%`} />
    </div>
  );
};

export default PreferencesFormProgress;
