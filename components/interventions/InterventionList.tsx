'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { InterventionCard } from './InterventionCard';
import { Search, Filter, Plus, Brain, TrendingUp } from 'lucide-react';
import { Intervention, Client, TypeIntervention } from '@/types';

interface InterventionListProps {
  interventions: Intervention[];
  clients: Client[];
  types: TypeIntervention[];
  currentUser: any;
  onNewIntervention: () => void;
  onCloseIntervention: (id: string) => void;
}

export function InterventionList({ 
  interventions, 
  clients, 
  types, 
  currentUser, 
  onNewIntervention, 
  onCloseIntervention 
}: InterventionListProps) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filtrage intelligent avec IA
  const filteredAndSortedInterventions = useMemo(() => {
    let filtered = interventions.filter(intervention => {
      // Filtrage par rôle utilisateur
      if (currentUser.role === 'technicien') {
        if (intervention.technicienId !== currentUser.id) return false;
      } else if (currentUser.role === 'superviseur') {
        // Logique pour superviseur - voir les interventions de ses techniciens
        // Pour la démo, on montre toutes les interventions
      }

      // Filtres de recherche
      const client = clients.find(c => c.id === intervention.clientId);
      const type = types.find(t => t.id === intervention.typeId);
      
      const matchesSearch = !searchTerm || 
        client?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intervention.commentaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type?.nom.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || intervention.status === statusFilter;
      const matchesType = typeFilter === 'all' || intervention.typeId === typeFilter;
      const matchesClient = clientFilter === 'all' || intervention.clientId === clientFilter;

      return matchesSearch && matchesStatus && matchesType && matchesClient;
    });

    // Tri intelligent avec priorité IA
    filtered.sort((a, b) => {
      // Priorité aux interventions urgentes
      if (a.status === 'urgente' && b.status !== 'urgente') return -1;
      if (b.status === 'urgente' && a.status !== 'urgente') return 1;

      switch (sortBy) {
        case 'date_desc':
          return new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime();
        case 'date_asc':
          return new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
        case 'client':
          const clientA = clients.find(c => c.id === a.clientId)?.nom || '';
          const clientB = clients.find(c => c.id === b.clientId)?.nom || '';
          return clientA.localeCompare(clientB);
        case 'duree':
          if (currentTime) {
            const dureeA = a.dateFin ? 
              new Date(a.dateFin).getTime() - new Date(a.dateDebut).getTime() : 
              currentTime - new Date(a.dateDebut).getTime();
            const dureeB = b.dateFin ? 
              new Date(b.dateFin).getTime() - new Date(b.dateDebut).getTime() : 
              currentTime - new Date(b.dateDebut).getTime();
            return dureeB - dureeA;
          }
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [interventions, clients, types, currentUser, searchTerm, statusFilter, typeFilter, clientFilter, sortBy, currentTime]);

  const stats = useMemo(() => {
    const total = filteredAndSortedInterventions.length;
    const enCours = filteredAndSortedInterventions.filter(i => i.status === 'en_cours').length;
    const urgentes = filteredAndSortedInterventions.filter(i => i.status === 'urgente').length;
    const cloturees = filteredAndSortedInterventions.filter(i => i.status === 'cloturee').length;
    
    return { total, enCours, urgentes, cloturees };
  }, [filteredAndSortedInterventions]);

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Interventions</h2>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="secondary">{stats.total} Total</Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {stats.enCours} En cours
            </Badge>
            <Badge variant="destructive">{stats.urgentes} Urgentes</Badge>
            <Badge variant="default">{stats.cloturees} Clôturées</Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-purple-600">
            <Brain className="h-4 w-4" />
            <span>Tri intelligent activé</span>
          </div>
          <Button onClick={onNewIntervention}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Intervention
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres et Recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="cloturee">Clôturée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Plus récent</span>
                  </div>
                </SelectItem>
                <SelectItem value="date_asc">Plus ancien</SelectItem>
                <SelectItem value="client">Client A-Z</SelectItem>
                <SelectItem value="duree">Durée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des interventions */}
      <div className="space-y-4">
        {filteredAndSortedInterventions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucune intervention trouvée</p>
                <p className="text-sm">Essayez de modifier vos filtres ou créez une nouvelle intervention</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedInterventions.map((intervention) => {
            const client = clients.find(c => c.id === intervention.clientId);
            const type = types.find(t => t.id === intervention.typeId);
            
            return (
              <InterventionCard
                key={intervention.id}
                // @ts-ignore
                intervention={{
                  // @ts-ignore
                  ...intervention,
                  // @ts-ignore
                  client: client?.nom || 'Client inconnu',
                  // @ts-ignore
                  type: type?.nom || 'Type inconnu',
                  // @ts-ignore
                  ville: client?.ville
                }}
                // @ts-ignore
                canClose={currentUser.role === 'technicien' && intervention.technicienId === currentUser.id}
                // @ts-ignore
                onClose={() => onCloseIntervention(intervention.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}