import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Star } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

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
    return evaluationFields.reduce((averages, field) => {
      const sum = evaluations.reduce((acc, evaluationItem) => {
        const value = Number(evaluationItem[field.name])
        return acc + (isNaN(value) ? 0 : value)
      }, 0)
  
      averages[field.name] = evaluations.length > 0 ? sum / evaluations.length : 0
      return averages
    }, {})
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

  const averages = calculateAverages()
  const overallAverage = Object.values(averages).reduce((sum, value) => sum + value, 0) / evaluationFields.length
  const recommendationPercentage = (evaluations.filter(evaluationItem => evaluationItem.recommendation === 'Oui').length / evaluations.length) * 100

  const starRatings = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: evaluations.filter(e => Math.round(e.overallRating || 0) === stars).length,
    percentage: (evaluations.filter(e => Math.round(e.overallRating || 0) === stars).length / evaluations.length) * 100
  }))

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Evaluation for {evaluations[0]?.courseId?.title || 'Évaluation du cours'}
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Résumé de l'évaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-5xl font-bold text-primary flex items-center">
                <Star className="w-10 h-10 mr-2 text-yellow-400 fill-current" />
                {overallAverage.toFixed(2)}
              </div>
            </div>
            <div className="mt-4">
              {starRatings.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center mb-2">
                  <div className="w-20 flex items-center">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Progress value={percentage} className="flex-grow mx-2" />
                  <span className="w-16 text-right text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
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
                <div className="text-3xl font-bold text-primary flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-400 fill-current" />
                  {averages[field.name].toFixed(2)}
                </div>
                <Progress value={averages[field.name] * 20} className="mt-2" />
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
              {evaluations.slice(-3).map((evaluationItem, index) => (
                <li key={index} className="bg-muted p-4 rounded-lg">
                  <p className="text-sm italic text-muted-foreground mb-2">
                    "{evaluationItem.generalComments || 'Pas de commentaire'}"
                  </p>
                  <div className="flex items-center justify-end">
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}