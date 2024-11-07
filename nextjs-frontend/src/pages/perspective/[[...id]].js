import { useRouter } from "next/router";
import _ from "lodash";
import ImageCollage from "@/components/ui-compositions/ImageCollage";
import { useState } from "react";

const PerspectivePage = () => {
  const router = useRouter();

  const id = _.get(router, "query.id.0");

  const [perspective, setPerspective] = useState({
    title: "The Renaissance of the Digital",
    author: "Jussi Ängeslevä",
    abstract:
      "The digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design. Founded by Joachim Sauter, the Digitale Klasse has been at the forefront of digital art and design education from 1990 to 2023. Explore our archive to discover something something projects, somethign else research, and the some impact of digital media on contemporary art and design. The digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design.",  
    headerImage: "./images/3N7A0079.jpeg",
    images: ["./images/3N7A0084.jpeg"],

    content: [
      {
        type: "text",
        content:
          "The digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design.",
      },
      {
        type: "image",
        src: "./images/3N7A0084.jpeg",
        alt: "hero",
        className: "w-full h-[550px]",
      },
      {
        type: "text",
        content:
          "The digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design.",
      },
      {
        type: "image",
        src: "./images/3N7A0084.jpeg",
        alt: "hero",
        className: "w-full h-[550px]",
      },
      {
        type: "text",
        content:
          "The digitale klasse archive is a collection of projects, research, and impact of digital media on contemporary art and design.",
      },
      {
        type: "image",
        src: "./images/3N7A0084.jpeg",
        alt: "hero",
        className: "w-full h-[550px]",
      },
    ],
  });

  return (
    <div>
      <section className="col-span-12 gap-4  grid grid-cols-12">
        <div className="col-span-9 col-start-3  ">
          <h3 className="text-2xl leading-[37px]">{perspective.title}</h3>
          <p>by {perspective.author}</p>
        </div>

        <div className="col-span-10 col-start-2">
          <ImageCollage
            className={"w-full h-[500px] overflow-hidden"}
            images={[
              { src: "/images/hero.jpeg", alt: "hero", className: "left-0 top-0 w-4/5", aspectRatio: "3:2" },
              { src: "/images/3N7A0080.jpeg", alt: "hero", className: "right-0 top-1/4 w-1/4" },
            ]}
          />
        </div>

        <div className="col-span-8 col-start-3 mt-12 w-full">
          <p className="mt-4  w-3/4 leading-[25px]">
            {perspective.abstract}
          </p>
        </div>
      </section>

      <section className="col-span-12 gap-4  grid grid-cols-12">

      </section>

      
    </div>
  );
};

export default PerspectivePage;
