'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { clientService } from '@/lib/clients';
import { userService } from '@/lib/users';
import { typeInterventionService } from '@/lib/types-intervention';
import { interventionService } from '@/lib/interventions';
import { Client, User, TypeIntervention, Intervention } from '@/types';

/**
 * Hook personnalisé pour utiliser les services Supabase
 * Fournit des méthodes pour interagir avec les données et gère l'état de chargement et les erreurs
 */
export function useSupabase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction utilitaire pour gérer les opérations asynchrones
  const handleAsync = async <T,>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Services pour les clients
  const clients = {
    getAll: () => handleAsync(() => clientService.getAllClients()),
    getById: (id: string) => handleAsync(() => clientService.getClientById(id)),
    create: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => 
      handleAsync(() => clientService.createClient(client)),
    update: (id: string, client: Partial<Client>) => 
      handleAsync(() => clientService.updateClient(id, client)),
    delete: (id: string) => handleAsync(() => clientService.deleteClient(id)),
  };

  // Services pour les utilisateurs
  const users = {
    getAll: () => handleAsync(() => userService.getAllUsers()),
    getTechnicians: () => handleAsync(() => userService.getAllTechnicians()),
    getById: (id: string) => handleAsync(() => userService.getUserById(id)),
    create: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }) => 
      handleAsync(() => userService.createUser(userData)),
    update: (id: string, userData: Partial<User>) => 
      handleAsync(() => userService.updateUser(id, userData)),
    delete: (id: string) => handleAsync(() => userService.deleteUser(id)),
  };

  // Services pour les types d'interventions
  const typesIntervention = {
    getAll: () => handleAsync(() => typeInterventionService.getAllTypesIntervention()),
    getById: (id: string) => handleAsync(() => typeInterventionService.getTypeInterventionById(id)),
    create: (typeData: Omit<TypeIntervention, 'id' | 'created_at' | 'updated_at'>) => 
      handleAsync(() => typeInterventionService.createTypeIntervention(typeData)),
    update: (id: string, typeData: Partial<TypeIntervention>) => 
      handleAsync(() => typeInterventionService.updateTypeIntervention(id, typeData)),
    delete: (id: string) => handleAsync(() => typeInterventionService.deleteTypeIntervention(id)),
  };

  // Services pour les interventions
  const interventions = {
    getAll: () => handleAsync(() => interventionService.getAllInterventions()),
    getByTechnician: (technicienId: string) => 
      handleAsync(() => interventionService.getInterventionsByTechnicien(technicienId)),
    getByClient: (clientId: string) => 
      handleAsync(() => interventionService.getInterventionsByClient(clientId)),
    getById: (id: string) => handleAsync(() => interventionService.getInterventionById(id)),
    create: (interventionData: Omit<Intervention, 'id' | 'created_at' | 'updated_at' | 'client' | 'technicien' | 'type'>) => 
      handleAsync(() => interventionService.createIntervention(interventionData)),
    update: (id: string, interventionData: Partial<Omit<Intervention, 'client' | 'technicien' | 'type'>>) => 
      handleAsync(() => interventionService.updateIntervention(id, interventionData)),
    delete: (id: string) => handleAsync(() => interventionService.deleteIntervention(id)),
  };

  return {
    currentUser: user,
    loading,
    error,
    clients,
    users,
    typesIntervention,
    interventions,
  };
}