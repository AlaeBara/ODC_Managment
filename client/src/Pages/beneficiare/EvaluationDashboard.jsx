import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Star, Users, ThumbsUp } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import EvaluationCart from './evaluation-cart'

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
]

export default function EvaluationDashboard() {
  const { id } = useParams()
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/evaluationdash/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
  
        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Unauthorized: Please log in' : 'No available Evaluations for this formation')
        }
        const data = await response.json()
        setEvaluations(data)
      } catch (error) {
        console.error('Error fetching evaluations:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchEvaluations()
  }, [id])

  const calculateAverages = () => {
    let totalSum = 0
    let totalValidEvaluations = 0

    const fieldAverages = evaluationFields.reduce((averages, field) => {
      const validEvaluations = evaluations.filter(evaluationItem => 
        !isNaN(Number(evaluationItem[field.name])) && evaluationItem[field.name] !== ''
      )

      const sum = validEvaluations.reduce((acc, evaluationItem) => {
        const value = Number(evaluationItem[field.name])
        return acc + value
      }, 0)

      totalSum += sum
      totalValidEvaluations += validEvaluations.length

      averages[field.name] = validEvaluations.length > 0 ? sum / validEvaluations.length : null
      return averages
    }, {})

    const overallAverage = totalValidEvaluations > 0 ? totalSum / totalValidEvaluations : 0

    return { fieldAverages, overallAverage }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <AlertTriangle className="w-20 h-20 text-destructive mb-4" />
        <p className="text-2xl font-semibold">{error}</p>
      </div>
    )
  }

  if (!evaluations.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <AlertTriangle className="w-20 h-20 text-warning mb-4" />
        <p className="text-2xl font-semibold">Aucune évaluation trouvée</p>
      </div>
    )
  }

  const { fieldAverages, overallAverage } = calculateAverages()
  const recommendationPercentage = (evaluations.filter(item => item.recommendation === 'OUI').length * 100 / evaluations.length)
  
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Evaluation for {evaluations[0]?.courseId?.title || 'Évaluation du cours'}
        </h1>
        
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground bg-orange-500">
            <CardTitle className="text-2xl">Résumé de l'évaluation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-5xl font-bold text-primary flex items-center mb-2">
                  <Star className="w-10 h-10 mr-2 text-yellow-400 fill-current" />
                  {overallAverage.toFixed(2)}
                </div>
                <span className="text-sm text-muted-foreground">Note moyenne</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold text-primary flex items-center mb-2">
                  <Users className="w-8 h-8 mr-2 text-primary" />
                  {evaluations.length}
                </div>
                <span className="text-sm text-muted-foreground">Évaluations totales</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold text-primary flex items-center mb-2">
                  <ThumbsUp className="w-8 h-8 mr-2 text-green-500" />
                  {recommendationPercentage.toFixed(0)}%
                </div>
                <span className="text-sm text-muted-foreground">Recommandation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluationFields.map((field) => (
            <Card key={field.name} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="bg-muted">
                <CardTitle className="text-sm">{field.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {fieldAverages[field.name] !== null ? (
                  <>
                    <div className="text-3xl font-bold text-primary flex items-center">
                      <Star className="w-6 h-6 mr-2 text-yellow-400 fill-current" />
                      {fieldAverages[field.name].toFixed(2)}
                    </div>
                    <Progress value={fieldAverages[field.name] * 20} className="mt-2" />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Pas de données</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Commentaires Récents</CardTitle>
          </CardHeader>
          <CardContent>
          <ul className="space-y-4">
              {evaluations
                .filter(evaluation => evaluation.generalComments)
                .slice(-3)
                .map((evaluationItem, index) => (
                  <li key={index} className="bg-muted p-4 rounded-lg">
                    <p className="text-sm italic text-muted-foreground mb-2">
                      "{evaluationItem.generalComments}"
                    </p>
                <div className="flex items-center justify-end">
                </div>
              </li>
            ))}
            </ul>
          </CardContent>
        </Card>
        <EvaluationCart evaluations={evaluations} />
      </div>
    </div>
  )
}