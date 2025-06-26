# Ervia - Agent IA pour Organisateurs d'Événements

> **Hackathon 2025** - Services.ceo

## 📋 Description

Ervia est un agent IA conçu pour assister les organisateurs d'événements dans leurs tâches quotidiennes :

- **Planning d'événements** : Aide à la planification et à l'organisation
- **Idées de sorties** : Suggestions personnalisées d'activités et de lieux
- **Idées de cadeaux** : Recommandations adaptées au contexte et au budget

## 🚀 Installation

### Prérequis

- Node.js (version 18+)
- Docker et Docker Compose
- MongoDB

### Installation rapide

1. **Cloner le projet**

   ```bash
   git clone https://github.com/stephanelazarevic/hackathon-2025.git
   cd hackathon-2025
   ```

2. **Configuration environnement**

   Créer un fichier `.env` à la racine du projet :

   ```bash
    # Variables d'environnement
    NODE_ENV=
    MONGO_INITDB_ROOT_USERNAME=
    MONGO_INITDB_ROOT_PASSWORD=
    MONGO_INITDB_DATABASE=
    MONGODB_URI=
    API_DOCS_PATH=back/src/api/docs
   ```

3. **Démarrer les services**

   ```bash
   # Installer les dépendances
   cd front 
   npm install
   cd ../back
   npm install

   # Démarrer MongoDB et initialiser la base
   docker compose up -d
   ```
