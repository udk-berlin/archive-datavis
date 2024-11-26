import { Input } from "@/components/ui/input";
import { Fragment } from "react";

import { RiSearchLine, RiQuestionLine } from "@remixicon/react";
import { useEffect, useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";

import { Link } from "next/link";
import { cn } from "@/lib/utils";

const SidePanel = ({ focusedId, setFocusedId, className }) => {
  const [focusedIdData, setFocusedIdData] = useState({});
  const bucketUrl = "http://192.168.1.102:54321/storage/v1/object/public/";
// const bucketUrl = "http://localhost:54321/storage/v1/object/public/";

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`http://192.168.1.102:3010/api/project/${id}`);
   // const response = await fetch(`http://localhost:3010/api/project/${id}`);
      const data = await response.json();
      setFocusedIdData(data);
      return data;
    };

    if (focusedId) {
      fetchData(focusedId);
    }
  }, [focusedId, setFocusedIdData]);

  useEffect(() => {
    if (focusedIdData) {
      console.log(focusedIdData);
    }
  }, [focusedIdData]);

  return (
    <div className={cn("pl-12 flex-grow border-l-2 border-white pr-12", className)}>
      <div className="sticky top-0 bg-background pt-12 mb-6 pb-6 z-10">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <RiSearchLine className="w-5 h-5" />
          </span>
          <Input type="text" placeholder="Search..." className="pl-10 h-12 rounded-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto ">
        {focusedIdData && (
          <div>
            <h2 className="text-xl mb-2">{focusedIdData.name}</h2>
            <div>
              <ul className="flex gap-4 mb-4">
                {focusedIdData.authors && (
                  <>
                    {focusedIdData.authors.map((author, i) => (
                      <li key={i}>
                        <Badge className="rounded-none bg-white text-black px-3 py-2">
                          {author.firstName} {author.name}
                        </Badge>
                      </li>
                    ))}
                  </>
                )}
                {focusedIdData.semester && (
                  <>
                    {focusedIdData.semester.map((semester, i) => (
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
            {focusedIdData.thumbnail && <img src={`${bucketUrl}${focusedIdData.thumbnail}`}></img>}

            {focusedIdData.abstract && <p className="mt-4 leading-5 mb-12">{focusedIdData.abstract}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
