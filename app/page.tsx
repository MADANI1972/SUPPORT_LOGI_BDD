'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogIn, UserPlus, Shield, Users, Wrench, BarChart3, Brain, Clock, CheckCircle, Settings, FileText } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { InterventionForm } from '@/components/interventions/InterventionForm';
import { InterventionList } from '@/components/interventions/InterventionList';
import { UserManagement } from '@/components/admin/UserManagement';
import { ClientManagement } from '@/components/admin/ClientManagement';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { Client, Intervention, TypeIntervention } from '@/types';
import { useState } from 'react';

export default function Home() {
  const { user, login, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  
  // États pour les données
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [types, setTypes] = useState<TypeIntervention[]>([]);

  // Initialisation des données de démonstration
  useEffect(() => {
    if (user) {
      initializeDemoData();
    }
  }, [user]);

  const initializeDemoData = () => {
    // Utilisateurs de démonstration
    const demoUsers: any[] = [
      { id: '1', name: 'Admin Système', email: 'admin@logipharm.com', role: 'admin' },
      { id: '2', name: 'Marie Superviseur', email: 'supervisor@logipharm.com', role: 'superviseur' },
      { id: '3', name: 'Jean Technicien', email: 'technicien@logipharm.com', role: 'technicien', supervisorId: '2' },
      { id: '4', name: 'Pierre Durand', email: 'pierre.durand@logipharm.com', role: 'technicien', supervisorId: '2' },
    ];

    // Clients de démonstration
    const demoClients: Client[] = [
      { id: '1', nom: 'Pharmacie Centrale', ville: 'Paris', contact: '01 23 45 67 89', codeClient: 'PC001', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', nom: 'Clinique Nord', ville: 'Lyon', contact: '04 12 34 56 78', codeClient: 'CN002', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', nom: 'Hôpital Sud', ville: 'Marseille', contact: '04 98 76 54 32', codeClient: 'HS003', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', nom: 'Pharmacie Est', ville: 'Strasbourg', contact: '03 88 12 34 56', codeClient: 'PE004', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    // Types d'intervention
    const demoTypes: TypeIntervention[] = [
      { id: '1', nom: 'Installation', description: 'Installation de nouveaux équipements', couleur: '#3b82f6', actif: true },
      { id: '2', nom: 'Maintenance', description: 'Maintenance préventive et corrective', couleur: '#10b981', actif: true },
      { id: '3', nom: 'Dépannage', description: 'Résolution de problèmes urgents', couleur: '#ef4444', actif: true },
      { id: '4', nom: 'Formation', description: 'Formation des utilisateurs', couleur: '#8b5cf6', actif: true },
      { id: '5', nom: 'Mise à jour', description: 'Mise à jour logicielle', couleur: '#f59e0b', actif: true },
    ];

    // Interventions de démonstration
    const demoInterventions: Intervention[] = [
      {
        id: '1',
        clientId: '1',
        typeId: '2',
        technicienId: '3',
        status: 'en_cours',
        dateDebut: '2024-01-15T09:00:00Z',
        commentaire: 'Problème sur le module de facturation - Erreur lors de l\'impression des factures',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      },
      {
        id: '2',
        clientId: '2',
        typeId: '1',
        technicienId: '4',
        status: 'cloturee',
        dateDebut: '2024-01-14T14:30:00Z',
        dateFin: '2024-01-14T18:45:00Z',
        commentaire: 'Installation nouveau serveur de base de données',
        commentaireCloture: 'Installation terminée avec succès. Tests de performance validés.',
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-14T18:45:00Z',
        duree: 255
      },
      {
        id: '3',
        clientId: '3',
        typeId: '3',
        technicienId: '3',
        status: 'urgente',
        dateDebut: '2024-01-15T11:15:00Z',
        commentaire: 'Système de prescription en panne - Impossible de saisir les ordonnances',
        createdAt: '2024-01-15T11:15:00Z',
        updatedAt: '2024-01-15T11:15:00Z'
      }
    ];

    setUsers(demoUsers);
    setClients(demoClients);
    setTypes(demoTypes);
    setInterventions(demoInterventions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-600 p-3 rounded-full inline-block mb-4">
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={logout}
        interventions={interventions}
        clients={clients}
        users={users}
        types={types}
        setInterventions={setInterventions}
        setUsers={setUsers}
        setClients={setClients}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">LOGIPHARM-Support</CardTitle>
          <p className="text-gray-600">Gestion intelligente des interventions techniques</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm onLogin={login} />
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <RegisterForm onRegister={login} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@logipharm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <LogIn className="h-4 w-4 mr-2" />
        Se connecter
      </Button>
      <div className="text-sm text-gray-600 mt-4">
        <p>Comptes de démonstration :</p>
        <p>• admin@logipharm.com (Admin)</p>
        <p>• supervisor@logipharm.com (Superviseur)</p>
        <p>• technicien@logipharm.com (Technicien)</p>
      </div>
    </form>
  );
}

function RegisterForm({ onRegister }: { onRegister: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    await onRegister(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="exemple@logipharm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Mot de passe</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <UserPlus className="h-4 w-4 mr-2" />
        Créer un compte
      </Button>
    </form>
  );
}

function Dashboard({ 
  user, 
  onLogout, 
  interventions, 
  clients, 
  users, 
  types, 
  setInterventions, 
  setUsers, 
  setClients 
}: { 
  user: any; 
  onLogout: () => void;
  interventions: Intervention[];
  clients: Client[];
  users: any[];
  types: TypeIntervention[];
  setInterventions: React.Dispatch<React.SetStateAction<Intervention[]>>;
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNewIntervention, setShowNewIntervention] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, roles: ['admin', 'superviseur', 'technicien'] },
    { id: 'interventions', label: 'Interventions', icon: Wrench, roles: ['admin', 'superviseur', 'technicien'] },
    { id: 'users', label: 'Utilisateurs', icon: Users, roles: ['admin'] },
    { id: 'clients', label: 'Clients', icon: Users, roles: ['admin', 'superviseur'] },
    { id: 'types', label: 'Types d\'intervention', icon: Settings, roles: ['admin'] },
    { id: 'reports', label: 'Rapports', icon: BarChart3, roles: ['admin', 'superviseur'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LOGIPHARM</h1>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-300 p-2 rounded-full">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="w-full">
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === 'dashboard' && <DashboardContent user={user} interventions={interventions} clients={clients} />}
        {activeSection === 'interventions' && (
          showNewIntervention ? (
            <InterventionForm
              onSubmit={(data) => {
                const newIntervention: Intervention = {
                  id: Math.random().toString(36).substr(2, 9),
                  ...data,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                setInterventions(prev => [...prev, newIntervention]);
                setShowNewIntervention(false);
              }}
              onCancel={() => setShowNewIntervention(false)}
              clients={clients}
              types={types}
              currentUser={user}
            />
          ) : (
            <InterventionList
              interventions={interventions}
              clients={clients}
              types={types}
              currentUser={user}
              onNewIntervention={() => setShowNewIntervention(true)}
              onCloseIntervention={(id) => {
                setInterventions(prev => prev.map(intervention => 
                  intervention.id === id 
                    ? { ...intervention, status: 'cloturee', dateFin: new Date().toISOString(), updatedAt: new Date().toISOString() }
                    : intervention
                ));
              }}
            />
          )
        )}
        {activeSection === 'users' && (
          <UserManagement
            users={users}
            currentUser={user}
            onCreateUser={(userData) => {
              const newUser: any = {
                id: Math.random().toString(36).substr(2, 9),
                ...userData
              };
              setUsers(prev => [...prev, newUser]);
            }}
            onUpdateUser={(id, userData) => {
              setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
            }}
            onDeleteUser={(id) => {
              setUsers(prev => prev.filter(u => u.id !== id));
            }}
          />
        )}
        {activeSection === 'clients' && (
          <ClientManagement
            clients={clients}
            onCreateClient={(clientData) => {
              // @ts-ignore
              const newClient: Client = {
                 // @ts-ignore
                id: Math.random().toString(36).substr(2, 9),
                 // @ts-ignore
                ...clientData
              };
               // @ts-ignore
              setClients(prev => [...prev, newClient]);
            }}
            onUpdateClient={(id, clientData) => {
              setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData as Partial<Client> } : c));
            }}
            onDeleteClient={(id) => {
              setClients(prev => prev.filter(c => c.id !== id));
              setInterventions(prev => prev.filter(i => i.clientId !== id));
            }}
          />
        )}
        {activeSection === 'reports' && (
          <ReportsModule
            interventions={interventions}
            clients={clients}
            users={users}
            types={types}
            currentUser={user}
            onCloseIntervention={(id, commentaireCloture) => {
              setInterventions(prev => prev.map(intervention => 
                intervention.id === id 
                  ? { 
                      ...intervention, 
                      status: 'cloturee', 
                      dateFin: new Date().toISOString(), 
                      commentaireCloture,
                      updatedAt: new Date().toISOString() 
                    }
                  : intervention
              ));
            }}
          />
        )}
      </div>
    </div>
  );
}

function DashboardContent({ user, interventions, clients }: { user: any; interventions: Intervention[]; clients: Client[] }) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: interventions.length,
    enCours: interventions.filter(i => i.status === 'en_cours').length,
    cloturees: interventions.filter(i => i.status === 'cloturee').length,
    urgentes: interventions.filter(i => i.status === 'urgente').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Tableau de bord</h2>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">IA Activée</span>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Suggestions IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">3 interventions urgentes nécessitent votre attention</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Maintenance préventive recommandée pour Client ABC</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interventions</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.enCours}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clôturées</p>
                <p className="text-2xl font-bold text-green-600">{stats.cloturees}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgentes}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Interventions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interventions.slice(0, 5).map((intervention, index) => {
              const client = clients.find(c => c.id === intervention.clientId);
              
              let dureeText = '0h 0m';
              if (currentTime) {
                const duree = intervention.dateFin 
                  ? new Date(intervention.dateFin).getTime() - new Date(intervention.dateDebut).getTime()
                  : currentTime - new Date(intervention.dateDebut).getTime();
                const heures = Math.floor(duree / (1000 * 60 * 60));
                const minutes = Math.floor((duree % (1000 * 60 * 60)) / (1000 * 60));
                dureeText = `${heures}h ${minutes}m`;
              }
              
              return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{client?.nom || 'Client inconnu'}</p>
                    <p className="text-sm text-gray-600">{intervention.commentaire.substring(0, 50)}...</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{dureeText}</span>
                  <Badge 
                    variant={intervention.status === 'cloturee' ? 'default' : 
                            intervention.status === 'urgente' ? 'destructive' : 'secondary'}
                  >
                    {intervention.status}
                  </Badge>
                </div>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}