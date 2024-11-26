import { Input } from "@/components/ui/input";
import { Fragment } from "react";

import { RiSearchLine, RiQuestionLine, RiArrowLeftLine, RiLink } from "@remixicon/react";
import { useEffect, useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";

import { Link } from "next/link";
import { cn } from "@/lib/utils";

const SidePanel = ({ focusedIds, setFocusedIds, className, cachedData }) => {
  const [focusedIdsData, setFocusedIdsData] = useState([]);
  const bucketUrl = "http://192.168.1.102:54321/storage/v1/object/public/";
  // const bucketUrl = "http://localhost:54321/storage/v1/object/public/";

  useEffect(() => {
    if (focusedIdsData) {
      console.log("sideP Data", focusedIdsData);
    }
  }, [focusedIdsData]);


  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`http://192.168.1.102:3010/api/project/${id}`);
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

  return (
    <div className={cn(" flex-grow border-l-2 border-white ", className)}>
      <div className=" pl-3 pr-12 flex sticky items-center top-0 bg-secondary pt-2 mb-6 pb-2 z-10 ">
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
        <RiLink className="w-5 h-5 text-secondary-foreground ml-auto" />
      </div>

      <div className="flex-1 overflow-y-auto ">
        {focusedIdsData && focusedIdsData.length === 1 && (
          <div>
            <h2 className="text-xl mb-2">{focusedIdsData[0].name}</h2>
            <div>
              <ul className="flex gap-4 mb-4">
                {focusedIdsData[0].authors && (
                  <>
                    {focusedIdsData[0].authors.map((author, i) => (
                      <li key={i}>
                        <Badge className="rounded-none bg-white text-black px-3 py-2">
                          {author.firstName} {author.name}
                        </Badge>
                      </li>
                    ))}
                  </>
                )}
                {focusedIdsData[0].semester && (
                  <>
                    {focusedIdsData[0].semester.map((semester, i) => (
                      <Fragment key={i}>
                        <li>
                          <Badge className="rounded-none bg-white text-black px-3 py-2">{semester.name}</Badge>
                        </li>
                        <li>
                          <Badge className="rounded-none bg-white text-black px-3 py-2">
                            {semester.term} {semester.year}
                          </Badge>
                        </li>
                      </Fragment>
                    ))}
                  </>
                )}
              </ul>
            </div>
            {focusedIdsData[0].thumbnail && <img src={`${bucketUrl}${focusedIdsData[0].thumbnail}`}></img>}

            {focusedIdsData[0].abstract && <p className="mt-4 leading-5 mb-12">{focusedIdsData[0].abstract}</p>}
          </div>
        )}
        {focusedIdsData && focusedIdsData.length > 1 && (
          <div>
            <h2 className="text-xl mb-2">Author: name name</h2>
            <div>
              <ul className="flex gap-4 mb-4">
                {focusedIdsData.map((project, i) => (
                  <li key={i}>
                    {project.name}
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
