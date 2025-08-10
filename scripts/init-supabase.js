/**
 * Script pour initialiser la base de données Supabase avec des données de démonstration
 * 
 * Pour exécuter ce script:
 * 1. Assurez-vous que les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies
 * 2. Exécutez: node scripts/init-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Vérifier les variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies');
  process.exit(1);
}

// Vérifier si les valeurs sont des exemples
if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('votre-projet') || 
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') || 
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://project.supabase.co') {
  console.error('Erreur: Vous utilisez des valeurs d\'exemple pour NEXT_PUBLIC_SUPABASE_URL.');
  console.error('Veuillez mettre à jour le fichier .env.local avec les valeurs réelles de votre projet Supabase.');
  console.error('Consultez le README.md pour plus d\'informations sur la configuration de Supabase.');
  process.exit(1);
}

// Vérifier si les clés sont des exemples
if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('votre-clé-anon') || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key')) {
  console.error('Erreur: Vous utilisez des valeurs d\'exemple pour NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  console.error('Veuillez mettre à jour le fichier .env.local avec les valeurs réelles de votre projet Supabase.');
  console.error('Consultez le README.md pour plus d\'informations sur la configuration de Supabase.');
  process.exit(1);
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY.includes('votre-clé-service') || 
    process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')) {
  console.error('Erreur: Vous utilisez des valeurs d\'exemple pour SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Veuillez mettre à jour le fichier .env.local avec les valeurs réelles de votre projet Supabase.');
  console.error('Consultez le README.md pour plus d\'informations sur la configuration de Supabase.');
  process.exit(1);
}

// Créer un client Supabase avec la clé de service pour avoir les droits d'administration
let supabase;
try {
  console.log('Tentative de connexion à Supabase...');
  console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} catch (error) {
  console.error('Erreur lors de la création du client Supabase:');
  console.error(error);
  console.error('\nVérifiez que:');
  console.error('1. Votre projet Supabase est bien créé et actif');
  console.error('2. Les variables d\'environnement dans .env.local sont correctes');
  console.error('3. Vous avez une connexion internet active');
  console.error('\nConsultez le README.md pour plus d\'informations sur la configuration de Supabase.');
  process.exit(1);
}

// Tester la connexion à Supabase
async function testConnection() {
  try {
    console.log('Test de la connexion à Supabase...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('Connexion à Supabase établie avec succès!');
    return true;
  } catch (error) {
    console.error('Erreur lors du test de connexion à Supabase:');
    console.error(error);
    console.error('\nVérifiez que:');
    console.error('1. Votre projet Supabase est bien créé et actif');
    console.error('2. Les variables d\'environnement dans .env.local sont correctes');
    console.error('3. La table "users" existe dans votre base de données');
    console.error('\nConsultez le README.md pour plus d\'informations sur la configuration de Supabase.');
    return false;
  }
}

// Données de démonstration
const demoUsers = [
  {
    email: 'admin@logipharm.com',
    password: 'Admin123!',
    name: 'Admin Principal',
    role: 'admin',
  },
  {
    email: 'tech1@logipharm.com',
    password: 'Tech123!',
    name: 'Technicien 1',
    role: 'technicien',
  },
  {
    email: 'tech2@logipharm.com',
    password: 'Tech123!',
    name: 'Technicien 2',
    role: 'technicien',
  },
];

const demoClients = [
  {
    nom: 'Pharmacie Centrale',
    ville: 'Paris',
    contact: '01 23 45 67 89',
    code_client: 'PC001',
  },
  {
    nom: 'Pharmacie du Marché',
    ville: 'Lyon',
    contact: '04 56 78 90 12',
    code_client: 'PM002',
  },
  {
    nom: 'Pharmacie des Alpes',
    ville: 'Grenoble',
    contact: '04 76 12 34 56',
    code_client: 'PA003',
  },
];

const demoTypesIntervention = [
  {
    nom: 'Installation',
    description: 'Installation initiale du logiciel',
  },
  {
    nom: 'Formation',
    description: 'Formation des utilisateurs',
  },
  {
    nom: 'Maintenance',
    description: 'Maintenance préventive ou corrective',
  },
  {
    nom: 'Support',
    description: 'Assistance technique à distance',
  },
];

// Fonction principale d'initialisation
async function initializeDatabase() {
  console.log('Début de l\'initialisation de la base de données...');

  try {
    // Créer les utilisateurs
    console.log('Création des utilisateurs...');
    const createdUsers = [];

    for (const user of demoUsers) {
      // Créer l'utilisateur dans l'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`Erreur lors de la création de l'utilisateur ${user.email}:`, authError.message);
        continue;
      }

      // Ajouter l'utilisateur dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          password: 'hashed_password', // Le mot de passe réel est géré par l'authentification Supabase
        }])
        .select()
        .single();

      if (userError) {
        console.error(`Erreur lors de l'ajout de l'utilisateur ${user.email} dans la table users:`, userError.message);
        continue;
      }

      console.log(`Utilisateur créé: ${user.email}`);
      createdUsers.push(userData);
    }

    // Créer les clients
    console.log('\nCréation des clients...');
    const createdClients = [];

    for (const client of demoClients) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (clientError) {
        console.error(`Erreur lors de la création du client ${client.nom}:`, clientError.message);
        continue;
      }

      console.log(`Client créé: ${client.nom}`);
      createdClients.push(clientData);
    }

    // Créer les types d'intervention
    console.log('\nCréation des types d\'intervention...');
    const createdTypes = [];

    for (const type of demoTypesIntervention) {
      const { data: typeData, error: typeError } = await supabase
        .from('types_intervention')
        .insert([type])
        .select()
        .single();

      if (typeError) {
        console.error(`Erreur lors de la création du type d'intervention ${type.nom}:`, typeError.message);
        continue;
      }

      console.log(`Type d'intervention créé: ${type.nom}`);
      createdTypes.push(typeData);
    }

    // Créer quelques interventions de démonstration
    console.log('\nCréation des interventions de démonstration...');

    if (createdUsers.length > 0 && createdClients.length > 0 && createdTypes.length > 0) {
      const demoInterventions = [
        {
          titre: 'Installation initiale',
          description: 'Installation du logiciel de gestion de pharmacie',
          statut: 'terminee',
          priorite: 'haute',
          date_debut: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a une semaine
          date_fin: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 6 jours
          client_id: createdClients[0].id,
          technicien_id: createdUsers.find(u => u.role === 'technicien').id,
          type_id: createdTypes.find(t => t.nom === 'Installation').id,
          notes: 'Installation réalisée avec succès',
        },
        {
          titre: 'Formation utilisateurs',
          description: 'Formation des pharmaciens à l\'utilisation du logiciel',
          statut: 'en_cours',
          priorite: 'normale',
          date_debut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
          date_fin: null,
          client_id: createdClients[1].id,
          technicien_id: createdUsers.find(u => u.role === 'technicien').id,
          type_id: createdTypes.find(t => t.nom === 'Formation').id,
          notes: 'Formation en cours, prévoir une session supplémentaire',
        },
        {
          titre: 'Problème de connexion',
          description: 'Le client ne peut pas se connecter au serveur',
          statut: 'en_attente',
          priorite: 'urgente',
          date_debut: new Date().toISOString(),
          date_fin: null,
          client_id: createdClients[2].id,
          technicien_id: createdUsers.find(u => u.email === 'tech2@logipharm.com').id,
          type_id: createdTypes.find(t => t.nom === 'Support').id,
          notes: 'À traiter en priorité',
        },
      ];

      for (const intervention of demoInterventions) {
        const { data: interventionData, error: interventionError } = await supabase
          .from('interventions')
          .insert([intervention])
          .select()
          .single();

        if (interventionError) {
          console.error(`Erreur lors de la création de l'intervention ${intervention.titre}:`, interventionError.message);
          continue;
        }

        console.log(`Intervention créée: ${intervention.titre}`);
      }
    } else {
      console.warn('Impossible de créer des interventions car les utilisateurs, clients ou types d\'intervention n\'ont pas été créés correctement');
    }

    console.log('\nInitialisation de la base de données terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter la fonction d'initialisation avec test de connexion préalable
async function main() {
  const connectionSuccessful = await testConnection();
  
  if (connectionSuccessful) {
    await initializeDatabase();
  } else {
    console.error('Impossible d\'initialiser la base de données en raison d\'erreurs de connexion.');
    console.error('Veuillez vérifier votre configuration Supabase et réessayer.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Erreur non gérée lors de l\'initialisation:', error);
  process.exit(1);
});