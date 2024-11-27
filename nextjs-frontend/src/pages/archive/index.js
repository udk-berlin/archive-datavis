import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Button } from "@/components/ui/button";

import { RiInformationLine, RiInformationFill, RiLoopLeftLine, RiPauseLine } from "@remixicon/react";

import * as p5code from "./sketch";
import SidePanel from "./SidePanel";

const ArchivePage = () => {
  let papertexture;

  const sketch = useMemo(() => p5code.sketch, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedIds, setFocusedIds] = useState([]);
  const [focusedType, setFocusedType] = useState({ type: "", id: "" });

  const [visualisationAutoRotation, setVisualisationAutoRotation] = useState("on");

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
    <div className="flex w-[100vw] h-full ">
      <div className="flex-1 relative ">
        <NextReactP5Wrapper
          sketch={sketch}
          windowWidth={windowWidth}
          setFocusedIds={setFocusedIds}
          setFocusedType={setFocusedType}
          setAutoRotation={setVisualisationAutoRotation}
          autoRotation={visualisationAutoRotation}
        />
        <div className="absolute bottom-1 right-4 z-10 flex gap-4">
          <Button
            variant="ghost"
            className="p-0 m-0 "
            onClick={() => {
              setVisualisationAutoRotation(visualisationAutoRotation === "on" ? "off" : "on");
            }}
          >
            {visualisationAutoRotation === "on" ? <RiLoopLeftLine /> : <RiPauseLine />}
          </Button>
          <Button variant="ghost" className="p-0 m-0">
            <RiInformationLine />
          </Button>
        </div>
      </div>

      <div className="w-1/3 h-full flex flex-col ">
        <SidePanel focusedIds={focusedIds} setFocusedIds={setFocusedIds} focusedType={focusedType} className="flex-1  " />
      </div>
    </div>
  );
};

export default ArchivePage;
