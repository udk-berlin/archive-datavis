import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
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
        <div className="mt-8 mb-12">
          <div>
            <Card className="w-[300px] h-[400px] rounded-xl overflow-hidden shadow-lg mb-4">
              <img src="/images/hero.jpeg" className="w-full h-full object-cover" />
            </Card>

            <h4>new digital</h4>
            <p className="text-muted italic">by Jussi Ängeslevä</p>
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
