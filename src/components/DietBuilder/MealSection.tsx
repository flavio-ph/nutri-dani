import { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import type { MealSectionData, DietItem } from '../../types/diet';

interface Props {
  section: MealSectionData;
  onChange: (updated: MealSectionData) => void;
  onDelete: () => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function MealSection({ section, onChange, onDelete }: Props) {
  const update = (partial: Partial<MealSectionData>) =>
    onChange({ ...section, ...partial });

  const updateItem = (id: string, field: keyof DietItem, value: string) => {
    onChange({
      ...section,
      items: section.items.map((it) =>
        it.id === id ? { ...it, [field]: value } : it
      ),
    });
  };

  const addItem = () =>
    update({ items: [...section.items, { id: generateId(), food: '', quantity: '' }] });

  const removeItem = (id: string) =>
    update({ items: section.items.filter((it) => it.id !== id) });

  return (
    <div className="bg-white dark:bg-[#1E211C] border border-[#E1E8DE] dark:border-[#2A3526] rounded-2xl shadow-sm overflow-hidden mb-4">
      {/* Section Header */}
      <div className="bg-[#E1E8DE] dark:bg-[#202A1A] px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            value={section.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Nome da Refeição (ex: Café da Manhã)"
            className="flex-1 bg-transparent font-bold text-[#2C2C2C] dark:text-[#FDFBF7] text-sm uppercase tracking-wide placeholder-[#5E7153]/50 border-b border-[#5E7153]/30 focus:border-[#5E7153] focus:outline-none py-0.5 min-w-0"
          />
          <input
            value={section.subtitle ?? ''}
            onChange={(e) => update({ subtitle: e.target.value })}
            placeholder="Subtítulo opcional (ex: Opção 1)"
            className="sm:w-56 bg-transparent text-[#4A5B42] dark:text-[#A8C09A] text-xs uppercase tracking-wide placeholder-[#5E7153]/40 border-b border-[#5E7153]/20 focus:border-[#5E7153] focus:outline-none py-0.5 min-w-0"
          />
        </div>
        <button
          onClick={onDelete}
          title="Remover refeição"
          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Food Table */}
        <div className="overflow-x-auto rounded-lg border border-[#E1E8DE] dark:border-[#2A3526]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F7F2] dark:bg-[#1A221A] text-[#4A5B42] dark:text-[#A8C09A] uppercase text-xs tracking-wide">
                <th className="px-3 py-2 text-left font-semibold w-2/3">Alimento</th>
                <th className="px-3 py-2 text-left font-semibold w-1/3">Quantidade</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-t border-[#E1E8DE] dark:border-[#2A3526] group"
                >
                  <td className="px-3 py-1.5">
                    <input
                      value={item.food}
                      onChange={(e) => updateItem(item.id, 'food', e.target.value)}
                      placeholder={`Alimento ${idx + 1}`}
                      className="w-full bg-transparent text-[#2C2C2C] dark:text-[#FDFBF7] placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none text-sm"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      placeholder="Ex: 1 xícara"
                      className="w-full bg-transparent text-[#2C2C2C] dark:text-[#FDFBF7] placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none text-sm"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs text-[#5E7153] hover:text-[#4A5B42] font-medium transition-colors"
        >
          <PlusCircle size={14} />
          Adicionar alimento
        </button>

        {/* Conditional Note */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
            Observação condicional
          </label>
          <input
            value={section.conditionalNote ?? ''}
            onChange={(e) => update({ conditionalNote: e.target.value })}
            placeholder="Ex: Fazer o lanche da manhã apenas se sentir fome"
            className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#5E7153] italic"
          />
        </div>

        {/* Substitution */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
            Pode substituir por
          </label>
          <textarea
            value={section.substitution ?? ''}
            onChange={(e) => update({ substitution: e.target.value })}
            rows={2}
            placeholder="Ex: 1 banana prata OU 1 fatia de melancia OU 1 maçã"
            className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#5E7153] italic resize-none"
          />
        </div>

        {/* Orientações */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
            Orientações
          </label>
          <textarea
            value={section.notes ?? ''}
            onChange={(e) => update({ notes: e.target.value })}
            rows={2}
            placeholder="Ex: Usar apenas a pontinha da colher de chá de manteiga..."
            className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#5E7153] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
