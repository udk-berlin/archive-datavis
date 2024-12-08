import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import getConfig from "next/config";

const AbstractView = ({ data }) => {
  return (
    <>
      <div className=" mt-9 mb-6">
        <div className="mb-2">
          <h2 className="text-xl font-light tracking-robin">{data?.name}</h2>
        </div>
        <div className="flex space-x-3">
          {data.authors?.map((a, i) => (
            <Badge key={i} className="rounded-none  border-black text-base font-light px-2 py-1  tracking-robin" variant={"outline"}>
              {a.firstName} {a.name}
            </Badge>
          ))}
          <Badge className="rounded-none  border-black text-base font-light  px-2 py-1 tracking-robin" variant={"outline"}>
            {data?.allocation?.temporal?.year}
          </Badge>
        </div>
      </div>
      <div>
        {data.assets && (
          <div className="">
            <Carousel className="">
              <CarouselPrevious variant="ghost" className="absolute bottom-0 left-0 mr-8 mb-0 rounded-none border-none z-10" />
              <CarouselContent>
                {data?.assets.map((url, index) => (
                  <CarouselItem key={index} className="p-0 m-0">
                    <Card className="p-0 m-0 bg-none   ">
                      <CardContent className="p-0 m-0 w-full aspect-[1.05/1] overflow-none">
                        <img
                          src={`${getConfig().publicRuntimeConfig.bucket.url}:${getConfig().publicRuntimeConfig.bucket.port}/${
                            getConfig().publicRuntimeConfig.bucket.path
                          }/${url}`}
                          className="w-full h-full object-cover"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext variant="ghost" className="absolute bottom-0 right-0 ml-2 mb-0 bg-none rounded-none border-none z-10" />
            </Carousel>
          </div>
        )}
        {!data.assets && data.thumbnail && (
          <div className="aspect-w-3 aspect-h-2">
            <img
              src={`${getConfig().publicRuntimeConfig.bucket.url}:${getConfig().publicRuntimeConfig.bucket.port}/${
                getConfig().publicRuntimeConfig.bucket.path
              }/${data.thumbnail}`}
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-4">
          {data.abstract && <p className="mt-3 text-base mb-12 leading-normal font-light tracking-robin leading-robin">{data.abstract}</p>}
        </div>
      </div>
    </>
  );
};

export default AbstractView;
