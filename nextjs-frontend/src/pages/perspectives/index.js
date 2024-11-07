import React, { useState } from "react";
import ImageCollage from "@/components/ui-compositions/ImageCollage";
import Link from "next/link";

const PerspectivesPage = () => {
  const [perspectives, setPerspectives] = useState([
    {
      id: 1,
      title: "The Renaissance of the Physical",
      author: "Jussi Ängeslevä",
      description:
        "As technology advances, the boundaries between our digital and physical worlds are blurring, giving rise to a new form of media that goes beyond screens and pixels. This new media landscape is a vast and complex ecosystem of interconnected platforms, devices, and experiences that are reshaping the way we create, consume, and share content.",
      headerImage: "./images/3N7A0078.jpeg",
      images: ["./images/3N7A9987.jpeg"],
    },
    {
      id: 2,
      title: "Another Headline, this time its much longer and needs two lines instead of one",
      author: "Author 1",
      description:
        "with this description, we can see that the text is wrapping around the image, which is a good thing, because it means that the text is responsive and will look good on all screen sizes.",
      headerImage: "./images/3N7A0080.jpeg",
      images: ["./images/3N7A0081.jpeg"],
    },
    {
      id: 3,
      title: "The restaurant at the end of the universe",
      author: "Author 1",
      description:
        " the new media landscape is a vast and complex ecosystem of interconnected platforms, devices, and experiences that are reshaping the way we create, consume, and share content.",
      headerImage: "./images/3N7A0083.jpeg",
      images: ["./images/3N7A0084.jpeg"],
    },
    {
      id: 4,
      title: "The Renaissance of the Digital",
      author: "Author 1",
      description:
        "the digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design.",
      headerImage: "./images/3N7A0079.jpeg",
      images: ["./images/3N7A0084.jpeg"],
    },
  ]);

  const PerspectiveSnippet = ({ perspective, index }) => {
    const isEven = index % 2 === 0;

    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + "…";
      }
      return text;
    };

    return (
      <section className="col-span-12 gap-4 grid grid-cols-12">
        <div className={`col-span-5 mt-24 ${isEven ? "order-1" : "order-2"}`}>
          <h3 className="text-2xl leading-[37px]">
            {perspective.title}

          </h3>
          <p className="text-xl"> by {perspective.author}</p>
          <p className="mt-4 w-3/4 leading-[25px]">{truncateText(perspective.description, 200)}</p>
          <p className="mt-2 underline font-bold"><Link href={`/perspective/${perspective?.id}`}> Read more</Link></p>
        </div>

        <div className={`col-span-7 ${isEven ? "order-2" : "order-1"}`}>
          <ImageCollage
            className={"w-full h-[550px]"}
            images={[
              perspective.headerImage
                ? {
                    src: perspective.headerImage,
                    alt: "hero",
                    className: ` top-0 w-6/7 ${isEven ? "left-0" : "left-0"}`,
                    aspectRatio: "3:2",
                  }
                : "",

              perspective.images[0]
                ? {
                    src: perspective.images[0],
                    alt: "hero",
                    className: ` bottom-0 w-1/4 ${isEven ? "right-0" : "left-1/3"}`,
                    aspectRatio: "1:1",
                  }
                : "",
            ]}
          />
        </div>
      </section>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-24">
      {perspectives.map(
        (perspective, index) => (console.log(index), (<PerspectiveSnippet key={index} perspective={perspective} index={index} />))
      )}
    </div>
  );
};

export default PerspectivesPage;
