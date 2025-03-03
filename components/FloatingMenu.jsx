import MapLayoutPages from "./MapLayoutPages";

const FloatingMenu = () => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="flex h-16 items-center gap-1 rounded-full border bg-white px-2 backdrop-blur-md md:gap-2 md:px-4">
        <MapLayoutPages />
      </div>
    </div>
  );
};

export default FloatingMenu;
