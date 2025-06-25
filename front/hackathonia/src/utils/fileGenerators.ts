// Utilitaires pour la génération de fichiers
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateXMLContent = (data: any) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<evenement>
    <meta>
        <genere_le>${new Date().toISOString()}</genere_le>
        <genere_par>Evently-AI</genere_par>
    </meta>
    <informations_generales>
        <type>${data.eventType}</type>
        <organisation>${data.projectType}</organisation>
        <nombre_invites>${data.guests}</nombre_invites>
        <budget>${data.budget}</budget>
        <date_souhaitee>${data.date}</date_souhaitee>
        <lieu>${data.location}</lieu>
    </informations_generales>
    <style>
        <theme>${data.theme}</theme>
        <ambiance>${data.atmosphere}</ambiance>
        <priorite>${data.priority}</priorite>
    </style>
    <profil_organisateur>
        <experience>${data.status}</experience>
        <age_moyen_invites>${data.age}</age_moyen_invites>
    </profil_organisateur>
    <recommandations>
        <lieux>
            ${data.recommendations?.venue?.map((v: string) => `<lieu>${v}</lieu>`).join('') || '<lieu>A definir</lieu>'}
        </lieux>
        <restauration>
            ${data.recommendations?.catering?.map((c: string) => `<option>${c}</option>`).join('') || '<option>A definir</option>'}
        </restauration>
    </recommandations>
</evenement>`;
};

export const downloadHTMLAsPDF = (data: any) => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Résumé Événement - ${data.eventType}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #06b6d4; margin-bottom: 10px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-card { background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4; }
        .info-card h3 { margin: 0 0 10px 0; color: #0891b2; }
        .recommendations ul { list-style-type: none; padding: 0; }
        .recommendations li { background: #e0f2fe; margin: 5px 0; padding: 10px; border-radius: 5px; }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Résumé de votre ${data.eventType}</h1>
        <p>Généré par Evently-AI le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <div class="section">
        <h2>📝 Informations générales</h2>
        <div class="info-grid">
            <div class="info-card">
                <h3>Événement</h3>
                <p><strong>Type:</strong> ${data.eventType}</p>
                <p><strong>Organisation:</strong> ${data.projectType}</p>
            </div>
            <div class="info-card">
                <h3>Logistique</h3>
                <p><strong>Invités:</strong> ${data.guests} personnes</p>
                <p><strong>Budget:</strong> ${data.budget}€</p>
            </div>
            <div class="info-card">
                <h3>Lieu et Date</h3>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Lieu:</strong> ${data.location}</p>
            </div>
            <div class="info-card">
                <h3>Style</h3>
                <p><strong>Thème:</strong> ${data.theme}</p>
                <p><strong>Ambiance:</strong> ${data.atmosphere}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🎯 Préférences</h2>
        <div class="info-card">
            <p><strong>Priorité principale:</strong> ${data.priority}</p>
            <p><strong>Expérience organisateur:</strong> ${data.status}</p>
            <p><strong>Âge moyen des invités:</strong> ${data.age} ans</p>
        </div>
    </div>

    <div class="section recommendations">
        <h2>💡 Recommandations</h2>
        <h3>📍 Lieux suggérés</h3>
        <ul>
            ${data.recommendations?.venue?.map((v: string) => `<li>• ${v}</li>`).join('') || '<li>À définir selon vos préférences</li>'}
        </ul>
        
        <h3>🍽️ Restauration</h3>
        <ul>
            ${data.recommendations?.catering?.map((c: string) => `<li>• ${c}</li>`).join('') || '<li>À définir selon votre budget</li>'}
        </ul>
    </div>

    <div class="footer">
        <p>Ce résumé a été généré par Evently-AI pour vous aider dans l'organisation de votre événement.</p>
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadAsPDF = async (data: any) => {
  // Créer le contenu HTML pour le PDF
  const htmlContent = `
    <div id="pdf-content" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #06b6d4; margin-bottom: 10px; font-size: 28px;">🎉 Résumé de votre ${data.eventType}</h1>
        <p style="color: #64748b; font-size: 14px;">Généré par Evently-AI le ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 5px; font-size: 20px;">📝 Informations générales</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h3 style="margin: 0 0 10px 0; color: #0891b2; font-size: 16px;">Événement</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${data.eventType}</p>
            <p style="margin: 5px 0;"><strong>Organisation:</strong> ${data.projectType}</p>
          </div>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h3 style="margin: 0 0 10px 0; color: #0891b2; font-size: 16px;">Logistique</h3>
            <p style="margin: 5px 0;"><strong>Invités:</strong> ${data.guests} personnes</p>
            <p style="margin: 5px 0;"><strong>Budget:</strong> ${data.budget}€</p>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h3 style="margin: 0 0 10px 0; color: #0891b2; font-size: 16px;">Lieu et Date</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
            <p style="margin: 5px 0;"><strong>Lieu:</strong> ${data.location}</p>
          </div>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h3 style="margin: 0 0 10px 0; color: #0891b2; font-size: 16px;">Style</h3>
            <p style="margin: 5px 0;"><strong>Thème:</strong> ${data.theme}</p>
            <p style="margin: 5px 0;"><strong>Ambiance:</strong> ${data.atmosphere}</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 5px; font-size: 20px;">🎯 Préférences</h2>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4; margin-top: 15px;">
          <p style="margin: 5px 0;"><strong>Priorité principale:</strong> ${data.priority}</p>
          <p style="margin: 5px 0;"><strong>Expérience organisateur:</strong> ${data.status}</p>
          <p style="margin: 5px 0;"><strong>Âge moyen des invités:</strong> ${data.age} ans</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 5px; font-size: 20px;">💡 Recommandations</h2>
        <h3 style="color: #0891b2; font-size: 16px; margin-top: 15px;">📍 Lieux suggérés</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${data.recommendations?.venue?.map((v: string) => `<li style="background: #e0f2fe; margin: 5px 0; padding: 10px; border-radius: 5px;">• ${v}</li>`).join('') || '<li style="background: #e0f2fe; margin: 5px 0; padding: 10px; border-radius: 5px;">À définir selon vos préférences</li>'}
        </ul>
        
        <h3 style="color: #0891b2; font-size: 16px; margin-top: 15px;">🍽️ Restauration</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${data.recommendations?.catering?.map((c: string) => `<li style="background: #e0f2fe; margin: 5px 0; padding: 10px; border-radius: 5px;">• ${c}</li>`).join('') || '<li style="background: #e0f2fe; margin: 5px 0; padding: 10px; border-radius: 5px;">À définir selon votre budget</li>'}
        </ul>
      </div>

      <div style="text-align: center; margin-top: 40px; color: #64748b; font-size: 12px;">
        <p>Ce résumé a été généré par Evently-AI pour vous aider dans l'organisation de votre événement.</p>
      </div>
    </div>
  `;

  // Créer un élément temporaire
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = 'white';
  document.body.appendChild(tempDiv);

  try {
    // Attendre un peu pour que le DOM se mette à jour
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convertir en canvas
    const canvas = await html2canvas(tempDiv, {
      width: 800,
      height: tempDiv.scrollHeight,
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    // Créer le PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // Largeur A4 en mm
    const pageHeight = 295; // Hauteur A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const imgData = canvas.toDataURL('image/png');
    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Ajouter d'autres pages si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Télécharger le PDF
    pdf.save(`evenement-${data.eventType}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Téléchargement HTML en cours...');
    // Fallback vers HTML
    downloadHTMLAsPDF(data);
    return false;
  } finally {
    // Nettoyer
    document.body.removeChild(tempDiv);
  }
};