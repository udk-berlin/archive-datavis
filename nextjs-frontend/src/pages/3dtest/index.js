import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Delaunay } from "d3-delaunay";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Test3dPage = () => {
  const data = {
    name: "a",
    children: [
      { name: "b", children: [{ name: "c", children: [{ name: "d" }] }] },
      {
        name: "e",
        children: [
          {
            name: "f",
            children: [{ name: "g", children: [{ name: "h" }, { name: "i" }, { name: "j" }] }, { name: "h" }, { name: "i" }, { name: "j" }],
          },
        ],
      },
      { name: "g", children: [{ name: "c", }] },
      { name: "j", children: [{ name: "c", children: [{ name: "d" }, {name:"a"}] }] },
    ],
  };

  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true; // Enable shadow maps
    mountRef.current.appendChild(renderer.domElement);

    // Set up the camera position
    camera.position.z = 5;

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.25; // Damping factor
    controls.screenSpacePanning = false; // Disable panning
    controls.minDistance = 1; // Minimum zoom distance
    controls.maxDistance = 100; // Maximum zoom distance


// Add ambient light for soft ambient shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a directional light that casts very soft shadows
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(5, 10, 7.5);
light.castShadow = true;
light.shadow.radius = 10; // Increase shadow radius for softer shadows
light.shadow.mapSize.width = 2048; // Increase shadow map size for better quality
light.shadow.mapSize.height = 2048;
scene.add(light);

// Create a floor that receives shadows
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);


    // Function to create points from the JSON data
    const createPoints = (node, depth = 0, parentPosition = new THREE.Vector3(0, 0, 0)) => {
      const distance = 2;
      const angle = (Math.PI * 2) / (node.children ? node.children.length : 1);
      const points = [];

      if (node.children) {
        node.children.forEach((child, index) => {
          const x = parentPosition.x + distance * Math.cos(angle * index);
          const y = parentPosition.y + distance * Math.sin(angle * index);
          const z = parentPosition.z + distance * depth;
          const position = new THREE.Vector3(x, y, z);

          points.push(position);
          points.push(...createPoints(child, depth + 1, position));
        });
      }

      return points;
    };

    // Create points from the JSON data
    const points = createPoints(data);

    // Create geometry and material for points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Function to create lines between points
    const createLines = (points) => {
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    };

    // Create lines between points
    createLines(points);


    const generateNoiseTexture = (width, height) => {
        const size = width * height;
        const data = new Uint8Array(size * 4);
      
        for (let i = 0; i < size; i++) {
          const value = Math.random() * 255;
          data[i * 4] = value;
          data[i * 4 + 1] = value;
          data[i * 4 + 2] = value;
          data[i * 4 + 3] = 255;
        }
      
        const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
      };
      
      // Generate a noise texture
      const noiseTexture = generateNoiseTexture(512, 512);

    // Function to create triangles between points using Delaunay triangulation
    const createTriangles = (points) => {
        const delaunay = Delaunay.from(points.map(p => [p.x, p.y]));
        const triangles = delaunay.triangles;
      
        const vertices = [];
        for (let i = 0; i < triangles.length; i += 3) {
          const a = points[triangles[i]];
          const b = points[triangles[i + 1]];
          const c = points[triangles[i + 2]];
      
          vertices.push(a.x, a.y, a.z);
          vertices.push(b.x, b.y, b.z);
          vertices.push(c.x, c.y, c.z);
        }
      
        const triangleGeometry = new THREE.BufferGeometry();
        triangleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Create material with noise texture
        const triangleMaterial = new THREE.MeshBasicMaterial({
          map: noiseTexture,
          side: THREE.DoubleSide,
          opacity: 0.5,
          transparent: true
        });
      
        const mesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
        mesh.castShadow = true;
        scene.add(mesh);
      };

      

    // Create triangles between points
    createTriangles(points);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <h1>3D Test Page</h1>
      <div ref={mountRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default Test3dPage;