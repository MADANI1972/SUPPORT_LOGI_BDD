import { supabase } from './supabase';
import { User } from '@/types';

/**
 * Service de gestion des utilisateurs utilisant Supabase
 */
export const userService = {
  /**
   * Récupère tous les utilisateurs
   * @returns Liste des utilisateurs ou un tableau vide en cas d'erreur
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error.message);
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des utilisateurs:', error);
      return [];
    }
  },

  /**
   * Récupère tous les techniciens (utilisateurs avec le rôle 'technicien')
   * @returns Liste des techniciens ou un tableau vide en cas d'erreur
   */
  async getAllTechnicians(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'technicien')
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des techniciens:', error.message);
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des techniciens:', error);
      return [];
    }
  },

  /**
   * Récupère un utilisateur par son ID
   * @param id - ID de l'utilisateur à récupérer
   * @returns L'utilisateur ou null s'il n'existe pas
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error.message);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }
  },

  /**
   * Crée un nouvel utilisateur
   * @param user - Données de l'utilisateur à créer
   * @returns L'utilisateur créé ou null en cas d'erreur
   */
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      // Créer l'utilisateur dans l'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });

      if (authError) {
        console.error('Erreur lors de la création du compte d\'authentification:', authError.message);
        return null;
      }

      // Créer l'utilisateur dans la table users
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...user,
          id: authData.user?.id, // Utiliser l'ID généré par l'authentification
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error.message);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Erreur inattendue lors de la création de l\'utilisateur:', error);
      return null;
    }
  },

  /**
   * Met à jour un utilisateur existant
   * @param id - ID de l'utilisateur à mettre à jour
   * @param user - Nouvelles données de l'utilisateur
   * @returns L'utilisateur mis à jour ou null en cas d'erreur
   */
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    try {
      // Si le mot de passe est mis à jour, mettre à jour l'authentification
      if (user.password) {
        const { error: authError } = await supabase.auth.updateUser({
          password: user.password,
        });

        if (authError) {
          console.error(`Erreur lors de la mise à jour du mot de passe pour l'utilisateur ${id}:`, authError.message);
          return null;
        }
      }

      // Mettre à jour les informations de l'utilisateur dans la table users
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error.message);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error(`Erreur inattendue lors de la mise à jour de l'utilisateur ${id}:`, error);
      return null;
    }
  },

  /**
   * Supprime un utilisateur
   * @param id - ID de l'utilisateur à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      // Supprimer l'utilisateur de la table users
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (userError) {
        console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, userError.message);
        return false;
      }

      // Supprimer l'utilisateur de l'authentification
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      if (authError) {
        console.error(`Erreur lors de la suppression du compte d'authentification pour l'utilisateur ${id}:`, authError.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erreur inattendue lors de la suppression de l'utilisateur ${id}:`, error);
      return false;
    }
  },
};