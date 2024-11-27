import { Input } from "@/components/ui/input";
import { Fragment } from "react";

import { RiSearchLine, RiQuestionLine, RiArrowLeftLine, RiLink, RiExpandDiagonalFill } from "@remixicon/react";
import { useEffect, useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";

import { Link } from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { set } from "lodash";

const SidePanel = ({ focusedIds, setFocusedIds, focusedType, className, cachedData }) => {
  const [focusedIdsData, setFocusedIdsData] = useState([]);
  const bucketUrl = "http://localhost:54321/storage/v1/object/public/";
  // const bucketUrl = "http://localhost:54321/storage/v1/object/public/";

  const [focusedData, setFocusedData] = useState({});

  useEffect(() => {
    const fetchData = async (id, key) => {
      const response = await fetch(`http://localhost:3010/api/${key}/${id}`);
      const data = await response.json();
      setFocusedData(data);
      return data;
    };
    if ((focusedType.type === "authors" || focusedType.type === "semesters") && focusedType.id) {
      fetchData( focusedType.id, focusedType.type)
    }
  }, [focusedType, setFocusedData]);

  useEffect(() => {
    if (focusedData) {
      console.log("fData", focusedData);
    }
  }, [focusedData]);



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
    <div className={cn("flex-grow border-l-2 border-white overflow-hidden", className)}>
      <div className="pl-3 pr-12 flex sticky items-center top-0 bg-secondary pt-2 pb-2 z-10">
        <RiArrowLeftLine className="w-6 h-6 text-secondary-foreground" onClick={() => setFocusedId(null)} />
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

      <div className="flex-1 overflow-hidden">
        {focusedIdsData && focusedIdsData.length === 1 && (
          <div>
            {focusedIdsData[0].thumbnail && (
              <div className="aspect-w-3 aspect-h-2">
                <img src={`${bucketUrl}${focusedIdsData[0].thumbnail}`} className="object-cover" />
              </div>
            )}

            <div className="px-12 mt-6">
              <div>
                <h2 className="text-xl leading-6">{focusedIdsData[0].name}</h2>
                <h3 className="text-xl font-normal">{focusedIdsData[0].authors?.map((a) => `${a.firstName} ${a.name}`)?.join(", ")}</h3>
                <h3 className="text-xl font-normal leading-5">{focusedIdsData[0]?.allocation?.temporal?.year}</h3>
              </div>

              {focusedIdsData[0].abstract && (
                <p className="mt-4 leading-5 mb-12">
                  {focusedIdsData[0].abstract?.length < 500
                    ? focusedIdsData[0].abstract
                    : `${focusedIdsData[0].abstract.substring(0, 500)} …`}
                </p>
              )}
              {focusedIdsData[0].abstract?.length > 500 && (
                <div className="flex items-center">
                  <p className=" mt-2 underline font-bold">Read more</p>
                  {/* <RiExpandDiagonalFill className="w-5 h-5 text-black hover:text-popover-foreground" /> */}
                </div>
              )}
            </div>
          </div>
        )}
        {focusedIdsData && focusedIdsData.length > 1 && (
          <div className="px-12 mt-6">
            {focusedType.type === "authors" && focusedData &&  (
              <div>
                <h2 className="text-xl leading-6">{`${focusedData?.firstName} ${focusedData?.name}`}</h2>
                <h3 className="text-sm font-normal">{stripUrl(focusedData?.contactInfo?.website || '')}</h3>
                <h3 className="text-sm font-normal leading-4">{focusedData?.contactInfo?.mail}</h3>
              </div>
            )}

            {focusedType.type === "semesters" && focusedData &&  (
              <div>
                <h2 className="text-xl leading-6">{`${focusedData?.name}`}</h2>
                <h3 className="text-sm font-normal">{focusedData?.term === 'ws' ? "winter semester" : "summer semester"}</h3>
                <h3 className="text-sm font-normal">{focusedData?.year }</h3>
  
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
  );
};

export default SidePanel;
