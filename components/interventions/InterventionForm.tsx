'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Save, X, Lightbulb } from 'lucide-react';
import { Client, TypeIntervention } from '@/types';

interface InterventionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  clients: Client[];
  types: TypeIntervention[];
  currentUser: any;
}

export function InterventionForm({ onSubmit, onCancel, clients, types, currentUser }: InterventionFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    typeId: '',
    commentaire: '',
    priorite: 'normale'
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  // Simulation des suggestions IA basées sur le contexte
  const generateAiSuggestions = (clientId: string, typeId: string) => {
    const client = clients.find(c => c.id === clientId);
    const type = types.find(t => t.id === typeId);
    
    if (client && type) {
      const suggestions = [
        `Vérifier l'état du système ${type.nom.toLowerCase()} chez ${client.nom}`,
        `Contrôler les dernières mises à jour effectuées`,
        `Examiner les logs d'erreur récents`,
        `Tester la connectivité réseau et les performances`
      ];
      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    if (formData.typeId) {
      generateAiSuggestions(clientId, formData.typeId);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setFormData(prev => ({ ...prev, typeId }));
    if (formData.clientId) {
      generateAiSuggestions(formData.clientId, typeId);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      commentaire: prev.commentaire ? `${prev.commentaire}\n${suggestion}` : suggestion
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const interventionData = {
      ...formData,
      technicienId: currentUser.id,
      status: 'en_cours',
      dateDebut: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSubmit(interventionData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Nouvelle Intervention</span>
          <Badge variant="secondary" className="ml-2">
            <Brain className="h-3 w-3 mr-1" />
            IA Activée
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={formData.clientId} onValueChange={handleClientChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{client.nom}</span>
                        <span className="text-sm text-gray-500">{client.ville} • {client.codeClient}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'intervention *</Label>
              <Select value={formData.typeId} onValueChange={handleTypeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {types.filter(type => type.actif).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: type.couleur || '#3b82f6' }}
                        />
                        <span>{type.nom}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorite">Priorité</Label>
            <Select value={formData.priorite} onValueChange={(value) => setFormData(prev => ({ ...prev, priorite: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basse">Basse</SelectItem>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAiSuggestions && aiSuggestions.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                  <span>Suggestions IA pour cette intervention</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded">
                      <span className="text-sm text-gray-700">{suggestion}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => applySuggestion(suggestion)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Appliquer
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="commentaire">Description de l'intervention *</Label>
            <Textarea
              id="commentaire"
              placeholder="Décrivez le problème ou la tâche à effectuer..."
              value={formData.commentaire}
              onChange={(e) => setFormData(prev => ({ ...prev, commentaire: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Créer l'intervention
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}