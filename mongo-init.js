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

print('Base de données initialisée avec succès');