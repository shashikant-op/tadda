"client"
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizCardProps {
  quiz: unknown;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const quizRec = quiz as Record<string, unknown> | null;
  const questionsList = Array.isArray(quiz)
    ? quiz
    : quizRec?.questions && Array.isArray(quizRec.questions)
    ? (quizRec.questions as Record<string, unknown>[])
    : [];

  if (questionsList.length === 0) return null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const calculateScore = () => {
    let score = 0;
    questionsList.forEach((q) => {
      const qId = (q.id || q._id) as string;
      const options = q.options as string[] | undefined;
      if (selectedAnswers[qId] === q.correctAnswer || selectedAnswers[qId] === options?.indexOf(q.correctAnswer as string)) {
        score++;
      }
    });
    return score;
  };

  return (
    <Card className="my-8 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-xl">Knowledge Check Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questionsList.map((q, qIndex: number) => {
          const qId = (q.id || q._id || qIndex.toString()) as string;
          const options = (q.options as string[]) || [];
          const correctIdx = typeof q.correctAnswer === "number" ? q.correctAnswer : options?.indexOf(q.correctAnswer as string) ?? 0;
          const isCorrect = selectedAnswers[qId] === correctIdx;

          return (
            <div key={qId} className="space-y-3 pb-6 border-b last:border-0">
              <p className="font-medium text-base">
                {qIndex + 1}. {q.question as string}
              </p>
              <div className="space-y-2">
                {options.map((option: string, oIndex: number) => {
                  const isChosen = selectedAnswers[qId] === oIndex;

                  return (
                    <button
                      key={oIndex}
                      disabled={submitted}
                      onClick={() => handleSelect(qId, oIndex)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between ${
                        isChosen ? "border-primary bg-primary/10 font-medium" : "bg-background hover:bg-muted"
                      } ${submitted && oIndex === correctIdx ? "border-green-500 bg-green-500/10 text-green-700 font-semibold" : ""} ${
                        submitted && isChosen && !isCorrect ? "border-red-500 bg-red-500/10 text-red-700" : ""
                      }`}
                    >
                      <span>{option}</span>
                      {submitted && oIndex === correctIdx && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {submitted && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-2 text-xs text-muted-foreground bg-background p-3 rounded border">
                  <span className="font-semibold text-foreground">Explanation: </span>
                  {(q.explanation as string) || "Correct answer explanation."}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-card/50 p-6 rounded-b-xl border-t">
        {submitted ? (
          <div className="text-sm font-semibold">
            Score: {calculateScore()} / {questionsList.length}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Select answers for all questions</div>
        )}
        {!submitted ? (
          <Button onClick={() => setSubmitted(true)} disabled={Object.keys(selectedAnswers).length === 0}>
            Submit Answers
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setSelectedAnswers({});
            }}
          >
            Retake Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
