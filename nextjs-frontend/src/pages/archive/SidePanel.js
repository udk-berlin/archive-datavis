import { Input } from "@/components/ui/input";
import { Fragment } from "react";

import {
  RiSearchLine,
  RiQuestionLine,
  RiArrowLeftLine,
  RiLink,
  RiExpandDiagonalFill,
  RiExpandLeftLine,
  RiFolder2Line,
  RiFolderOpenLine,
  RiSquareLine,
  RiFolderLine,
  RiFile2Line,
} from "@remixicon/react";
import { useEffect, useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";

import { Link } from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { set } from "lodash";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FileViewer from "./FileViewer";

const SidePanel = ({ focusedIds, setFocusedIds, focusedType, className, cachedData, opened, setOpened }) => {
  const [focusedIdsData, setFocusedIdsData] = useState([]);
  const bucketUrl = "http://localhost:54321/storage/v1/object/public/";
  // const bucketUrl = "http://localhost:54321/storage/v1/object/public/";

  const [focusedData, setFocusedData] = useState({});

  useEffect(() => {
    const fetchData = async (id, key) => {
      const response = await fetch(`http://localhost:3010/api/${key}/${id}`);
      const data = await response.json();
      if (typeof data === "object") {
      }
      setFocusedData(data);
      return data;
    };
    if ((focusedType.type === "authors" || focusedType.type === "semesters" || focusedType.type === "archive") && focusedType.id) {
      fetchData(focusedType.id, focusedType.type);
    }
  }, [focusedType, setFocusedData]);

  useEffect(() => {
    if (focusedData) {
      console.log("fData", focusedData);
    }
  }, [focusedData]);

  useEffect(() => {
    if (focusedType) {
      console.log("fType", focusedType);
    }
  }, [focusedType]);

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`http://localhost:3010/api/project/${id}`);
      // const response = await fetch(`http://localhost:3010/api/project/${id}`);
      const data = await response.json();

      return data;
    };

    const fetchDataofIds = async (ids) => {
      const newData = [];
      for await (const id of ids) {
        newData.push(await fetchData(id));
      }
      setFocusedIdsData(newData);
    };
    fetchDataofIds(focusedIds);
  }, [focusedIds, setFocusedIdsData]);

  const stripUrl = (url) => {
    return url.replace(/^http:\/\//, "").replace(/\/$/, "");
  };

  return (
    <div className={`grid gap-0 ${opened ? "grid-cols-2" : "grid-cols-1"}`}>
      {opened && (
        <FileViewer />
      )}
      <div className={cn("flex-grow  h-full overflow-hidden", className)}>
        <div className="pl-3 pr-12 flex sticky items-center top-0 bg-secondary pt-2 pb-2 z-10">
          {!opened ? (
            <RiFolder2Line className="w-5 h-5 " onClick={() => setOpened(!opened)} />
          ) : (
            <RiFolderOpenLine className="w-5 h-5 " onClick={() => setOpened(!opened)} />
          )}
          <div className="relative ml-3 flex-grow mr-4">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <RiSearchLine className="w-4 h-4 text-secondary-foreground" />
            </span>
            <Input
              type="text"
              placeholder="Search Digitale Klasse ..."
              className="pl-10 h-8 rounded-lg border-none bg-white w-full text-secondary-foreground focus-visible:ring-none focus-visible:outline-none focus-visible:text-black placeholder-secondary-foreground text-black"
            />
          </div>
          <RiLink
            className={`w-5 h-5 ${
              focusedIdsData.length === 1 ? "hover:text-popover-foreground text-black" : "text-secondary-foreground"
            }  ml-auto`}
          />
        </div>

        {focusedType.type !== "archive" && focusedIdsData && focusedIdsData.length === 1 && (
          <div className="px-12 mt-9 mb-6">
            <div className="mb-2">
              <h2 className="text-xl font-light tracking-robin">{focusedIdsData[0]?.name}</h2>
            </div>
            <div className="flex space-x-3">
              {focusedIdsData[0].authors?.map((a, i) => (
                <Badge key={i} className="rounded-none  border-black text-base font-light px-2 py-1  tracking-robin" variant={"outline"}>
                  {a.firstName} {a.name}
                </Badge>
              ))}

              <Badge className="rounded-none  border-black text-base font-light  px-2 py-1 tracking-robin" variant={"outline"}>
                {focusedIdsData[0]?.allocation?.temporal?.year}
              </Badge>
            </div>
          </div>
        )}

        {focusedType.type === "archive" && focusedData && (
          <>
            <div className="px-12 mt-9 mb-6">
              <div className="mb-2">
                <h2 className="text-xl font-light tracking-robin">{focusedData?.name}</h2>
              </div>
              <div className="flex space-x-3">
                {/* {focusedIdsData[0].authors?.map((a, i) => (
                  <Badge key={i} className="rounded-none  border-black text-base font-light px-2 py-1  tracking-robin" variant={"outline"}>
                    {a.firstName} {a.name}
                  </Badge>
                ))}

                <Badge className="rounded-none  border-black text-base font-light  px-2 py-1 tracking-robin" variant={"outline"}>
                  {focusedIdsData[0]?.allocation?.temporal?.year}
                </Badge> */}
              </div>
            </div>
            <div>
              {focusedData.thumbnail && (
                <div className="">
                  <img src={`${bucketUrl}${focusedData.thumbnail}`} className="object-cover" />
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex-1 overflow-x-hidden max-h-full px-12">
          {focusedIdsData && focusedIdsData.length === 1 && (
            <div>
              {focusedIdsData[0].assets && (
                <div className="">
                  <Carousel className="">
                    <CarouselPrevious variant="ghost" className="absolute bottom-0 left-0 mr-8 mb-0 rounded-none border-none z-10" />
                    <CarouselContent>
                      {focusedIdsData[0]?.assets.map((url, index) => (
                        <CarouselItem key={index} className="p-0 m-0">
                          <Card className="p-0 m-0 bg-none   ">
                            <CardContent className="p-0 m-0 w-full aspect-[1.05/1] overflow-none">
                              <img src={`${bucketUrl}${url}`} className="w-full h-full object-cover" />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselNext variant="ghost" className="absolute bottom-0 right-0 ml-2 mb-0 bg-none rounded-none border-none z-10" />
                  </Carousel>
                </div>
              )}

              {!focusedIdsData[0].assets && focusedIdsData[0].thumbnail && (
                <div className="aspect-w-3 aspect-h-2">
                  <img src={`${bucketUrl}${focusedIdsData[0].thumbnail}`} className="object-cover" />
                </div>
              )}

              <div className="mt-4">
                {focusedIdsData[0].abstract && (
                  <p className="mt-3 text-base mb-12 leading-normal font-light tracking-robin leading-robin">
                    {focusedIdsData[0].abstract}
                  </p>
                )}
              </div>
            </div>
          )}
          {focusedIdsData && focusedIdsData.length > 1 && (
            <div className="px-12 mt-6">
              {focusedType.type === "authors" && focusedData && (
                <div>
                  <h2 className="text-xl leading-6">{`${focusedData?.firstName} ${focusedData?.name}`}</h2>
                  <h3 className="text-sm font-normal">{stripUrl(focusedData?.contactInfo?.website || "")}</h3>
                  <h3 className="text-sm font-normal leading-4">{focusedData?.contactInfo?.mail}</h3>
                </div>
              )}

              {focusedType.type === "semesters" && focusedData && (
                <div>
                  <h2 className="text-xl leading-6">{`${focusedData?.name}`}</h2>
                  <h3 className="text-sm font-normal">{focusedData?.term === "ws" ? "winter semester" : "summer semester"}</h3>
                  <h3 className="text-sm font-normal">{focusedData?.year}</h3>
                </div>
              )}

              <div className="mt-12">
                <ul className="w-full">
                  {focusedIdsData.map((project, i) => (
                    <li key={i} className="flex justify-between  mb-4">
                      <div>
                        <h4 className="p-0">{project.name}</h4>
                        <h5 className="text-sm font-normal">{project?.allocation?.temporal?.year}</h5>
                      </div>
                      <div className="w-20 h-20">
                        <img src={`${bucketUrl}${project.thumbnail}`} className="w-full h-full object-cover" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
