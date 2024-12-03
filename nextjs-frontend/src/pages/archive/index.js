import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Button } from "@/components/ui/button";

import { RiInformationLine, RiInformationFill, RiLoopLeftLine, RiPauseLine, RiCompass3Line, RiPauseCircleLine, RiInfoI, RiPlayLine } from "@remixicon/react";

import * as p5code from "./sketch";
import SidePanel from "./SidePanel";

const ArchivePage = () => {
  let papertexture;

  const sketch = useMemo(() => p5code.sketch, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedIds, setFocusedIds] = useState([]);
  const [focusedType, setFocusedType] = useState({ type: "", id: "" });

  const [visualisationAutoRotation, setVisualisationAutoRotation] = useState("off");

  useEffect(() => {
    console.log("focusedIds", focusedIds);
  }, [focusedIds]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="grid w-full h-full w-[100vw] border-white grid-cols-7 overflow-hidden">
      <div className="flex-1 relative  col-span-5  " id="sketch-container">
        <NextReactP5Wrapper
          sketch={sketch}
          windowWidth={windowWidth}
          setFocusedIds={setFocusedIds}
          setFocusedType={setFocusedType}
          setAutoRotation={setVisualisationAutoRotation}
          autoRotation={visualisationAutoRotation}
        />
        <div className="absolute bottom-4 right-3 z-10 flex gap-3">
        <Button
            variant="ghost"
            className="p-0 m-0 w-6 h-6 "
            onClick={() => {
              setVisualisationAutoRotation(visualisationAutoRotation === "on" ? "off" : "on");
            }}
          >
           <RiCompass3Line className="!h-full !w-full " /> 
          </Button>
          <Button
            variant="ghost"
            className="p-0 m-0 w-6 h-6"
            onClick={() => {
              setVisualisationAutoRotation(visualisationAutoRotation === "on" ? "off" : "on");
            }}
          >
            {visualisationAutoRotation !== "on" ? <RiPlayLine className="!h-full !w-full "/> : <RiPauseLine className="!h-full !w-full" />}
          </Button>
          <Button variant="ghost" className="p-0 m-0 w-6 h-6">
            <RiInfoI className="!h-full !w-full  "/>
          </Button>
        </div>
      </div>

      <div className="col-span-2 border-l-2 border-white box-border h-full ">
        <SidePanel focusedIds={focusedIds} setFocusedIds={setFocusedIds} focusedType={focusedType} className="flex-1  " />
      </div>
    </div>
  );
};

export default ArchivePage;
