export interface DietItem {
  id: string;
  /** Texto de exibição do alimento (compatível com o exportador de PDF) */
  food: string;
  /** Texto de exibição da quantidade (ex: "2 col. sopa (30g)") */
  quantity: string;

  // ── Campos relacionais (preenchidos pelo autocomplete) ──────────────────
  /** Índice do alimento em tabelas-oficiais.json — opcional para retrocompatibilidade */
  foodId?: string;
  /** Tipo de medida caseira selecionada (ex: "Colher de sopa") */
  measureType?: string;
  /** Peso em gramas da medida caseira escolhida */
  measureWeight?: number;
  /** Quantidade numérica inserida pelo usuário (ex: 2) */
  measureQty?: number;

  // ── Campos calculados ───────────────────────────────────────────────────
  calories?: number;
  proteins?: number;
  carbs?: number;
  lipids?: number;
}

export interface MealSectionData {
  id: string;
  title: string;
  subtitle?: string;
  items: DietItem[];
  notes?: string;        // Orientações
  substitution?: string; // Pode substituir por
  conditionalNote?: string; // Ex: "Fazer o lanche da manhã apenas se sentir fome"
}

export interface DietPlan {
  patientName: string;
  date: string;
  header: string; // Cabeçalho livre editável
  nutritionist: string;
  crn: string;
  sections: MealSectionData[];
}
