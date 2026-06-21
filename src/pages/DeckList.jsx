import { Trash2, Edit2, Eye, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckStorage } from '../hooks/useDeckStorage';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export function DeckList() {
  const { decks, deleteDeck } = useDeckStorage();
  const navigate = useNavigate();
  const [viewingDeck, setViewingDeck] = useState(null);
  const [deckToDelete, setDeckToDelete] = useState(null);

  const handleDelete = () => {
    if (deckToDelete) {
      deleteDeck(deckToDelete);
      setDeckToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">My Decks</h1>
        </div>
        <button 
          onClick={() => navigate('/deck/builder')}
          className="flex items-center justify-center p-3 bg-zutomayo-accent text-white rounded-full hover:bg-zutomayo-accent-hover hover:shadow-[0_0_15px_rgba(123,94,167,0.5)] transition-all"
          title="新規デッキ作成"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="glass-panel p-12 text-center mt-12 border border-white/5">
          <p className="text-lg text-zutomayo-light mb-6">保存されたデッキがありません。</p>
          <button 
            onClick={() => navigate('/deck/builder')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-zutomayo-accent text-white font-bold rounded-lg hover:bg-zutomayo-accent-hover transition-colors"
          >
            <Plus size={18} /> 最初のデッキを作る
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <div key={deck.id} className="glass-panel p-5 flex flex-col group hover:border-zutomayo-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{deck.name}</h3>
                  <p className="text-xs text-zutomayo-light">
                    {deck.cards.length} 枚 • 更新: {new Date(deck.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Preview thumbnails */}
              <div className="flex -space-x-4 overflow-hidden mb-6 py-2">
                {deck.cards.slice(0, 5).map((card, idx) => (
                  <img 
                    key={`${card.id}-${idx}`}
                    src={card.imagePath} 
                    alt={card.name}
                    className="inline-block h-20 w-14 object-cover rounded shadow-md border border-white/20 relative"
                    style={{ zIndex: 5 - idx }}
                  />
                ))}
                {deck.cards.length > 5 && (
                  <div className="h-20 w-14 rounded bg-black/80 border border-white/20 flex items-center justify-center relative z-0">
                    <span className="text-xs text-white font-bold">+{deck.cards.length - 5}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => setViewingDeck(deck)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded transition-colors text-sm"
                >
                  <Eye size={16} /> デッキの確認
                </button>
                <button 
                  onClick={() => navigate(`/deck/builder?id=${deck.id}`)}
                  className="flex items-center justify-center px-3 bg-white/5 hover:bg-white/10 text-zutomayo-light hover:text-white rounded transition-colors"
                  title="デッキを編集"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => setDeckToDelete(deck.id)}
                  className="flex items-center justify-center px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                  title="デッキを削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deck View Modal */}
      {viewingDeck && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm" 
          onClick={() => setViewingDeck(null)}
        >
          <div 
            className="bg-zutomayo-dark/95 border border-white/10 rounded-2xl w-full max-w-5xl max-h-full flex flex-col shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white text-glow mb-1">{viewingDeck.name}</h2>
                <p className="text-sm text-zutomayo-light">{viewingDeck.cards.length} 枚のカード</p>
              </div>
              <button 
                onClick={() => setViewingDeck(null)} 
                className="p-2 text-zutomayo-light hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                title="閉じる"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content - Card Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                {viewingDeck.cards.map((card, idx) => (
                  <div key={`${card.id}-${idx}`} className="relative group">
                    <img 
                      src={card.imagePath} 
                      alt={card.name} 
                      className="w-full h-auto rounded-lg shadow-md border border-white/10 group-hover:border-zutomayo-accent transition-colors" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deckToDelete}
        onClose={() => setDeckToDelete(null)}
        onConfirm={handleDelete}
        title="デッキの削除"
        message="本当にこのデッキを削除しますか？\n削除したデッキは元に戻せません。"
        confirmText="削除する"
      />
    </div>
  );
}
