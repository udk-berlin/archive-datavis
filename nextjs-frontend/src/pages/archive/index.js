import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Button } from "@/components/ui/button";

import * as p5code from "./sketch";
import SidePanel from "./SidePanel";

const ArchivePage = () => {
  let papertexture;

  const sketch = useMemo(() => p5code.sketch, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedId, setFocusedId] = useState("");

  useEffect(() => {
    console.log("focusedId", focusedId);
  }
  , [focusedId]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const [img, setImg] = useState();

  return (
    <div className="flex h-full">
          {/* <div className="absolute left-0 top-0"> <Button onClick={() => setFocusedId("b874ceff-2abb-475b-a19c-9f2f3f82a8f4")}>Set focusedId</Button></div> */}
    <NextReactP5Wrapper sketch={sketch} windowWidth={windowWidth} setFocusedId={setFocusedId} className="flex-1" />

    <div className="w-1/3 h-full flex flex-col " >
      <SidePanel focusedId={focusedId} setFocusedId={setFocusedId} className="flex-1 overflow-y-auto " />
    </div>
  </div>
  );
};

export default ArchivePage;
