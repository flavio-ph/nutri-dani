import { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import type { MealSectionData, DietItem } from '../../types/diet';
import FoodAutocomplete from './FoodAutocomplete';

interface Props {
  section: MealSectionData;
  onChange: (updated: MealSectionData) => void;
  onDelete: () => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function newItem(): DietItem {
  return { id: generateId(), food: '', quantity: '' };
}

// Soma de todos os macros da seção (apenas itens com dados calculados)
function sumMacros(items: DietItem[]) {
  return items.reduce(
    (acc, it) => ({
      calories: acc.calories + (it.calories ?? 0),
      proteins:  acc.proteins  + (it.proteins  ?? 0),
      carbs:     acc.carbs     + (it.carbs     ?? 0),
      lipids:    acc.lipids    + (it.lipids    ?? 0),
    }),
    { calories: 0, proteins: 0, carbs: 0, lipids: 0 }
  );
}

export default function MealSection({ section, onChange, onDelete }: Props) {
  const [showMacros, setShowMacros] = useState(false);

  const update = (partial: Partial<MealSectionData>) =>
    onChange({ ...section, ...partial });

  const updateItem = (updated: DietItem) => {
    onChange({
      ...section,
      items: section.items.map((it) => (it.id === updated.id ? updated : it)),
    });
  };

  const addItem = () =>
    update({ items: [...section.items, newItem()] });

  const removeItem = (id: string) =>
    update({ items: section.items.filter((it) => it.id !== id) });

  const totals = sumMacros(section.items);
  const hasAnyMacros = section.items.some((it) => it.calories !== undefined);

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
        <div className="overflow-visible rounded-lg border border-[#E1E8DE] dark:border-[#2A3526]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F7F2] dark:bg-[#1A221A] text-[#4A5B42] dark:text-[#A8C09A] uppercase text-xs tracking-wide">
                <th className="px-3 py-2 text-left font-semibold">Alimento / Quantidade</th>
                <th className="px-2 py-2 text-center font-semibold w-14 text-amber-600 dark:text-amber-400">kcal</th>
                <th className="px-2 py-2 text-center font-semibold w-14 text-blue-600 dark:text-blue-400">ptn</th>
                <th className="px-2 py-2 text-center font-semibold w-14 text-green-600 dark:text-green-400">cho</th>
                <th className="px-2 py-2 text-center font-semibold w-14 text-rose-500 dark:text-rose-400">lip</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#E1E8DE] dark:border-[#2A3526] group align-top"
                >
                  {/* Autocomplete cell */}
                  <td className="px-3 py-2">
                    <FoodAutocomplete
                      item={item}
                      placeholder={`Buscar alimento…`}
                      onChange={updateItem}
                    />
                  </td>

                  {/* Macro cells */}
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-amber-700 dark:text-amber-400 font-medium">
                    {item.calories !== undefined ? item.calories.toFixed(0) : <span className="text-[#2C2C2C]/20 dark:text-white/10">—</span>}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-blue-700 dark:text-blue-400 font-medium">
                    {item.proteins !== undefined ? item.proteins.toFixed(1) : <span className="text-[#2C2C2C]/20 dark:text-white/10">—</span>}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-green-700 dark:text-green-400 font-medium">
                    {item.carbs !== undefined ? item.carbs.toFixed(1) : <span className="text-[#2C2C2C]/20 dark:text-white/10">—</span>}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-rose-600 dark:text-rose-400 font-medium">
                    {item.lipids !== undefined ? item.lipids.toFixed(1) : <span className="text-[#2C2C2C]/20 dark:text-white/10">—</span>}
                  </td>

                  {/* Delete button */}
                  <td className="px-2 py-2">
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

            {/* Totais da refeição */}
            {hasAnyMacros && (
              <tfoot>
                <tr className="border-t-2 border-[#5E7153]/30 bg-[#F4F7F2] dark:bg-[#1A221A]">
                  <td className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#5E7153] font-bold">
                    Total da refeição
                  </td>
                  <td className="px-2 py-1.5 text-center text-xs font-bold tabular-nums text-amber-700 dark:text-amber-400">
                    {totals.calories.toFixed(0)}
                  </td>
                  <td className="px-2 py-1.5 text-center text-xs font-bold tabular-nums text-blue-700 dark:text-blue-400">
                    {totals.proteins.toFixed(1)}
                  </td>
                  <td className="px-2 py-1.5 text-center text-xs font-bold tabular-nums text-green-700 dark:text-green-400">
                    {totals.carbs.toFixed(1)}
                  </td>
                  <td className="px-2 py-1.5 text-center text-xs font-bold tabular-nums text-rose-600 dark:text-rose-400">
                    {totals.lipids.toFixed(1)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
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
