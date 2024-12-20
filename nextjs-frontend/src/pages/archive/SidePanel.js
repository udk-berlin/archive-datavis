import { Input } from "@/components/ui/input";
import { RiSearchLine, RiLink, RiFolder2Line, RiFolderOpenLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FileViewer from "./FileViewer";
import AbstractView from "./AbstractView";

import { Slider } from "@/components/ui/slider";

const SidePanel = ({
  focusedIds,
  setFocusedIds,
  focusedType,
  className,
  cachedData,
  opened,
  setOpened,
  rotationA,
  setRotationA,
  rotationB,
  setRotationB,
  rotationC,
  setRotationC,
  rotationD,
  setRotationD,
}) => {
  const [focusedIdsData, setFocusedIdsData] = useState([]);
  const bucketUrl = "http://localhost:54321/storage/v1/object/public/";
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
    const fetchData = async (id) => {
      const response = await fetch(`http://localhost:3010/api/project/${id}`);
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
      {opened && <FileViewer />}
      <div className={cn("flex-grow  h-full ", className)}>
        <div className="pl-3 pr-12 flex sticky items-center top-0 bg-secondary pt-2 pb-2 z-10">
          {!opened ? (
            <RiFolder2Line
              className={`w-5 h-5 ${
                !(focusedIdsData.length === 1 && focusedIdsData[0]?.files) || (focusedData && focusedData?.files) ? "opacity-25" : ""
              }`}
              onClick={() => {
                if ((focusedIdsData.length === 1 && focusedIdsData[0]?.files) || (focusedData && focusedData?.files)) {
                  setOpened(!opened);
                }
              }}
            />
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

        {!focusedType.type && (
          <>
            <div className="grid gap-8 mt-4">
              <Slider defaultValue={[rotationA]} max={3} min={-3} step={0.01} onValueChange={(e) => setRotationA(e[0])} />
              <Slider defaultValue={[rotationB]} max={2} min={-2} step={0.01} onValueChange={(e) => setRotationB(e[0])} />
              <Slider defaultValue={[rotationC]} max={2} min={-2} step={0.01} onValueChange={(e) => setRotationC(e[0])} />
              <Slider defaultValue={[rotationD]} max={2} min={-2} step={0.01} onValueChange={(e) => setRotationD(e[0])} />
            </div>
            <div>
              const [rotationA, setRotationA] = useState({rotationA}); const [rotationB, setRotationB] = useState({rotationB}); const
              [rotationC, setRotationC] = useState({rotationC}); const [rotationD, setRotationD] = useState({rotationD});
            </div>
          </>
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
          {focusedType.type !== "archive" && focusedIdsData && focusedIdsData.length === 1 && <AbstractView data={focusedIdsData[0]} />}
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
