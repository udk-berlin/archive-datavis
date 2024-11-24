import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";


import { Input } from "@/components/ui/input";

import { RiSearchLine, RiQuestionLine } from "@remixicon/react";
import { Slider } from "@/components/ui/slider";

import * as p5code from "./sketch";

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
    <div className="flex mr-12">
      <NextReactP5Wrapper sketch={sketch} windowWidth={windowWidth} setFocusedId={setFocusedId} />
      <div className=" pl-12 flex-grow border-l-[3px] border-white  pt-12">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <RiSearchLine className="w-5 h-5" />
          </span>
          <Input type="text" placeholder="Search..." className="pl-10 h-12 rounded-none " />
         
          <br />
          {focusedId}
        </div>
      </div>
    </div>
  );
};

export default Library;
