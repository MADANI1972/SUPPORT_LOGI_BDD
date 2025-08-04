import { supabase } from './supabase';
import { Intervention } from '@/types';

/**
 * Service de gestion des interventions utilisant Supabase
 */
export const interventionService = {
  /**
   * Récupère toutes les interventions
   * @returns Liste des interventions ou un tableau vide en cas d'erreur
   */
  async getAllInterventions(): Promise<Intervention[]> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          client:client_id(*),
          technicien:technicien_id(*),
          type:type_id(*)
        `)
        .order('date_debut', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des interventions:', error.message);
        return [];
      }

      return data as unknown as Intervention[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des interventions:', error);
      return [];
    }
  },

  /**
   * Récupère les interventions d'un technicien spécifique
   * @param technicienId - ID du technicien
   * @returns Liste des interventions du technicien ou un tableau vide en cas d'erreur
   */
  async getInterventionsByTechnicien(technicienId: string): Promise<Intervention[]> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          client:client_id(*),
          technicien:technicien_id(*),
          type:type_id(*)
        `)
        .eq('technicien_id', technicienId)
        .order('date_debut', { ascending: false });

      if (error) {
        console.error(`Erreur lors de la récupération des interventions du technicien ${technicienId}:`, error.message);
        return [];
      }

      return data as unknown as Intervention[];
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération des interventions du technicien ${technicienId}:`, error);
      return [];
    }
  },

  /**
   * Récupère les interventions d'un client spécifique
   * @param clientId - ID du client
   * @returns Liste des interventions du client ou un tableau vide en cas d'erreur
   */
  async getInterventionsByClient(clientId: string): Promise<Intervention[]> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          client:client_id(*),
          technicien:technicien_id(*),
          type:type_id(*)
        `)
        .eq('client_id', clientId)
        .order('date_debut', { ascending: false });

      if (error) {
        console.error(`Erreur lors de la récupération des interventions du client ${clientId}:`, error.message);
        return [];
      }

      return data as unknown as Intervention[];
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération des interventions du client ${clientId}:`, error);
      return [];
    }
  },

  /**
   * Récupère une intervention par son ID
   * @param id - ID de l'intervention à récupérer
   * @returns L'intervention ou null si elle n'existe pas
   */
  async getInterventionById(id: string): Promise<Intervention | null> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          client:client_id(*),
          technicien:technicien_id(*),
          type:type_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération de l'intervention ${id}:`, error.message);
        return null;
      }

      return data as unknown as Intervention;
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération de l'intervention ${id}:`, error);
      return null;
    }
  },

  /**
   * Crée une nouvelle intervention
   * @param intervention - Données de l'intervention à créer
   * @returns L'intervention créée ou null en cas d'erreur
   */
  async createIntervention(intervention: Omit<Intervention, 'id' | 'created_at' | 'updated_at' | 'client' | 'technicien' | 'type'>): Promise<Intervention | null> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert([intervention])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'intervention:', error.message);
        return null;
      }

      // Récupérer l'intervention complète avec les relations
      return await this.getInterventionById(data.id);
    } catch (error) {
      console.error('Erreur inattendue lors de la création de l\'intervention:', error);
      return null;
    }
  },

  /**
   * Met à jour une intervention existante
   * @param id - ID de l'intervention à mettre à jour
   * @param intervention - Nouvelles données de l'intervention
   * @returns L'intervention mise à jour ou null en cas d'erreur
   */
  async updateIntervention(id: string, intervention: Partial<Omit<Intervention, 'client' | 'technicien' | 'type'>>): Promise<Intervention | null> {
    try {
      const { error } = await supabase
        .from('interventions')
        .update(intervention)
        .eq('id', id);

      if (error) {
        console.error(`Erreur lors de la mise à jour de l'intervention ${id}:`, error.message);
        return null;
      }

      // Récupérer l'intervention mise à jour avec les relations
      return await this.getInterventionById(id);
    } catch (error) {
      console.error(`Erreur inattendue lors de la mise à jour de l'intervention ${id}:`, error);
      return null;
    }
  },

  /**
   * Supprime une intervention
   * @param id - ID de l'intervention à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteIntervention(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interventions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Erreur lors de la suppression de l'intervention ${id}:`, error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erreur inattendue lors de la suppression de l'intervention ${id}:`, error);
      return false;
    }
  },
};