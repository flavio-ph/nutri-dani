import { useState, useCallback } from 'react';
import { PlusCircle, FileDown, Loader2, RotateCcw, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { DietPlan, MealSectionData } from '../../types/diet';
import MealSection from './MealSection';
import { exportDietToPDF } from './DietExporter';

// ── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptySection(title: string, subtitle?: string): MealSectionData {
  return {
    id: genId(),
    title,
    subtitle,
    items: [{ id: genId(), food: '', quantity: '' }],
    notes: '',
    substitution: '',
    conditionalNote: '',
  };
}

const DEFAULT_SECTIONS: MealSectionData[] = [
  emptySection('Café da Manhã', 'Opção 1'),
  emptySection('Café da Manhã', 'Opção 2'),
  emptySection('Lanche da Manhã'),
  emptySection('Almoço'),
  emptySection('Lanche da Tarde', 'Opção 1'),
  emptySection('Lanche da Tarde', 'Opção 2'),
  emptySection('Jantar'),
];

const INITIAL_PLAN: DietPlan = {
  patientName: '',
  date: new Date().toLocaleDateString('pt-BR'),
  header: 'Plano Alimentar',
  nutritionist: 'Daniele Alves – Nutricionista',
  crn: 'CRN: ',
  sections: DEFAULT_SECTIONS,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DietBuilder() {
  const [plan, setPlan] = useState<DietPlan>(INITIAL_PLAN);
  const [isExporting, setIsExporting] = useState(false);
  const [showHeaderPanel, setShowHeaderPanel] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const updatePlan = (partial: Partial<DietPlan>) =>
    setPlan((prev) => ({ ...prev, ...partial }));

  const updateSection = useCallback((id: string, updated: MealSectionData) => {
    setPlan((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? updated : s)),
    }));
  }, []);

  const deleteSection = (id: string) =>
    setPlan((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));

  const addSection = () =>
    setPlan((prev) => ({
      ...prev,
      sections: [...prev.sections, emptySection('Nova Refeição')],
    }));

  const toggleCollapse = (id: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportDietToPDF(plan);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os dados e começar uma nova dieta?')) {
      setPlan({ ...INITIAL_PLAN, sections: DEFAULT_SECTIONS.map((s) => ({ ...s, id: genId(), items: [{ id: genId(), food: '', quantity: '' }] })) });
      setCollapsedSections(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121411] font-sans">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#121411]/90 backdrop-blur-md border-b border-[#E1E8DE] dark:border-[#2A3526] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-[#5E7153] hover:text-[#4A5B42] text-sm font-medium transition-colors hidden sm:block"
            >
              ← Site
            </a>
            <span className="text-[#E1E8DE] dark:text-[#2A3526] hidden sm:block">|</span>
            <h1 className="font-display text-lg font-bold text-[#4A5B42] dark:text-[#A8C09A] italic">
              Criador de Dieta
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Nova dieta"
              className="p-2 rounded-lg text-[#A68B67] hover:text-[#8B6E4E] hover:bg-[#E9E6E1] dark:hover:bg-[#2A251D] transition-colors"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-[#5E7153] hover:bg-[#4A5B42] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              {isExporting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileDown size={15} />
              )}
              {isExporting ? 'Gerando...' : 'Baixar PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Document Header Panel ─────────────────────────────────────── */}
        <section className="bg-white dark:bg-[#1E211C] rounded-2xl border border-[#E1E8DE] dark:border-[#2A3526] shadow-sm overflow-hidden">
          <button
            onClick={() => setShowHeaderPanel((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 bg-[#5E7153] text-white text-sm font-semibold"
          >
            <span>📄 Informações do Documento</span>
            {showHeaderPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence initial={false}>
            {showHeaderPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Header text */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      Título do Documento
                    </label>
                    <input
                      value={plan.header}
                      onChange={(e) => updatePlan({ header: e.target.value })}
                      placeholder="Ex: Plano Alimentar Individualizado"
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40 font-semibold"
                    />
                  </div>

                  {/* Nutritionist */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      Nutricionista
                    </label>
                    <input
                      value={plan.nutritionist}
                      onChange={(e) => updatePlan({ nutritionist: e.target.value })}
                      placeholder="Ex: Daniele Alves – Nutricionista"
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40"
                    />
                  </div>

                  {/* CRN */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      CRN / Registro
                    </label>
                    <input
                      value={plan.crn}
                      onChange={(e) => updatePlan({ crn: e.target.value })}
                      placeholder="Ex: CRN-3: 12345"
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40"
                    />
                  </div>

                  {/* Patient name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      Nome do Paciente
                    </label>
                    <input
                      value={plan.patientName}
                      onChange={(e) => updatePlan({ patientName: e.target.value })}
                      placeholder="Nome completo do paciente"
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      Data
                    </label>
                    <input
                      value={plan.date}
                      onChange={(e) => updatePlan({ date: e.target.value })}
                      placeholder="Ex: 03/05/2026"
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 placeholder-[#2C2C2C]/30 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Meal Sections ─────────────────────────────────────────────── */}
        <div className="space-y-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] uppercase tracking-widest text-[#A68B67] font-semibold">
              Refeições ({plan.sections.length})
            </h2>
            <button
              onClick={() => {
                const allIds = plan.sections.map((s) => s.id);
                const allCollapsed = allIds.every((id) => collapsedSections.has(id));
                if (allCollapsed) {
                  setCollapsedSections(new Set());
                } else {
                  setCollapsedSections(new Set(allIds));
                }
              }}
              className="text-[10px] uppercase tracking-wider text-[#5E7153] hover:text-[#4A5B42] font-medium transition-colors"
            >
              {plan.sections.every((s) => collapsedSections.has(s.id))
                ? 'Expandir todas'
                : 'Recolher todas'}
            </button>
          </div>

          <AnimatePresence>
            {plan.sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                {/* Collapsible wrapper */}
                <div className="bg-white dark:bg-[#1E211C] border border-[#E1E8DE] dark:border-[#2A3526] rounded-2xl shadow-sm overflow-hidden mb-4">
                  {/* Collapse toggle bar */}
                  <button
                    onClick={() => toggleCollapse(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F4F7F2] dark:bg-[#1A221A] hover:bg-[#E8EDE5] dark:hover:bg-[#1E281E] transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-[#4A5B42] dark:text-[#A8C09A] uppercase tracking-wide">
                      {section.title}
                      {section.subtitle && (
                        <span className="ml-2 text-[10px] text-[#5E7153]/70 font-medium normal-case tracking-normal">
                          – {section.subtitle}
                        </span>
                      )}
                    </span>
                    <span className="text-[#5E7153]">
                      {collapsedSections.has(section.id) ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronUp size={15} />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {!collapsedSections.has(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <MealSection
                          section={section}
                          onChange={(updated) => updateSection(section.id, updated)}
                          onDelete={() => deleteSection(section.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Add Section Button ───────────────────────────────────────── */}
        <button
          onClick={addSection}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#5E7153]/40 hover:border-[#5E7153] text-[#5E7153] hover:text-[#4A5B42] rounded-2xl py-4 text-sm font-semibold transition-all hover:bg-[#5E7153]/5"
        >
          <PlusCircle size={16} />
          Adicionar Refeição
        </button>

        {/* ── Export CTA ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#5E7153] to-[#4A5B42] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-white">
            <p className="font-bold text-lg font-display italic">Pronta para exportar?</p>
            <p className="text-white/70 text-sm mt-0.5">
              {plan.patientName
                ? `Dieta de ${plan.patientName}`
                : 'Preencha o nome do paciente no cabeçalho'}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-white text-[#4A5B42] hover:bg-[#E1E8DE] disabled:opacity-60 font-bold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileDown size={16} />
            )}
            {isExporting ? 'Gerando...' : 'Baixar Dieta (PDF)'}
          </button>
        </div>

        <p className="text-center text-xs text-[#2C2C2C]/40 dark:text-white/30 pb-8">
          Daniele Alves – Nutricionista · Ferramenta Interna
        </p>
      </main>
    </div>
  );
}
