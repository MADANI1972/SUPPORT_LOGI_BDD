'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AIInsightsProps {
  userRole: string;
}

export function AIInsights({ userRole }: AIInsightsProps) {
  const insights = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Interventions Urgentes',
      description: '3 interventions nécessitent une attention immédiate',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Maintenance Préventive',
      description: 'Maintenance recommandée pour 2 clients cette semaine',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Performance',
      description: 'Temps moyen d\'intervention réduit de 15% ce mois',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'alert',
      icon: Clock,
      title: 'Retard Possible',
      description: 'Intervention Client XYZ risque de dépasser 4h',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Assistant IA - Insights</span>
          <Badge variant="secondary" className="ml-2">
            Temps réel
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-4 rounded-lg ${insight.bgColor} transition-all hover:shadow-sm`}
            >
              <div className={`p-2 rounded-full bg-white/60`}>
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}