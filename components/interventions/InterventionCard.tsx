'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, User, MapPin } from 'lucide-react';

interface Intervention {
  id: string;
  client: string;
  type: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  technicien: string;
  dateDebut?: string;
  dateFin?: string;
  notes?: string;
  ville?: string;
}

interface InterventionCardProps {
  intervention: Intervention;
  canClose: boolean;
  onClose?: () => void;
}

export function InterventionCard({ intervention, canClose, onClose }: InterventionCardProps) {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'terminee': return 'default';
      case 'en_cours': return 'secondary';
      case 'en_attente': return 'outline';
      case 'annulee': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'terminee': return 'Terminée';
      case 'en_cours': return 'En cours';
      case 'en_attente': return 'En attente';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'destructive';
      case 'haute': return 'destructive';
      case 'normale': return 'secondary';
      case 'basse': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Wrench className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{intervention.client}</CardTitle>
              <p className="text-sm text-gray-600">{intervention.type}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getStatusColor(intervention.statut)}>
              {getStatusLabel(intervention.statut)}
            </Badge>
            {intervention.priorite === 'urgente' && (
              <Badge variant="destructive">Urgente</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Technicien:</span>
              <span className="font-medium">{intervention.technicien}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Début:</span>
              <span className="font-medium">{intervention.dateDebut}</span>
            </div>
            
            {intervention.dateFin && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fin:</span>
                <span className="font-medium">{intervention.dateFin}</span>
              </div>
            )}
            
            {intervention.ville && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Ville:</span>
                <span className="font-medium">{intervention.ville}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Notes:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {intervention.notes || 'Aucune note'}
            </p>
          </div>
        </div>
        
        {canClose && intervention.statut === 'en_cours' && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} size="sm">
              Clôturer l'intervention
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}