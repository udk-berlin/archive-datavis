import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Button } from "@/components/ui/button";

import {
  RiInformationLine,
  RiInformationFill,
  RiLoopLeftLine,
  RiPauseLine,
  RiCompass3Line,
  RiPauseCircleLine,
  RiInfoI,
  RiPlayLine,
} from "@remixicon/react";

import * as p5code from "./sketch";
import SidePanel from "./SidePanel";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const ArchivePage = () => {
  let papertexture;

  const sketch = useMemo(() => p5code.sketch, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedIds, setFocusedIds] = useState([]);
  const [focusedType, setFocusedType] = useState({ type: "", id: "" });

  const [visualisationAutoRotation, setVisualisationAutoRotation] = useState("off");

  const [opened, setOpened] = useState(false);

  const resizablePanelRef = useRef(null);


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


  useEffect(() => {
    if (resizablePanelRef.current) {
      resizablePanelRef.current.resize(!opened ? 25 : 50);
    }
  }, [opened]);

  return (
    <ResizablePanelGroup direction="horizontal" className={"h-full w-[100vw] overflow-hidden"}>
      <ResizablePanel className="h-full" defaultSize={!opened? 75 : 50}>
        <div className="h-full" id="sketch-container">
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
              {visualisationAutoRotation !== "on" ? (
                <RiPlayLine className="!h-full !w-full " />
              ) : (
                <RiPauseLine className="!h-full !w-full" />
              )}
            </Button>
            <Button variant="ghost" className="p-0 m-0 w-6 h-6">
              <RiInfoI className="!h-full !w-full  " />
            </Button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className={'border-0 border-white w-[3px] bg-white'} />
      <ResizablePanel ref={resizablePanelRef} defaultSize={opened ? 25 : 50} maxSize={50}>
        <SidePanel
          focusedIds={focusedIds}
          setFocusedIds={setFocusedIds}
          focusedType={focusedType}
          className="flex-1  "
          opened={opened}
          setOpened={setOpened}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ArchivePage;
