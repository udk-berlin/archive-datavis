import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ImageCollage from "@/components/ui-compositions/ImageCollage";

const Home = () => {
  return (
    <div className="lg:grid grid-cols-12 lg:gap-4 px-12 mt-12 lg:mt-24 sm:block sm:gap-0">
      <section className="col-span-12 lg:gap-4 md:gap-0 lg:grid sm:block grid-cols-12">
        <div className="col-span-5 sm:mt-6 lg:mt-24  ">
          <h3 className="text-2xl ">
            Welcome to the Digitale Klasse Archive:
            <br />a comprehensive repository of the pioneering work and legacy of the Digitale Klasse at the Berlin University of the Arts.
          </h3>
          <p className="mt-2 w-full  lg:w-3/4  leading-6">
            Founded by Joachim Sauter, the Digitale Klasse has been at the forefront of digital art and design education from 1990 to 2023.
            Explore our archive to discover something something projects, somethign else research, and the some impact of digital media on
            contemporary art and design.
          </p>
        </div>

        <div className="col-span-6 col-start-7">
          <ImageCollage
            className={"w-full h-[500px] mt-6 lg:mt-0"}
            images={[
              { src: "/images/hero.jpeg", alt: "hero", className: "right-0 top-0 w-full lg:w-4/5 ", aspectRatio: "3:2" },
              { src: "/images/3N7A0080.jpeg", alt: "hero", className: "left-0 bottom-0 hidden lg:block w-2/5" },
            ]}
          />
        </div>
      </section>

      <section className="mt-24 col-span-12 gap-4  grid grid-cols-12">
        <div className="col-span-6 ">
          <ImageCollage
            className={"w-full h-[550px]"}
            images={[
              { src: "/images/3N7A0078.jpeg", alt: "hero", className: "left-0 top-0 md:w-4/5", aspectRatio: "3:2" },
              { src: "/images/3N7A0083.jpeg", alt: "hero", className: "right-0 bottom-0 md:w-1/2 sm:hidden" },
            ]}
          />
        </div>

        <div className="col-span-5 col-start-8 mt-24 w-3/4">
          <h3 className="text-2xl ">Physical archive</h3>
          <p className="text-muted mt-4">
            Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its
            medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.
          </p>
        </div>
      </section>

      <section className="mt-48 col-span-12  gap-4  grid grid-cols-12">
        <div className="col-span-4 col-start-2 mt-24 w-full">
          <h3 className="text-2xl ">data network</h3>
          <p className="text-muted mt-4">
            Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its
            medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.
          </p>
        </div>

        <div className="col-span-7 col-start-6">
          <ImageCollage
            className={"w-full h-[550px]"}
            images={[
              { src: "/images/3N7A0078.jpeg", alt: "hero", className: "left-0 top-0 w-4/5", aspectRatio: "3:2" },
              { src: "/images/3N7A0083.jpeg", alt: "hero", className: "right-0 bottom-0 w-1/2" },
            ]}
          />
        </div>
      </section>

      <section className="mt-48 col-span-12 gap-4 grid grid-cols-12">
        <div className="col-span-7 ">
          <ImageCollage
            className={"w-full h-[650px]"}
            images={[
              { src: "/images/3N7A0078.jpeg", alt: "hero", className: "left-20 top-0 w-4/5", aspectRatio: "3:2" },
              { src: "/images/3N7A0083.jpeg", alt: "hero", className: "left-0 bottom-0 w-1/3" },
              { src: "/images/3N7A0080.jpeg", alt: "hero", className: "right-0 bottom-20 w-1/3" },
            ]}
          />
        </div>

        <div className="col-span-4 col-start-8 mt-24  w-full">
          <h3 className="text-2xl ">Perspectives</h3>
          <p className="text-muted mt-4">
            Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its
            medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.
          </p>
        </div>
      </section>

      <section className="mt-48 col-span-12 gap-4 grid grid-cols-12">
        <div className="col-span-3 col-start-2 ">
          <h3 className="text-2xl ">Contribute</h3>
          <p className="text-muted mt-4">
            Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its
            medias etc.Text about the archive itself, its medias etc.Text about the archive itself, its medias etc.
          </p>
        </div>

        <div className="col-span-7 col-start-5 ">
          <ImageCollage
            className={"w-full h-[550px]"}
            images={[
              { src: "/images/3N7A9977_edit.jpg", alt: "hero", className: "left-20 top-0 w-4/5", aspectRatio: "3:2" },
              { src: "/images/3N7A0079.jpeg", alt: "hero", className: "right-0 bottom-0 w-1/3" },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
