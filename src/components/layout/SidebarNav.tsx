import React from 'react';
import {
  Compass,
  GitCommit,
  Crosshair,
  Share2,
  Maximize2,
  Building,
  Box,
  Home,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SceneId } from '../../types/simulation';

interface SidebarNavProps {
  currentScene: SceneId;
  onSelectScene: (id: SceneId) => void;
  visitedScenes: Set<SceneId>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface SceneItem {
  id: SceneId;
  index: string;
  title: string;
  category: string;
  icon: React.ElementType;
}

const SCENE_ITEMS: SceneItem[] = [
  {
    id: 'intro',
    index: '00',
    title: 'Khơi gợi hứng thú',
    category: 'Mở đầu',
    icon: Compass,
  },
  {
    id: 'scene1_relative_positions',
    index: '01',
    title: 'Vị trí tương đối',
    category: 'Hình học 3D',
    icon: GitCommit,
  },
  {
    id: 'scene2_parallel_property',
    index: '02',
    title: 'Tính chất qua điểm M',
    category: 'Tiên đề Euclid 3D',
    icon: Crosshair,
  },
  {
    id: 'scene3_concurrence',
    index: '03',
    title: 'Ba giao tuyến đồng quy',
    category: 'Định lí 3 mặt phẳng',
    icon: Share2,
  },
  {
    id: 'scene4_parallel_planes',
    index: '04',
    title: 'Ba giao tuyến song song',
    category: 'Định lí 3 mặt phẳng',
    icon: Maximize2,
  },
  {
    id: 'scene5_real_door',
    index: '05',
    title: 'Khung cửa hiện đại',
    category: 'Vận dụng thực tế',
    icon: Building,
  },
  {
    id: 'scene6_real_truss',
    index: '06',
    title: 'Giàn kết cấu không gian',
    category: 'Vận dụng thực tế',
    icon: Box,
  },
  {
    id: 'scene7_real_planes',
    index: '07',
    title: 'Mái vòm & Trừu tượng hóa',
    category: 'Vận dụng thực tế',
    icon: Home,
  },
  {
    id: 'summary',
    index: '08',
    title: 'Tổng kết & Bản đồ 3D',
    category: 'Hệ thống hóa',
    icon: CheckCircle2,
  },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentScene,
  onSelectScene,
  visitedScenes,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800 bg-[#0c121e]/95 backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Top Sidebar Header */}
      <div className="h-12 border-b border-slate-800/80 px-4 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lộ trình bài học
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-auto"
          title={isCollapsed ? 'Mở rộng mục lục' : 'Thu nhỏ mục lục'}
          aria-label="Thu nhỏ / mở rộng mục lục"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {SCENE_ITEMS.map((item) => {
          const isActive = currentScene === item.id;
          const isVisited = visitedScenes.has(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectScene(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative group ${
                isActive
                  ? 'bg-sky-500/15 text-white shadow-sm border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              {/* Left active line accent */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full" />
              )}

              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 leading-tight mb-0.5">
                    <span className="font-mono">{item.index}</span>
                    <span>{item.category}</span>
                  </div>
                  <div
                    className={`text-xs font-medium truncate ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.title}
                  </div>
                </div>
              )}

              {/* Visited dot indicator */}
              {!isCollapsed && isVisited && !isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Đã hoàn thành</span>
            <span className="font-mono text-sky-400 font-semibold">
              {visitedScenes.size} / {SCENE_ITEMS.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.round((visitedScenes.size / SCENE_ITEMS.length) * 100)}%`,
              }}
            />
          </div>

          {/* Author & Copyright */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <div className="text-slate-300 font-medium">Bản quyền © Eliza Tâm Dương</div>
            <div className="text-slate-400">
              SĐT: <a href="tel:0962571826" className="text-sky-400 hover:underline font-mono">0962571826</a>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
