import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneId, CameraPreset } from '../../types/simulation';
import {
  createTextSprite,
  createInfiniteLine,
  createAcrylicPlane,
  createPointMarker,
} from './threeUtils';

interface ThreeSceneProps {
  sceneId: SceneId;
  showPlanes: boolean;
  showLabels: boolean;
  cameraPreset: CameraPreset;
  onCameraPresetHandled?: () => void;
  isAutoRotating?: boolean;
  // Scene 1 props
  scene1Angle: number;
  scene1Elevation: number;
  scene1Distance: number;
  onScene1StatusChange?: (status: {
    type: 'intersecting' | 'parallel' | 'skew';
    intersectionPoint?: [number, number, number];
    isCoplanar: boolean;
  }) => void;
  // Scene 2 props
  scene2Angle: number;
  isScene2Snapped: boolean;
  // Scene 3 props
  scene3Step: number;
  scene3Exploded: number; // 0 to 1
  // Scene 4 props
  scene4Step: number;
  // Scene 5 props
  scene5SelectedBars: number[];
  onSelectBar?: (id: number) => void;
  // Scene 6 props
  scene6ActivePair: 'pairA' | 'pairB';
  // Scene 7 props
  scene7Mode: 'apex' | 'prism';
  scene7Abstraction: number; // 0 to 1
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  sceneId,
  showPlanes,
  showLabels,
  cameraPreset,
  onCameraPresetHandled,
  isAutoRotating = false,
  scene1Angle,
  scene1Elevation,
  scene1Distance,
  onScene1StatusChange,
  scene2Angle,
  isScene2Snapped,
  scene3Step,
  scene3Exploded,
  scene4Step,
  scene5SelectedBars,
  onSelectBar,
  scene6ActivePair,
  scene7Mode,
  scene7Abstraction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);

  // Target camera state for smooth lerping
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(7, 6, 9));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isTransitioningCamera = useRef<boolean>(false);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.022);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(7, 6, 9);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI / 2 + 0.25; // allow looking slightly from below
    controlsRef.current = controls;

    // 5. Lighting: key, fill, rim + subtle ambient
    const ambientLight = new THREE.AmbientLight(0xcfd8dc, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-10, 8, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.5);
    rimLight.position.set(0, -10, 0);
    scene.add(rimLight);

    // 6. Subtle Floor Grid
    const grid = new THREE.GridHelper(24, 24, 0x1e293b, 0x0f172a);
    grid.position.y = -2.5;
    grid.material.opacity = 0.45;
    grid.material.transparent = true;
    scene.add(grid);

    // Dynamic objects container
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Raycasting for bar selection in Scene 5
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      if (sceneId !== 'scene5_real_door') return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(dynamicGroup.children, true);
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj && obj !== dynamicGroup) {
          if (obj.userData && typeof obj.userData.barId === 'number') {
            if (onSelectBar) onSelectBar(obj.userData.barId);
            return;
          }
          obj = obj.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera lerp when targetCamPos is set
      if (isTransitioningCamera.current) {
        if (camera.position.distanceTo(targetCamPos.current) > 0.04) {
          camera.position.lerp(targetCamPos.current, 0.08);
          controls.target.lerp(targetLookAt.current, 0.08);
        } else {
          isTransitioningCamera.current = false;
        }
      }

      // Optional subtle idle rotation for intro
      if (sceneId === 'intro') {
        dynamicGroup.rotation.y += delta * 0.15;
      } else {
        dynamicGroup.rotation.y = 0;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [sceneId]);

  // Handle auto-rotate state on OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 2.4;
    }
  }, [isAutoRotating]);

  // Handle camera preset changes smoothly
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    isTransitioningCamera.current = true;
    if (cameraPreset === 'perspective') {
      targetCamPos.current.set(7, 6, 9);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraPreset === 'top') {
      targetCamPos.current.set(0.01, 13, 0);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraPreset === 'front') {
      targetCamPos.current.set(0, 1.5, 11);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraPreset === 'side') {
      targetCamPos.current.set(11, 1.5, 0);
      targetLookAt.current.set(0, 0, 0);
    }
    if (onCameraPresetHandled) onCameraPresetHandled();
  }, [cameraPreset, onCameraPresetHandled]);

  // Re-build 3D content inside dynamicGroup whenever props or scenes change
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    // Clean up previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    // BUILD SPECIFIC SCENE
    if (sceneId === 'intro') {
      buildIntroScene(group);
    } else if (sceneId === 'scene1_relative_positions') {
      buildScene1(group);
    } else if (sceneId === 'scene2_parallel_property') {
      buildScene2(group);
    } else if (sceneId === 'scene3_concurrence') {
      buildScene3(group);
    } else if (sceneId === 'scene4_parallel_planes') {
      buildScene4(group);
    } else if (sceneId === 'scene5_real_door') {
      buildScene5(group);
    } else if (sceneId === 'scene6_real_truss') {
      buildScene6(group);
    } else if (sceneId === 'scene7_real_planes') {
      buildScene7(group);
    } else if (sceneId === 'summary') {
      buildSummaryScene(group);
    }
  }, [
    sceneId,
    showPlanes,
    showLabels,
    scene1Angle,
    scene1Elevation,
    scene1Distance,
    scene2Angle,
    isScene2Snapped,
    scene3Step,
    scene3Exploded,
    scene4Step,
    scene5SelectedBars,
    scene6ActivePair,
    scene7Mode,
    scene7Abstraction,
  ]);

  // -------------------------------------------------------------
  // BUILDERS FOR EACH SCENE
  // -------------------------------------------------------------

  // INTRO SCENE: Minimalist glowing space geometry
  const buildIntroScene = (root: THREE.Group) => {
    // Elegant crystal cube wireframe
    const boxGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      roughness: 0.1,
      transmission: 0.8,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    root.add(box);

    const boxEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    root.add(boxEdges);

    // Pair of glowing parallel spatial lines inside
    const lineA = createInfiniteLine(12, 0.04, 0x38bdf8, 0x0284c7);
    lineA.position.set(0, 1.2, 0);
    lineA.rotation.z = Math.PI / 2;
    root.add(lineA);

    const lineB = createInfiniteLine(12, 0.04, 0x10b981, 0x059669);
    lineB.position.set(0, -1.2, 0);
    lineB.rotation.z = Math.PI / 2;
    root.add(lineB);

    // Glowing transverse diagonal line
    const lineC = createInfiniteLine(10, 0.03, 0xf59e0b, 0xd97706);
    lineC.position.set(0, 0, 1.5);
    lineC.rotation.x = Math.PI / 4;
    lineC.rotation.y = Math.PI / 6;
    root.add(lineC);

    if (showLabels) {
      const lblA = createTextSprite('d₁', '#38bdf8', 'rgba(15, 23, 42, 0.8)');
      lblA.position.set(3.2, 1.6, 0);
      root.add(lblA);

      const lblB = createTextSprite('d₂', '#10b981', 'rgba(15, 23, 42, 0.8)');
      lblB.position.set(3.2, -1.6, 0);
      root.add(lblB);
    }
  };

  // SCENE 1: Relative positions of two lines (Intersecting, Parallel, Skew)
  const buildScene1 = (root: THREE.Group) => {
    // Line a lies fixed along X axis on plane Z=0: y = 0, z = 0, x in [-L, L]
    const lineA = createInfiniteLine(14, 0.05, 0x38bdf8, 0x0284c7);
    lineA.rotation.z = Math.PI / 2; // runs along X
    root.add(lineA);

    // Line b position and orientation
    // Angle theta in radians, elevation z, distance y
    const rad = (scene1Angle * Math.PI) / 180;
    const yOffset = scene1Distance;
    const zOffset = scene1Elevation;

    // Line b direction vector
    const dirB = new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0).normalize();
    const posB = new THREE.Vector3(0, yOffset, zOffset);

    const lineB = createInfiniteLine(14, 0.05, 0xf59e0b, 0xd97706);
    lineB.position.copy(posB);
    lineB.rotation.z = rad;
    root.add(lineB);

    // Mathematical classification
    const isCoplanar = Math.abs(zOffset) < 0.05;
    const isParallelAngle = Math.abs(Math.sin(rad)) < 0.02; // angle approx 0 or 180

    let type: 'intersecting' | 'parallel' | 'skew' = 'skew';
    let intersectPt: [number, number, number] | undefined = undefined;

    if (isCoplanar) {
      if (isParallelAngle) {
        // Parallel
        type = 'parallel';
      } else {
        // Intersecting on plane Z=0
        type = 'intersecting';
        // Line A: y=0, z=0 (runs along x)
        // Line B: point (0, y0, 0), direction (cos rad, sin rad, 0)
        // Intersection: y = y0 + t * sin rad = 0 => t = -y0 / sin rad
        const t = -yOffset / Math.sin(rad);
        const ix = 0 + t * Math.cos(rad);
        intersectPt = [ix, 0, 0];

        // Draw glowing point I
        const markerI = createPointMarker(0xef4444, 0.22, true);
        markerI.position.set(ix, 0, 0);
        root.add(markerI);

        if (showLabels) {
          const lblI = createTextSprite('I (giao điểm)', '#f87171', 'rgba(239, 68, 68, 0.2)');
          lblI.position.set(ix, 0.5, 0);
          root.add(lblI);
        }
      }
    } else {
      type = 'skew';
      // Skew: show perpendicular connector line (đoạn vuông góc chung)
      const connectorGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, yOffset, zOffset),
      ]);
      const connectorMat = new THREE.LineDashedMaterial({
        color: 0x94a3b8,
        dashSize: 0.2,
        gapSize: 0.15,
        linewidth: 2,
      });
      const connector = new THREE.Line(connectorGeo, connectorMat);
      connector.computeLineDistances();
      root.add(connector);
    }

    if (onScene1StatusChange) {
      onScene1StatusChange({
        type,
        intersectionPoint: intersectPt,
        isCoplanar,
      });
    }

    // Base Plane (P) containing line a (Z = 0)
    if (showPlanes) {
      const planeP = createAcrylicPlane(
        14,
        10,
        type === 'parallel' ? 0x10b981 : 0x0284c7,
        type === 'parallel' ? 0.35 : 0.2,
        'PlaneP'
      );
      planeP.position.set(0, 0, 0);
      root.add(planeP);

      if (showLabels) {
        const lblPlane = createTextSprite(
          type === 'parallel' ? 'Mặt phẳng (P) chứa a và b' : 'Mặt phẳng (P) chứa đường thẳng a',
          '#38bdf8',
          'rgba(15, 23, 42, 0.85)'
        );
        lblPlane.position.set(-5, -3.8, 0.1);
        root.add(lblPlane);
      }
    }

    // Labels for a and b
    if (showLabels) {
      const lblA = createTextSprite('a', '#38bdf8', 'rgba(15, 23, 42, 0.85)', 36);
      lblA.position.set(5.5, 0.4, 0);
      root.add(lblA);

      const lblB = createTextSprite('b', '#f59e0b', 'rgba(15, 23, 42, 0.85)', 36);
      const bTip = posB.clone().add(dirB.clone().multiplyScalar(4.5));
      lblB.position.set(bTip.x, bTip.y + 0.4, bTip.z);
      root.add(lblB);
    }
  };

  // SCENE 2: Parallel line property through point M
  const buildScene2 = (root: THREE.Group) => {
    // Fixed line a at y = -1.6, z = 0, runs along X
    const lineA = createInfiniteLine(14, 0.05, 0x38bdf8, 0x0284c7);
    lineA.position.set(0, -1.6, 0);
    lineA.rotation.z = Math.PI / 2;
    root.add(lineA);

    // Fixed point M at (0, 1.6, 0)
    const ptM = createPointMarker(0x10b981, 0.22, true);
    ptM.position.set(0, 1.6, 0);
    root.add(ptM);

    // Test line d passing through M
    const rad = (scene2Angle * Math.PI) / 180;
    const isParallel = isScene2Snapped;

    const lineD = createInfiniteLine(
      14,
      0.05,
      isParallel ? 0x10b981 : 0xf59e0b,
      isParallel ? 0x059669 : 0xd97706
    );
    lineD.position.set(0, 1.6, 0);
    lineD.rotation.z = Math.PI / 2 + (isParallel ? 0 : rad);
    root.add(lineD);

    // Plane containing both a and d when parallel
    if (showPlanes && isParallel) {
      const plane = createAcrylicPlane(14, 7, 0x10b981, 0.3);
      plane.position.set(0, 0, 0);
      root.add(plane);

      if (showLabels) {
        const lblPlane = createTextSprite(
          'Mặt phẳng duy nhất xác định bởi (M, a)',
          '#10b981',
          'rgba(15, 23, 42, 0.85)'
        );
        lblPlane.position.set(0, 3.2, 0.1);
        root.add(lblPlane);
      }
    }

    if (showLabels) {
      const lblA = createTextSprite('a (cố định)', '#38bdf8', 'rgba(15, 23, 42, 0.85)');
      lblA.position.set(5.2, -1.2, 0);
      root.add(lblA);

      const lblM = createTextSprite('M', '#10b981', 'rgba(15, 23, 42, 0.85)', 36);
      lblM.position.set(0, 2.1, 0);
      root.add(lblM);

      const lblD = createTextSprite(
        isParallel ? 'd // a (Duy nhất)' : 'd (đang xoay)',
        isParallel ? '#10b981' : '#f59e0b',
        'rgba(15, 23, 42, 0.85)'
      );
      lblD.position.set(4.5, 2.0, 0);
      root.add(lblD);
    }
  };

  // SCENE 3: Three planes concurrence at O
  const buildScene3 = (root: THREE.Group) => {
    // 3 planes intersecting at origin (0, 0, 0)
    // P: XY plane (z = 0)
    // Q: YZ plane (x = 0)
    // R: inclined plane through origin, e.g. x + y - z = 0 or XZ plane (y = 0)
    // Let's use 3 distinct harmonious intersecting planes:
    // P: Horizontal (XZ, y = 0)
    // Q: Vertical (YZ, x = 0)
    // R: Slanted (45 deg)
    const exp = scene3Exploded * 1.8; // exploded offset

    // Plane P: horizontal (XZ)
    if (showPlanes) {
      const planeP = createAcrylicPlane(8, 8, 0x0284c7, 0.28, 'P');
      planeP.rotation.x = Math.PI / 2;
      planeP.position.set(0, -exp, 0);
      root.add(planeP);
    }

    // Plane Q: vertical (YZ)
    if (showPlanes) {
      const planeQ = createAcrylicPlane(8, 8, 0x8b5cf6, 0.28, 'Q');
      planeQ.rotation.y = Math.PI / 2;
      planeQ.position.set(-exp, 0, 0);
      root.add(planeQ);
    }

    // Plane R: diagonal plane
    if (showPlanes) {
      const planeR = createAcrylicPlane(8, 8, 0xf59e0b, 0.28, 'R');
      planeR.rotation.x = Math.PI / 4;
      planeR.position.set(0, 0, exp);
      root.add(planeR);
    }

    // Progressive appearance of intersection lines:
    // Line a = P ∩ Q: Cyan Neon (Xanh Lam)
    if (scene3Step >= 1) {
      const lineA = createInfiniteLine(11, 0.065, 0x00d2ff, 0x0284c7);
      lineA.rotation.x = Math.PI / 2; // lies along Z axis
      root.add(lineA);

      if (showLabels) {
        const lblA = createTextSprite(
          'a = (P) ∩ (Q)',
          '#00e5ff',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#00e5ff'
        );
        lblA.position.set(0.3, 0.3, 4.4);
        root.add(lblA);
      }
    }

    // Line b = Q ∩ R: Rose / Ruby Neon (Đỏ Hồng)
    if (scene3Step >= 2) {
      const lineB = createInfiniteLine(11, 0.065, 0xf43f5e, 0xe11d48);
      lineB.rotation.x = Math.PI / 4; // lies along Q and R
      root.add(lineB);

      if (showLabels) {
        const lblB = createTextSprite(
          'b = (Q) ∩ (R)',
          '#fb7185',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#fb7185'
        );
        lblB.position.set(0.3, 3.4, 3.4);
        root.add(lblB);
      }
    }

    // Line c = R ∩ P: Amber / Gold Neon (Vàng Cam)
    if (scene3Step >= 3) {
      const lineC = createInfiniteLine(11, 0.065, 0xfbbf24, 0xd97706);
      lineC.rotation.z = Math.PI / 2; // lies along X axis
      root.add(lineC);

      if (showLabels) {
        const lblC = createTextSprite(
          'c = (R) ∩ (P)',
          '#fde047',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#fde047'
        );
        lblC.position.set(4.4, 0.3, 0.3);
        root.add(lblC);
      }
    }

    // Common point of concurrence O
    if (scene3Step >= 4) {
      const ptO = createPointMarker(0x10b981, 0.28, true);
      ptO.position.set(0, 0, 0);
      root.add(ptO);

      if (showLabels) {
        const lblO = createTextSprite(
          'O (điểm đồng quy)',
          '#34d399',
          'rgba(15, 23, 42, 0.9)',
          36,
          12,
          '#10b981'
        );
        lblO.position.set(0, 0.8, 0);
        root.add(lblO);
      }
    }

    // Exploded dashed guide lines when exploded > 0
    if (scene3Exploded > 0.1) {
      const guideMat = new THREE.LineDashedMaterial({
        color: 0x94a3b8,
        dashSize: 0.15,
        gapSize: 0.1,
      });
      const gPoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -exp, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-exp, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, exp),
      ];
      const guideGeo = new THREE.BufferGeometry().setFromPoints(gPoints);
      const guides = new THREE.LineSegments(guideGeo, guideMat);
      guides.computeLineDistances();
      root.add(guides);
    }
  };

  // SCENE 4: Three planes with pairwise parallel lines (Prism configuration)
  const buildScene4 = (root: THREE.Group) => {
    // Three planes forming a triangular prism:
    // Cross section in XY plane is an equilateral triangle:
    // Vertex 1: (0, 2)
    // Vertex 2: (-1.732, -1)
    // Vertex 3: (1.732, -1)
    // The three intersection lines run parallel along Z-axis:
    // a at (0, 2, z)
    // b at (-1.732, -1, z)
    // c at (1.732, -1, z)
    const p1 = new THREE.Vector3(0, 2.2, 0);
    const p2 = new THREE.Vector3(-1.9, -1.1, 0);
    const p3 = new THREE.Vector3(1.9, -1.1, 0);

    // Three planes:
    // P connects p2 and p3 (bottom plane, horizontal)
    // Q connects p1 and p2 (left slanted plane)
    // R connects p1 and p3 (right slanted plane)
    if (showPlanes) {
      // Bottom plane (P)
      const planeP = createAcrylicPlane(8, 12, 0x0284c7, 0.25, 'P');
      planeP.rotation.x = Math.PI / 2;
      planeP.position.set(0, -1.1, 0);
      root.add(planeP);

      // Left slanted plane (Q)
      const planeQ = createAcrylicPlane(5.5, 12, 0x8b5cf6, 0.25, 'Q');
      const midQ = p1.clone().add(p2).multiplyScalar(0.5);
      planeQ.position.copy(midQ);
      planeQ.rotation.z = Math.PI / 6; // tilt matching triangle side
      root.add(planeQ);

      // Right slanted plane (R)
      const planeR = createAcrylicPlane(5.5, 12, 0xf59e0b, 0.25, 'R');
      const midR = p1.clone().add(p3).multiplyScalar(0.5);
      planeR.position.copy(midR);
      planeR.rotation.z = -Math.PI / 6;
      root.add(planeR);
    }

    // Step 1: line a = (Q) ∩ (R) at top vertex p1 (Cyan Neon)
    if (scene4Step >= 1) {
      const lineA = createInfiniteLine(13, 0.065, 0x00d2ff, 0x0284c7);
      lineA.position.copy(p1);
      lineA.rotation.x = Math.PI / 2;
      root.add(lineA);

      if (showLabels) {
        const lblA = createTextSprite(
          'a = (Q) ∩ (R) //',
          '#00e5ff',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#00e5ff'
        );
        lblA.position.set(0, 2.7, 4.6);
        root.add(lblA);
      }
    }

    // Step 2: line b = (P) ∩ (Q) at bottom-left vertex p2 (Rose / Ruby Neon)
    if (scene4Step >= 2) {
      const lineB = createInfiniteLine(13, 0.065, 0xf43f5e, 0xe11d48);
      lineB.position.copy(p2);
      lineB.rotation.x = Math.PI / 2;
      root.add(lineB);

      if (showLabels) {
        const lblB = createTextSprite(
          'b = (P) ∩ (Q) //',
          '#fb7185',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#fb7185'
        );
        lblB.position.set(-2.5, -1.4, 4.6);
        root.add(lblB);
      }
    }

    // Step 3: line c = (R) ∩ (P) at bottom-right vertex p3 (Amber / Gold Neon)
    if (scene4Step >= 3) {
      const lineC = createInfiniteLine(13, 0.065, 0xfbbf24, 0xd97706);
      lineC.position.copy(p3);
      lineC.rotation.x = Math.PI / 2;
      root.add(lineC);

      if (showLabels) {
        const lblC = createTextSprite(
          'c = (R) ∩ (P) //',
          '#fde047',
          'rgba(15, 23, 42, 0.9)',
          32,
          10,
          '#fde047'
        );
        lblC.position.set(2.5, -1.4, 4.6);
        root.add(lblC);
      }
    }

    // Step 4: Parallel relation visual lines connecting them
    if (scene4Step >= 4) {
      const triGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p1.x, p1.y, 3.5),
        new THREE.Vector3(p2.x, p2.y, 3.5),
        new THREE.Vector3(p3.x, p3.y, 3.5),
        new THREE.Vector3(p1.x, p1.y, 3.5),
      ]);
      const triMat = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        linewidth: 2,
        transparent: true,
        opacity: 0.7,
      });
      const tri = new THREE.Line(triGeo, triMat);
      root.add(tri);
    }
  };

  // SCENE 5: Real World 1 - Architectural Door Frame
  const buildScene5 = (root: THREE.Group) => {
    // Outer Door Frame
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.3,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      transmission: 0.9,
      opacity: 0.25,
      transparent: true,
      roughness: 0.05,
    });

    // Glass panel
    const glassGeo = new THREE.BoxGeometry(4.8, 7.2, 0.04);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    root.add(glass);

    // Frame Borders
    const createBeam = (w: number, h: number, d: number, pos: [number, number, number]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
      m.position.set(...pos);
      root.add(m);
    };
    createBeam(0.2, 7.4, 0.3, [-2.5, 0, 0]); // Left post
    createBeam(0.2, 7.4, 0.3, [2.5, 0, 0]); // Right post
    createBeam(5.2, 0.2, 0.3, [0, 3.7, 0]); // Top lintel
    createBeam(5.2, 0.2, 0.3, [0, -3.7, 0]); // Bottom threshold

    // 5 vertical mullion bars that the student can select
    // Positions: -1.6, -0.8, 0, 0.8, 1.6
    const barXPositions = [-1.6, -0.8, 0, 0.8, 1.6];
    barXPositions.forEach((x, index) => {
      const isSelected = scene5SelectedBars.includes(index);
      const barColor = isSelected ? 0x10b981 : 0x94a3b8;
      const barGeo = new THREE.CylinderGeometry(0.06, 0.06, 7.2, 16);
      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: isSelected ? 0x10b981 : 0x000000,
        emissiveIntensity: isSelected ? 0.7 : 0,
        metalness: 0.7,
        roughness: 0.2,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(x, 0, 0);
      bar.userData = { barId: index };
      root.add(bar);

      // Visual indicator label above bar
      if (showLabels) {
        const lbl = createTextSprite(
          `Thanh ${index + 1}`,
          isSelected ? '#10b981' : '#cbd5e1',
          isSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(15, 23, 42, 0.75)',
          24
        );
        lbl.position.set(x, 4.2, 0);
        root.add(lbl);
      }
    });

    // If two vertical bars are selected: show plane spanning between them
    if (scene5SelectedBars.length >= 2) {
      const x1 = barXPositions[scene5SelectedBars[0]];
      const x2 = barXPositions[scene5SelectedBars[1]];
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const spanWidth = maxX - minX;
      const spanMid = (minX + maxX) / 2;

      const spanGeo = new THREE.PlaneGeometry(spanWidth, 7.2);
      const spanMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const spanPlane = new THREE.Mesh(spanGeo, spanMat);
      spanPlane.position.set(spanMid, 0, 0.02);
      root.add(spanPlane);
    }
  };

  // SCENE 6: Real World 2 - 3D Steel Space Truss (Bridge / Roof Lattice)
  const buildScene6 = (root: THREE.Group) => {
    // 3D Space Truss with Top Chord, Bottom Chord, and Diagonal Web members
    const nodeColor = 0x64748b;
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.3,
    });

    // Helper to draw a tubular strut between two 3D points
    const drawStrut = (
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      color: number = 0x475569,
      emissive?: number,
      thickness: number = 0.05
    ) => {
      const dist = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const geo = new THREE.CylinderGeometry(thickness, thickness, dist, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: emissive || 0x000000,
        emissiveIntensity: emissive ? 0.6 : 0,
        metalness: 0.6,
        roughness: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        p2.clone().sub(p1).normalize()
      );
      root.add(mesh);
    };

    // Truss nodes
    // Top deck: 4 nodes at y = 1.5, z = -1.2, x = -4.5, -1.5, 1.5, 4.5
    // Top deck front: 4 nodes at y = 1.5, z = 1.2
    // Bottom deck: 4 nodes at y = -1.5, z = 0
    const topBack = [-4.5, -1.5, 1.5, 4.5].map((x) => new THREE.Vector3(x, 1.5, -1.2));
    const topFront = [-4.5, -1.5, 1.5, 4.5].map((x) => new THREE.Vector3(x, 1.5, 1.2));
    const bottomMid = [-3.0, 0, 3.0].map((x) => new THREE.Vector3(x, -1.5, 0));

    // Longitudinal top chords
    const isPairA = scene6ActivePair === 'pairA';
    const isPairB = scene6ActivePair === 'pairB';

    // Pair A: Upper parallel longitudinal chords
    // Chord 1: topBack[0] to topBack[3]
    drawStrut(
      topBack[0],
      topBack[3],
      isPairA ? 0x10b981 : 0x64748b,
      isPairA ? 0x10b981 : 0,
      isPairA ? 0.09 : 0.05
    );
    // Chord 2: topFront[0] to topFront[3]
    drawStrut(
      topFront[0],
      topFront[3],
      isPairA ? 0x10b981 : 0x64748b,
      isPairA ? 0x10b981 : 0,
      isPairA ? 0.09 : 0.05
    );

    // Web diagonal bracing members
    for (let i = 0; i < 3; i++) {
      drawStrut(topBack[i], topFront[i], 0x475569);
      drawStrut(topBack[i], bottomMid[i], 0x475569);
      drawStrut(topFront[i], bottomMid[i], 0x475569);
      drawStrut(bottomMid[i], topBack[i + 1], 0x475569);
      drawStrut(bottomMid[i], topFront[i + 1], 0x475569);
    }
    drawStrut(topBack[3], topFront[3], 0x475569);

    // Pair B: Skew lines!
    // Line 1: Top chord (topBack[0] to topBack[3])
    // Line 2: Diagonal strut connecting bottomMid[0] to topFront[1]
    if (isPairB) {
      drawStrut(topBack[0], topBack[3], 0xf59e0b, 0xf59e0b, 0.09);
      drawStrut(bottomMid[0], topFront[1], 0xf59e0b, 0xf59e0b, 0.09);

      // Draw vertical projection gap line demonstrating 3D height distance!
      const dropLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.5, 1.5, -1.2),
        new THREE.Vector3(-1.5, -0.7, 0.6),
      ]);
      const dropLineMat = new THREE.LineDashedMaterial({
        color: 0xef4444,
        dashSize: 0.15,
        gapSize: 0.1,
      });
      const drop = new THREE.Line(dropLineGeo, dropLineMat);
      drop.computeLineDistances();
      root.add(drop);
    }

    if (showLabels) {
      if (isPairA) {
        const lbl1 = createTextSprite(
          'Thanh biên trên 1 //',
          '#10b981',
          'rgba(16, 185, 129, 0.3)'
        );
        lbl1.position.set(0, 2.1, -1.2);
        root.add(lbl1);

        const lbl2 = createTextSprite(
          'Thanh biên trên 2 //',
          '#10b981',
          'rgba(16, 185, 129, 0.3)'
        );
        lbl2.position.set(0, 2.1, 1.2);
        root.add(lbl2);
      } else {
        const lbl1 = createTextSprite(
          'Thanh dầm trên (Tầng +1.5m)',
          '#f59e0b',
          'rgba(245, 158, 11, 0.3)'
        );
        lbl1.position.set(0, 2.1, -1.2);
        root.add(lbl1);

        const lbl2 = createTextSprite(
          'Thanh giằng chéo (Tầng dưới)',
          '#f59e0b',
          'rgba(245, 158, 11, 0.3)'
        );
        lbl2.position.set(-1.0, 0.1, 0.6);
        root.add(lbl2);
      }
    }
  };

  // SCENE 7: Real World 3 - Three Planes (Apex Concurrence vs Prism Parallel)
  const buildScene7 = (root: THREE.Group) => {
    const alpha = scene7Abstraction; // 0 = realistic building, 1 = pure math planes

    if (scene7Mode === 'apex') {
      // Modern architectural triangular pyramid pavilion / roof meeting at top apex O
      const apex = new THREE.Vector3(0, 3.2, 0);
      const b1 = new THREE.Vector3(-2.8, -1.2, -1.8);
      const b2 = new THREE.Vector3(2.8, -1.2, -1.8);
      const b3 = new THREE.Vector3(0, -1.2, 2.6);

      // Realistic Roof Mesh (wooden/metallic slats)
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.5,
        roughness: 0.4,
        transparent: true,
        opacity: Math.max(0.15, 1 - alpha * 0.8),
      });

      const makeTriangle = (v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3) => {
        const geo = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          v1.x,
          v1.y,
          v1.z,
          v2.x,
          v2.y,
          v2.z,
          v3.x,
          v3.y,
          v3.z,
        ]);
        geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        return new THREE.Mesh(geo, roofMat);
      };

      root.add(makeTriangle(apex, b1, b2));
      root.add(makeTriangle(apex, b2, b3));
      root.add(makeTriangle(apex, b3, b1));

      // Mathematical intersection lines (emerging as alpha increases)
      const lineA = createInfiniteLine(10, 0.05, 0x38bdf8, 0x0284c7);
      lineA.position.copy(apex);
      lineA.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b1.clone().sub(apex).normalize()
      );
      root.add(lineA);

      const lineB = createInfiniteLine(10, 0.05, 0xa78bfa, 0x7c3aed);
      lineB.position.copy(apex);
      lineB.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b2.clone().sub(apex).normalize()
      );
      root.add(lineB);

      const lineC = createInfiniteLine(10, 0.05, 0xfbbf24, 0xd97706);
      lineC.position.copy(apex);
      lineC.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b3.clone().sub(apex).normalize()
      );
      root.add(lineC);

      // Apex point marker
      const ptO = createPointMarker(0x10b981, 0.25, true);
      ptO.position.copy(apex);
      root.add(ptO);

      if (showLabels) {
        const lblO = createTextSprite(
          alpha > 0.5 ? 'Đỉnh chung O (Đồng quy)' : 'Đỉnh nóc công trình O',
          '#10b981',
          'rgba(15, 23, 42, 0.85)'
        );
        lblO.position.set(0, 3.8, 0);
        root.add(lblO);
      }
    } else {
      // Prism: A-frame roof / triangular tent pavilion
      // Ridge line along Z: from (0, 2, -4) to (0, 2, 4)
      // Left eve: (-2.5, -1.2, -4) to (-2.5, -1.2, 4)
      // Right eve: (2.5, -1.2, -4) to (2.5, -1.2, 4)
      const rTop = new THREE.Vector3(0, 2.2, 0);
      const rLeft = new THREE.Vector3(-2.4, -1.2, 0);
      const rRight = new THREE.Vector3(2.4, -1.2, 0);

      // Three planes: Sloped roof Left, Sloped roof Right, Floor
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        transparent: true,
        opacity: Math.max(0.18, 1 - alpha * 0.75),
        side: THREE.DoubleSide,
      });

      // Roof left
      const roofLeft = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 9), roofMat);
      roofLeft.position.set(-1.2, 0.5, 0);
      roofLeft.rotation.z = Math.PI / 3.4;
      roofLeft.rotation.y = Math.PI / 2;
      root.add(roofLeft);

      // Roof right
      const roofRight = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 9), roofMat);
      roofRight.position.set(1.2, 0.5, 0);
      roofRight.rotation.z = -Math.PI / 3.4;
      roofRight.rotation.y = Math.PI / 2;
      root.add(roofRight);

      // Floor
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 9), roofMat);
      floor.position.set(0, -1.2, 0);
      floor.rotation.x = Math.PI / 2;
      root.add(floor);

      // 3 Intersection lines: a (ridge), b (left ground eve), c (right ground eve)
      const lineA = createInfiniteLine(12, 0.05, 0x10b981, 0x059669);
      lineA.position.copy(rTop);
      lineA.rotation.x = Math.PI / 2;
      root.add(lineA);

      const lineB = createInfiniteLine(12, 0.05, 0x38bdf8, 0x0284c7);
      lineB.position.copy(rLeft);
      lineB.rotation.x = Math.PI / 2;
      root.add(lineB);

      const lineC = createInfiniteLine(12, 0.05, 0xfbbf24, 0xd97706);
      lineC.position.copy(rRight);
      lineC.rotation.x = Math.PI / 2;
      root.add(lineC);

      if (showLabels) {
        const lblA = createTextSprite(
          alpha > 0.5 ? 'Giao tuyến a (Đôi một song song)' : 'Đường nóc mái A //',
          '#10b981',
          'rgba(16, 185, 129, 0.3)'
        );
        lblA.position.set(0, 2.7, 3.5);
        root.add(lblA);
      }
    }
  };

  // SUMMARY SCENE: 3D interactive conceptual tree
  const buildSummaryScene = (root: THREE.Group) => {
    // Left cluster: Hai đường thẳng trong không gian
    // Center-left: Đồng phẳng (Cắt nhau, Song song)
    // Far-left: Không đồng phẳng (Chéo nhau)
    // Right cluster: Ba giao tuyến của 3 mặt phẳng (Đồng quy, Đôi một song song)

    // Node 1: Hai đường thẳng (Left)
    const nodeA = createPointMarker(0x38bdf8, 0.35, true);
    nodeA.position.set(-3.5, 1.8, 0);
    root.add(nodeA);

    // Branch 1: Cắt nhau
    const sub1 = createPointMarker(0xef4444, 0.22, true);
    sub1.position.set(-5.5, 0.2, 0);
    root.add(sub1);

    // Branch 2: Song song (highlighted golden)
    const sub2 = createPointMarker(0x10b981, 0.3, true);
    sub2.position.set(-3.5, 0.2, 0);
    root.add(sub2);

    // Branch 3: Chéo nhau
    const sub3 = createPointMarker(0xf59e0b, 0.22, true);
    sub3.position.set(-1.5, 0.2, 0);
    root.add(sub3);

    // Node 2: Ba mặt phẳng & 3 giao tuyến (Right)
    const nodeB = createPointMarker(0xa855f7, 0.35, true);
    nodeB.position.set(3.5, 1.8, 0);
    root.add(nodeB);

    // Branch Right 1: Đồng quy
    const sub4 = createPointMarker(0x06b6d4, 0.28, true);
    sub4.position.set(2.0, 0.2, 0);
    root.add(sub4);

    // Branch Right 2: Đôi một song song
    const sub5 = createPointMarker(0x10b981, 0.28, true);
    sub5.position.set(5.0, 0.2, 0);
    root.add(sub5);

    // Connecting structural lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x475569,
      linewidth: 2,
    });
    const pts = [
      new THREE.Vector3(-3.5, 1.8, 0),
      new THREE.Vector3(-5.5, 0.2, 0),
      new THREE.Vector3(-3.5, 1.8, 0),
      new THREE.Vector3(-3.5, 0.2, 0),
      new THREE.Vector3(-3.5, 1.8, 0),
      new THREE.Vector3(-1.5, 0.2, 0),

      new THREE.Vector3(3.5, 1.8, 0),
      new THREE.Vector3(2.0, 0.2, 0),
      new THREE.Vector3(3.5, 1.8, 0),
      new THREE.Vector3(5.0, 0.2, 0),
    ];
    const connGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const connMesh = new THREE.LineSegments(connGeo, lineMat);
    root.add(connMesh);

    if (showLabels) {
      const l1 = createTextSprite('Hai đường thẳng', '#38bdf8', 'rgba(15, 23, 42, 0.85)', 30);
      l1.position.set(-3.5, 2.4, 0);
      root.add(l1);

      const lC = createTextSprite('Cắt nhau (1 điểm chung)', '#f87171', 'rgba(15, 23, 42, 0.8)');
      lC.position.set(-5.5, -0.4, 0);
      root.add(lC);

      const lS = createTextSprite(
        'Song song: Đồng phẳng + 0 điểm chung',
        '#10b981',
        'rgba(16, 185, 129, 0.25)',
        28
      );
      lS.position.set(-3.5, -0.7, 0);
      root.add(lS);

      const lX = createTextSprite(
        'Chéo nhau: Không đồng phẳng',
        '#fbbf24',
        'rgba(15, 23, 42, 0.8)'
      );
      lX.position.set(-1.5, -0.4, 0);
      root.add(lX);

      const l2 = createTextSprite('Ba giao tuyến phân biệt', '#c084fc', 'rgba(15, 23, 42, 0.85)', 30);
      l2.position.set(3.5, 2.4, 0);
      root.add(l2);

      const lDQ = createTextSprite('Hoặc: Đồng quy tại 1 điểm', '#38bdf8', 'rgba(15, 23, 42, 0.8)');
      lDQ.position.set(2.0, -0.4, 0);
      root.add(lDQ);

      const lSS = createTextSprite('Hoặc: Đôi một song song', '#10b981', 'rgba(16, 185, 129, 0.25)', 28);
      lSS.position.set(5.0, -0.4, 0);
      root.add(lSS);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};
