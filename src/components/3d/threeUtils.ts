import * as THREE from 'three';

// Create a high-res crisp canvas-based text sprite (billboard)
export function createTextSprite(
  text: string,
  color: string = '#ffffff',
  bgColor: string = 'rgba(15, 23, 42, 0.75)',
  fontSize: number = 32,
  padding: number = 10,
  borderColor?: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  const font = `600 ${fontSize}px "Plus Jakarta Sans", "STIX Two Text", sans-serif`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.2;

  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = Math.ceil(textHeight + padding * 2);

  // Re-set font after canvas resize
  ctx.font = font;
  ctx.imageSmoothingEnabled = true;

  // Background rounded rect
  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    const r = 8;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, r);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = borderColor || 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  const aspect = canvas.width / canvas.height;
  const scaleH = 0.55;
  sprite.scale.set(scaleH * aspect, scaleH, 1);
  return sprite;
}

// Create a line with dual arrowheads at ends to visually represent an infinite line
export function createInfiniteLine(
  length: number = 16,
  radius: number = 0.05,
  color: number = 0x38bdf8,
  glowColor?: number
): THREE.Group {
  const group = new THREE.Group();

  // Central line tube
  const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: glowColor ? glowColor : color,
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.2,
  });
  const cylinder = new THREE.Mesh(cylinderGeo, material);
  group.add(cylinder);

  // Arrowheads at both ends (cones)
  const coneGeo = new THREE.ConeGeometry(radius * 2.8, radius * 6, 16);
  const coneTop = new THREE.Mesh(coneGeo, material);
  coneTop.position.y = length / 2;
  group.add(coneTop);

  const coneBottom = new THREE.Mesh(coneGeo, material);
  coneBottom.position.y = -length / 2;
  coneBottom.rotation.z = Math.PI;
  group.add(coneBottom);

  return group;
}

// Create a semi-transparent acrylic plane with subtle border lines
export function createAcrylicPlane(
  width: number,
  height: number,
  color: number,
  opacity: number = 0.25,
  name?: string
): THREE.Group {
  const group = new THREE.Group();
  if (name) group.name = name;

  // Plane surface
  const planeGeo = new THREE.PlaneGeometry(width, height);
  const planeMat = new THREE.MeshPhysicalMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    roughness: 0.1,
    transmission: 0.6,
    thickness: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  group.add(plane);

  // Wireframe outline edges
  const edgesGeo = new THREE.EdgesGeometry(planeGeo);
  const edgesMat = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: Math.min(1, opacity + 0.45),
    linewidth: 2,
  });
  const outline = new THREE.LineSegments(edgesGeo, edgesMat);
  group.add(outline);

  return group;
}

// Create an intersection point sphere with gentle halo
export function createPointMarker(
  color: number = 0xf59e0b,
  radius: number = 0.18,
  glow: boolean = true
): THREE.Group {
  const group = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.5,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  if (glow) {
    const haloGeo = new THREE.SphereGeometry(radius * 1.9, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.28,
      wireframe: true,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);
  }

  return group;
}
