import type { DietPlan, MealSectionData } from '../../types/diet';

// ── HTML builder helpers ─────────────────────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMealTable(section: MealSectionData): string {
  const visibleItems = section.items.filter(
    (it) => it.food.trim() !== '' || it.quantity.trim() !== ''
  );

  const rows = visibleItems.length > 0
    ? visibleItems.map(
        (item) => `
        <tr>
          <td>${esc(item.food.toUpperCase())}</td>
          <td>${esc(item.quantity.toUpperCase())}</td>
        </tr>`
      ).join('')
    : '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>';

  return `
    <table>
      <thead>
        <tr>
          <th style="width:65%">ALIMENTO</th>
          <th style="width:35%">QUANTIDADE</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildSection(section: MealSectionData): string {
  const titleLine = section.subtitle
    ? `${section.title.toUpperCase()} – ${section.subtitle.toUpperCase()}`
    : section.title.toUpperCase();

  const conditionalNote = section.conditionalNote?.trim()
    ? `<p class="note italic">${esc(section.conditionalNote)}</p>`
    : '';

  const substitution = section.substitution?.trim()
    ? `<p class="note italic">Pode substituir por: ${esc(section.substitution)}</p>`
    : '';

  const notes = section.notes?.trim()
    ? `<p class="orientacoes"><strong>ORIENTAÇÕES:</strong> ${esc(section.notes)}</p>`
    : '';

  return `
    <div class="meal-section">
      <h3 class="meal-title">${esc(titleLine)}</h3>
      ${buildMealTable(section)}
      ${conditionalNote}
      ${substitution}
      ${notes}
    </div>`;
}

function buildHTML(plan: DietPlan): string {
  const sections = plan.sections.map(buildSection).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dieta – ${esc(plan.patientName || 'Paciente')}</title>
  <style>
    /* ── Reset ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Page ─────────────────────────────────────────── */
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 18mm;
    }

    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 10.5pt;
      color: #1a1a1a;
      background: #fff;
      line-height: 1.4;
    }

    /* ── Header ───────────────────────────────────────── */
    .doc-header {
      text-align: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #4A5B42;
    }

    .doc-title {
      font-size: 15pt;
      font-weight: bold;
      color: #4A5B42;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .doc-nutritionist {
      font-size: 10.5pt;
      font-weight: bold;
      color: #2c2c2c;
    }

    .doc-crn {
      font-size: 9.5pt;
      color: #555;
    }

    /* ── Patient Info ─────────────────────────────────── */
    .patient-info {
      display: flex;
      justify-content: space-between;
      margin: 8px 0 14px;
      font-size: 10pt;
      gap: 10px;
    }

    .patient-info span {
      font-weight: normal;
    }

    .patient-info strong {
      font-weight: bold;
    }

    /* ── Meal Section ─────────────────────────────────── */
    .meal-section {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }

    .meal-title {
      font-size: 10.5pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      background-color: #E8EDE5;
      padding: 4px 8px;
      border: 1px solid #c0cebb;
      letter-spacing: 0.5px;
      margin-bottom: 0;
    }

    /* ── Table ────────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }

    thead tr {
      background-color: #D9E1D4;
    }

    th {
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 3px 7px;
      border: 1px solid #aab8a5;
      text-align: left;
    }

    td {
      padding: 3px 7px;
      border: 1px solid #c8d4c4;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background-color: #f7f9f6;
    }

    /* ── Notes ────────────────────────────────────────── */
    .note {
      font-size: 9.5pt;
      margin-top: 3px;
      color: #333;
    }

    .note.italic {
      font-style: italic;
    }

    .orientacoes {
      font-size: 9.5pt;
      margin-top: 4px;
      color: #1a1a1a;
    }

    /* ── Footer ───────────────────────────────────────── */
    .doc-footer {
      text-align: center;
      font-size: 8.5pt;
      color: #888;
      font-style: italic;
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
    }

    /* ── Print overrides ──────────────────────────────── */
    @media print {
      body { background: #fff; }
      .meal-section { page-break-inside: avoid; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="doc-header">
    ${plan.header.trim() ? `<div class="doc-title">${esc(plan.header)}</div>` : ''}
    ${plan.nutritionist.trim() ? `<div class="doc-nutritionist">${esc(plan.nutritionist)}</div>` : ''}
    ${plan.crn.trim() ? `<div class="doc-crn">${esc(plan.crn)}</div>` : ''}
  </div>

  <!-- Patient info -->
  <div class="patient-info">
    <div><strong>PACIENTE:</strong> <span>${esc(plan.patientName.toUpperCase() || '—')}</span></div>
    <div><strong>DATA:</strong> <span>${esc(plan.date || '—')}</span></div>
  </div>

  <!-- Meal sections -->
  ${sections}

  <!-- Footer -->
  <div class="doc-footer">
    Este plano alimentar é individualizado e não deve ser compartilhado.
  </div>

</body>
</html>`;
}

// ── Main export function ─────────────────────────────────────────────────────

export function exportDietToPDF(plan: DietPlan): void {
  const html = buildHTML(plan);

  // Open a new window, write the HTML, and trigger print → Save as PDF
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    alert('Seu navegador bloqueou a janela de impressão. Permita pop-ups para este site e tente novamente.');
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();

  // Wait for resources to load before printing
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  // Fallback if onload doesn't fire
  setTimeout(() => {
    if (!win.closed) {
      win.focus();
      win.print();
    }
  }, 1000);
}
