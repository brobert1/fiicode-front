import ImageLoading from "./ImageLoading";

const Image = ({ src, alt, status }) => {
  if (!src) {
    return (
      <div className="w-64 rounded-full border-2 border-dashed border-primary relative">
        <div className="grid bg-white aspect-square place-items-center rounded-full bg-tertiary object-cover text-4xl text-secondary">
          <i className="fas fa-image text-black text-4xl"></i>
          {status === "loading" && <ImageLoading />}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-full border-2 border-dashed border-primary w-64 aspect-square">
      <img className="w-full h-full rounded-full object-cover" src={src} alt={alt} />
      {status === "loading" && <ImageLoading />}
    </div>
  );
};

export default Image;
