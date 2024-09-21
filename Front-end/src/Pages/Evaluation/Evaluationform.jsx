import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
]

export default function EvaluationForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [courseDetails, setCourseDetails] = useState(null)
  const [evaluation, setEvaluation] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetOneFormations/${id}`)
        if (!response.ok) throw new Error('Failed to fetch course details')
        const data = await response.json()
        setCourseDetails(data)
      } catch (error) {
        console.error('Error fetching course details:', error)
        toast.error('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCourseDetails()
    } else {
      setLoading(false)
      toast.error('Invalid evaluation link')
    }
  }, [id, token])

  const handleInputChange = (name, value) => {
    setEvaluation(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/SubmitEvaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...evaluation,
          courseId: id,
          mentorId: courseDetails.mentors[0]._id, // Assuming the first mentor is the one to be evaluated
        }),
      })
      if (!response.ok) throw new Error('Failed to submit evaluation')
      toast.success('Evaluation submitted successfully')
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      toast.error('Failed to submit evaluation')
    }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (!token) {
    return <div className="text-center mt-8">Invalid evaluation link</div>
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Évaluation de la formation</CardTitle>
          {courseDetails && (
            <p className="text-center text-gray-600">{courseDetails.title}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Merci de renseigner votre degré de satisfaction par rapport à chacun des éléments ci-dessous.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {evaluationFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <RadioGroup
                    onValueChange={(value) => handleInputChange(field.name, parseInt(value))}
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-1">
                        <RadioGroupItem value={value.toString()} id={`${field.name}-${value}`} />
                        <Label htmlFor={`${field.name}-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendation">Recommanderiez-vous cette formation autour de vous ?</Label>
              <RadioGroup
                onValueChange={(value) => handleInputChange('recommendation', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OUI" id="recommendation-yes" />
                  <Label htmlFor="recommendation-yes">OUI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NON" id="recommendation-no" />
                  <Label htmlFor="recommendation-no">NON</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="generalComments">Commentaires et appréciation générale :</Label>
              <Textarea
                id="generalComments"
                onChange={(e) => handleInputChange('generalComments', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">Soumettre l'évaluation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}