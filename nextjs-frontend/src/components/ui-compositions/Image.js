const Image = ({ src, alt, className, aspectRatio }) => {
  // Determine the aspect ratio class based on the aspectRatio prop
  const aspectRatioClass = aspectRatio === "1:1" ? "aspect-w-1 aspect-h-1" : "aspect-w-3 aspect-h-2";

  return (
    <div className={`relative ${aspectRatioClass}`}>
      <img src={src} alt={alt} className={`absolute inset-0 w-full h-full object-cover ${className}`} />
    </div>
  );
};

export default Image;