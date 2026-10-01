import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { X, RotateCcw, Link2, Unlink } from 'lucide-react';
import {
  createTextSprite,
  createInfiniteLine,
  createAcrylicPlane,
  createPointMarker,
} from './threeUtils';

interface ComparisonModalProps {
  type: 'parallel_vs_skew' | 'concurrence_vs_parallel';
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  type,
  isOpen,
  onClose,
}) => {
  const containerLeftRef = useRef<HTMLDivElement>(null);
  const containerRightRef = useRef<HTMLDivElement>(null);
  const [syncRotation, setSyncRotation] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const leftEl = containerLeftRef.current;
    const rightEl = containerRightRef.current;
    if (!leftEl || !rightEl) return;

    // LEFT SCENE
    const sceneL = new THREE.Scene();
    sceneL.background = new THREE.Color(0x0a0e17);
    const cameraL = new THREE.PerspectiveCamera(45, leftEl.clientWidth / leftEl.clientHeight, 0.1, 100);
    cameraL.position.set(7, 6, 9);

    const rendererL = new THREE.WebGLRenderer({ antialias: true });
    rendererL.setSize(leftEl.clientWidth, leftEl.clientHeight);
    rendererL.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    leftEl.replaceChildren(rendererL.domElement);
    const controlsL = new OrbitControls(cameraL, rendererL.domElement);
    controlsL.enableDamping = true;

    // RIGHT SCENE
    const sceneR = new THREE.Scene();
    sceneR.background = new THREE.Color(0x0a0e17);
    const cameraR = new THREE.PerspectiveCamera(45, rightEl.clientWidth / rightEl.clientHeight, 0.1, 100);
    cameraR.position.set(7, 6, 9);

    const rendererR = new THREE.WebGLRenderer({ antialias: true });
    rendererR.setSize(rightEl.clientWidth, rightEl.clientHeight);
    rendererR.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rightEl.replaceChildren(rendererR.domElement);
    const controlsR = new OrbitControls(cameraR, rendererR.domElement);
    controlsR.enableDamping = true;

    // Lights
    [sceneL, sceneR].forEach((sc) => {
      const ambient = new THREE.AmbientLight(0xcfd8dc, 0.7);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(10, 15, 10);
      sc.add(ambient, dirLight);

      const grid = new THREE.GridHelper(20, 20, 0x1e293b, 0x0f172a);
      grid.position.y = -2.5;
      grid.material.opacity = 0.4;
      grid.material.transparent = true;
      sc.add(grid);
    });

    // Populate Models
    if (type === 'parallel_vs_skew') {
      // LEFT: SONG SONG (Parallel)
      const lineA = createInfiniteLine(12, 0.05, 0x10b981, 0x059669);
      lineA.position.set(0, 1.2, 0);
      lineA.rotation.z = Math.PI / 2;
      sceneL.add(lineA);

      const lineB = createInfiniteLine(12, 0.05, 0x10b981, 0x059669);
      lineB.position.set(0, -1.2, 0);
      lineB.rotation.z = Math.PI / 2;
      sceneL.add(lineB);

      const planeL = createAcrylicPlane(14, 6, 0x10b981, 0.3);
      sceneL.add(planeL);

      const lblPlaneL = createTextSprite('Mặt phẳng chung chứa a và b', '#10b981', 'rgba(15, 23, 42, 0.85)');
      lblPlaneL.position.set(0, 2.6, 0.1);
      sceneL.add(lblPlaneL);

      // RIGHT: CHÉO NHAU (Skew)
      const lineA_R = createInfiniteLine(12, 0.05, 0x38bdf8, 0x0284c7);
      lineA_R.position.set(0, 0, 0);
      lineA_R.rotation.z = Math.PI / 2; // runs along X
      sceneR.add(lineA_R);

      const lineB_R = createInfiniteLine(12, 0.05, 0xf59e0b, 0xd97706);
      lineB_R.position.set(0, 1.8, 1.8);
      lineB_R.rotation.x = Math.PI / 3;
      sceneR.add(lineB_R);

      // Plane containing only line A
      const planeR = createAcrylicPlane(14, 6, 0x0284c7, 0.22);
      sceneR.add(planeR);

      // Connector line showing skew distance
      const connGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1.8, 1.8),
      ]);
      const connMat = new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.2, gapSize: 0.15 });
      const conn = new THREE.Line(connGeo, connMat);
      conn.computeLineDistances();
      sceneR.add(conn);

      const lblPlaneR = createTextSprite('Đường b nằm ngoài mặt phẳng chứa a', '#f59e0b', 'rgba(15, 23, 42, 0.85)');
      lblPlaneR.position.set(0, -2.2, 0.1);
      sceneR.add(lblPlaneR);
    } else {
      // CONCURRENCE VS PARALLEL PLANES
      // LEFT: Concurrence at O
      const pl1 = createAcrylicPlane(7, 7, 0x0284c7, 0.25);
      pl1.rotation.x = Math.PI / 2;
      sceneL.add(pl1);

      const pl2 = createAcrylicPlane(7, 7, 0x8b5cf6, 0.25);
      pl2.rotation.y = Math.PI / 2;
      sceneL.add(pl2);

      const pl3 = createAcrylicPlane(7, 7, 0xf59e0b, 0.25);
      pl3.rotation.x = Math.PI / 4;
      sceneL.add(pl3);

      const lA = createInfiniteLine(10, 0.06, 0x00d2ff, 0x0284c7);
      lA.rotation.x = Math.PI / 2;
      sceneL.add(lA);

      const lB = createInfiniteLine(10, 0.06, 0xf43f5e, 0xe11d48);
      lB.rotation.x = Math.PI / 4;
      sceneL.add(lB);

      const lC = createInfiniteLine(10, 0.06, 0xfbbf24, 0xd97706);
      lC.rotation.z = Math.PI / 2;
      sceneL.add(lC);

      const ptO = createPointMarker(0x10b981, 0.28, true);
      sceneL.add(ptO);

      // RIGHT: 3 Parallel lines in Prism with 3 distinct colors
      const p1 = new THREE.Vector3(0, 1.8, 0);
      const p2 = new THREE.Vector3(-1.6, -0.9, 0);
      const p3 = new THREE.Vector3(1.6, -0.9, 0);

      const lineColors = [
        { color: 0x00d2ff, emissive: 0x0284c7 },
        { color: 0xf43f5e, emissive: 0xe11d48 },
        { color: 0xfbbf24, emissive: 0xd97706 },
      ];

      [p1, p2, p3].forEach((p, idx) => {
        const line = createInfiniteLine(11, 0.06, lineColors[idx].color, lineColors[idx].emissive);
        line.position.copy(p);
        line.rotation.x = Math.PI / 2;
        sceneR.add(line);
      });

      const triGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p1.x, p1.y, 2.5),
        new THREE.Vector3(p2.x, p2.y, 2.5),
        new THREE.Vector3(p3.x, p3.y, 2.5),
        new THREE.Vector3(p1.x, p1.y, 2.5),
      ]);
      const tri = new THREE.Line(triGeo, new THREE.LineBasicMaterial({ color: 0x10b981 }));
      sceneR.add(tri);
    }

    // Animation & Synchronization
    let animId: number;
    let isUpdatingFromL = false;
    let isUpdatingFromR = false;

    controlsL.addEventListener('change', () => {
      if (syncRotation && !isUpdatingFromR) {
        isUpdatingFromL = true;
        cameraR.position.copy(cameraL.position);
        cameraR.quaternion.copy(cameraL.quaternion);
        controlsR.target.copy(controlsL.target);
        isUpdatingFromL = false;
      }
    });

    controlsR.addEventListener('change', () => {
      if (syncRotation && !isUpdatingFromL) {
        isUpdatingFromR = true;
        cameraL.position.copy(cameraR.position);
        cameraL.quaternion.copy(cameraR.quaternion);
        controlsL.target.copy(controlsR.target);
        isUpdatingFromR = false;
      }
    });

    const animate = () => {
      animId = requestAnimationFrame(animate);
      controlsL.update();
      controlsR.update();
      rendererL.render(sceneL, cameraL);
      rendererR.render(sceneR, cameraR);
    };
    animate();

    const handleResize = () => {
      if (!leftEl || !rightEl) return;
      cameraL.aspect = leftEl.clientWidth / leftEl.clientHeight;
      cameraL.updateProjectionMatrix();
      rendererL.setSize(leftEl.clientWidth, leftEl.clientHeight);

      cameraR.aspect = rightEl.clientWidth / rightEl.clientHeight;
      cameraR.updateProjectionMatrix();
      rendererR.setSize(rightEl.clientWidth, rightEl.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      rendererL.dispose();
      rendererR.dispose();
    };
  }, [isOpen, type, syncRotation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#0f172a] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              {type === 'parallel_vs_skew'
                ? 'So Sánh Trực Quan: Hai Đường Thẳng Song Song vs Chéo Nhau'
                : 'So Sánh: Ba Giao Tuyến Đồng Quy vs Đôi Một Song Song'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSyncRotation(!syncRotation)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                syncRotation
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Đồng bộ góc xoay cả hai mô hình"
            >
              {syncRotation ? <Link2 className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
              {syncRotation ? 'Đang đồng bộ góc xoay' : 'Xoay độc lập'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Canvas Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 relative">
          {/* Left Panel */}
          <div className="relative h-full flex flex-col">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3.5 py-2 shadow-lg">
              <div className="text-xs font-semibold text-emerald-400">
                {type === 'parallel_vs_skew' ? 'MÔ HÌNH A: HAI ĐƯỜNG SONG SONG' : 'TRƯỜNG HỢP 1: BA GIAO TUYẾN ĐỒNG QUY'}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {type === 'parallel_vs_skew'
                  ? 'Đồng phẳng (cùng thuộc 1 mp) + Không có điểm chung'
                  : '3 mặt phẳng cắt nhau tại điểm chung duy nhất O'}
              </div>
            </div>
            <div ref={containerLeftRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />
          </div>

          {/* Right Panel */}
          <div className="relative h-full flex flex-col">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur-sm border border-amber-500/30 rounded-lg px-3.5 py-2 shadow-lg">
              <div className="text-xs font-semibold text-amber-400">
                {type === 'parallel_vs_skew' ? 'MÔ HÌNH B: HAI ĐƯỜNG CHÉO NHAU' : 'TRƯỜNG HỢP 2: ĐÔI MỘT SONG SONG'}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {type === 'parallel_vs_skew'
                  ? 'Không đồng phẳng (không có mp nào chứa cả hai)'
                  : '3 giao tuyến song song theo phương lăng trụ'}
              </div>
            </div>
            <div ref={containerRightRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />
          </div>
        </div>

        {/* Footer Notes */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>💡 Dùng chuột trái kéo để xoay 360°, cuộn chuột để phóng to/thu nhỏ chi tiết.</span>
          <span className="text-slate-300 font-medium">
            Bản quyền: <strong className="text-sky-400">Eliza Tâm Dương</strong> · SĐT:{' '}
            <a href="tel:0962571826" className="text-sky-300 hover:underline font-mono">
              0962571826
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
