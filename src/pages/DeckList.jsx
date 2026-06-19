import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckStorage } from '../hooks/useDeckStorage';
import { Trash2, Edit2, Play, Plus } from 'lucide-react';

export function DeckList() {
  const { decks, deleteDeck } = useDeckStorage();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm('このデッキを削除してもよろしいですか？')) {
      deleteDeck(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow mb-2">My Decks</h1>
          <p className="text-zutomayo-light">ローカルストレージに保存されたデッキ一覧です。</p>
        </div>
        <button 
          onClick={() => navigate('/deck/builder')}
          className="flex items-center gap-2 px-6 py-3 bg-zutomayo-accent text-white font-bold rounded-lg hover:bg-zutomayo-accent-hover hover:shadow-[0_0_15px_rgba(123,94,167,0.5)] transition-all"
        >
          <Plus size={20} /> 新規デッキ作成
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
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded transition-colors text-sm">
                  <Play size={16} /> 遊ぶ
                </button>
                <button 
                  onClick={() => navigate(`/deck/builder?id=${deck.id}`)}
                  className="flex items-center justify-center px-3 bg-white/5 hover:bg-white/10 text-zutomayo-light hover:text-white rounded transition-colors"
                  title="デッキを編集"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(deck.id)}
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
    </div>
  );
}
