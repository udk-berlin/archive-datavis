import { useState, useEffect, useRef, useMemo } from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Button } from "@/components/ui/button";

import { RiPauseLine, RiCompass3Line, RiInfoI, RiPlayLine } from "@remixicon/react";

import sketch from "./sketch";
import SidePanel from "./SidePanel";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const ArchivePage = () => {
  const sketchData = useMemo(() => sketch, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedIds, setFocusedIds] = useState([]);
  const [focusedType, setFocusedType] = useState({ type: "", id: "" });

  const [visualisationAutoRotation, setVisualisationAutoRotation] = useState("off");
  const [opened, setOpened] = useState(false);
  const [p5PanelPercent, setP5PanelPercent] = useState(75);
  const resizablePanelRef = useRef(null);

  const [rotationA, setRotationA] = useState(-3);
  const [rotationB, setRotationB] = useState(0.37);
  const [rotationC, setRotationC] = useState(-0.48);
  const [rotationD, setRotationD] = useState(0.09);

  const [rotationA, setRotationA] = useState(0);
  const [rotationB, setRotationB] = useState(0);
  const [rotationC, setRotationC] = useState(0);
  const [rotationD, setRotationD] = useState(0);


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
    <ResizablePanelGroup direction="horizontal" className={"h-full !w-[100vw] overflow-hidden"}>
      <ResizablePanel
        className="h-full"
        defaultSize={!opened ? 75 : 50}
        id="sketch-container"
        onResize={(e) => {
          setP5PanelPercent(e);
        }}
      >
        <div className="h-full relative">
          <NextReactP5Wrapper
            sketch={sketchData}
            windowWidth={windowWidth}
            setFocusedIds={setFocusedIds}
            setFocusedType={setFocusedType}
            setAutoRotation={setVisualisationAutoRotation}
            autoRotation={visualisationAutoRotation}
            canvasSizeChanged={p5PanelPercent}
            rotationA={rotationA}
            rotationB={rotationB}
            rotationC={rotationC}
            rotationD={rotationD}
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
      <ResizableHandle className={"border-0 border-white w-[3px] bg-white"} />
      <ResizablePanel ref={resizablePanelRef} defaultSize={opened ? 25 : 50} maxSize={50}>
        <SidePanel
          focusedIds={focusedIds}
          setFocusedIds={setFocusedIds}
          focusedType={focusedType}
          className="flex-1  "
          opened={opened}
          setOpened={setOpened}
          rotationA={rotationA}
          setRotationA={setRotationA}
          rotationB={rotationB}
          setRotationB={setRotationB}
          rotationC={rotationC}
          setRotationC={setRotationC}
          rotationD={rotationD}
          setRotationD={setRotationD}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ArchivePage;
