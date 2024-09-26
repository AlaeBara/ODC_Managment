import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const evaluationFields = [
  { label: "Qualité du contenu", name: "contentQuality" },
  { label: "Compétences acquises", name: "acquiredSkillsQuality" },
  { label: "Alignement professionnel", name: "alignmentWithNeeds" },
  { label: "Structure de formation", name: "trainingStructure" },
  { label: "Niveau de difficulté", name: "difficultyLevel" },
  { label: "Pédagogie du formateur", name: "trainerPedagogyQuality" },
  { label: "Expertise du formateur", name: "trainerExpertise" },
  { label: "Supports de formation", name: "materialQuality" },
  { label: "Exercices et activités", name: "exercisesQuality" },
  { label: "Adaptation aux participants", name: "adaptationToParticipants" },
  { label: "Confort de la salle", name: "roomComfort" },
  { label: "Accessibilité", name: "accessibility" },
  { label: "Horaires et pauses", name: "timingAndBreaks" },
  { label: "Matériel pédagogique", name: "equipmentCondition" },
  { label: "Communication", name: "organizationalCommunication" },
  { label: "Gestion administrative", name: "administrativeManagement" },
  { label: "Composition du groupe", name: "groupComposition" },
  { label: "Durée de la formation", name: "trainingDuration" },
];

export default function EvaluationDashboard() {
  const { id } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/evaluationdash/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Unauthorized: Please log in' : 'Failed to fetch evaluations');
        }
  
        const data = await response.json();
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvaluations();
  }, [id]);

  const calculateAverages = () => {
    return evaluationFields.reduce((averages, field) => {
      const sum = evaluations.reduce((acc, evaluationItem) => {
        const value = Number(evaluationItem[field.name]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
  
      averages[field.name] = evaluations.length > 0 ? sum / evaluations.length : 0;
      return averages;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <p className="text-2xl font-semibold">{error}</p>
      </div>
    );
  }

  if (!evaluations.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4" />
        <p className="text-2xl font-semibold">Aucune évaluation trouvée</p>
      </div>
    );
  }

  const averages = calculateAverages();
  const overallAverage = Object.values(averages).reduce((sum, value) => sum + value, 0) / evaluationFields.length;
  const recommendationPercentage = (evaluations.filter(evaluationItem => evaluationItem.recommendation === 'Oui').length / evaluations.length) * 100;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Tableau de Bord des Évaluations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Note Globale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-blue-500 flex items-center">
                <Star className="w-8 h-8 mr-2 text-yellow-500" />
                {overallAverage.toFixed(2)}
              </div>
              <Progress value={overallAverage * 20} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-green-500">{recommendationPercentage.toFixed(1)}%</div>
              <Progress value={recommendationPercentage} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Nombre d'Évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-purple-500">{evaluations.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluationFields.map((field) => (
            <Card key={field.name} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">{field.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  {averages[field.name].toFixed(2)}
                </div>
                <Progress value={averages[field.name] * 20} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Commentaires Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluations.slice(-3).map((evaluationItem, index) => (
                <li key={index} className="bg-gray-700 p-3 rounded">
                  {evaluationItem.generalComments}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}