import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { SceneId, CameraPreset, Scene1State } from './types/simulation';
import { sounds } from './utils/audio';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';
import { BottomControls } from './components/layout/BottomControls';
import { PedagogyPanel } from './components/layout/PedagogyPanel';
import { ThreeScene } from './components/3d/ThreeScene';
import { ComparisonModal } from './components/3d/ComparisonModal';
import { HelpModal } from './components/layout/HelpModal';

export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>('intro');
  const [visitedScenes, setVisitedScenes] = useState<Set<SceneId>>(new Set(['intro']));
  const [showPlanes, setShowPlanes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonType, setComparisonType] = useState<
    'parallel_vs_skew' | 'concurrence_vs_parallel'
  >('parallel_vs_skew');

  // Scene 1: Relative positions state
  const [scene1Angle, setScene1Angle] = useState(0); // 0 = parallel direction
  const [scene1Elevation, setScene1Elevation] = useState(0); // 0 = coplanar
  const [scene1Distance, setScene1Distance] = useState(2.2);
  const [scene1Status, setScene1Status] = useState<{
    type: 'intersecting' | 'parallel' | 'skew';
    intersectionPoint?: [number, number, number];
    isCoplanar: boolean;
  }>({
    type: 'parallel',
    isCoplanar: true,
  });

  // Scene 2: Parallel property through point M
  const [scene2Angle, setScene2Angle] = useState(25);
  const [isScene2Snapped, setIsScene2Snapped] = useState(false);

  // Scene 3: Concurrence
  const [scene3Step, setScene3Step] = useState(1);
  const [scene3Exploded, setScene3Exploded] = useState(0); // 0 to 1

  // Scene 4: Parallel planes
  const [scene4Step, setScene4Step] = useState(1);

  // Scene 5: Real Door
  const [scene5SelectedBars, setScene5SelectedBars] = useState<number[]>([1, 3]);

  // Scene 6: Real Truss
  const [scene6ActivePair, setScene6ActivePair] = useState<'pairA' | 'pairB'>('pairA');

  // Scene 7: Real Planes
  const [scene7Mode, setScene7Mode] = useState<'apex' | 'prism'>('apex');
  const [scene7Abstraction, setScene7Abstraction] = useState(0.2);

  // Track visited scenes
  useEffect(() => {
    setVisitedScenes((prev) => new Set([...prev, currentScene]));
  }, [currentScene]);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  // Reset Camera
  const handleResetCamera = () => {
    setCameraPreset('perspective');
  };

  // Scene navigation
  const sceneOrder: SceneId[] = [
    'intro',
    'scene1_relative_positions',
    'scene2_parallel_property',
    'scene3_concurrence',
    'scene4_parallel_planes',
    'scene5_real_door',
    'scene6_real_truss',
    'scene7_real_planes',
    'summary',
  ];

  const handleNextScene = () => {
    const idx = sceneOrder.indexOf(currentScene);
    if (idx < sceneOrder.length - 1) {
      sounds.playClick();
      setCurrentScene(sceneOrder[idx + 1]);
    }
  };

  // Scene 1 preset handlers
  const handleSetScene1Preset = (preset: Scene1State) => {
    sounds.playClick();
    if (preset === 'intersecting') {
      setScene1Angle(35);
      setScene1Elevation(0);
      setScene1Distance(1.8);
    } else if (preset === 'parallel') {
      setScene1Angle(0);
      setScene1Elevation(0);
      setScene1Distance(2.2);
    } else if (preset === 'skew') {
      setScene1Angle(45);
      setScene1Elevation(2.0);
      setScene1Distance(2.0);
    }
  };

  // Scene 2 Angle Change
  const handleScene2AngleChange = (angle: number) => {
    setScene2Angle(angle);
    if (Math.abs(angle) < 2.5) {
      if (!isScene2Snapped) {
        sounds.playSnap();
        setIsScene2Snapped(true);
      }
    } else {
      if (isScene2Snapped) {
        setIsScene2Snapped(false);
      }
    }
  };

  const handleScene2Snap = () => {
    sounds.playSnap();
    setScene2Angle(0);
    setIsScene2Snapped(true);
  };

  const handleScene2TryAnother = () => {
    sounds.playClick();
    setScene2Angle(35);
    setIsScene2Snapped(false);
  };

  // Scene 5 select bar toggle
  const handleScene5SelectBar = (id: number) => {
    setScene5SelectedBars((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  // Open comparison modal
  const handleOpenComparison = () => {
    if (currentScene === 'scene1_relative_positions') {
      setComparisonType('parallel_vs_skew');
    } else {
      setComparisonType('concurrence_vs_parallel');
    }
    setIsComparisonOpen(true);
  };

  // Toggle auto-rotation of model
  const handleToggleAutoRotate = () => {
    sounds.playClick();
    setIsAutoRotating((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0e17] text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        currentScene={currentScene}
        onSceneChange={setCurrentScene}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetCamera={handleResetCamera}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar Roadmap */}
        <SidebarNav
          currentScene={currentScene}
          onSelectScene={setCurrentScene}
          visitedScenes={visitedScenes}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center 3D Viewport */}
        <main className="flex-1 h-full relative overflow-hidden bg-[#070b12]">
          {/* Top-right Quick Rotate Canvas Button */}
          <button
            onClick={handleToggleAutoRotate}
            className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xl transition-all cursor-pointer ${
              isAutoRotating
                ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/40 shadow-sky-500/20'
                : 'bg-slate-900/85 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white'
            }`}
            title={isAutoRotating ? 'Dừng tự động quay' : 'Bật tự động quay mô hình 360°'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>{isAutoRotating ? 'Đang quay mô hình (Dừng)' : 'Quay mô hình 360°'}</span>
          </button>

          <ThreeScene
            sceneId={currentScene}
            showPlanes={showPlanes}
            showLabels={showLabels}
            cameraPreset={cameraPreset}
            onCameraPresetHandled={() => {}}
            isAutoRotating={isAutoRotating}
            // Scene 1
            scene1Angle={scene1Angle}
            scene1Elevation={scene1Elevation}
            scene1Distance={scene1Distance}
            onScene1StatusChange={setScene1Status}
            // Scene 2
            scene2Angle={scene2Angle}
            isScene2Snapped={isScene2Snapped}
            // Scene 3
            scene3Step={scene3Step}
            scene3Exploded={scene3Exploded}
            // Scene 4
            scene4Step={scene4Step}
            // Scene 5
            scene5SelectedBars={scene5SelectedBars}
            onSelectBar={handleScene5SelectBar}
            // Scene 6
            scene6ActivePair={scene6ActivePair}
            // Scene 7
            scene7Mode={scene7Mode}
            scene7Abstraction={scene7Abstraction}
          />

          {/* Bottom Floating 3D Controls */}
          <BottomControls
            sceneId={currentScene}
            cameraPreset={cameraPreset}
            onSetCameraPreset={setCameraPreset}
            showPlanes={showPlanes}
            onTogglePlanes={() => setShowPlanes(!showPlanes)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={handleToggleAutoRotate}
            onResetCamera={handleResetCamera}
            onOpenComparison={
              currentScene === 'scene1_relative_positions' ||
              currentScene === 'scene4_parallel_planes'
                ? handleOpenComparison
                : undefined
            }
            // Scene 3 Explode
            isExploded={scene3Exploded > 0.1}
            onToggleExplode={() => {
              sounds.playClick();
              setScene3Exploded(scene3Exploded > 0.1 ? 0 : 0.8);
            }}
            // Scene 6 Angles
            onTrickyAngle={() => {
              // Top-down / flat tricky view where lines overlap
              setCameraPreset('front');
            }}
            onInspect3DAngle={() => {
              // 3D perspective to see height gap
              setCameraPreset('perspective');
            }}
          />
        </main>

        {/* Right Pedagogical Guidance & Interactions */}
        <PedagogyPanel
          sceneId={currentScene}
          onNextScene={handleNextScene}
          // Scene 1
          scene1Angle={scene1Angle}
          onScene1AngleChange={setScene1Angle}
          scene1Elevation={scene1Elevation}
          onScene1ElevationChange={setScene1Elevation}
          scene1Distance={scene1Distance}
          onScene1DistanceChange={setScene1Distance}
          onSetScene1Preset={handleSetScene1Preset}
          scene1Status={scene1Status}
          onOpenComparison={handleOpenComparison}
          // Scene 2
          scene2Angle={scene2Angle}
          onScene2AngleChange={handleScene2AngleChange}
          isScene2Snapped={isScene2Snapped}
          onScene2Snap={handleScene2Snap}
          onScene2TryAnother={handleScene2TryAnother}
          // Scene 3
          scene3Step={scene3Step}
          onScene3StepChange={setScene3Step}
          // Scene 4
          scene4Step={scene4Step}
          onScene4StepChange={setScene4Step}
          // Scene 5
          scene5SelectedBars={scene5SelectedBars}
          onScene5SelectBar={handleScene5SelectBar}
          // Scene 6
          scene6ActivePair={scene6ActivePair}
          onScene6SelectPair={setScene6ActivePair}
          // Scene 7
          scene7Mode={scene7Mode}
          onScene7ModeChange={setScene7Mode}
          scene7Abstraction={scene7Abstraction}
          onScene7AbstractionChange={setScene7Abstraction}
        />
      </div>

      {/* Side-by-side 3D Comparison Modal */}
      <ComparisonModal
        type={comparisonType}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
