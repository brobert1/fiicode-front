import { Button } from "@components";
import { useFormContext } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";

const StepNavigation = ({ lastStep, onSubmit, setStep, step: currentStep }) => {
  const { trigger, getValues } = useFormContext();
  const [status, setStatus] = useState("idle");

  const nextStep = useMemo(
    () => (currentStep < lastStep ? currentStep + 1 : null),
    [currentStep, lastStep]
  );
  const isLastStep = nextStep === null;
  const buttonText = useMemo(() => (isLastStep ? "Salvează" : "Înainte"), [isLastStep]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        setStatus("loading");
        await onSubmit(values);
      } finally {
        setStatus("idle");
      }
    },
    [onSubmit]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  }, [currentStep, setStep]);

  const handleNext = useCallback(async () => {
    // Trigger validation for all fields
    const isValid = await trigger();
    if (!isValid) {
      // The errors are automatically set in react-hook-form, so no extra handling is needed.
      return;
    }
    if (!isLastStep) {
      setStep(nextStep);
    } else {
      const values = getValues();
      await handleSubmit(values);
    }
  }, [isLastStep, nextStep, setStep, trigger, getValues, handleSubmit]);

  return (
    <div className="flex w-full flex-col gap-5 py-3 sm:py-5">
      <div className="flex w-full justify-end gap-4">
        {currentStep !== 1 && (
          <Button
            className="button full flex items-center justify-center gap-3 bg-gray-100 px-4 py-2 text-base uppercase sm:px-12"
            onClick={handleBack}
          >
            Înapoi
          </Button>
        )}
        <Button
          className="button full primary flex items-center justify-center gap-3 px-4 py-2 text-base uppercase sm:px-12"
          disabled={status === "loading"}
          onClick={handleNext}
        >
          <p className="mr-1">{buttonText}</p>
          <i className="fa-solid fa-arrow-right w-3 text-sm"></i>
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
