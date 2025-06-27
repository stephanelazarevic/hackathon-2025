import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Assistant</span>
            </div>
            <Link 
              href="/ai"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Démarrer le chat
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Intelligence Artificielle Avancée
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez vos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> questionnaires </span>
            intelligents
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Notre IA génère automatiquement des questionnaires personnalisés sous forme de phrases à trou, 
            traite vos réponses et produit des rapports détaillés exportables.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/ai"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="mr-2">🚀</span>
              Commencer maintenant
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg">
              <span className="mr-2">📖</span>
              En savoir plus
            </button>
          </div>

          {/* Fonctionnalités */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questionnaires Intelligents</h3>
              <p className="text-gray-600 text-sm">
                Génération automatique de questionnaires personnalisés sous forme de phrases à trou
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Traitement Rapide</h3>
              <p className="text-gray-600 text-sm">
                Analyse instantanée de vos réponses avec synthèse intelligente des informations
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapports Exportables</h3>
              <p className="text-gray-600 text-sm">
                Génération de comptes-rendus détaillés exportables en PDF, HTML, Markdown et plus
              </p>
            </div>
          </div>
        </div>

        {/* Formes décoratives */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gray-500 text-sm">
            © 2025 AI Assistant. Créé avec ❤️ pour une meilleure productivité.
          </p>
        </div>
      </footer>
    </div>
  );
}
