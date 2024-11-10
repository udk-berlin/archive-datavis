import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';

const ThreeJSTest = () => {
  const mountRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [displacedPoints, setDisplacedPoints] = useState([]);
  const [centralPoint, setCentralPoint] = useState(new THREE.Vector3(0, 0, 0));
  const [img, setImg] = useState(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, -1).normalize();
    scene.add(directionalLight);

    const textureLoader = new TextureLoader();
    textureLoader.load('/images/floatingShadow.png', (texture) => {
      setImg(texture);
    });

    const createOrbit = (distance, n, centralPoint) => {
      const _points = [];
      for (let i = 0; i < n; i++) {
        let theta = Math.acos(1 - (2 * (i + 0.5)) / n);
        let phi = i * Math.PI * (3 - Math.sqrt(5));

        let x = centralPoint.x + distance * Math.sin(theta) * Math.cos(phi);
        let y = centralPoint.y + distance * Math.sin(theta) * Math.sin(phi);
        let z = centralPoint.z + distance * Math.cos(theta);

        _points.push(new THREE.Vector3(x, y, z));
      }

      return _points;
    };

    const createDisplacedPoints = (_points, distances) => {
      const newPoints = _points.map((point, i) => {
        const direction = new THREE.Vector3().subVectors(point, centralPoint).normalize();
        const extensionLength = (distances[i] ? distances[i] * 3 : 1) || 1;
        const extendedDirection = direction.multiplyScalar(extensionLength);
        const newEndPoint = new THREE.Vector3().addVectors(point, extendedDirection);
        return newEndPoint;
      });

      return newPoints;
    };



    const initialPoints = createOrbit(100, 66, centralPoint);
    setPoints(initialPoints);

    const displacedPoints = createDisplacedPoints(initialPoints, [
      1, 14, 4,  8,  3,  9,  9, 12, 7, 11,  5, 5,
     13, 11, 4, 10, 16,  9, 18,  7, 7,  9, 11, 3,
      8,  5, 9,  6, 12, 10,  7, 14, 2,  9,  4, 2,
      6,  6, 3,  3, 11,  5,  7,  6, 5,  6,  2, 0,
      2,  0, 2,  0,  0,  0,  0,  0, 0,  0,  0, 0,
      0,  0, 0,  0,  0, 57
   ]);
    setDisplacedPoints(displacedPoints);

    const drawTriangles = (points) => {
      const geometry = new ConvexGeometry(points);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const draw = () => {
      requestAnimationFrame(draw);
      controls.update();
      renderer.render(scene, camera);
    };

    camera.position.set(0, 0, 500);
    controls.update();

    const centralSphereGeometry = new THREE.SphereGeometry(10, 32, 32);
    const centralSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const centralSphere = new THREE.Mesh(centralSphereGeometry, centralSphereMaterial);
    centralSphere.position.copy(centralPoint);
    scene.add(centralSphere);

    drawTriangles(displacedPoints);

    if (img) {
      const planeGeometry = new THREE.PlaneGeometry(800, 800);
      const planeMaterial = new THREE.MeshBasicMaterial({ map: img, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = -250;
      scene.add(plane);
    }

    draw();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [centralPoint, img]);

  return <div ref={mountRef} />;
};

export default ThreeJSTest;