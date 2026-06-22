import React, { useState, useRef, useEffect, useId } from 'react';
import { Search, X, ChevronDown, Loader2 } from 'lucide-react';
import type { Food } from '../../types/food';
import type { DietItem } from '../../types/diet';
import { useFoodSearch } from '../../hooks/useFoodSearch';
import {
  STANDARD_MEASURES,
  calculateNutrition,
  formatQuantityText,
} from '../../lib/foodService';

interface Props {
  item: DietItem;
  placeholder?: string;
  onChange: (updated: DietItem) => void;
}

// ── Subcomponente: badge de macro ──────────────────────────────────────────────

function MacroBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center min-w-[4rem] px-2 py-1.5 rounded-lg text-xs font-semibold ${color}`}>
      <span className="opacity-70 font-medium leading-none mb-1.5">{label}</span>
      <span className="leading-none">{value.toFixed(1)}g</span>
    </span>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function FoodAutocomplete({ item, placeholder = 'Buscar alimento…', onChange }: Props) {
  const uid = useId();

  // Estado de busca
  const [query, setQuery] = useState(item.foodId ? item.food : '');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Estado do formulário de medida (visível após selecionar um alimento)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [measureIdx, setMeasureIdx] = useState(0);   // índice em STANDARD_MEASURES
  const [qty, setQty] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isLoading } = useFoodSearch(query);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Abre o dropdown quando surgem resultados
  useEffect(() => {
    if (results.length > 0) {
      setOpen(true);
      setActiveIdx(-1);
    }
  }, [results]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    // Se o usuário edita o campo, limpa a seleção anterior
    if (selectedFood) {
      setSelectedFood(null);
      onChange({ ...item, foodId: undefined, food: e.target.value, quantity: '', calories: undefined, proteins: undefined, carbs: undefined, lipids: undefined, totalGrams: undefined });
    }
  }

  function handleSelectFood(food: Food) {
    setSelectedFood(food);
    setQuery(food.name);
    setOpen(false);
    setMeasureIdx(0);
    setQty(1);

    // Dispara cálculo inicial com medida default (índice 0)
    emitChange(food, 0, 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelectFood(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleClear() {
    setQuery('');
    setSelectedFood(null);
    setMeasureIdx(0);
    setQty(1);
    onChange({ ...item, food: '', quantity: '', foodId: undefined, measureType: undefined, measureWeight: undefined, measureQty: undefined, calories: undefined, proteins: undefined, carbs: undefined, lipids: undefined, totalGrams: undefined });
    inputRef.current?.focus();
  }

  function emitChange(food: Food, mIdx: number, q: number) {
    const measure = STANDARD_MEASURES[mIdx];
    const nutrition = calculateNutrition(food, measure.weightGrams, q);
    const quantityText = formatQuantityText(measure.label, measure.weightGrams, q);

    onChange({
      ...item,
      food: food.name,
      quantity: quantityText,
      foodId: food.id,
      measureType: measure.label,
      measureWeight: measure.weightGrams,
      measureQty: q,
      calories: nutrition.calories,
      proteins: nutrition.proteins,
      carbs: nutrition.carbs,
      lipids: nutrition.lipids,
      totalGrams: nutrition.totalGrams,
    });
  }

  function handleMeasureChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.target.value);
    setMeasureIdx(idx);
    if (selectedFood) emitChange(selectedFood, idx, qty);
  }

  function handleQtyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    const safe = isNaN(v) || v <= 0 ? 0 : v;
    setQty(safe);
    if (selectedFood && safe > 0) emitChange(selectedFood, measureIdx, safe);
  }

  function handleTotalGramsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    const safeGrams = isNaN(v) || v < 0 ? 0 : v;
    const currentWeight = STANDARD_MEASURES[measureIdx].weightGrams;
    // Se a medida for "Grama(s) (g)" (peso 1), a quantidade é igual as gramas.
    // Senão, calcula a quantidade fracionada da medida caseira.
    const newQty = safeGrams / currentWeight;
    setQty(newQty);
    if (selectedFood && safeGrams > 0) emitChange(selectedFood, measureIdx, newQty);
  }

  // ── Macros calculados (para exibição em tempo real) ──────────────────────────
  const nutrition =
    selectedFood && qty > 0
      ? calculateNutrition(selectedFood, STANDARD_MEASURES[measureIdx].weightGrams, qty)
      : null;

  // ── Renderização ─────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Campo de busca ─────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors ${
        selectedFood
          ? 'bg-[#EAF0E7] dark:bg-[#1E2A1A]'
          : 'bg-transparent hover:bg-[#F4F7F2] dark:hover:bg-[#1A221A]'
      }`}>
        {isLoading ? (
          <Loader2 size={13} className="text-[#5E7153] animate-spin flex-shrink-0" />
        ) : (
          <Search size={13} className="text-[#5E7153]/50 flex-shrink-0" />
        )}

        <input
          ref={inputRef}
          id={`${uid}-food-input`}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={`${uid}-listbox`}
          aria-expanded={open}
          aria-activedescendant={activeIdx >= 0 ? `${uid}-opt-${activeIdx}` : undefined}
          className="flex-1 min-w-0 bg-transparent text-[#2C2C2C] dark:text-[#FDFBF7] text-sm placeholder-[#2C2C2C]/30 dark:placeholder-white/20 focus:outline-none"
        />

        {(query || selectedFood) && (
          <button
            onClick={handleClear}
            title="Limpar"
            className="p-0.5 rounded text-[#2C2C2C]/30 hover:text-red-400 dark:text-white/20 dark:hover:text-red-400 transition-colors flex-shrink-0"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* ── Loading state dropdown ────────────────────────────────────────── */}
      {isLoading && !open && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[300px] bg-white dark:bg-[#1E211C] border border-[#E1E8DE] dark:border-[#2A3526] rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 text-xs text-[#5E7153]">
          <Loader2 size={12} className="animate-spin flex-shrink-0" />
          Buscando alimentos…
        </div>
      )}

      {/* ── Dropdown de sugestões ────────────────────────────────────────────── */}
      {open && results.length > 0 && (

        <ul
          ref={listRef}
          id={`${uid}-listbox`}
          role="listbox"
          className="absolute left-0 z-50 mt-1 w-full min-w-[300px] bg-white dark:bg-[#1E211C] border border-[#E1E8DE] dark:border-[#2A3526] rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {results.map((food, idx) => (
            <li
              key={food.id}
              id={`${uid}-opt-${idx}`}
              role="option"
              aria-selected={idx === activeIdx}
              onPointerDown={(e) => {
                e.preventDefault(); // evita blur no input antes do click
                handleSelectFood(food);
              }}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors ${
                idx === activeIdx
                  ? 'bg-[#5E7153] text-white'
                  : 'text-[#2C2C2C] dark:text-[#FDFBF7] hover:bg-[#F4F7F2] dark:hover:bg-[#252B20]'
              }`}
            >
              <span className="truncate pr-4">{food.name}</span>
              <span className={`text-[10px] flex-shrink-0 ${idx === activeIdx ? 'text-white/70' : 'text-[#5E7153]/60 dark:text-[#A8C09A]/60'}`}>
                {food.kcalPer100g.toFixed(0)} kcal/100g
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ── Painel de Medida (exibido após selecionar alimento) ──────────────── */}
      {selectedFood && (
        <div className="mt-2 flex flex-col gap-3 p-3 bg-[#F4F7F2]/50 dark:bg-[#1A221A]/50 rounded-xl border border-[#E1E8DE]/50 dark:border-[#2A3526]/50">
          <div className="flex flex-wrap items-center gap-4">
            {/* Quantidade */}
            <div className="flex items-center gap-2">
              <label htmlFor={`${uid}-qty`} className="text-[10px] text-[#5E7153] font-bold uppercase tracking-wider whitespace-nowrap">
                Qtd.
              </label>
              <input
                id={`${uid}-qty`}
                type="number"
                min="0.1"
                step="0.5"
                value={qty}
                onChange={handleQtyChange}
                className="w-16 text-sm text-center bg-white dark:bg-[#1E211C] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5E7153] shadow-sm transition-all"
              />
            </div>

            {/* Medida caseira */}
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <label htmlFor={`${uid}-measure`} className="text-[10px] text-[#5E7153] font-bold uppercase tracking-wider whitespace-nowrap">
                Medida
              </label>
              <div className="relative flex-1">
                <select
                  id={`${uid}-measure`}
                  value={measureIdx}
                  onChange={handleMeasureChange}
                  className="w-full appearance-none text-xs bg-white dark:bg-[#1E211C] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5E7153] cursor-pointer shadow-sm transition-all"
                >
                  {STANDARD_MEASURES.map((m, i) => (
                    <option key={m.label} value={i}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E7153]" />
              </div>
            </div>

            {/* Gramas diretas */}
            <div className="flex items-center gap-2">
              <label htmlFor={`${uid}-grams`} className="text-[10px] text-[#5E7153] font-bold uppercase tracking-wider whitespace-nowrap">
                Gramas (g)
              </label>
              <input
                id={`${uid}-grams`}
                type="number"
                min="0.1"
                step="0.5"
                value={Math.round(qty * STANDARD_MEASURES[measureIdx].weightGrams * 10) / 10}
                onChange={handleTotalGramsChange}
                className="w-16 text-sm text-center bg-white dark:bg-[#1E211C] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5E7153] shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Divisor subtil */}
          <div className="h-px w-full bg-[#E1E8DE]/50 dark:bg-[#2A3526]/50"></div>

          {/* Badges de macros calculados */}
          {nutrition && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex flex-col items-center justify-center min-w-[4rem] px-2 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <span className="opacity-70 font-medium leading-none mb-1.5">kcal</span>
                <span className="leading-none">{nutrition.calories.toFixed(0)}</span>
              </span>
              <MacroBadge label="ptn" value={nutrition.proteins} color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" />
              <MacroBadge label="cho" value={nutrition.carbs}    color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" />
              <MacroBadge label="lip" value={nutrition.lipids}   color="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
