'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Hash } from 'lucide-react';
import { Client } from '@/types';

interface ClientManagementProps {
  clients: Client[];
  onCreateClient: (clientData: Partial<Client>) => void;
  onUpdateClient: (id: string, clientData: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientManagement({ clients, onCreateClient, onUpdateClient, onDeleteClient }: ClientManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.codeClient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestion des Clients</h2>
          <p className="text-gray-600 mt-1">Gérez votre base de données clients</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmit={(clientData) => {
                onCreateClient(clientData);
                setShowCreateDialog(false);
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Rechercher par nom, ville ou code client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{client.nom}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{client.ville}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{client.contact}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <Badge variant="outline">{client.codeClient}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le client</DialogTitle>
                      </DialogHeader>
                      <ClientForm
                        client={client}
                        onSubmit={(clientData) => {
                          onUpdateClient(client.id, clientData);
                          setEditingClient(null);
                        }}
                        onCancel={() => setEditingClient(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {client.nom} ? Cette action est irréversible et supprimera également toutes les interventions associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteClient(client.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClientForm({ 
  client, 
  onSubmit, 
  onCancel 
}: { 
  client?: Client; 
  onSubmit: (data: Partial<Client>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    nom: client?.nom || '',
    ville: client?.ville || '',
    contact: client?.contact || '',
    codeClient: client?.codeClient || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updatedAt: new Date().toISOString(),
      ...(client ? {} : { createdAt: new Date().toISOString() })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom du client</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          placeholder="Ex: Pharmacie Centrale"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input
            id="ville"
            value={formData.ville}
            onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
            placeholder="Ex: Paris"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="codeClient">Code Client</Label>
          <Input
            id="codeClient"
            value={formData.codeClient}
            onChange={(e) => setFormData(prev => ({ ...prev, codeClient: e.target.value.toUpperCase() }))}
            placeholder="Ex: PC001"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact">Contact</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          placeholder="Ex: 01 23 45 67 89"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {client ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}