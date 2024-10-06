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
import { Loader2, AlertTriangle, Star, Sun, Coffee, Book, Users, Clock, CheckCircle } from 'lucide-react'

const evaluationFields = [
  { label: "Qualité du contenu de la formation", name: "contentQuality", icon: Book },
  { label: "Qualité des compétences acquises", name: "acquiredSkillsQuality", icon: Star },
  { label: "Alignement des compétences acquises avec vos besoins professionnels", name: "alignmentWithNeeds", icon: Users },
  { label: "Structure de la formation (rythme, progression pédagogique, etc.)", name: "trainingStructure", icon: Clock },
  { label: "Niveau de difficulté de la formation", name: "difficultyLevel", icon: Book },
  { label: "Qualité pédagogique du formateur (élocution, dynamisme, etc.)", name: "trainerPedagogyQuality", icon: Users },
  { label: "Expertise du formateur (niveau de connaissance dans son domaine)", name: "trainerExpertise", icon: Star },
  { label: "Qualité des supports de formation", name: "materialQuality", icon: Book },
  { label: "Qualité des exercices et des activités", name: "exercisesQuality", icon: Book },
  { label: "Adaptation au profil et au niveau des participants", name: "adaptationToParticipants", icon: Users },
  { label: "Confort de la salle", name: "roomComfort", icon: Sun },
  { label: "Accessibilité du lieu de formation", name: "accessibility", icon: Users },
  { label: "Horaires et pauses", name: "timingAndBreaks", icon: Coffee },
  { label: "État et disponibilité du matériel pédagogique", name: "equipmentCondition", icon: Book },
  { label: "Communication des informations d'ordre organisationnel", name: "organizationalCommunication", icon: Users },
  { label: "Gestion administrative", name: "administrativeManagement", icon: Users },
  { label: "Composition du groupe (taille et niveau)", name: "groupComposition", icon: Users },
  { label: "Durée de la formation", name: "trainingDuration", icon: Clock },
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
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      toast.error('Failed to submit evaluation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-600">{error}</p>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8" />
                Merci !
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <p className="text-lg text-gray-700 text-center">
                Nous apprécions grandement votre retour. Vos commentaires nous aideront à améliorer nos formations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardTitle className="text-3xl font-bold text-center">Évaluation de la formation</CardTitle>
            {courseDetails && (
              <p className="text-center text-white text-lg mt-2">{courseDetails.title}</p>
            )}
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-md text-gray-600 mb-6 text-center">
                Merci de renseigner votre degré de satisfaction par rapport à chacun des éléments ci-dessous.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {evaluationFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    className="space-y-3 bg-orange-50 p-4 rounded-lg shadow-md border border-orange-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(field.icon, { className: "w-5 h-5 text-orange-500" })}
                      <Label htmlFor={field.name} className="text-lg font-semibold text-gray-700">{field.label}</Label>
                    </div>
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(field.name, parseInt(value))}
                      className="flex justify-between items-center"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={value.toString()}
                            id={`${field.name}-${value}`}
                            className="sr-only peer"
                          />
                          <Label
                            htmlFor={`${field.name}-${value}`}
                            className="cursor-pointer flex flex-col items-center peer-focus:text-orange-500"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                evaluation[field.name] >= value
                                  ? 'text-orange-400 fill-current'
                                  : 'text-gray-300'
                              } transition-colors duration-200 ease-in-out`}
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
                className="space-y-3 bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200"
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
                      <RadioGroupItem value={option} id={`recommendation-${option.toLowerCase()}`} className="text-orange-500" />
                      <Label htmlFor={`recommendation-${option.toLowerCase()}`} className="text-lg">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
              <motion.div
                className="space-y-3 bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label htmlFor="generalComments" className="text-lg font-semibold text-gray-700">Commentaires et appréciation générale :</Label>
                <Textarea
                  id="generalComments"
                  onChange={(e) => handleInputChange('generalComments', e.target.value)}
                  className="min-h-[150px] w-full p-3 border border-orange-300 rounded-md ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  placeholder="Vos commentaires sont précieux pour nous aider à améliorer nos formations..."
                />
              </motion.div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
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