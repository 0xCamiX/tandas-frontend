'use client'

import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { QuizWithOptions } from '@/lib/types'

type ModuleQuizTabProps = {
  quizzes: QuizWithOptions[]
}

export function ModuleQuizTab({ quizzes }: ModuleQuizTabProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  if (quizzes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">No hay evaluación disponible para este módulo</p>
      </div>
    )
  }

  const handleAnswerChange = (quizId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [quizId]: optionId,
    }))
  }

  const handleSubmit = () => {
    if (quizzes.length === 0) return

    // Calcular puntuación
    let correctAnswers = 0
    quizzes.forEach(quiz => {
      const selectedOption = quiz.options.find(option => option.id === selectedAnswers[quiz.id])
      if (selectedOption?.isCorrect) {
        correctAnswers++
      }
    })

    const calculatedScore = Math.round((correctAnswers / quizzes.length) * 100)
    setScore(calculatedScore)
    setSubmitted(true)

    // Mostrar feedback con toast
    if (calculatedScore >= 70) {
      toast.success('¡Excelente trabajo!', {
        description: `Has aprobado la evaluación con ${calculatedScore}%`,
      })
    } else {
      toast.error('Necesitas repasar', {
        description: `Tu puntuación es ${calculatedScore}%. Intenta nuevamente después de revisar el contenido.`,
      })
    }
  }

  const allAnswered = quizzes.every(quiz => selectedAnswers[quiz.id])

  if (submitted && score !== null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultado de la Evaluación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold">Tu puntuación</h3>
            <div className="mb-4 text-4xl font-bold">{score}%</div>
            <Progress className="mb-4 h-2" value={score} />
            {score >= 70 ? (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>¡Aprobado!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <XCircle className="h-5 w-5" />
                <span>Necesitas repasar</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizzes.map((quiz, index) => {
              return (
                <div className="space-y-3" key={quiz.id}>
                  <div className="flex items-start gap-2">
                    <span className="rounded-full bg-muted px-2 py-1 text-sm text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium">{quiz.question}</h4>
                      <div className="mt-3 space-y-2">
                        {quiz.options.map(option => {
                          const isSelected = selectedAnswers[quiz.id] === option.id
                          const optionClass = isSelected
                            ? option.isCorrect
                              ? 'border-green-300 bg-green-100 text-green-800'
                              : 'border-red-300 bg-red-100 text-red-800'
                            : option.isCorrect
                              ? 'border-green-300 bg-green-100 text-green-800'
                              : 'border-muted-foreground/20 bg-muted'

                          return (
                            <div className={`rounded-md border p-3 ${optionClass}`} key={option.id}>
                              {option.optionText}
                            </div>
                          )
                        })}
                      </div>
                      {quiz.explanation && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Explicación: </span>
                          {quiz.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedAnswers({})
                setSubmitted(false)
                setScore(null)
                toast.info('Puedes intentarlo de nuevo', {
                  description: 'Lee cuidadosamente cada pregunta antes de responder.',
                })
              }}
              variant="outline"
            >
              Intentar de nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quizzes.map((quiz, index) => (
          <div className="space-y-3" key={quiz.id}>
            <div className="flex items-start gap-2">
              <span className="rounded-full bg-muted px-2 py-1 text-sm text-muted-foreground">
                {index + 1}
              </span>
              <h4 className="font-medium">{quiz.question}</h4>
            </div>
            <RadioGroup
              className="ml-8"
              onValueChange={value => handleAnswerChange(quiz.id, value)}
              value={selectedAnswers[quiz.id]}
            >
              <div className="space-y-2">
                {quiz.options.map(option => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem id={option.id} value={option.id} />
                    <Label className="cursor-pointer" htmlFor={option.id}>
                      {option.optionText}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}

        <Button className="w-full" disabled={!allAnswered} onClick={handleSubmit}>
          Enviar respuestas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
