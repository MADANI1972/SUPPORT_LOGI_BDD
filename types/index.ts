export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superviseur' | 'technicien';
  supervisorId?: string;
}

export interface Client {
  id: string;
  nom: string;
  ville: string;
  contact: string;
  codeClient: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypeIntervention {
  id: string;
  nom: string;
  description?: string;
  couleur?: string;
  actif: boolean;
}

export interface Intervention {
  id: string;
  titre: string;
  description: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  dateDebut?: string;
  dateFin?: string;
  clientId: string;
  technicienId: string;
  typeId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rapport {
  id: string;
  titre: string;
  type: 'mensuel' | 'hebdomadaire' | 'personnalise';
  periode: {
    debut: string;
    fin: string;
  };
  filtres: {
    techniciens?: string[];
    clients?: string[];
    types?: string[];
  };
  generePar: string;
  genereA: string;
  donnees: any;
}