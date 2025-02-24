const LoadingDots = () => {
  return (
    <div className="flex h-10 w-full items-center justify-center">
      <div className="flex space-x-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-primary opacity-55"></div>
        <div className="h-3 w-3 animate-bounce rounded-full bg-primary opacity-75 [animation-delay:0.2s]"></div>
        <div className="h-3 w-3 animate-bounce rounded-full bg-primary opacity-95 [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default LoadingDots;
