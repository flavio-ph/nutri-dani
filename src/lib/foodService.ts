/**
 * foodService.ts
 * Módulo de dados de alimentos baseado em tabelas-oficiais.json.
 * O JSON é carregado uma única vez (lazy) e mantido em cache em memória.
 */

import type { Food, FoodRecord, FoodMeasure, NutritionResult } from '../types/food';

// ── Cache em memória ───────────────────────────────────────────────────────────

let _foodCache: Food[] | null = null;
let _loadPromise: Promise<Food[]> | null = null;

/** Normaliza string para comparação: lowercase + remove diacríticos */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Converte string do JSON para número; retorna 0 para "NA", "Tr" ou vazio */
function parseNum(val: string): number {
  if (!val || val === 'NA' || val === 'Tr' || val === '') return 0;
  const n = parseFloat(val.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

/** Processa um FoodRecord bruto em um Food normalizado por 100 g */
function processRecord(raw: FoodRecord, index: number): Food | null {
  const name = raw['']?.trim();
  const refGrams = parseNum(raw['Quantidade (g)']);
  const kcal = parseNum(raw['Energia (kcal)']);

  // Filtra linhas-cabeçalho (categoria sem valores numéricos)
  if (!name || refGrams === 0 || kcal === 0) return null;

  const factor = 100 / refGrams; // fator de normalização para 100 g

  return {
    id: String(index),
    name,
    referenceGrams: refGrams,
    kcalPer100g: kcal * factor,
    proteinPer100g: parseNum(raw['Proteína (g)']) * factor,
    lipidsPer100g: parseNum(raw['Lipídeos (g)']) * factor,
    carbsPer100g: parseNum(raw['CHO (g)']) * factor,
    fiberPer100g: parseNum(raw['Fibras (g)']) * factor,
  };
}

/** Carrega e processa o JSON; usa cache para evitar re-fetches */
async function loadFoods(): Promise<Food[]> {
  if (_foodCache) return _foodCache;
  if (_loadPromise) return _loadPromise;

  _loadPromise = fetch('/tabelas-oficiais.json')
    .then((r) => r.json() as Promise<FoodRecord[]>)
    .then((records) => {
      const foods: Food[] = [];
      records.forEach((record, i) => {
        const food = processRecord(record, i);
        if (food) foods.push(food);
      });
      _foodCache = foods;
      return foods;
    });

  return _loadPromise;
}

// ── API pública ────────────────────────────────────────────────────────────────

/** Máximo de resultados retornados por busca */
const MAX_RESULTS = 25;

/**
 * Busca alimentos pelo nome (case-insensitive, ignora diacríticos).
 * Ordena priorizando matches que começam com o termo buscado.
 * Retorna no máximo MAX_RESULTS resultados.
 */
export async function searchFoods(query: string): Promise<Food[]> {
  if (!query || query.trim().length < 2) return [];
  const foods = await loadFoods();
  const q = normalize(query.trim());

  const results = foods.filter((f) => normalize(f.name).includes(q));

  // Ordenação: matches no início primeiro
  results.sort((a, b) => {
    const aStarts = normalize(a.name).startsWith(q) ? 0 : 1;
    const bStarts = normalize(b.name).startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.name.localeCompare(b.name, 'pt-BR');
  });

  return results.slice(0, MAX_RESULTS);
}

/**
 * Retorna um alimento pelo seu ID (índice no array do JSON).
 */
export async function getFoodById(id: string): Promise<Food | undefined> {
  const foods = await loadFoods();
  return foods.find((f) => f.id === id);
}

// ── Medidas Caseiras Padrão ────────────────────────────────────────────────────

export const STANDARD_MEASURES: FoodMeasure[] = [
  { label: 'Grama(s) (g)',           weightGrams: 1    },
  { label: 'Colher de chá (5g)',      weightGrams: 5    },
  { label: 'Colher de sobremesa (8g)',weightGrams: 8    },
  { label: 'Colher de sopa (15g)',    weightGrams: 15   },
  { label: 'Colher de servir (30g)',  weightGrams: 30   },
  { label: 'Xícara de chá (200g)',    weightGrams: 200  },
  { label: 'Xícara de café (50g)',    weightGrams: 50   },
  { label: 'Copo (200g)',             weightGrams: 200  },
  { label: 'Fatia (30g)',             weightGrams: 30   },
  { label: 'Fatia grande (60g)',      weightGrams: 60   },
  { label: 'Unidade pequena (50g)',   weightGrams: 50   },
  { label: 'Unidade média (100g)',    weightGrams: 100  },
  { label: 'Unidade grande (150g)',   weightGrams: 150  },
  { label: 'Porção (100g)',           weightGrams: 100  },
];

// ── Motor de Cálculo ──────────────────────────────────────────────────────────

/**
 * Calcula os macronutrientes de uma linha de dieta.
 *
 * @param food       Alimento selecionado
 * @param weightGrams Peso em gramas da medida escolhida
 * @param qty        Quantidade de medidas (ex: 2 colheres de sopa)
 */
export function calculateNutrition(
  food: Food,
  weightGrams: number,
  qty: number,
): NutritionResult {
  const totalGrams = weightGrams * qty;
  const factor = totalGrams / 100;

  return {
    calories: Math.round(food.kcalPer100g * factor * 10) / 10,
    proteins:  Math.round(food.proteinPer100g * factor * 10) / 10,
    carbs:     Math.round(food.carbsPer100g * factor * 10) / 10,
    lipids:    Math.round(food.lipidsPer100g * factor * 10) / 10,
    totalGrams: Math.round(totalGrams * 10) / 10,
  };
}

/**
 * Formata o texto de quantidade para exibição e exportação de PDF.
 * Ex: "2 × Colher de sopa (15g) = 30g"
 */
export function formatQuantityText(
  measureLabel: string,
  measureWeight: number,
  qty: number,
): string {
  const total = Math.round(measureWeight * qty * 10) / 10;
  if (measureLabel === 'Grama(s) (g)') {
    return `${qty}g`;
  }
  const qtyStr = Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
  return `${qtyStr} ${measureLabel} (${total}g)`;
}
