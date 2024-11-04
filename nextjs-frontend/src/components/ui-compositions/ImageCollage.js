import { useEffect, useState, useRef } from "react";
import Image from "./Image";
import { cn } from "@/lib/utils";

const ImageCollage = ({ images, className }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const collageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (collageRef.current) {
      observer.observe(collageRef.current);
    }

    return () => {
      if (collageRef.current) {
        observer.unobserve(collageRef.current);
      }
    };
  }, []);

  return (
    <div ref={collageRef} className={cn("relative h-[500px] w-[500px]", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn("absolute transition-transform w-[500px] transform hover:scale-105 hover:z-10", image.className)}
          style={{
            transform: isVisible ? `translateY(${scrollY * 0.1 * (index + 1)}px)` : "none", // Adjust the multiplier for different parallax effects
            height: "auto",
          }}
        >
          <Image src={image.src} alt={image.alt} aspectRatio={image.aspectRatio ? image.aspectRatio : "1:1"} className="shadow-lg" />
        </div>
      ))}
    </div>
  );
};

export default ImageCollage;