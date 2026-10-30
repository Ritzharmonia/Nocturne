import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { X, Trash2, Book, Sparkles } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onClear: () => void;
}

export const FortuneHistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onClear
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = filterCategory === 'all' 
    ? records 
    : records.filter(r => r.category === filterCategory);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month} сарын ${day}, ${hours}:${mins}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-lg bg-gradient-to-b from-[#0f1730] via-[#090e1f] to-[#040610] border border-cyan-500/40 shadow-2xl p-6 flex flex-col overflow-hidden">
        {/* Top glow border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Хаах"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Book className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-gothic font-bold text-slate-100">
              ЗӨГНӨЛИЙН ТЭМДЭГЛЭЛ
            </h3>
            <p className="text-xs text-slate-400 font-serif">
              Чиний хүлээн авсан өмнөх зөгнөлүүдийн түүх ({records.length})
            </p>
          </div>
        </div>

        {/* Interactive filter tabs (functional buttons with click handlers) */}
        <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-800 text-xs">
          {[
            { id: 'all', label: 'Бүгд' },
            { id: 'luck', label: 'Аз хийморь' },
            { id: 'mystery', label: 'Нууц' },
            { id: 'humor', label: 'Хошигнол' },
            { id: 'treasure', label: 'Эрдэнэс' },
            { id: 'curse', label: 'Хараал' },
            { id: 'destiny', label: 'Хувь тавилан' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1 rounded font-gothic tracking-wider transition-colors ${
                filterCategory === tab.id
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-serif">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>Одоогоор тэмдэглэгдсэн зөгнөл алга байна.</p>
              <p className="text-xs text-slate-600 mt-1">Болор бөмбөлгөөр зөгнүүлж түүхээ бүтээгээрэй.</p>
            </div>
          ) : (
            filtered.map(record => (
              <div
                key={record.id}
                className={`p-4 rounded-md border transition-all ${
                  record.isSecretRare
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Meta line: Clean unboxed metadata with typographic separators */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-serif mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-gothic">{record.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDate(record.timestamp)}</span>
                  </div>
                  {record.candyReward && (
                    <span className="text-amber-300 font-medium font-gothic">
                      🍬 +{record.candyReward} чихэр
                    </span>
                  )}
                </div>

                <h4 className="text-base font-gothic font-semibold text-slate-100 mb-1">
                  {record.fortuneTitle}
                </h4>
                <p className="text-sm text-slate-300 font-serif leading-relaxed">
                  «{record.fortuneText}»
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {records.length > 0 ? (
            <button
              onClick={onClear}
              className="text-xs text-red-400/80 hover:text-red-300 hover:bg-red-950/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 font-gothic"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Түүхийг арилгах</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="py-1.5 px-5 rounded font-gothic text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
