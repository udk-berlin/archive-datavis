import Image from "./Image";
import { cn } from "@/lib/utils"

const ImageCollage = ({ images, className }) => {

  return (
    <div className={cn("relative h-[500px] w-[500px]",className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn("absolute transition-transform duration-30 ease-in-out w-[500px] transform hover:scale-105 hover:z-10", image.className)}
          style={{
           

            height:"auto",
          }}
        >
          <Image src={image.src} alt={image.alt} aspectRatio={image.aspectRatio ? image.aspectRatio : "1:1"} className=" shadow-lg" />
        </div>
      ))}
    </div>
  );
};

export default ImageCollage;