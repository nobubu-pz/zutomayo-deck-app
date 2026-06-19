import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, children, onNext, onPrev }) {
  const [touchStartY, setTouchStartY] = useState(0);
  const scrollTimeout = useRef(null);
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (onNext) onNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (onPrev) onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen) return null;

  const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e) => {
    if (scrollTimeout.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 50 && onNext) onNext();
      else if (deltaY < -50 && onPrev) onPrev();
      
      // 次の入力を少し待つ（連続スワイプ防止）
      scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null }, 600);
    }
  };

  const handleWheel = (e) => {
    if (scrollTimeout.current) return;
    
    // スクロール量が小さすぎる場合は無視（誤動作防止）
    if (Math.abs(e.deltaY) < 10) return;

    if (e.deltaY > 0 && onNext) {
      onNext();
      scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null }, 800);
    } else if (e.deltaY < 0 && onPrev) {
      onPrev();
      scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null }, 800);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
        {children}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white/90 bg-black/20 hover:bg-black/50 rounded-full p-2 transition-colors z-50"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
