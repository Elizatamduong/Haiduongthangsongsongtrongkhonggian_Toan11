import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Info,
  Maximize2,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { SceneId, Scene1State } from '../../types/simulation';
import { sounds } from '../../utils/audio';

interface PedagogyPanelProps {
  sceneId: SceneId;
  onNextScene: () => void;
  // Scene 1
  scene1Angle: number;
  onScene1AngleChange: (val: number) => void;
  scene1Elevation: number;
  onScene1ElevationChange: (val: number) => void;
  scene1Distance: number;
  onScene1DistanceChange: (val: number) => void;
  onSetScene1Preset: (preset: Scene1State) => void;
  scene1Status?: {
    type: 'intersecting' | 'parallel' | 'skew';
    intersectionPoint?: [number, number, number];
    isCoplanar: boolean;
  };
  onOpenComparison?: () => void;
  // Scene 2
  scene2Angle: number;
  onScene2AngleChange: (val: number) => void;
  isScene2Snapped: boolean;
  onScene2Snap: () => void;
  onScene2TryAnother: () => void;
  // Scene 3
  scene3Step: number;
  onScene3StepChange: (step: number) => void;
  // Scene 4
  scene4Step: number;
  onScene4StepChange: (step: number) => void;
  // Scene 5
  scene5SelectedBars: number[];
  onScene5SelectBar: (id: number) => void;
  // Scene 6
  scene6ActivePair: 'pairA' | 'pairB';
  onScene6SelectPair: (pair: 'pairA' | 'pairB') => void;
  // Scene 7
  scene7Mode: 'apex' | 'prism';
  onScene7ModeChange: (mode: 'apex' | 'prism') => void;
  scene7Abstraction: number;
  onScene7AbstractionChange: (val: number) => void;
}

export const PedagogyPanel: React.FC<PedagogyPanelProps> = ({
  sceneId,
  onNextScene,
  scene1Angle,
  onScene1AngleChange,
  scene1Elevation,
  onScene1ElevationChange,
  scene1Distance,
  onScene1DistanceChange,
  onSetScene1Preset,
  scene1Status,
  onOpenComparison,
  scene2Angle,
  onScene2AngleChange,
  isScene2Snapped,
  onScene2Snap,
  onScene2TryAnother,
  scene3Step,
  onScene3StepChange,
  scene4Step,
  onScene4StepChange,
  scene5SelectedBars,
  onScene5SelectBar,
  scene6ActivePair,
  onScene6SelectPair,
  scene7Mode,
  onScene7ModeChange,
  scene7Abstraction,
  onScene7AbstractionChange,
}) => {
  // Local state for quizzes / hypotheses
  const [scene3Answer, setScene3Answer] = useState<string | null>(null);
  const [scene3Checked, setScene3Checked] = useState(false);

  const [scene4Answer, setScene4Answer] = useState<string | null>(null);
  const [scene4Checked, setScene4Checked] = useState(false);

  // Scene 5 reasoning checkboxes:
  const [scene5ReasonCoplanar, setScene5ReasonCoplanar] = useState(false);
  const [scene5ReasonNoCommon, setScene5ReasonNoCommon] = useState(false);
  const [scene5Checked, setScene5Checked] = useState(false);

  // Scene 6 classification quiz
  const [scene6AAnswer, setScene6AAnswer] = useState<'parallel' | 'skew' | null>(null);
  const [scene6BAnswer, setScene6BAnswer] = useState<'parallel' | 'skew' | null>(null);
  const [scene6Checked, setScene6Checked] = useState(false);

  // Summary quiz state
  const [quiz1, setQuiz1] = useState<number | null>(null);
  const [quiz2, setQuiz2] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  return (
    <aside className="w-80 sm:w-96 border-l border-slate-800 bg-[#0a0e17]/95 backdrop-blur-md flex flex-col shrink-0 z-20 overflow-hidden select-none">
      {/* Header bar */}
      <div className="h-12 border-b border-slate-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Khám phá & Bài học
          </span>
        </div>
        <button
          onClick={onNextScene}
          className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          <span>Tiếp theo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* SCENE 0: INTRO */}
        {/* ============================================================== */}
        {sceneId === 'intro' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Khởi động tư duy không gian</div>
              <h2 className="text-lg font-bold text-white mt-1">
                Hai Đường Thẳng Trong Không Gian
              </h2>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-sky-500/25 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Câu hỏi gợi mở:</div>
              <p className="text-sm font-medium text-amber-200 leading-relaxed italic">
                “Trong không gian, hai đường thẳng không có điểm chung có nhất thiết song song với nhau không?”
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Trong hình học phẳng, hai đường thẳng phân biệt không cắt nhau thì chắc chắn song song. Nhưng khi bước vào không gian 3 chiều với chiều cao và chiều sâu, liệu điều này còn đúng?
            </p>

            <button
              onClick={() => {
                sounds.playClick();
                onNextScene();
              }}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
            >
              <span>Bắt đầu khám phá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 1: RELATIVE POSITIONS */}
        {/* ============================================================== */}
        {sceneId === 'scene1_relative_positions' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Bài học 01</div>
              <h2 className="text-base font-bold text-white">Vị Trí Tương Đối Của Hai Đường Thẳng</h2>
            </div>

            {/* Quick State Switcher */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400">Thiết lập vị trí thử nghiệm:</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onSetScene1Preset('intersecting')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-colors ${
                    scene1Status?.type === 'intersecting'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Cắt nhau
                </button>
                <button
                  onClick={() => onSetScene1Preset('parallel')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-colors ${
                    scene1Status?.type === 'parallel'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Song song
                </button>
                <button
                  onClick={() => onSetScene1Preset('skew')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-colors ${
                    scene1Status?.type === 'skew'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Chéo nhau
                </button>
              </div>
            </div>

            {/* Manual Controls */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Điều chỉnh đường thẳng b</span>
              </div>

              {/* Angle */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Góc xoay so với a:</span>
                  <span className="font-mono text-slate-200">{Math.round(scene1Angle)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={scene1Angle}
                  onChange={(e) => onScene1AngleChange(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Elevation Z (coplanar vs skew) */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Độ cao nâng ra khỏi mặt phẳng (Z):</span>
                  <span className="font-mono text-slate-200">{scene1Elevation.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={scene1Elevation}
                  onChange={(e) => onScene1ElevationChange(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Distance Y */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Khoảng cách tịnh tiến (Y):</span>
                  <span className="font-mono text-slate-200">{scene1Distance.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  value={scene1Distance}
                  onChange={(e) => onScene1DistanceChange(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Status Display */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                scene1Status?.type === 'parallel'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : scene1Status?.type === 'intersecting'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                {scene1Status?.type === 'parallel' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Hai đường thẳng song song: a ∥ b</span>
                  </>
                )}
                {scene1Status?.type === 'intersecting' && (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">Hai đường thẳng cắt nhau tại điểm I</span>
                  </>
                )}
                {scene1Status?.type === 'skew' && (
                  <>
                    <Info className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Hai đường thẳng chéo nhau</span>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                {scene1Status?.type === 'parallel' && (
                  <p>
                    ✓ Cùng nằm trong mặt phẳng (P) (đồng phẳng).
                    <br />
                    ✓ Không có điểm chung nào dù kéo dài vô tận.
                  </p>
                )}
                {scene1Status?.type === 'intersecting' && (
                  <p>
                    ✓ Cùng nằm trong một mặt phẳng (P).
                    <br />
                    ✓ Có duy nhất một điểm chung I.
                  </p>
                )}
                {scene1Status?.type === 'skew' && (
                  <p>
                    ✓ Không có điểm chung nhưng <strong>không đồng phẳng</strong> (không có mặt phẳng nào chứa cả hai).
                    <br />
                    ✓ Đường b nằm ngoài mặt phẳng chứa đường a.
                  </p>
                )}
              </div>
            </div>

            {/* Core Distinction Box */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Trọng tâm ghi nhớ:
              </div>
              <div className="text-emerald-300 font-mono">
                SONG SONG = Không giao nhau + Đồng phẳng
              </div>
              <div className="text-amber-300 font-mono">
                CHÉO NHAU = Không giao nhau + Không đồng phẳng
              </div>
            </div>

            {/* Compare Button */}
            {onOpenComparison && (
              <button
                onClick={onOpenComparison}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Mở cửa sổ so sánh song song vs chéo nhau</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 2: PARALLEL PROPERTY THROUGH POINT M */}
        {/* ============================================================== */}
        {sceneId === 'scene2_parallel_property' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Bài học 02</div>
              <h2 className="text-base font-bold text-white">Tính Chất Đường Thẳng Song Song</h2>
            </div>

            <div className="p-3 bg-sky-950/30 border border-sky-500/25 rounded-xl space-y-1.5">
              <div className="text-xs font-semibold text-sky-300">Nhiệm vụ:</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cho đường thẳng <strong>a</strong> và điểm <strong>M</strong> nằm ngoài a. Hãy xoay đường thử nghiệm <strong>d</strong> qua M để tìm hướng song song với a.
              </p>
            </div>

            {/* Manual Rotation Slider */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Góc quay đường d:</span>
                <span className="font-mono text-slate-200">
                  {isScene2Snapped ? '0° (Khớp song song)' : `${Math.round(scene2Angle)}°`}
                </span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={scene2Angle}
                onChange={(e) => onScene2AngleChange(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-60°</span>
                <span className="text-emerald-400 font-semibold">0° (Song song)</span>
                <span>+60°</span>
              </div>
            </div>

            {/* Quick Snap Action */}
            <div className="flex gap-2">
              <button
                onClick={onScene2Snap}
                className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium transition-colors"
              >
                Khớp song song d ∥ a
              </button>
              <button
                onClick={onScene2TryAnother}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Thử đường khác qua M
              </button>
            </div>

            {/* Verification State */}
            {isScene2Snapped ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Định lí được khẳng định (Tiên đề Euclid trong không gian)</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  “Trong không gian, qua một điểm M nằm ngoài một đường thẳng a,{' '}
                  <span className="text-emerald-300 underline underline-offset-2">
                    có duy nhất một đường thẳng
                  </span>{' '}
                  đi qua M và song song với a.”
                </p>
                <div className="text-[11px] text-slate-400">
                  Hai đường thẳng song song a và d cùng xác định một mặt phẳng duy nhất (M, a).
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-slate-300 leading-relaxed">
                Đường d hiện tại đang cắt hoặc lệch hướng với a. Hãy xoay về góc 0° để quan sát điều kiện song song và mặt phẳng xuất hiện.
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 3: THREE PLANES - CONCURRENCE */}
        {/* ============================================================== */}
        {sceneId === 'scene3_concurrence' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Bài học 03</div>
              <h2 className="text-base font-bold text-white">Ba Mặt Phẳng & Ba Giao Tuyến (Đồng Quy)</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Cho ba mặt phẳng (P), (Q), (R) đôi một cắt nhau theo ba giao tuyến phân biệt:
            </p>

            {/* Stepper Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>3 giao tuyến (3 màu phân biệt):</span>
                <span className="text-[11px] text-slate-400 font-mono">Bước {scene3Step}/4</span>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    step: 1,
                    label: '1. Giao tuyến a = (P) ∩ (Q)',
                    color: 'text-cyan-300',
                    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.7)]',
                    desc: 'Xanh Lam Cyan',
                  },
                  {
                    step: 2,
                    label: '2. Giao tuyến b = (Q) ∩ (R)',
                    color: 'text-rose-300',
                    dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]',
                    desc: 'Đỏ Hồng Ruby',
                  },
                  {
                    step: 3,
                    label: '3. Giao tuyến c = (R) ∩ (P)',
                    color: 'text-amber-300',
                    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
                    desc: 'Vàng Cam Hổ Phách',
                  },
                  {
                    step: 4,
                    label: '4. Điểm đồng quy O của a, b, c',
                    color: 'text-emerald-300 font-semibold',
                    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
                    desc: 'Điểm chung O',
                  },
                ].map((item) => (
                  <button
                    key={item.step}
                    onClick={() => {
                      sounds.playClick();
                      onScene3StepChange(item.step);
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium text-left border transition-all flex items-center justify-between ${
                      scene3Step >= item.step
                        ? 'bg-slate-800/90 text-white border-slate-700 shadow-sm'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                      <span className={scene3Step >= item.step ? item.color : 'text-slate-400'}>
                        {item.label}
                      </span>
                    </div>
                    {scene3Step >= item.step ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction Question */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
              <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Câu hỏi dự đoán:</span>
              </div>
              <p className="text-xs text-slate-200">
                Khi ba mặt phẳng cắt nhau như cấu hình này, ba giao tuyến a, b, c có quan hệ gì?
              </p>

              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'opt1', text: 'Ba giao tuyến đồng quy tại một điểm O' },
                  { id: 'opt2', text: 'Ba giao tuyến đôi một song song' },
                  { id: 'opt3', text: 'Ba giao tuyến chéo nhau từng đôi một' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setScene3Answer(opt.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      scene3Answer === opt.id
                        ? 'bg-sky-500/20 text-white border-sky-500/40'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <button
                disabled={!scene3Answer}
                onClick={() => {
                  sounds.playSuccess();
                  setScene3Checked(true);
                  onScene3StepChange(4);
                }}
                className="w-full py-2 bg-sky-500 disabled:opacity-40 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
              >
                Kiểm tra dự đoán
              </button>
            </div>

            {/* Mathematical Conclusion */}
            {scene3Checked && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5 animate-in fade-in">
                <div className="text-xs font-semibold text-emerald-400">Kết luận toán học:</div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Ba giao tuyến <strong>a, b, c đồng quy tại điểm chung duy nhất O</strong>. Điểm O thuộc cả ba mặt phẳng (P), (Q) và (R).
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 4: THREE PLANES - PARALLEL */}
        {/* ============================================================== */}
        {sceneId === 'scene4_parallel_planes' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Bài học 04</div>
              <h2 className="text-base font-bold text-white">Ba Mặt Phẳng & Ba Giao Tuyến (Song Song)</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Quan sát cấu hình 3 mặt phẳng khác (tương tự 3 mặt bên kéo dài của lăng trụ tam giác).
            </p>

            {/* Stepper Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>3 giao tuyến song song (3 màu phân biệt):</span>
                <span className="text-[11px] text-slate-400 font-mono">Bước {scene4Step}/4</span>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    step: 1,
                    label: '1. Giao tuyến a = (Q) ∩ (R) ở trên',
                    color: 'text-cyan-300',
                    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.7)]',
                    desc: 'Xanh Lam Cyan',
                  },
                  {
                    step: 2,
                    label: '2. Giao tuyến b = (P) ∩ (Q) bên trái',
                    color: 'text-rose-300',
                    dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]',
                    desc: 'Đỏ Hồng Ruby',
                  },
                  {
                    step: 3,
                    label: '3. Giao tuyến c = (R) ∩ (P) bên phải',
                    color: 'text-amber-300',
                    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
                    desc: 'Vàng Cam Hổ Phách',
                  },
                  {
                    step: 4,
                    label: '4. Cả ba đường a ∥ b ∥ c song song',
                    color: 'text-teal-300 font-semibold',
                    dot: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]',
                    desc: 'Đôi một song song',
                  },
                ].map((item) => (
                  <button
                    key={item.step}
                    onClick={() => {
                      sounds.playClick();
                      onScene4StepChange(item.step);
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium text-left border transition-all flex items-center justify-between ${
                      scene4Step >= item.step
                        ? 'bg-slate-800/90 text-white border-slate-700 shadow-sm'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                      <span className={scene4Step >= item.step ? item.color : 'text-slate-400'}>
                        {item.label}
                      </span>
                    </div>
                    {scene4Step >= item.step ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
              <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Dự đoán quan hệ ba giao tuyến:</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'optA', text: 'Ba giao tuyến đôi một song song (a ∥ b ∥ c)' },
                  { id: 'optB', text: 'Ba giao tuyến đồng quy tại một điểm' },
                  { id: 'optC', text: 'Ba giao tuyến chéo nhau' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setScene4Answer(opt.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      scene4Answer === opt.id
                        ? 'bg-sky-500/20 text-white border-sky-500/40'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <button
                disabled={!scene4Answer}
                onClick={() => {
                  sounds.playSuccess();
                  setScene4Checked(true);
                  onScene4StepChange(4);
                }}
                className="w-full py-2 bg-sky-500 disabled:opacity-40 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
              >
                Kiểm tra dự đoán
              </button>
            </div>

            {/* Theorem Conclusion Box */}
            {scene4Checked && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 animate-in fade-in">
                <div className="text-xs font-semibold text-emerald-400">
                  ĐỊNH LÍ VỀ BA GIAO TUYẾN CỦA BA MẶT PHẲNG:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  “Nếu ba mặt phẳng đôi một cắt nhau theo ba giao tuyến phân biệt thì ba giao tuyến ấy{' '}
                  <span className="text-emerald-300 underline underline-offset-2">
                    hoặc đồng quy, hoặc đôi một song song
                  </span>.”
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 5: REAL WORLD 1 - DOOR FRAME */}
        {/* ============================================================== */}
        {sceneId === 'scene5_real_door' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Vận dụng thực tế 01</div>
              <h2 className="text-base font-bold text-white">Khung Cửa & Các Thanh Song Song</h2>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-sky-300 font-semibold">Thao tác:</div>
              <p className="text-slate-300 leading-relaxed">
                Nhấp chuột trực tiếp lên các thanh dọc trên khung cửa (hoặc chọn bên dưới) để chọn 2 thanh mà em cho là song song.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 1, 2, 3, 4].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      sounds.playClick();
                      onScene5SelectBar(id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      scene5SelectedBars.includes(id)
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Thanh {id + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Reasoning Check */}
            {scene5SelectedBars.length >= 2 && (
              <div className="p-3.5 bg-slate-900 border border-sky-500/30 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-amber-200">
                  Câu hỏi: Vì sao hai thanh này được coi là hai đường thẳng song song?
                </div>
                <div className="text-[11px] text-slate-400">Đánh dấu tất cả yếu tố cần và đủ:</div>

                <div className="space-y-2 text-xs text-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scene5ReasonCoplanar}
                      onChange={(e) => setScene5ReasonCoplanar(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                    />
                    <span>Cùng nằm trong mặt phẳng khung cửa (đồng phẳng)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scene5ReasonNoCommon}
                      onChange={(e) => setScene5ReasonNoCommon(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                    />
                    <span>Không có điểm chung (khoảng cách đều, không cắt nhau)</span>
                  </label>
                </div>

                <button
                  onClick={() => {
                    sounds.playSuccess();
                    setScene5Checked(true);
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
                >
                  Kiểm tra câu trả lời
                </button>

                {scene5Checked && (
                  <div className="text-xs pt-2 border-t border-slate-800 leading-relaxed">
                    {scene5ReasonCoplanar && scene5ReasonNoCommon ? (
                      <p className="text-emerald-300">
                        ✓ Chính xác! Định nghĩa đòi hỏi cả 2 yếu tố: <strong>Đồng phẳng</strong> và <strong>Không có điểm chung</strong>. Nếu thiếu tính đồng phẳng, chúng có thể là hai đường chéo nhau!
                      </p>
                    ) : (
                      <p className="text-amber-300">
                        Hãy chọn đủ cả hai điều kiện: Đồng phẳng và Không có điểm chung!
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 6: REAL WORLD 2 - TRUSS SYSTEM */}
        {/* ============================================================== */}
        {sceneId === 'scene6_real_truss' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Vận dụng thực tế 02</div>
              <h2 className="text-base font-bold text-white">Giàn Thép Không Gian 3D</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Trong các công trình cầu dàn thép hoặc mái vòm, nhiều thanh kết cấu đan chéo ở các cao độ khác nhau. Hãy phân tích hai cặp thanh được chọn:
            </p>

            {/* Pair selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onScene6SelectPair('pairA');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  scene6ActivePair === 'pairA'
                    ? 'bg-emerald-500/20 text-white border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-semibold text-emerald-400">Cặp thanh A</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Hai thanh biên trên</div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onScene6SelectPair('pairB');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  scene6ActivePair === 'pairB'
                    ? 'bg-amber-500/20 text-white border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-semibold text-amber-400">Cặp thanh B</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Thanh trên & thanh xiên dưới</div>
              </button>
            </div>

            {/* Classification Challenge */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="text-sky-300 font-semibold">Phân loại quan hệ:</div>

              <div className="space-y-2">
                <div>
                  <div className="text-slate-300 mb-1">Cặp thanh A là:</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScene6AAnswer('parallel')}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                        scene6AAnswer === 'parallel'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Song song
                    </button>
                    <button
                      onClick={() => setScene6AAnswer('skew')}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                        scene6AAnswer === 'skew'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Chéo nhau
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-slate-300 mb-1">Cặp thanh B là:</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScene6BAnswer('parallel')}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                        scene6BAnswer === 'parallel'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Song song
                    </button>
                    <button
                      onClick={() => setScene6BAnswer('skew')}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                        scene6BAnswer === 'skew'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Chéo nhau
                    </button>
                  </div>
                </div>
              </div>

              <button
                disabled={!scene6AAnswer || !scene6BAnswer}
                onClick={() => {
                  sounds.playSuccess();
                  setScene6Checked(true);
                }}
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
              >
                Kiểm tra phân loại
              </button>

              {scene6Checked && (
                <div className="p-2.5 bg-slate-800 rounded-lg text-[11px] text-slate-300 space-y-1">
                  <p className="text-emerald-400 font-semibold">
                    Cặp A: Song song (cùng thuộc mặt phẳng sàn trên).
                  </p>
                  <p className="text-amber-400 font-semibold">
                    Cặp B: Chéo nhau (ở 2 cao độ lệch nhau, không có mặt phẳng nào chứa cả hai).
                  </p>
                  <p className="text-slate-400 italic">
                    💡 Lưu ý: Hình chiếu 2D phẳng có thể làm hai thanh chéo nhau trông như cắt nhau hoặc song song. Phải xoay mô hình 3D để kiểm chứng chiều sâu!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 7: REAL WORLD 3 - THREE PLANES */}
        {/* ============================================================== */}
        {sceneId === 'scene7_real_planes' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-sky-400 font-medium">Vận dụng thực tế 03</div>
              <h2 className="text-base font-bold text-white">Ba Mặt Phẳng Trong Kiến Trúc</h2>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onScene7ModeChange('apex');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  scene7Mode === 'apex'
                    ? 'bg-sky-500/20 text-white border-sky-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-semibold text-sky-300">1. Đỉnh Chóp Nóc</div>
                <div className="text-[11px] text-slate-300 mt-0.5">3 mặt gặp tại đỉnh O</div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onScene7ModeChange('prism');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  scene7Mode === 'prism'
                    ? 'bg-emerald-500/20 text-white border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <div className="font-semibold text-emerald-300">2. Mái Lăng Trụ</div>
                <div className="text-[11px] text-slate-300 mt-0.5">3 mặt tạo 3 nếp song song</div>
              </button>
            </div>

            {/* Geometric Abstraction Slider */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Chế độ trừu tượng hóa toán học:</span>
                <span className="font-mono text-sky-400">{Math.round(scene7Abstraction * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={scene7Abstraction}
                onChange={(e) => onScene7AbstractionChange(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Vật thể thực tế</span>
                <span>Mặt phẳng hình học thuần túy</span>
              </div>
            </div>

            {/* Architectural Explanation */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1.5 leading-relaxed">
              <div className="text-slate-200 font-semibold">Ý nghĩa hình học:</div>
              {scene7Mode === 'apex' ? (
                <p className="text-slate-300">
                  Ba bề mặt mái nghiêng của chòi kiến trúc cắt nhau theo ba gờ mái (ba giao tuyến). Vì cả 3 gờ đều đi qua đỉnh chóp nên ba giao tuyến{' '}
                  <strong className="text-sky-300">đồng quy tại đỉnh O</strong>.
                </p>
              ) : (
                <p className="text-slate-300">
                  Hai mái dốc và mặt sàn nhà tạo thành ba mặt phẳng đôi một cắt nhau. Ba giao tuyến (nếp nóc mái và hai mép chân tường){' '}
                  <strong className="text-emerald-300">đôi một song song</strong> với nhau.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENE 8: SUMMARY & KNOWLEDGE MAP */}
        {/* ============================================================== */}
        {sceneId === 'summary' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-emerald-400 font-medium">Hệ thống hóa kiến thức</div>
              <h2 className="text-base font-bold text-white">Bản Đồ Kiến Thức Trực Quan</h2>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-sky-300 font-semibold">1. Hai đường thẳng trong không gian:</div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>
                  <strong>Đồng phẳng:</strong> Cắt nhau (1 điểm chung) hoặc Song song (0 điểm chung).
                </li>
                <li>
                  <strong>Không đồng phẳng:</strong> Chéo nhau (0 điểm chung, không có mặt phẳng nào chứa cả hai).
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-purple-300 font-semibold">2. Định lí về ba giao tuyến:</div>
              <p className="text-slate-300 leading-relaxed">
                Nếu ba mặt phẳng đôi một cắt nhau theo ba giao tuyến phân biệt thì ba giao tuyến ấy:{' '}
                <strong className="text-emerald-300">hoặc đồng quy, hoặc đôi một song song</strong>.
              </p>
            </div>

            {/* Quick Mini Quiz */}
            <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-3 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Câu hỏi củng cố:</span>
              </div>

              <div>
                <p className="text-slate-200 mb-1.5">
                  1. Hai đường thẳng không có điểm chung thì có chắc chắn song song không?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuiz1(1)}
                    className={`flex-1 py-1.5 rounded-lg border text-center ${
                      quiz1 === 1
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Chắc chắn song song
                  </button>
                  <button
                    onClick={() => setQuiz1(2)}
                    className={`flex-1 py-1.5 rounded-lg border text-center ${
                      quiz1 === 2
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Chưa chắc (có thể chéo nhau)
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-200 mb-1.5">
                  2. Để hai đường thẳng song song, cần thỏa mãn điều kiện gì?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuiz2(1)}
                    className={`flex-1 py-1.5 rounded-lg border text-center ${
                      quiz2 === 1
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Đồng phẳng + Không giao nhau
                  </button>
                  <button
                    onClick={() => setQuiz2(2)}
                    className={`flex-1 py-1.5 rounded-lg border text-center ${
                      quiz2 === 2
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Chỉ cần không giao nhau
                  </button>
                </div>
              </div>

              <button
                disabled={!quiz1 || !quiz2}
                onClick={() => {
                  sounds.playSuccess();
                  setQuizChecked(true);
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                Hoàn thành bài học
              </button>

              {quizChecked && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px] leading-relaxed">
                  🎉 Xuất sắc! Bạn đã nắm vững bản chất toán học của hai đường thẳng song song trong không gian!
                </div>
              )}
            </div>

            {/* Author & Copyright Box */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                Thông tin bản quyền & tác giả:
              </div>
              <div className="text-slate-200 font-medium">
                Bản quyền: <span className="text-sky-400 font-semibold">Eliza Tâm Dương</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Số điện thoại: <a href="tel:0962571826" className="text-sky-400 hover:underline font-mono">0962571826</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
