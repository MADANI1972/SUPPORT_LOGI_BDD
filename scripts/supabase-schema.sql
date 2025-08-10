-- Schéma SQL pour initialiser les tables dans Supabase

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'technicien',
  supervisor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  ville TEXT NOT NULL,
  contact TEXT NOT NULL,
  code_client TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des types d'intervention
CREATE TABLE IF NOT EXISTS public.types_intervention (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interventions
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'nouveau',
  priorite TEXT NOT NULL DEFAULT 'normale',
  date_debut TIMESTAMP WITH TIME ZONE,
  date_fin TIMESTAMP WITH TIME ZONE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  technicien_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type_id UUID NOT NULL REFERENCES public.types_intervention(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour le champ updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_types_intervention_updated_at
BEFORE UPDATE ON public.types_intervention
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_interventions_updated_at
BEFORE UPDATE ON public.interventions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types_intervention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs
-- Les administrateurs peuvent tout voir et modifier
-- Les utilisateurs peuvent voir leur propre profil et celui de leurs subordonnés
CREATE POLICY users_admin_policy ON public.users
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin') OR auth.uid() = id OR auth.uid() = supervisor_id);

-- Politique pour les clients
-- Tous les utilisateurs authentifiés peuvent voir les clients
-- Seuls les administrateurs peuvent modifier les clients
CREATE POLICY clients_select_policy ON public.clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY clients_insert_update_delete_policy ON public.clients
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- Politique pour les types d'intervention
-- Tous les utilisateurs authentifiés peuvent voir les types d'intervention
-- Seuls les administrateurs peuvent modifier les types d'intervention
CREATE POLICY types_intervention_select_policy ON public.types_intervention
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY types_intervention_insert_update_delete_policy ON public.types_intervention
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- Politique pour les interventions
-- Les administrateurs peuvent tout voir et modifier
-- Les techniciens peuvent voir et modifier leurs propres interventions
-- Les superviseurs peuvent voir les interventions de leurs subordonnés
CREATE POLICY interventions_admin_policy ON public.interventions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

CREATE POLICY interventions_technicien_policy ON public.interventions
  FOR ALL
  TO authenticated
  USING (auth.uid() = technicien_id);

CREATE POLICY interventions_supervisor_select_policy ON public.interventions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT supervisor_id FROM public.users WHERE id = technicien_id));