import { Input } from "@/components/ui/input";
import { Fragment } from "react";

import { RiSearchLine, RiQuestionLine } from "@remixicon/react";
import { useEffect, useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";

import { Link } from "next/link";
import { cn } from "@/lib/utils";

const SidePanel = ({ focusedId, setFocusedId, className }) => {
  const [focusedIdData, setFocusedIdData] = useState({});
  const bucketUrl = "http://192.168.1.101:54321/storage/v1/object/public/";

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`http://192.168.1.101:3010/api/project/${id}`);
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
    <div className={cn(
        "pl-12 flex-grow  border-l-[2px]  border-white  pt-12 ",
        className
      )} >
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          <RiSearchLine className="w-5 h-5" />
        </span>
        <Input type="text" placeholder="Search..." className="pl-10 h-12 rounded-none " />

        {focusedIdData && (
          <div className="mt-12">
            <h2 className="text-xl mb-2">{focusedIdData.name}</h2>
            <div>
              {focusedIdData.authors && (
                <div>
                  <ul className="flex gap-4 mb-4">
                    {focusedIdData.authors.map((author, i) => (
                      <li key={i}>
                        <Badge className="rounded-none bg-white text-black px-3 py-2">
                          {author.firstName} {author.name}
                        </Badge>
                      </li>
                    ))}
                    {focusedIdData.semester && (
                      <>
                        {focusedIdData.semester.map((semester, i) => (
                          <>
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
                          </>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {focusedIdData.thumbnail && <img src={`${bucketUrl}${focusedIdData.thumbnail}`}></img>}

            {focusedIdData.abstract && <p className="mt-4 text-xl">{focusedIdData.abstract}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
