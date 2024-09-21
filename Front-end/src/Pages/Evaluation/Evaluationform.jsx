import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertTriangle, Star } from 'lucide-react'

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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetOneFormations/${id}`)
        if (!response.ok) throw new Error('Failed to fetch course details')
        const data = await response.json()
        setCourseDetails(data)
      } catch (error) {
        console.error('Error fetching course details:', error)
        setError('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCourseDetails()
    } else {
      setLoading(false)
      setError('Invalid evaluation link')
    }
  }, [id, token])

  const handleInputChange = (name, value) => {
    setEvaluation(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/SubmitEvaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...evaluation,
          courseId: id,
          mentorId: courseDetails.mentors[0]._id,
        }),
      })
      if (!response.ok) throw new Error('Failed to submit evaluation')
      toast.success('Evaluation submitted successfully')
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      toast.error('Failed to submit evaluation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 to-purple-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">Évaluation de la formation</CardTitle>
            {courseDetails && (
              <p className="text-center text-white text-lg mt-2">{courseDetails.title}</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-md text-gray-600 mb-6 text-center italic">
                Merci de renseigner votre degré de satisfaction par rapport à chacun des éléments ci-dessous.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {evaluationFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    className="space-y-3 bg-white p-4 rounded-lg shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Label htmlFor={field.name} className="text-lg font-semibold text-gray-700">{field.label}</Label>
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(field.name, parseInt(value))}
                      className="flex justify-between items-center"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={value.toString()}
                            id={`${field.name}-${value}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`${field.name}-${value}`}
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                evaluation[field.name] >= value
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                            <span className="mt-1 text-sm">{value}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="space-y-3 bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="recommendation" className="text-lg font-semibold text-gray-700">Recommanderiez-vous cette formation autour de vous ?</Label>
                <RadioGroup
                  onValueChange={(value) => handleInputChange('recommendation', value)}
                  className="flex space-x-4 justify-center"
                >
                  {['OUI', 'NON'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`recommendation-${option.toLowerCase()}`} />
                      <Label htmlFor={`recommendation-${option.toLowerCase()}`} className="text-lg">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
              <motion.div
                className="space-y-3 bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label htmlFor="generalComments" className="text-lg font-semibold text-gray-700">Commentaires et appréciation générale :</Label>
                <Textarea
                  id="generalComments"
                  onChange={(e) => handleInputChange('generalComments', e.target.value)}
                  className="min-h-[150px] w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vos commentaires sont précieux pour nous aider à améliorer nos formations..."
                />
              </motion.div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  'Soumettre l\'évaluation'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}