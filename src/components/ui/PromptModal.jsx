import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function PromptModal({ isOpen, onClose, onSave, defaultValue, title, warningMsg }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue || '');
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(inputValue.trim() || defaultValue);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-zutomayo-dark border border-white/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zutomayo-light hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {warningMsg && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm whitespace-pre-wrap leading-relaxed">
            {warningMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={defaultValue}
            className="w-full bg-black/40 border border-zutomayo-border rounded-xl py-3 px-4 text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all mb-6"
            autoFocus
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 text-zutomayo-light hover:text-white hover:bg-white/10 transition-colors font-bold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-zutomayo-accent to-zutomayo-secondary text-white font-bold shadow-[0_0_15px_rgba(123,94,167,0.4)] hover:shadow-[0_0_20px_rgba(123,94,167,0.6)] transition-all"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
