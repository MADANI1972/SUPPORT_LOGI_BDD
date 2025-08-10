import { supabase } from './supabase';
import { Client } from '@/types';

/**
 * Service de gestion des clients utilisant Supabase
 */
export const clientService = {
  /**
   * Récupère tous les clients
   * @returns Liste des clients ou un tableau vide en cas d'erreur
   */
  async getAllClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des clients:', error.message);
        return [];
      }

      return data as Client[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des clients:', error);
      return [];
    }
  },

  /**
   * Récupère un client par son ID
   * @param id - ID du client à récupérer
   * @returns Le client ou null s'il n'existe pas
   */
  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération du client ${id}:`, error.message);
        return null;
      }

      return data as Client;
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération du client ${id}:`, error);
      return null;
    }
  },

  /**
   * Crée un nouveau client
   * @param client - Données du client à créer
   * @returns Le client créé ou null en cas d'erreur
   */
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du client:', error.message);
        return null;
      }

      return data as Client;
    } catch (error) {
      console.error('Erreur inattendue lors de la création du client:', error);
      return null;
    }
  },

  /**
   * Met à jour un client existant
   * @param id - ID du client à mettre à jour
   * @param client - Nouvelles données du client
   * @returns Le client mis à jour ou null en cas d'erreur
   */
  async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour du client ${id}:`, error.message);
        return null;
      }

      return data as Client;
    } catch (error) {
      console.error(`Erreur inattendue lors de la mise à jour du client ${id}:`, error);
      return null;
    }
  },

  /**
   * Supprime un client
   * @param id - ID du client à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Erreur lors de la suppression du client ${id}:`, error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erreur inattendue lors de la suppression du client ${id}:`, error);
      return false;
    }
  },
};