'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BarChart3, Download, FileText, Calendar as CalendarIcon, Brain, TrendingUp, AlertTriangle, Users, Clock, Filter, X, CheckCircle, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Intervention, Client, User, TypeIntervention } from '@/types';

interface ReportsModuleProps {
  interventions: Intervention[];
  clients: Client[];
  users: User[];
  types: TypeIntervention[];
  currentUser: User;
  onCloseIntervention?: (id: string, commentaireCloture: string) => void;
}

export function ReportsModule({ interventions, clients, users, types, currentUser, onCloseIntervention }: ReportsModuleProps) {
  // Filtres de période globale
  const [globalDateRange, setGlobalDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  
  // Filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState({
    dateDebutFrom: null as Date | null,
    dateDebutTo: null as Date | null,
    dateFinFrom: null as Date | null,
    dateFinTo: null as Date | null,
    selectedTypes: [] as string[],
    urgencyLevels: [] as string[],
    showAdvanced: false
  });
  
  const [selectedTechnicien, setSelectedTechnicien] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [closingIntervention, setClosingIntervention] = useState<Intervention | null>(null);
  const [commentaireCloture, setCommentaireCloture] = useState('');

  // Calculs des statistiques
  const stats = useMemo(() => {
    let filteredInterventions = interventions.filter(intervention => {
      // Filtre par période globale
      const interventionDate = new Date(intervention.dateDebut);
      const inGlobalDateRange = interventionDate >= globalDateRange.from && interventionDate <= globalDateRange.to;
      
      // Filtres avancés
      let passesAdvancedFilters = true;
      
      // Filtre par date de début d'intervention
      if (advancedFilters.dateDebutFrom) {
        const debutDate = new Date(intervention.dateDebut);
        if (debutDate < advancedFilters.dateDebutFrom) passesAdvancedFilters = false;
      }
      if (advancedFilters.dateDebutTo) {
        const debutDate = new Date(intervention.dateDebut);
        if (debutDate > advancedFilters.dateDebutTo) passesAdvancedFilters = false;
      }
      
      // Filtre par date de fin d'intervention
      if (advancedFilters.dateFinFrom && intervention.dateFin) {
        const finDate = new Date(intervention.dateFin);
        if (finDate < advancedFilters.dateFinFrom) passesAdvancedFilters = false;
      }
      if (advancedFilters.dateFinTo && intervention.dateFin) {
        const finDate = new Date(intervention.dateFin);
        if (finDate > advancedFilters.dateFinTo) passesAdvancedFilters = false;
      }
      
      // Filtre par types sélectionnés
      if (advancedFilters.selectedTypes.length > 0) {
        if (!advancedFilters.selectedTypes.includes(intervention.typeId)) {
          passesAdvancedFilters = false;
        }
      }
      
      // Filtre par degré d'urgence
      if (advancedFilters.urgencyLevels.length > 0) {
        if (!advancedFilters.urgencyLevels.includes(intervention.status)) {
          passesAdvancedFilters = false;
        }
      }
      
      const matchesTechnicien = selectedTechnicien === 'all' || intervention.technicienId === selectedTechnicien;
      const matchesClient = selectedClient === 'all' || intervention.clientId === selectedClient;
      
      return inGlobalDateRange && passesAdvancedFilters && matchesTechnicien && matchesClient;
    });

    const total = filteredInterventions.length;
    const cloturees = filteredInterventions.filter(i => i.status === 'cloturee').length;
    const enCours = filteredInterventions.filter(i => i.status === 'en_cours').length;
    const urgentes = filteredInterventions.filter(i => i.status === 'urgente').length;

    // Calcul du temps moyen
    const interventionsCloturees = filteredInterventions.filter(i => i.status === 'cloturee' && i.dateFin);
    const tempsMoyen = interventionsCloturees.length > 0 
      ? interventionsCloturees.reduce((acc, intervention) => {
          const duree = new Date(intervention.dateFin!).getTime() - new Date(intervention.dateDebut).getTime();
          return acc + duree;
        }, 0) / interventionsCloturees.length
      : 0;

    // Répartition par type
    const repartitionTypes = types.map(type => ({
      type: type.nom,
      count: filteredInterventions.filter(i => i.typeId === type.id).length,
      couleur: type.couleur
    }));

    // Performance par technicien
    const performanceTechniciens = users
      .filter(u => u.role === 'technicien')
      .map(technicien => {
        const interventionsTechnicien = filteredInterventions.filter(i => i.technicienId === technicien.id);
        const clotureesTechnicien = interventionsTechnicien.filter(i => i.status === 'cloturee');
        
        return {
          nom: technicien.name,
          total: interventionsTechnicien.length,
          cloturees: clotureesTechnicien.length,
          taux: interventionsTechnicien.length > 0 ? (clotureesTechnicien.length / interventionsTechnicien.length) * 100 : 0
        };
      });

    return {
      total,
      cloturees,
      enCours,
      urgentes,
      tempsMoyen,
      repartitionTypes,
      performanceTechniciens,
      tauxReussite: total > 0 ? (cloturees / total) * 100 : 0
    };
  }, [interventions, globalDateRange, advancedFilters, selectedTechnicien, selectedClient, types, users]);

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      dateDebutFrom: null,
      dateDebutTo: null,
      dateFinFrom: null,
      dateFinTo: null,
      selectedTypes: [],
      urgencyLevels: [],
      showAdvanced: false
    });
  };

  const toggleTypeFilter = (typeId: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(typeId)
        ? prev.selectedTypes.filter(id => id !== typeId)
        : [...prev.selectedTypes, typeId]
    }));
  };

  const toggleUrgencyFilter = (urgency: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      urgencyLevels: prev.urgencyLevels.includes(urgency)
        ? prev.urgencyLevels.filter(level => level !== urgency)
        : [...prev.urgencyLevels, urgency]
    }));
  };
  const formatDuree = (milliseconds: number) => {
    const heures = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${heures}h ${minutes}m`;
  };

  const generatePDFReport = () => {
    // Simulation de génération PDF
    console.log('Génération du rapport PDF...');
    alert('Rapport PDF généré avec succès !');
  };

  const generateExcelExport = () => {
    // Simulation d'export Excel
    console.log('Export Excel en cours...');
    alert('Export Excel généré avec succès !');
  };

  const handleCloseIntervention = () => {
    if (closingIntervention && onCloseIntervention) {
      onCloseIntervention(closingIntervention.id, commentaireCloture);
      setClosingIntervention(null);
      setCommentaireCloture('');
    }
  };

  const canCloseIntervention = (intervention: Intervention) => {
    return intervention.status === 'en_cours' && 
           (currentUser.role === 'admin' || 
            (currentUser.role === 'technicien' && intervention.technicienId === currentUser.id) ||
            (currentUser.role === 'superviseur'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Rapports & Analyses</h2>
          <div className="flex items-center space-x-2 mt-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Analyses IA Avancées</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button onClick={generatePDFReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={generateExcelExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        {/* Filtres communs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtres</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdvancedFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
              >
                <Filter className="h-4 w-4 mr-2" />
                {advancedFilters.showAdvanced ? 'Masquer' : 'Filtres avancés'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtres de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Période globale</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(globalDateRange.from, 'dd/MM/yyyy', { locale: fr })} - {format(globalDateRange.to, 'dd/MM/yyyy', { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: globalDateRange.from, to: globalDateRange.to }}
                      onSelect={(range) => range?.from && range?.to && setGlobalDateRange({ from: range.from, to: range.to })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Technicien</Label>
                <Select value={selectedTechnicien} onValueChange={setSelectedTechnicien}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les techniciens</SelectItem>
                    {users.filter(u => u.role === 'technicien').map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Filtres avancés */}
            {advancedFilters.showAdvanced && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Filtres Avancés</h4>
                  <Button variant="ghost" size="sm" onClick={resetAdvancedFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Filtres par dates d'intervention */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-700">Date de début d'intervention</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-sm">Du</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {advancedFilters.dateDebutFrom 
                                  ? format(advancedFilters.dateDebutFrom, 'dd/MM/yyyy', { locale: fr })
                                  : 'Sélectionner'
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={advancedFilters.dateDebutFrom || undefined}
                                onSelect={(date) => setAdvancedFilters(prev => ({ ...prev, dateDebutFrom: date || null }))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Au</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {advancedFilters.dateDebutTo 
                                  ? format(advancedFilters.dateDebutTo, 'dd/MM/yyyy', { locale: fr })
                                  : 'Sélectionner'
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={advancedFilters.dateDebutTo || undefined}
                                onSelect={(date) => setAdvancedFilters(prev => ({ ...prev, dateDebutTo: date || null }))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-700">Date de fin d'intervention</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-sm">Du</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {advancedFilters.dateFinFrom 
                                  ? format(advancedFilters.dateFinFrom, 'dd/MM/yyyy', { locale: fr })
                                  : 'Sélectionner'
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={advancedFilters.dateFinFrom || undefined}
                                onSelect={(date) => setAdvancedFilters(prev => ({ ...prev, dateFinFrom: date || null }))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Au</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {advancedFilters.dateFinTo 
                                  ? format(advancedFilters.dateFinTo, 'dd/MM/yyyy', { locale: fr })
                                  : 'Sélectionner'
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={advancedFilters.dateFinTo || undefined}
                                onSelect={(date) => setAdvancedFilters(prev => ({ ...prev, dateFinTo: date || null }))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filtre par types d'intervention */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Types d'intervention</h5>
                    <div className="flex flex-wrap gap-2">
                      {types.map(type => (
                        <Button
                          key={type.id}
                          variant={advancedFilters.selectedTypes.includes(type.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTypeFilter(type.id)}
                          className="flex items-center space-x-2"
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.couleur || '#3b82f6' }}
                          />
                          <span>{type.nom}</span>
                        </Button>
                      ))}
                    </div>
                    {advancedFilters.selectedTypes.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {advancedFilters.selectedTypes.length} type(s) sélectionné(s)
                      </div>
                    )}
                  </div>

                  {/* Filtre par degré d'urgence */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Degré d'urgence</h5>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={advancedFilters.urgencyLevels.includes('en_cours') ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleUrgencyFilter('en_cours')}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span>En cours</span>
                      </Button>
                      <Button
                        variant={advancedFilters.urgencyLevels.includes('urgente') ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleUrgencyFilter('urgente')}
                        className="flex items-center space-x-2"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Urgente</span>
                      </Button>
                      <Button
                        variant={advancedFilters.urgencyLevels.includes('cloturee') ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleUrgencyFilter('cloturee')}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Clôturée</span>
                      </Button>
                    </div>
                    {advancedFilters.urgencyLevels.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {advancedFilters.urgencyLevels.length} niveau(x) sélectionné(s)
                      </div>
                    )}
                  </div>

                  {/* Résumé des filtres actifs */}
                  {(advancedFilters.dateDebutFrom || advancedFilters.dateDebutTo || 
                    advancedFilters.dateFinFrom || advancedFilters.dateFinTo ||
                    advancedFilters.selectedTypes.length > 0 || 
                    advancedFilters.urgencyLevels.length > 0) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h6 className="font-medium text-blue-800 mb-2">Filtres actifs :</h6>
                      <div className="space-y-1 text-sm text-blue-700">
                        {advancedFilters.dateDebutFrom && (
                          <p>• Début intervention à partir du {format(advancedFilters.dateDebutFrom, 'dd/MM/yyyy', { locale: fr })}</p>
                        )}
                        {advancedFilters.dateDebutTo && (
                          <p>• Début intervention jusqu'au {format(advancedFilters.dateDebutTo, 'dd/MM/yyyy', { locale: fr })}</p>
                        )}
                        {advancedFilters.dateFinFrom && (
                          <p>• Fin intervention à partir du {format(advancedFilters.dateFinFrom, 'dd/MM/yyyy', { locale: fr })}</p>
                        )}
                        {advancedFilters.dateFinTo && (
                          <p>• Fin intervention jusqu'au {format(advancedFilters.dateFinTo, 'dd/MM/yyyy', { locale: fr })}</p>
                        )}
                        {advancedFilters.selectedTypes.length > 0 && (
                          <p>• Types : {advancedFilters.selectedTypes.map(id => types.find(t => t.id === id)?.nom).join(', ')}</p>
                        )}
                        {advancedFilters.urgencyLevels.length > 0 && (
                          <p>• Urgence : {advancedFilters.urgencyLevels.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Interventions</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-green-600">{stats.tauxReussite.toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                    <p className="text-2xl font-bold text-purple-600">{formatDuree(stats.tempsMoyen)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Interventions Urgentes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.urgentes}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par type */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Type d'Intervention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.repartitionTypes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.couleur || '#3b82f6' }}
                      />
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <Badge variant="secondary">{item.count} interventions</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des interventions en cours avec bouton clôture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Interventions en Cours</span>
                <Badge variant="secondary">{stats.enCours}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interventions
                  .filter(intervention => {
                    // Appliquer les mêmes filtres que pour les stats
                    const interventionDate = new Date(intervention.dateDebut);
                    const inGlobalDateRange = interventionDate >= globalDateRange.from && interventionDate <= globalDateRange.to;
                    
                    let passesAdvancedFilters = true;
                    
                    if (advancedFilters.dateDebutFrom) {
                      const debutDate = new Date(intervention.dateDebut);
                      if (debutDate < advancedFilters.dateDebutFrom) passesAdvancedFilters = false;
                    }
                    if (advancedFilters.dateDebutTo) {
                      const debutDate = new Date(intervention.dateDebut);
                      if (debutDate > advancedFilters.dateDebutTo) passesAdvancedFilters = false;
                    }
                    
                    if (advancedFilters.selectedTypes.length > 0) {
                      if (!advancedFilters.selectedTypes.includes(intervention.typeId)) {
                        passesAdvancedFilters = false;
                      }
                    }
                    
                    if (advancedFilters.urgencyLevels.length > 0) {
                      if (!advancedFilters.urgencyLevels.includes(intervention.status)) {
                        passesAdvancedFilters = false;
                      }
                    }
                    
                    const matchesTechnicien = selectedTechnicien === 'all' || intervention.technicienId === selectedTechnicien;
                    const matchesClient = selectedClient === 'all' || intervention.clientId === selectedClient;
                    
                    return intervention.status === 'en_cours' && inGlobalDateRange && passesAdvancedFilters && matchesTechnicien && matchesClient;
                  })
                  .slice(0, 10) // Limiter à 10 interventions pour l'affichage
                  .map((intervention) => {
                    const client = clients.find(c => c.id === intervention.clientId);
                    const type = types.find(t => t.id === intervention.typeId);
                    const technicien = users.find(u => u.id === intervention.technicienId);
                    
                    return (
                      <div key={intervention.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-2 rounded-full">
                            <Wrench className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{client?.nom || 'Client inconnu'}</p>
                            <p className="text-sm text-gray-600">{type?.nom || 'Type inconnu'}</p>
                            <p className="text-xs text-gray-500">
                              Technicien: {technicien?.name || 'Inconnu'} • 
                              Début: {format(new Date(intervention.dateDebut), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant="secondary" className="text-orange-600 border-orange-200">
                              En cours
                            </Badge>
                          </div>
                          {canCloseIntervention(intervention) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setClosingIntervention(intervention)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Clôturer
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Clôturer l'intervention</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-800">{client?.nom}</p>
                                    <p className="text-sm text-gray-600">{type?.nom}</p>
                                    <p className="text-sm text-gray-500 mt-2">{intervention.commentaire}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="commentaire-cloture">Commentaire de clôture</Label>
                                    <Textarea
                                      id="commentaire-cloture"
                                      placeholder="Décrivez les actions effectuées et le résultat de l'intervention..."
                                      value={commentaireCloture}
                                      onChange={(e) => setCommentaireCloture(e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setClosingIntervention(null);
                                        setCommentaireCloture('');
                                      }}
                                    >
                                      Annuler
                                    </Button>
                                    <Button 
                                      onClick={handleCloseIntervention}
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={!commentaireCloture.trim()}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Clôturer l'intervention
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {interventions.filter(i => i.status === 'en_cours').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucune intervention en cours</p>
                    <p className="text-sm">Toutes les interventions sont clôturées</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Technicien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.performanceTechniciens.map((technicien, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{technicien.nom}</p>
                        <p className="text-sm text-gray-600">{technicien.total} interventions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{technicien.cloturees} clôturées</p>
                      <Badge variant={technicien.taux >= 80 ? 'default' : technicien.taux >= 60 ? 'secondary' : 'destructive'}>
                        {technicien.taux.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Clients à Risque</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-gray-800">Pharmacie Centrale</p>
                    <p className="text-sm text-gray-600">3 interventions urgentes ce mois</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-gray-800">Clinique Nord</p>
                    <p className="text-sm text-gray-600">Temps d'intervention en hausse de 40%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>Maintenance Préventive</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-gray-800">Hôpital Sud</p>
                    <p className="text-sm text-gray-600">Maintenance recommandée dans 7 jours</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-gray-800">Pharmacie Est</p>
                    <p className="text-sm text-gray-600">Mise à jour système suggérée</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Prédéfinis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={generatePDFReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport Mensuel Complet
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={generateExcelExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Interventions Excel
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyse Performance Techniciens
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Rapport IA Prédictif
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exports Programmés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Rapport Hebdomadaire</p>
                      <Badge variant="secondary">Actif</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Tous les lundis à 8h00</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Export Mensuel</p>
                      <Badge variant="secondary">Actif</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Le 1er de chaque mois</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurer un nouvel export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}