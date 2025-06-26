'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  reportContent: string;
  metadata: {
    title: string;
    generatedAt: string;
    userRequest: string;
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
  };
  questionnaire: any;
  answers: Record<string, string>;
}

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        generateReport(parsedData);
      } catch (err) {
        setError('Données invalides');
        setLoading(false);
      }
    } else {
      setError('Aucune donnée trouvée');
      setLoading(false);
    }
  }, [searchParams]);

  const generateReport = async (data: any) => {
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const result = await response.json();
      setReportData(result);
    } catch (err) {
      setError('Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current || !reportData) return;

    try {
      // Créer une copie de l'élément pour le PDF avec des styles compatibles
      const clonedElement = reportRef.current.cloneNode(true) as HTMLElement;
      
      // Remplacer les couleurs oklch par des couleurs RGB/HEX compatibles
      const replaceOklchColors = (element: HTMLElement) => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_ELEMENT,
          null
        );

        let node;
        while (node = walker.nextNode()) {
          const el = node as HTMLElement;
          const computedStyle = window.getComputedStyle(el);
          
          // Convertir les couleurs problématiques en couleurs sûres
          if (computedStyle.backgroundColor.includes('oklch') || 
              computedStyle.color.includes('oklch') ||
              computedStyle.borderColor.includes('oklch')) {
            
            // Appliquer des couleurs de fallback sûres
            el.style.backgroundColor = el.style.backgroundColor || 'transparent';
            el.style.color = el.style.color || '#374151';
            el.style.borderColor = el.style.borderColor || '#d1d5db';
          }

          // Remplacer les gradients complexes par des couleurs solides
          if (computedStyle.backgroundImage.includes('gradient')) {
            if (el.className.includes('from-blue')) {
              el.style.backgroundColor = '#3b82f6';
              el.style.backgroundImage = 'none';
            } else if (el.className.includes('from-purple')) {
              el.style.backgroundColor = '#8b5cf6';
              el.style.backgroundImage = 'none';
            } else if (el.className.includes('from-emerald')) {
              el.style.backgroundColor = '#10b981';
              el.style.backgroundImage = 'none';
            }
          }
        }
      };

      // Ajouter l'élément cloné temporairement au DOM
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = reportRef.current.offsetWidth + 'px';
      document.body.appendChild(clonedElement);

      // Remplacer les couleurs problématiques
      replaceOklchColors(clonedElement);

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: clonedElement.scrollHeight,
        width: clonedElement.scrollWidth,
        logging: false,
        onclone: (clonedDoc) => {
          // Assurer que toutes les couleurs sont compatibles dans le document cloné
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              color: inherit !important;
              background-color: inherit !important;
            }
            .bg-gradient-to-r { background-image: none !important; }
            .bg-gradient-to-br { background-image: none !important; }
            .bg-clip-text { background-clip: unset !important; -webkit-background-clip: unset !important; }
            .text-transparent { color: #374151 !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Supprimer l'élément temporaire
      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${reportData.metadata.title.replace(/[^a-z0-9]/gi, '_')}_rapport.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de la génération du PDF. Les couleurs modernes ne sont pas supportées. Essayez l\'export HTML à la place.');
    }
  };

  const exportToHTML = () => {
    if (!reportData) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.metadata.title}</title>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1, h2, h3 { color: #2563eb; }
        h1 { border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        .metadata { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .answers { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
        ul, ol { padding-left: 20px; }
        strong { color: #1e40af; }
    </style>
</head>
<body>
    <div class="metadata">
        <h2>📋 Informations du rapport</h2>
        <p><strong>Généré le:</strong> ${new Date(reportData.metadata.generatedAt).toLocaleString('fr-FR')}</p>
        <p><strong>Demande initiale:</strong> ${reportData.metadata.userRequest}</p>
        <p><strong>Taux de complétion:</strong> ${reportData.metadata.completionRate}% (${reportData.metadata.answeredQuestions}/${reportData.metadata.totalQuestions} questions)</p>
    </div>
    
    ${reportData.reportContent.replace(/\n/g, '<br>')}
    
    <div class="answers">
        <h2>📝 Détail des réponses</h2>
        ${reportData.questionnaire.questions.map((q: { question: string; id: string }) => `
            <p><strong>${q.question}:</strong> ${reportData.answers[q.id] || 'Non répondu'}</p>
        `).join('')}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.metadata.title.replace(/[^a-z0-9]/gi, '_')}_rapport.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    if (!reportData) return;

    const markdownContent = `# ${reportData.metadata.title}

## 📋 Informations du rapport
- **Généré le:** ${new Date(reportData.metadata.generatedAt).toLocaleString('fr-FR')}
- **Demande initiale:** ${reportData.metadata.userRequest}
- **Taux de complétion:** ${reportData.metadata.completionRate}% (${reportData.metadata.answeredQuestions}/${reportData.metadata.totalQuestions} questions)

---

${reportData.reportContent}

---

## 📝 Détail des réponses

${reportData.questionnaire.questions.map((q: { question: string; id: string }) => 
  `**${q.question}:** ${reportData.answers[q.id] || 'Non répondu'}`
).join('\n\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.metadata.title.replace(/[^a-z0-9]/gi, '_')}_rapport.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (!reportData) return;

    // Extraire seulement les informations essentielles
    const essentialData = {
      titre: reportData.metadata.title,
      demande: reportData.metadata.userRequest,
      date_generation: new Date(reportData.metadata.generatedAt).toLocaleDateString('fr-FR'),
      taux_completion: `${reportData.metadata.completionRate}%`,
      
      // Extraire les réponses importantes seulement
      reponses_cles: Object.fromEntries(
        Object.entries(reportData.answers).filter(([, value]) => value && value.trim() !== '')
      ),
      
      // Résumé du contenu du rapport (premières lignes)
      resume: reportData.reportContent.split('\n').slice(0, 3).join(' ').substring(0, 200) + '...',
      
      // Métadonnées minimales
      statistiques: {
        questions_repondues: reportData.metadata.answeredQuestions,
        total_questions: reportData.metadata.totalQuestions
      }
    };

    const blob = new Blob([JSON.stringify(essentialData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.metadata.title.replace(/[^a-z0-9]/gi, '_')}_essentiel.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ['Question', 'Réponse', 'Type', 'Requis'],
      ...reportData.questionnaire.questions.map((q: { question: string; id: string; type: string; required: boolean }) => [
        q.question,
        reportData.answers[q.id] || 'Non répondu',
        q.type,
        q.required ? 'Oui' : 'Non'
      ])
    ].map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.metadata.title.replace(/[^a-z0-9]/gi, '_')}_reponses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération du rapport en cours...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{reportData.metadata.title}</h1>
              <p className="text-sm text-gray-500">
                Généré le {new Date(reportData.metadata.generatedAt).toLocaleString('fr-FR')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Retour
              </button>

              {/* Boutons d'export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  title="Exporter en PDF"
                >
                  📄 PDF
                </button>
                <button
                  onClick={exportToHTML}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  title="Exporter en HTML"
                >
                  🌐 HTML
                </button>
                <button
                  onClick={exportToMarkdown}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  title="Exporter en Markdown"
                >
                  📝 MD
                </button>
                <button
                  onClick={exportToJSON}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  title="Exporter en JSON"
                >
                  📊 JSON
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  title="Exporter en CSV"
                >
                  📈 CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div ref={reportRef} className="relative">
          {/* Formes décoratives en arrière-plan */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -z-10"></div>
          <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 -z-10"></div>
          
          <div className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
            {/* Gradient décoratif en header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            {/* En-tête compact et coloré */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8 relative">
              <div className="absolute top-4 right-4 text-4xl">🎯</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Rapport d&apos;analyse
              </h2>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700">
                    <span className="font-semibold text-green-600">{reportData.metadata.completionRate}%</span> complété
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-600 italic">&ldquo;{reportData.metadata.userRequest}&rdquo;</span>
                </div>
              </div>
            </div>

            {/* Contenu du rapport avec style moderne */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 pb-4 border-b-4 border-gradient-to-r from-blue-500 to-purple-500 relative">
                      <div className="absolute -left-4 top-0 text-5xl">📊</div>
                      <span className="ml-12">{children}</span>
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-10 flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                      <span className="text-3xl">✨</span>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-indigo-700 mb-4 mt-8 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 mb-6">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-3 mb-6">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3 flex-shrink-0"></span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-6 py-4 my-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-r-xl italic text-gray-700 relative">
                      <span className="absolute top-2 left-2 text-2xl text-blue-400">💭</span>
                      <div className="ml-8">{children}</div>
                    </blockquote>
                  ),
                }}
              >
                {reportData.reportContent}
              </ReactMarkdown>
            </div>

            {/* Footer avec statistiques visuelles */}
            <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800">Analyse terminée</p>
                    <p className="text-sm text-emerald-600">
                      {reportData.metadata.answeredQuestions} réponses collectées avec succès
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-600">Généré le</p>
                  <p className="font-medium text-emerald-800">
                    {new Date(reportData.metadata.generatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
