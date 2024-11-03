import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {

  const dummyPerspectives= [
    {
      title: "new digital",
      author: "Jussi Ängeslevä",
      image: "/images/hero.jpeg"
    },
    {
      title: "media renessaince",
      author: "Jussi Ängeslevä",
      image: "/images/3N7A0081.jpeg"
    },
    {
      title: "the social web",
      author: "Jussi Ängeslevä",
      image: "/images/3N7A0084.jpeg"
    },
    {
      title: "another era",
      author: "Jussi Ängeslevä",
      image: "/images/3N7A0078.jpeg"
    },
    {
      title: "failed parthways",
      author: "Jussi Ängeslevä",
      image: "/images/3N7A0080.jpeg"
    },
    {
      title: "some phyiscal",
      author: "Jussi Ängeslevä",
      image: "/images/3N7A0083.jpeg"
    },
    ]
  return (
    <>
      <section className="w-2/3 ">
        <h3 className="text-4xl leading-[45px]">
          Welcome to the Digitale Klasse archive, a comprehensive repository of the pioneering work and legacy of the Digitale Klasse at the
          Berlin University of the Arts. Founded by Joachim Sauter, the Digitale Klasse has been at the forefront of digital art and design
          education from 1990 to 2023. Explore our archive to discover something something projects, somethign else research, and the some impact
          of digital media on contemporary art and design.
        </h3>
      </section>

      <section className="mt-24">
        <h3 className="text-2xl">perspectives</h3>
        <p className="text-muted">lore lore</p>
        <Separator className="mt-4" />
        <div className="mt-8 mb-12 w-full overflow-x-auto">
          <div className="flex space-x-10">
            {dummyPerspectives.map((perspective, index) => (
              <div key={index} className="flex-shrink-0">
                <Card className="w-[300px] h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <img src={perspective.image} className="w-full h-full object-cover" />
                </Card>
                <div>
                  <h4>{perspective.title}</h4>
                  <p className="text-muted italic">by {perspective.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24">
      <h3 className="text-2xl">data network</h3>
      <p className="text-muted">lore lore</p>
      <Separator className="mt-4" />
        <div className="h-[400px] mt-8">
        </div>

      </section>

     

  
    </>
  );
}
