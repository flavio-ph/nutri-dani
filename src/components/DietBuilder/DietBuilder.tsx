import { useState, useCallback, useEffect } from 'react';
import { PlusCircle, FileDown, Loader2, RotateCcw, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';
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
  date: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD para input[type=date]
  header: 'Plano Alimentar',
  nutritionist: 'Daniele Alves – Nutricionista',
  crn: 'CRN-5/26511',
  sections: DEFAULT_SECTIONS,
};

/** Formata data ISO para pt-BR (para PDF e exibição) */
function formatDateBR(isoDate: string): string {
  if (!isoDate) return '';
  // Se já está no formato dd/mm/yyyy, retorna direto
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) return isoDate;
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

/** Soma de todos os macros de todas as seções */
function sumAllMacros(sections: MealSectionData[]) {
  return sections.reduce(
    (acc, section) =>
      section.items.reduce(
        (a, it) => ({
          calories: a.calories + (it.calories ?? 0),
          proteins: a.proteins + (it.proteins ?? 0),
          carbs: a.carbs + (it.carbs ?? 0),
          lipids: a.lipids + (it.lipids ?? 0),
        }),
        acc,
      ),
    { calories: 0, proteins: 0, carbs: 0, lipids: 0 },
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DietBuilder() {
  // Inicializa a partir do localStorage se existir
  const [plan, setPlan] = useState<DietPlan>(() => {
    try {
      const saved = localStorage.getItem('dietPlan');
      return saved ? JSON.parse(saved) : INITIAL_PLAN;
    } catch {
      return INITIAL_PLAN;
    }
  });

  // Dark mode persistente
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showHeaderPanel, setShowHeaderPanel] = useState(true);

  // Começa com todas as seções colapsadas
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(plan.sections.map((s) => s.id)),
  );

  // Sincroniza dark mode com o DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Persiste o plano no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('dietPlan', JSON.stringify(plan));
    } catch {
      // quota exceeded — ignora silenciosamente
    }
  }, [plan]);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

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

  const addSection = () => {
    const newSection = emptySection('Nova Refeição');
    setPlan((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    // Nova seção começa expandida para o usuário editar
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.delete(newSection.id);
      return next;
    });
  };

  const toggleCollapse = (id: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleExport = () => {
    setIsExporting(true);
    setExportError(null);
    try {
      // Formata a data para pt-BR antes de exportar
      const planForExport = { ...plan, date: formatDateBR(plan.date) };
      exportDietToPDF(planForExport);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      setExportError('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os dados e começar uma nova dieta?')) {
      const freshSections = DEFAULT_SECTIONS.map((s) => ({
        ...s,
        id: genId(),
        items: [{ id: genId(), food: '', quantity: '' }],
      }));
      const freshPlan = { ...INITIAL_PLAN, sections: freshSections };
      setPlan(freshPlan);
      setCollapsedSections(new Set(freshSections.map((s) => s.id)));
    }
  };

  // Totais globais da dieta
  const globalTotals = sumAllMacros(plan.sections);
  const hasAnyMacro = plan.sections.some((s) =>
    s.items.some((it) => it.calories !== undefined),
  );

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
            {/* Toggle dark mode */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); toggleTheme(); }}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="p-2 rounded-lg text-[#A68B67] hover:text-[#8B6E4E] hover:bg-[#E9E6E1] dark:hover:bg-[#2A251D] transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={handleReset}
              title="Nova dieta"
              aria-label="Limpar e iniciar nova dieta"
              className="p-2 rounded-lg text-[#A68B67] hover:text-[#8B6E4E] hover:bg-[#E9E6E1] dark:hover:bg-[#2A251D] transition-colors"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              aria-label="Baixar dieta em PDF"
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
        {/* Feedback de erro na exportação */}
        {exportError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
            <span>{exportError}</span>
            <button
              onClick={() => setExportError(null)}
              aria-label="Fechar mensagem de erro"
              className="text-red-400 hover:text-red-600 ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Document Header Panel ─────────────────────────────────────── */}
        <section className="bg-white dark:bg-[#1E211C] rounded-2xl border border-[#E1E8DE] dark:border-[#2A3526] shadow-sm overflow-hidden">
          <button
            onClick={() => setShowHeaderPanel((v) => !v)}
            aria-label={showHeaderPanel ? 'Recolher informações do documento' : 'Expandir informações do documento'}
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

                  {/* Date — agora type="date" para consistência */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#5E7153] font-semibold">
                      Data
                    </label>
                    <input
                      type="date"
                      value={plan.date}
                      onChange={(e) => updatePlan({ date: e.target.value })}
                      className="w-full text-sm bg-[#FDFBF7] dark:bg-[#161A14] text-[#2C2C2C] dark:text-[#FDFBF7] border border-[#E1E8DE] dark:border-[#2A3526] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5E7153]/40"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Painel de Totais Globais ───────────────────────────────────── */}
        {hasAnyMacro && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E211C] rounded-2xl border border-[#E1E8DE] dark:border-[#2A3526] shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3 bg-[#4A5B42] text-white text-sm font-semibold flex items-center gap-2">
              <span>📊 Totais do Dia</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Calorias */}
              <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-1">kcal</span>
                <span className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
                  {globalTotals.calories.toFixed(0)}
                </span>
                <span className="text-[10px] text-amber-600/60 dark:text-amber-400/60 mt-0.5">calorias</span>
              </div>
              {/* Proteínas */}
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <span className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">ptn</span>
                <span className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                  {globalTotals.proteins.toFixed(1)}
                </span>
                <span className="text-[10px] text-blue-600/60 dark:text-blue-400/60 mt-0.5">gramas</span>
              </div>
              {/* Carboidratos */}
              <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                <span className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-bold mb-1">cho</span>
                <span className="text-2xl font-bold tabular-nums text-green-700 dark:text-green-400">
                  {globalTotals.carbs.toFixed(1)}
                </span>
                <span className="text-[10px] text-green-600/60 dark:text-green-400/60 mt-0.5">gramas</span>
              </div>
              {/* Lipídeos */}
              <div className="flex flex-col items-center bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3">
                <span className="text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold mb-1">lip</span>
                <span className="text-2xl font-bold tabular-nums text-rose-700 dark:text-rose-400">
                  {globalTotals.lipids.toFixed(1)}
                </span>
                <span className="text-[10px] text-rose-600/60 dark:text-rose-400/60 mt-0.5">gramas</span>
              </div>
            </div>
            {/* Barras de macro proporcionais */}
            {(() => {
              const total = globalTotals.proteins * 4 + globalTotals.carbs * 4 + globalTotals.lipids * 9;
              if (total === 0) return null;
              const pPct = (globalTotals.proteins * 4 / total) * 100;
              const cPct = (globalTotals.carbs * 4 / total) * 100;
              const lPct = (globalTotals.lipids * 9 / total) * 100;
              return (
                <div className="px-4 pb-4">
                  <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
                    <div className="bg-blue-400 dark:bg-blue-500 transition-all" style={{ width: `${pPct}%` }} title={`Proteína ${pPct.toFixed(0)}%`} />
                    <div className="bg-green-400 dark:bg-green-500 transition-all" style={{ width: `${cPct}%` }} title={`Carboidrato ${cPct.toFixed(0)}%`} />
                    <div className="bg-rose-400 dark:bg-rose-500 transition-all" style={{ width: `${lPct}%` }} title={`Lipídeo ${lPct.toFixed(0)}%`} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-[#2C2C2C]/50 dark:text-white/40">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Ptn {pPct.toFixed(0)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />CHO {cPct.toFixed(0)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Lip {lPct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })()}
          </motion.section>
        )}

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
              aria-label="Expandir ou recolher todas as refeições"
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
                    aria-label={`${collapsedSections.has(section.id) ? 'Expandir' : 'Recolher'} refeição ${section.title}`}
                    aria-expanded={!collapsedSections.has(section.id)}
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
          aria-label="Adicionar nova refeição"
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
            aria-label="Baixar dieta em PDF"
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
