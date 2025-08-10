# SUPPORT_LOGIPHARM

Application de gestion des interventions techniques pour LogiPharm.

## Description

SUPPORT_LOGIPHARM est une application web développée avec Next.js qui permet de gérer les interventions techniques pour les clients de LogiPharm. Elle offre les fonctionnalités suivantes :

- Gestion des utilisateurs (administrateurs, superviseurs, techniciens)
- Gestion des clients
- Création et suivi des interventions techniques
- Génération de rapports
- Interface utilisateur moderne et responsive

## Technologies utilisées

- Next.js 13.5.1
- React 18.2.0
- TypeScript 5.2.2
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase pour l'authentification et le stockage de données
- Tailwind CSS
- Radix UI
- Zod pour la validation
- React Hook Form

## Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Base de données PostgreSQL (Supabase)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-organisation/SUPPORT_LOGIPHARM.git
   cd SUPPORT_LOGIPHARM
   ```

2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurer les variables d'environnement :
   - Copier le fichier `.env.local.example` en `.env.local`
   - Modifier les valeurs selon votre environnement, notamment :
     - `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL
     - `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
     - `SUPABASE_SERVICE_ROLE_KEY` : Clé de service de votre projet Supabase

4. Générer le client Prisma :
   ```bash
   npx prisma generate
   ```

5. Appliquer les migrations de base de données :
   ```bash
   npx prisma migrate dev
   ```

6. Initialiser la base de données Supabase avec des données de démonstration :
   ```bash
   npm run init-db
   ```

## Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Configuration de Supabase

1. Créer un compte sur [Supabase](https://supabase.com) si ce n'est pas déjà fait
2. Créer un nouveau projet dans Supabase
3. Récupérer les informations de connexion :
   - URL du projet (`NEXT_PUBLIC_SUPABASE_URL`) : par exemple `https://abcdefghijklm.supabase.co`
   - Clé anonyme (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) : disponible dans les paramètres du projet, section API
   - Clé de service (`SUPABASE_SERVICE_ROLE_KEY`) : disponible dans les paramètres du projet, section API
4. Mettre à jour le fichier `.env.local` avec ces informations :
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-clé-anon-réelle"
   SUPABASE_SERVICE_ROLE_KEY="votre-clé-service-réelle"
   ```
5. Configurer la base de données :
   - Exécuter le script SQL dans l'éditeur SQL de Supabase :
     ```bash
     # Copier le contenu du fichier scripts/supabase-schema.sql dans l'éditeur SQL de Supabase
     ```
   - Puis utiliser le script d'initialisation fourni pour créer les données de démonstration :
     ```bash
     npm run init-db
     ```

> **Important** : Les valeurs actuelles dans `.env.local` sont des exemples et ne fonctionneront pas. Vous devez les remplacer par les valeurs réelles de votre projet Supabase.

### Résolution des problèmes courants

1. **Erreur "fetch failed" ou "getaddrinfo ENOTFOUND"** : 
   - Vérifiez que vous avez bien remplacé les valeurs d'exemple dans `.env.local` par les valeurs réelles de votre projet Supabase
   - Assurez-vous que votre projet Supabase est bien créé et actif
   - Vérifiez votre connexion internet

2. **Erreur "La table 'users' n'existe pas"** :
   - Assurez-vous d'avoir exécuté le script SQL (`scripts/supabase-schema.sql`) dans l'éditeur SQL de Supabase avant d'exécuter `npm run init-db`

3. **Erreur d'authentification** :
   - Vérifiez que vous utilisez la bonne clé de service (`SUPABASE_SERVICE_ROLE_KEY`) et non la clé anonyme pour l'initialisation
   - Assurez-vous que les permissions sont correctement configurées dans votre projet Supabase

## Déploiement

### Déploiement sur Vercel

1. Créer un compte sur [Vercel](https://vercel.com) si ce n'est pas déjà fait
2. Installer l'interface de ligne de commande Vercel :
   ```bash
   npm install -g vercel
   ```
3. Se connecter à Vercel :
   ```bash
   vercel login
   ```
4. Configurer les variables d'environnement dans Vercel :
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Déployer l'application :
   ```bash
   vercel
   ```
6. Pour un déploiement en production :
   ```bash
   vercel --prod
   ```

### Déploiement manuel

1. Construire l'application :
   ```bash
   npm run build
   # ou
   yarn build
   ```
2. Démarrer le serveur en production :
   ```bash
   npm run start
   # ou
   yarn start
   ```

## Structure du projet

- `/app` - Pages et composants de l'application Next.js
- `/components` - Composants React réutilisables
- `/lib` - Services et utilitaires
  - `/lib/supabase.ts` - Configuration du client Supabase
  - `/lib/auth.ts` - Service d'authentification
  - `/lib/users.ts` - Service de gestion des utilisateurs
  - `/lib/clients.ts` - Service de gestion des clients
  - `/lib/types-intervention.ts` - Service de gestion des types d'interventions
  - `/lib/interventions.ts` - Service de gestion des interventions
  - `/lib/utils.ts` - Fonctions utilitaires
- `/prisma` - Schéma et migrations Prisma
- `/public` - Fichiers statiques
- `/scripts` - Scripts utilitaires
  - `/scripts/init-supabase.js` - Script d'initialisation de la base de données Supabase
- `/types` - Types TypeScript
  - `/types/index.ts` - Types principaux de l'application
  - `/types/supabase.ts` - Types pour Supabase
- `/hooks` - Hooks React personnalisés

## Licence

Ce projet est sous licence propriétaire. Tous droits réservés.

## Contact

Pour toute question ou assistance, veuillez contacter l'équipe de développement à support@logipharm.com.# SUPPORT_LOGI_BDD
