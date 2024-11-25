import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";




import * as p5code from "./sketch";
import SidePanel from "./SidePanel";

const Library = () => {
  let papertexture;

  const sketch = useMemo(() => p5code.sketch, []);


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [focusedId, setFocusedId] = useState("");


 

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
    <div className="flex mr-12 h-screen">
  
      <NextReactP5Wrapper sketch={sketch} windowWidth={windowWidth} setFocusedId={setFocusedId} />
    
    <div className="w-1/3 h-full overflow-y-auto no-scrollbar">
      <SidePanel focusedId={focusedId} setFocusedId={setFocusedId} className={"pb-36"} />
    </div>
  </div>
  );
};

export default Library;
