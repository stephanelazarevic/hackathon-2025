// Script d'initialisation MongoDB
db = db.getSiblingDB('ervia_db');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'ervia_user',
  pwd: '2ItTAFtA57TBJzR1WkHQTHQBwIwIzYk88YkCuckpHixQgIdLlz',
  roles: [
    {
      role: 'readWrite',
      db: 'ervia_db'
    }
  ]
});

db.apis.insertMany([
  {
    name: 'Data ES',
    description: 'Cette API est le point d’entrée à la base de données des équipements sportifs et des lieux de pratiques du ministère chargé des Sports. Celle-ci est mise à jour quotidiennement grâce à nos équipes d\'enquêteurs et des déclarations réalisées par les propriétaires. Vous y retrouverez tous les éléments liés à l’équipement (géolocalisation, type d’équipement, dimension, tribunes, aménagements, accessibilité, utilisateurs …) mais aussi les éléments liés à son installation (adresse, propriétaire, erp, type d’établissement …). Chaque équipement possède un code référentiel national unique.',
    link: '/api/explore/v2.1/catalog/datasets/data-es/records',
    api_key: null,
    doc: 'dataes.json'
  },
  {
    name: 'Basilic',
    description: 'Cette base géocodée des sites, lieux et équipements culturels est conçue et administrée par le département des études, de la prospective, des statistiques et de la documentation du ministère de la Culture. Elle alimente notamment la base permanente des équipements de l\'Insee et l\'Atlas Culture des territoires.',
    link: '/api/explore/v2.1/catalog/datasets/base-des-lieux-et-des-equipements-culturels/records',
    api_key: null,
    doc: 'basilic.json'
  },
]);
