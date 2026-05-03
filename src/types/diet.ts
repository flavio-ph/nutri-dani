export interface DietItem {
  id: string;
  food: string;
  quantity: string;
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
