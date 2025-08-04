import { supabase } from './supabase';
import { User } from '@/types';

/**
 * Service d'authentification utilisant Supabase
 */
export const authService = {
  /**
   * Connecte un utilisateur avec son email et mot de passe
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns L'utilisateur connecté ou null en cas d'erreur
   */
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        return null;
      }

      // Récupérer les informations complètes de l'utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Erreur lors de la récupération des données utilisateur:', userError.message);
        return null;
      }

      return userData as unknown as User;
    } catch (error) {
      console.error('Erreur inattendue lors de la connexion:', error);
      return null;
    }
  },

  /**
   * Déconnecte l'utilisateur actuel
   * @returns true si la déconnexion a réussi, false sinon
   */
  async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error);
      return false;
    }
  },

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns L'utilisateur connecté ou null si aucun utilisateur n'est connecté
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;

      // Récupérer les informations complètes de l'utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (userError) {
        console.error('Erreur lors de la récupération des données utilisateur:', userError.message);
        return null;
      }

      return userData as unknown as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      return null;
    }
  },
};