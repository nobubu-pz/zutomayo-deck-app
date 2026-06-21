import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'OK', cancelText = 'キャンセル' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-zutomayo-dark border border-white/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200 text-center">
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        <p className="text-zutomayo-light text-sm mb-6 whitespace-pre-wrap leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 text-zutomayo-light hover:text-white hover:bg-white/10 transition-colors font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
