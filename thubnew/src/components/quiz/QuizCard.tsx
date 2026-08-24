"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizService } from "@/services/quiz.service";

interface QuizQuestion {
  _id?: string;
  id?: string;
  question: string;
  options: string[];
}

interface QuizData {
  _id?: string;
  id?: string;
  questions?: QuizQuestion[];
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export function QuizCard({ quiz }: { quiz: QuizData }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const quizId = quiz?._id || quiz?.id;

  if (!quizId || questions.length === 0) return null;

  const submit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      setError("Answer every question before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const answers = questions.map((question, index) => {
        const questionId = question._id || question.id || String(index);
        return question.options[selectedAnswers[questionId]];
      });
      setResult(await quizService.submitQuiz(quizId, answers));
    } catch (submissionError) {
      const responseMessage = (submissionError as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(responseMessage || "Could not submit the quiz. Please sign in and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="my-8 border-primary/20 bg-primary/5">
      <CardHeader><CardTitle className="text-xl">Knowledge Check Quiz</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, questionIndex) => {
          const questionId = question._id || question.id || String(questionIndex);
          return (
            <fieldset key={questionId} className="space-y-3 border-b pb-6 last:border-0">
              <legend className="font-medium text-base">{questionIndex + 1}. {question.question}</legend>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className={`flex min-h-11 cursor-pointer items-center rounded-lg border px-4 py-3 text-sm transition-colors ${selectedAnswers[questionId] === optionIndex ? "border-primary bg-primary/10 font-medium" : "bg-background hover:bg-muted"} ${result ? "cursor-default" : ""}`}>
                    <input
                      type="radio"
                      name={`quiz-${quizId}-${questionId}`}
                      checked={selectedAnswers[questionId] === optionIndex}
                      disabled={Boolean(result)}
                      onChange={() => setSelectedAnswers((answers) => ({ ...answers, [questionId]: optionIndex }))}
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-card/50 p-6">
        {result ? (
          <p className="text-sm font-semibold" aria-live="polite">Score: {result.correctAnswers} / {result.totalQuestions} ({result.score}%)</p>
        ) : (
          <p className="text-sm text-muted-foreground">Answer all {questions.length} questions</p>
        )}
        {result ? (
          <Button variant="outline" onClick={() => { setResult(null); setSelectedAnswers({}); }}>Retake Quiz</Button>
        ) : (
          <Button onClick={submit} disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit Answers"}</Button>
        )}
      </CardFooter>
    </Card>
  );
}
