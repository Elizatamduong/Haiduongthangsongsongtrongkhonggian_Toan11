import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Eye,
  EyeOff,
  Layers,
  Columns,
  Split,
  Maximize2,
  Compass,
} from 'lucide-react';
import { CameraPreset, SceneId } from '../../types/simulation';

interface BottomControlsProps {
  sceneId: SceneId;
  cameraPreset: CameraPreset;
  onSetCameraPreset: (preset: CameraPreset) => void;
  showPlanes: boolean;
  onTogglePlanes: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onOpenComparison?: () => void;
  // Scene 3 exploded
  isExploded?: boolean;
  onToggleExplode?: () => void;
  // Scene 6 tricky angle
  onTrickyAngle?: () => void;
  onInspect3DAngle?: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  sceneId,
  cameraPreset,
  onSetCameraPreset,
  showPlanes,
  onTogglePlanes,
  showLabels,
  onToggleLabels,
  isAutoRotating,
  onToggleAutoRotate,
  onResetCamera,
  onOpenComparison,
  isExploded,
  onToggleExplode,
  onTrickyAngle,
  onInspect3DAngle,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl shadow-2xl max-w-[95%]">
      {/* Auto-rotate button: Prominently featured */}
      <button
        onClick={onToggleAutoRotate}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-md ${
          isAutoRotating
            ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/40'
            : 'bg-sky-500/15 text-sky-300 border-sky-500/35 hover:bg-sky-500/25 hover:text-white'
        }`}
        title={isAutoRotating ? 'Dừng quay mô hình 3D' : 'Bật tự động quay mô hình 360°'}
      >
        <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span>{isAutoRotating ? 'Đang quay 360° (Dừng)' : 'Quay mô hình'}</span>
      </button>

      <div className="h-5 w-px bg-slate-700/80 mx-0.5 hidden sm:block" />

      {/* Camera angle presets */}
      <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
        <button
          onClick={() => onSetCameraPreset('perspective')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraPreset === 'perspective'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Góc nhìn phối cảnh ba phần tư"
        >
          Phối cảnh 3/4
        </button>
        <button
          onClick={() => onSetCameraPreset('top')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraPreset === 'top'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Nhìn thẳng từ trên xuống"
        >
          Từ trên xuống
        </button>
        <button
          onClick={() => onSetCameraPreset('front')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraPreset === 'front'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Nhìn trực diện từ mặt trước"
        >
          Mặt trước
        </button>
        <button
          onClick={() => onSetCameraPreset('side')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraPreset === 'side'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Nhìn từ mặt bên"
        >
          Mặt bên
        </button>
      </div>

      <div className="h-5 w-px bg-slate-700/80 mx-0.5 hidden sm:block" />

      {/* Plane toggle */}
      <button
        onClick={onTogglePlanes}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
          showPlanes
            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}
        title={showPlanes ? 'Ẩn các mặt phẳng acrylic' : 'Bật các mặt phẳng acrylic'}
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{showPlanes ? 'Ẩn mặt phẳng' : 'Bật mặt phẳng'}</span>
      </button>

      {/* Label toggle */}
      <button
        onClick={onToggleLabels}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
          showLabels
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}
        title={showLabels ? 'Ẩn nhãn và kí hiệu toán học' : 'Bật nhãn toán học'}
      >
        {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{showLabels ? 'Ẩn nhãn' : 'Bật nhãn'}</span>
      </button>

      {/* Context-sensitive actions */}
      {/* 1. Comparison button for Scene 1 & Scene 4 */}
      {(sceneId === 'scene1_relative_positions' || sceneId === 'scene4_parallel_planes') &&
        onOpenComparison && (
          <button
            onClick={onOpenComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors shadow-sm"
            title="Mở màn hình so sánh 3D song song"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>So sánh 3D</span>
          </button>
        )}

      {/* 2. Explode / Assemble for Scene 3 */}
      {sceneId === 'scene3_concurrence' && onToggleExplode && (
        <button
          onClick={onToggleExplode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
            isExploded
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title={isExploded ? 'Ghép lại các mặt phẳng' : 'Tách rời các mặt phẳng để nhìn rõ giao tuyến'}
        >
          <Split className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Ghép lại' : 'Tách mặt phẳng'}</span>
        </button>
      )}

      {/* 3. Scene 6 Tricky Angle & 3D inspection */}
      {sceneId === 'scene6_real_truss' && (
        <div className="flex items-center gap-1">
          {onTrickyAngle && (
            <button
              onClick={onTrickyAngle}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
              title="Góc nhìn 2D gây hiểu nhầm giao nhau hoặc song song"
            >
              Góc chiếu 2D (Đánh lừa)
            </button>
          )}
          {onInspect3DAngle && (
            <button
              onClick={onInspect3DAngle}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
              title="Xoay sang góc nhìn thấy rõ khoảng cách 3D"
            >
              Xoay kiểm chứng 3D
            </button>
          )}
        </div>
      )}

      {/* Reset Camera */}
      <button
        onClick={onResetCamera}
        className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
        title="Khôi phục góc nhìn mặc định"
        aria-label="Khôi phục"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
