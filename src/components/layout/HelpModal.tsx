import React from 'react';
import { X, MousePointer, RotateCw, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="font-semibold text-white text-base">Hướng Dẫn Sử Dụng Phòng Thí Nghiệm 3D</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs leading-relaxed">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
              <RotateCw className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-0.5">Xoay tự do 360°</strong>
                Giữ chuột trái (hoặc vuốt 1 ngón tay trên màn hình cảm ứng) và kéo để quan sát toàn diện mô hình từ mọi hướng trong không gian.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
              <ZoomIn className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-0.5">Phóng to & Thu nhỏ</strong>
                Cuộn con lăn chuột (hoặc chụm 2 ngón tay trên màn hình cảm ứng) để phóng to giao điểm, xem xét chi tiết hai đường chéo nhau.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
              <Eye className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-0.5">Các góc nhìn tiêu chuẩn</strong>
                Sử dụng thanh công cụ bên dưới để chuyển nhanh: Phối cảnh 3/4, Nhìn từ trên xuống (Top), Trực diện (Front), Mặt bên (Side).
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
              <MousePointer className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-0.5">Tương tác chọn trực tiếp</strong>
                Nhấp chuột lên thanh khung cửa hoặc các nút bài tập ở bảng bên phải để dự đoán, kiểm tra và quan sát hiện tượng hình học.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-400">
            <span>Phục vụ giảng dạy chuyên đề Hình học không gian – Toán 11 THPT.</span>
            <span className="text-slate-300 font-medium">
              Bản quyền: <strong className="text-sky-400">Eliza Tâm Dương</strong> · SĐT:{' '}
              <a href="tel:0962571826" className="text-sky-300 hover:underline font-mono">
                0962571826
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
