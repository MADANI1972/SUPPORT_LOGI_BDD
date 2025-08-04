import { supabase } from './supabase';
import { TypeIntervention } from '@/types';

/**
 * Service de gestion des types d'interventions utilisant Supabase
 */
export const typeInterventionService = {
  /**
   * Récupère tous les types d'interventions
   * @returns Liste des types d'interventions ou un tableau vide en cas d'erreur
   */
  async getAllTypesIntervention(): Promise<TypeIntervention[]> {
    try {
      const { data, error } = await supabase
        .from('types_intervention')
        .select('*')
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des types d\'intervention:', error.message);
        return [];
      }

      return data as TypeIntervention[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des types d\'intervention:', error);
      return [];
    }
  },

  /**
   * Récupère un type d'intervention par son ID
   * @param id - ID du type d'intervention à récupérer
   * @returns Le type d'intervention ou null s'il n'existe pas
   */
  async getTypeInterventionById(id: string): Promise<TypeIntervention | null> {
    try {
      const { data, error } = await supabase
        .from('types_intervention')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération du type d'intervention ${id}:`, error.message);
        return null;
      }

      return data as TypeIntervention;
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération du type d'intervention ${id}:`, error);
      return null;
    }
  },

  /**
   * Crée un nouveau type d'intervention
   * @param typeIntervention - Données du type d'intervention à créer
   * @returns Le type d'intervention créé ou null en cas d'erreur
   */
  async createTypeIntervention(typeIntervention: Omit<TypeIntervention, 'id' | 'created_at' | 'updated_at'>): Promise<TypeIntervention | null> {
    try {
      const { data, error } = await supabase
        .from('types_intervention')
        .insert([typeIntervention])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du type d\'intervention:', error.message);
        return null;
      }

      return data as TypeIntervention;
    } catch (error) {
      console.error('Erreur inattendue lors de la création du type d\'intervention:', error);
      return null;
    }
  },

  /**
   * Met à jour un type d'intervention existant
   * @param id - ID du type d'intervention à mettre à jour
   * @param typeIntervention - Nouvelles données du type d'intervention
   * @returns Le type d'intervention mis à jour ou null en cas d'erreur
   */
  async updateTypeIntervention(id: string, typeIntervention: Partial<TypeIntervention>): Promise<TypeIntervention | null> {
    try {
      const { data, error } = await supabase
        .from('types_intervention')
        .update(typeIntervention)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour du type d'intervention ${id}:`, error.message);
        return null;
      }

      return data as TypeIntervention;
    } catch (error) {
      console.error(`Erreur inattendue lors de la mise à jour du type d'intervention ${id}:`, error);
      return null;
    }
  },

  /**
   * Supprime un type d'intervention
   * @param id - ID du type d'intervention à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteTypeIntervention(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('types_intervention')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Erreur lors de la suppression du type d'intervention ${id}:`, error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erreur inattendue lors de la suppression du type d'intervention ${id}:`, error);
      return false;
    }
  },
};