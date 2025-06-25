'use client';

import { StepFormData } from './StepForm';
import { downloadHTMLAsPDF, downloadAsPDF, generateXMLContent } from '../../utils/fileGenerators';

export interface EventSummaryData extends StepFormData {
  generatedAt: string;
  recommendations?: {
    venue: string[];
    catering: string[];
    entertainment: string[];
    decoration: string[];
    timeline: string[];
  };
}

interface EventSummaryProps {
  data: EventSummaryData;
  onBackToChat: () => void;
}

export default function EventSummary({ data, onBackToChat }: EventSummaryProps) {
  
  const generateRecommendations = (data: StepFormData) => {
    // Logique simple pour générer des recommandations basées sur les données
    const recommendations = {
      venue: [] as string[],
      catering: [] as string[],
      entertainment: [] as string[],
      decoration: [] as string[],
      timeline: [] as string[]
    };

    // Recommandations basées sur le type d'événement
    if (data.eventType === 'mariage') {
      recommendations.venue = ['Château', 'Domaine viticole', 'Salle de réception élégante'];
      recommendations.catering = ['Menu gastronomique', 'Cocktail dînatoire', 'Buffet raffiné'];
      recommendations.entertainment = ['DJ mariage', 'Groupe live', 'Photobooth'];
    } else if (data.eventType === 'conférence') {
      recommendations.venue = ['Centre de congrès', 'Hôtel business', 'Espace coworking'];
      recommendations.catering = ['Pause café', 'Déjeuner d\'affaires', 'Cocktail networking'];
      recommendations.entertainment = ['Conférenciers', 'Animation interactive', 'Espace networking'];
    }

    // Recommandations basées sur le budget
    if (data.budget < 2000) {
      recommendations.venue.push('Salle municipale', 'Chez vous', 'Parc public');
    } else if (data.budget > 10000) {
      recommendations.venue.push('Lieu d\'exception', 'Hôtel de luxe', 'Château privé');
    }

    // Timeline basée sur le nombre d'invités
    if (data.guests < 20) {
      recommendations.timeline = ['2h de préparation', '3h d\'événement', '1h de rangement'];
    } else if (data.guests > 100) {
      recommendations.timeline = ['1 jour de préparation', '6h d\'événement', '2h de rangement'];
    }

    return recommendations;
  };

  const eventSummary: EventSummaryData = {
    ...data,
    generatedAt: new Date().toISOString(),
    recommendations: generateRecommendations(data)
  };

  const downloadAsJSON = () => {
    const jsonData = JSON.stringify(eventSummary, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsMarkdown = () => {
    const markdown = `# Résumé de votre événement - ${data.eventType}

*Généré par Evently-AI le ${new Date().toLocaleDateString('fr-FR')}*

## 📝 Informations générales

- **Type d'événement** : ${data.eventType}
- **Organisation** : ${data.projectType}
- **Nombre d'invités** : ${data.guests} personnes
- **Budget** : ${data.budget}€
- **Date souhaitée** : ${data.date}
- **Lieu** : ${data.location}

## 🎨 Style et ambiance

- **Thème** : ${data.theme}
- **Ambiance** : ${data.atmosphere}
- **Priorité principale** : ${data.priority}

## 👤 Profil organisateur

- **Expérience** : ${data.status}
- **Âge moyen des invités** : ${data.age} ans

## 💡 Recommandations

### Lieux suggérés
${eventSummary.recommendations?.venue.map(v => `- ${v}`).join('\n') || '- À définir selon vos préférences'}

### Restauration
${eventSummary.recommendations?.catering.map(c => `- ${c}`).join('\n') || '- À définir selon votre budget'}

### Animation
${eventSummary.recommendations?.entertainment.map(e => `- ${e}`).join('\n') || '- À définir selon l\'ambiance souhaitée'}

### Timeline suggérée
${eventSummary.recommendations?.timeline.map(t => `- ${t}`).join('\n') || '- À définir selon la complexité'}

## ✅ Prochaines étapes

1. **Réserver le lieu** - Contactez les lieux suggérés
2. **Confirmer la date** - Vérifiez la disponibilité
3. **Budget détaillé** - Répartition par poste de dépense
4. **Invitations** - Préparer la liste et les invitations
5. **Prestataires** - Contacter les fournisseurs recommandés

---
*Ce résumé a été généré par Evently-AI pour vous aider dans l'organisation de votre événement.*`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsXML = () => {
    const xmlContent = generateXMLContent(eventSummary);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadAsHTML = () => {
    downloadHTMLAsPDF(eventSummary);
  };

  const downloadPDF = async () => {
    await downloadAsPDF(eventSummary);
  };

  const downloadAsCSV = () => {
    const csv = `Champ,Valeur
Type d'événement,${data.eventType}
Organisation,${data.projectType}
Nombre d'invités,${data.guests}
Budget,${data.budget}€
Date souhaitée,${data.date}
Lieu,${data.location}
Thème,${data.theme}
Ambiance,${data.atmosphere}
Priorité,${data.priority}
Expérience organisateur,${data.status}
Âge moyen invités,${data.age} ans
Date de génération,${new Date().toLocaleDateString('fr-FR')}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const text = `🎉 Résumé de votre ${data.eventType}

📅 Date: ${data.date}
📍 Lieu: ${data.location}
👥 Invités: ${data.guests} personnes
💰 Budget: ${data.budget}€
🎨 Thème: ${data.theme}
✨ Ambiance: ${data.atmosphere}
🎯 Priorité: ${data.priority}

Généré par Evently-AI 🤖`;

    try {
      await navigator.clipboard.writeText(text);
      alert('Résumé copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--chat-input-border)] rounded-xl p-8">
        
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToChat}
            className="text-[var(--accent-teal)] hover:text-[var(--accent-teal-dark)] font-medium flex items-center"
          >
            ← Retour au chat
          </button>
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">
            📋 Résumé de votre événement
          </h2>
          <div className="w-24"></div> {/* Spacer pour centrer le titre */}
        </div>

        {/* Résumé visuel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">🎉 Événement</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.eventType}</p>
              <p className="text-sm text-[var(--text-muted)]">{data.projectType}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">👥 Invités & Budget</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.guests} personnes</p>
              <p className="text-sm text-[var(--text-muted)]">{data.budget}€ de budget</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">📅 Date & Lieu</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.date}</p>
              <p className="text-sm text-[var(--text-muted)]">{data.location}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">🎨 Style</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.theme}</p>
              <p className="text-sm text-[var(--text-muted)]">{data.atmosphere}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">🎯 Priorité</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.priority}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
              <h3 className="font-semibold text-[var(--text-dark)] mb-2">👤 Profil</h3>
              <p className="text-[var(--accent-teal)] font-medium">{data.status}</p>
              <p className="text-sm text-[var(--text-muted)]">Âge moyen: {data.age} ans</p>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        {eventSummary.recommendations && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[var(--text-dark)] mb-4">💡 Nos recommandations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventSummary.recommendations.venue.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
                  <h4 className="font-medium text-[var(--text-dark)] mb-2">📍 Lieux suggérés</h4>
                  <ul className="text-sm space-y-1">
                    {eventSummary.recommendations.venue.map((venue, index) => (
                      <li key={index} className="text-[var(--text-muted)]">• {venue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {eventSummary.recommendations.catering.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-[var(--chat-input-border)]">
                  <h4 className="font-medium text-[var(--text-dark)] mb-2">🍽️ Restauration</h4>
                  <ul className="text-sm space-y-1">
                    {eventSummary.recommendations.catering.map((catering, index) => (
                      <li key={index} className="text-[var(--text-muted)]">• {catering}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Options de téléchargement */}
        <div className="border-t border-[var(--chat-input-border)] pt-6">
          <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">📥 Télécharger votre résumé</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <button
              onClick={downloadPDF}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">📕</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">PDF</span>
              <span className="text-xs text-[var(--text-muted)]">Document</span>
            </button>

            <button
              onClick={downloadAsJSON}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">📄</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">JSON</span>
              <span className="text-xs text-[var(--text-muted)]">Données</span>
            </button>

            <button
              onClick={downloadAsMarkdown}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">📝</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">Markdown</span>
              <span className="text-xs text-[var(--text-muted)]">Document</span>
            </button>

            <button
              onClick={downloadAsCSV}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">CSV</span>
              <span className="text-xs text-[var(--text-muted)]">Tableau</span>
            </button>

            <button
              onClick={downloadAsHTML}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">🌐</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">HTML</span>
              <span className="text-xs text-[var(--text-muted)]">Web</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center p-4 bg-white border border-[var(--chat-input-border)] rounded-lg hover:bg-[var(--chat-bubble-bg)] transition-colors"
            >
              <span className="text-2xl mb-1">📋</span>
              <span className="text-sm font-medium text-[var(--text-dark)]">Copier</span>
              <span className="text-xs text-[var(--text-muted)]">Presse-papiers</span>
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
            💡 Astuce: JSON pour les données, Markdown pour la documentation, CSV pour Excel, HTML pour impression
          </p>
        </div>
      </div>
    </div>
  );
}
