// Test de l'adaptation du système de rapport
// Ce script peut être utilisé pour tester différents types de demandes

const testCases = [
  {
    name: "Demande Menu seulement",
    userRequest: "Je veux des idées de menu pour mon anniversaire",
    expectedSections: ["menu"]
  },
  {
    name: "Demande Planning seulement", 
    userRequest: "J'ai besoin d'un planning détaillé pour ma conférence",
    expectedSections: ["planning"]
  },
  {
    name: "Demande Lieux seulement",
    userRequest: "Où organiser mon mariage ? Suggestions de lieux",
    expectedSections: ["lieux"]
  },
  {
    name: "Demande Cadeaux seulement",
    userRequest: "Idées de cadeaux originaux pour mes collègues",
    expectedSections: ["cadeaux"]
  },
  {
    name: "Demande multiple",
    userRequest: "Je veux un menu et des idées de décoration pour ma fête",
    expectedSections: ["menu", "decoration"]
  },
  {
    name: "Demande complète",
    userRequest: "Organisation complète de mon événement d'entreprise avec planning, budget et activités",
    expectedSections: ["planning", "budget", "activites"]
  }
];

console.log("🧪 Tests d'adaptation du système de rapport");
console.log("=" .repeat(50));

testCases.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log(`   Demande: "${test.userRequest}"`);
  console.log(`   Sections attendues: ${test.expectedSections.join(', ')}`);
  
  // Simuler la logique d'analyse
  const demandeLower = test.userRequest.toLowerCase();
  const motsCles = {
    planning: ['planning', 'programme', 'horaire', 'déroul', 'emploi du temps', 'chronologie', 'timeline', 'ordre', 'étapes', 'journée', 'timing'],
    menu: ['menu', 'repas', 'nourriture', 'traiteur', 'buffet', 'cuisine', 'plat', 'boisson', 'cocktail', 'déjeuner', 'dîner', 'petit-déjeuner', 'collation', 'apéritif'],
    lieux: ['lieu', 'salle', 'endroit', 'où', 'location', 'adresse', 'venue', 'espace', 'local', 'bâtiment', 'site'],
    activites: ['activité', 'animation', 'jeu', 'divertissement', 'atelier', 'spectacle', 'performance', 'entertainment', 'animation'],
    budget: ['budget', 'prix', 'coût', 'tarif', 'devis', 'estimation', 'finance', 'dépense', 'investissement', 'économie'],
    cadeaux: ['cadeau', 'gift', 'surprise', 'souvenir', 'présent', 'récompense', 'goodies', 'idée cadeau', 'offrir'],
    decoration: ['décor', 'déco', 'ambiance', 'thème', 'design', 'esthétique', 'style', 'couleur', 'ornement', 'décoration'],
    logistique: ['logistique', 'organisation', 'préparatif', 'coordination', 'gestion', 'matériel', 'équipement', 'transport'],
    invitations: ['invitation', 'invité', 'guest', 'convive', 'participant', 'public', 'liste', 'contact'],
    communication: ['communication', 'annonce', 'publicité', 'marketing', 'promotion', 'info', 'message']
  };

  const analyseDemande = {};
  
  for (const [section, keywords] of Object.entries(motsCles)) {
    let score = 0;
    keywords.forEach(keyword => {
      const occurrences = (demandeLower.match(new RegExp(`\\b${keyword}`, 'g')) || []).length;
      score += occurrences;
    });
    analyseDemande[section] = score;
  }

  const sectionsDetectees = Object.entries(analyseDemande)
    .filter(([, score]) => score > 0)
    .sort(([,a], [,b]) => b - a)
    .map(([section]) => section);

  const sectionsFinales = sectionsDetectees.length > 0 ? sectionsDetectees : ['planning', 'activites', 'budget'];
  
  console.log(`   Sections détectées: ${sectionsFinales.join(', ')}`);
  
  // Vérifier si la détection correspond aux attentes
  const isCorrect = test.expectedSections.every(expected => sectionsFinales.includes(expected)) &&
                   sectionsFinales.every(detected => test.expectedSections.includes(detected));
  
  console.log(`   Résultat: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
});

console.log("\n" + "=".repeat(50));
console.log("Test terminé. Les cas incorrects nécessitent un ajustement des mots-clés.");
