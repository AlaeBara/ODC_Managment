import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

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

export default function EvaluationCart({ evaluations }) {
  const getAverageScore = (evaluation) => {
    const scores = evaluationFields.map(field => Number(evaluation[field.name]) || 0)
    const sum = scores.reduce((a, b) => a + b, 0)
    return (sum / scores.length).toFixed(1)
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Évaluations individuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {evaluations.map((evaluation, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {getAverageScore(evaluation)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Évaluation {index + 1}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(evaluation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={evaluation.recommendation === 'OUI' ? "success" : "destructive"}>
                    {evaluation.recommendation === 'OUI' ? 'Recommandé' : 'Non recommandé'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationFields.map((field) => (
                    <div key={field.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{field.label}</span>
                        <span className="text-sm font-semibold">{evaluation[field.name]}</span>
                      </div>
                      <Progress value={Number(evaluation[field.name]) * 20} className="h-2" />
                    </div>
                  ))}
                </div>
                {evaluation.generalComments && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Commentaires généraux:</h4>
                      <p className="text-sm italic bg-muted p-3 rounded-md">{evaluation.generalComments}</p>
                    </div>
                  </>
                )}
                <div className="mt-4 flex justify-end">
                  {evaluation.recommendation === 'OUI' ? (
                    <ThumbsUp className="text-green-500 w-6 h-6" />
                  ) : (
                    <ThumbsDown className="text-red-500 w-6 h-6" />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}