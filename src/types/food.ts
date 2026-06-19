/**
 * Shape bruto de cada objeto no tabelas-oficiais.json.
 * Todos os valores são strings (inclusive os numéricos).
 * A chave "" contém o nome do alimento.
 */
export interface FoodRecord {
  '': string;                 // nome do alimento
  'Quantidade (g)': string;   // peso de referência da porção (base de cálculo)
  'Energia (kcal)': string;
  'Proteína (g)': string;
  'Lipídeos (g)': string;
  'CHO (g)': string;
  'Fibras (g)': string;
  // demais campos que não usamos no cálculo
  [key: string]: string;
}

/**
 * Alimento processado, pronto para uso no app.
 * Os macros são sempre por 100 g equivalentes (normalizados).
 */
export interface Food {
  /** Índice no array original (usado como ID estável) */
  id: string;
  /** Nome do alimento */
  name: string;
  /** Peso de referência da porção do JSON (em gramas) */
  referenceGrams: number;
  /** Calorias por 100 g (normalizado) */
  kcalPer100g: number;
  /** Proteínas por 100 g (normalizado) */
  proteinPer100g: number;
  /** Lipídeos por 100 g (normalizado) */
  lipidsPer100g: number;
  /** Carboidratos por 100 g (normalizado) */
  carbsPer100g: number;
  /** Fibras por 100 g (normalizado) */
  fiberPer100g: number;
}

/**
 * Medida caseira — define um tipo de porção e seu peso equivalente em gramas.
 */
export interface FoodMeasure {
  /** Rótulo exibido no seletor */
  label: string;
  /** Peso aproximado em gramas dessa medida */
  weightGrams: number;
}

/**
 * Resultado de um cálculo nutricional para uma linha de dieta.
 */
export interface NutritionResult {
  calories: number;
  proteins: number;
  carbs: number;
  lipids: number;
  totalGrams: number;
}
