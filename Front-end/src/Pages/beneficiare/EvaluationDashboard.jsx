import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle, Star } from 'lucide-react';

const evaluationFields = [
  { label: "Qualité du contenu de la formation", name: "contentQuality" },
  { label: "Qualité des compétences acquises", name: "acquiredSkillsQuality" },
  { label: "Alignement des compétences acquises avec vos besoins professionnels", name: "alignmentWithNeeds" },
  { label: "Structure de la formation (rythme, progression pédagogique, etc.)", name: "trainingStructure" },
  { label: "Niveau de difficulté de la formation", name: "difficultyLevel" },
  { label: "Qualité pédagogique du formateur (élocution, dynamisme, etc.)", name: "trainerPedagogyQuality" },
  { label: "Expertise du formateur (niveau de connaissance dans son domaine)", name: "trainerExpertise" },
  { label: "Qualité des supports de formation", name: "materialQuality" },
  { label: "Qualité des exercices et des activités", name: "exercisesQuality" },
  { label: "Adaptation au profil et au niveau des participants", name: "adaptationToParticipants" },
  { label: "Confort de la salle", name: "roomComfort" },
  { label: "Accessibilité du lieu de formation", name: "accessibility" },
  { label: "Horaires et pauses", name: "timingAndBreaks" },
  { label: "État et disponibilité du matériel pédagogique", name: "equipmentCondition" },
  { label: "Communication des informations d'ordre organisationnel", name: "organizationalCommunication" },
  { label: "Gestion administrative", name: "administrativeManagement" },
  { label: "Composition du groupe (taille et niveau)", name: "groupComposition" },
  { label: "Durée de la formation", name: "trainingDuration" },
];

export default function EvaluationDisplay() {
  const { id } = useParams(); // Course ID from URL
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
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in to view this evaluation');
          }
          if (response.status === 404) {
            throw new Error('Evaluations not found');
          }
          throw new Error('Failed to fetch evaluations');
        }

        const data = await response.json();
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError(error.message || 'Failed to load evaluations data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!evaluations.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4" />
        <p className="text-2xl font-semibold text-yellow-600">No evaluations data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-100 to-yellow-100">
      <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <CardTitle className="text-3xl font-bold text-center">Résultats de l'évaluation</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white space-y-8">
          {evaluations.map((evaluation, index) => (
            <div key={index} className="p-4 bg-orange-50 rounded-lg shadow-md border border-orange-200">
              <h3 className="text-2xl font-bold text-center mb-4">Évaluation {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {evaluationFields.map((field) => (
                  <div key={field.name} className="space-y-3">
                    <p className="text-lg font-semibold text-gray-700">{field.label}</p>
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-8 h-8 ${
                            evaluation[field.name] >= value ? 'text-orange-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg shadow-md border border-orange-200">
                  <p className="text-lg font-semibold text-gray-700">Recommanderiez-vous cette formation ?</p>
                  <p className="text-xl font-bold text-orange-500">{evaluation.recommendation}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg shadow-md border border-orange-200">
                  <p className="text-lg font-semibold text-gray-700">Commentaires généraux :</p>
                  <p className="text-gray-600 mt-2">{evaluation.generalComments}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}