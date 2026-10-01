import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Layers } from 'lucide-react';
import { SceneId } from '../../types/simulation';

interface HeaderProps {
  currentScene: SceneId;
  onSceneChange: (scene: SceneId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetCamera: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScene,
  onSceneChange,
  soundEnabled,
  onToggleSound,
  onResetCamera,
  onOpenHelp,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0a0e17]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <span>Không Gian 3D</span>
        </span>
        <span className="hidden sm:inline-block text-xs text-slate-400 pl-2 border-l border-slate-700/80">
          Hai Đường Thẳng Song Song Trong Không Gian
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => onSceneChange('scene1_relative_positions')}
          className={`hover:text-white transition-colors pb-0.5 border-b-2 ${
            currentScene === 'scene1_relative_positions'
              ? 'text-sky-400 border-sky-400 font-semibold'
              : 'border-transparent text-slate-400'
          }`}
        >
          Vị trí tương đối
        </button>
        <button
          onClick={() => onSceneChange('scene2_parallel_property')}
          className={`hover:text-white transition-colors pb-0.5 border-b-2 ${
            currentScene === 'scene2_parallel_property'
              ? 'text-sky-400 border-sky-400 font-semibold'
              : 'border-transparent text-slate-400'
          }`}
        >
          Tính chất qua điểm M
        </button>
        <button
          onClick={() => onSceneChange('scene3_concurrence')}
          className={`hover:text-white transition-colors pb-0.5 border-b-2 ${
            currentScene === 'scene3_concurrence' || currentScene === 'scene4_parallel_planes'
              ? 'text-sky-400 border-sky-400 font-semibold'
              : 'border-transparent text-slate-400'
          }`}
        >
          Định lí ba giao tuyến
        </button>
        <button
          onClick={() => onSceneChange('scene5_real_door')}
          className={`hover:text-white transition-colors pb-0.5 border-b-2 ${
            ['scene5_real_door', 'scene6_real_truss', 'scene7_real_planes'].includes(currentScene)
              ? 'text-sky-400 border-sky-400 font-semibold'
              : 'border-transparent text-slate-400'
          }`}
        >
          Ứng dụng thực tế
        </button>
        <button
          onClick={() => onSceneChange('summary')}
          className={`hover:text-white transition-colors pb-0.5 border-b-2 ${
            currentScene === 'summary'
              ? 'text-sky-400 border-sky-400 font-semibold'
              : 'border-transparent text-slate-400'
          }`}
        >
          Bản đồ tổng kết
        </button>
      </nav>

      {/* Zone 3: Primary Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetCamera}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
          title="Khôi phục góc nhìn camera ban đầu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Khôi phục góc nhìn</span>
        </button>

        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-800/80 text-sky-400 border-slate-700'
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
          title={soundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'}
          aria-label="Âm thanh"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors"
          title="Hướng dẫn tương tác 3D"
          aria-label="Hướng dẫn"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
