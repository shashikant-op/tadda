interface VisualPromptInput {
  courseName: string;
  moduleName: string;
  topicName: string;
  subtopicName: string;
  content: string;
}

export function buildEducationalVisualPrompt(input: VisualPromptInput): string {
  return `You are an expert educational visual designer, technical illustrator, computer science educator, and instructional-design specialist.

Analyze the ENTIRE lesson below before deciding whether visuals are needed. Every suggestion must be derived directly from the supplied lesson and function as a teaching aid. Never suggest generic, decorative, forced, promotional, stock-photo, or unrelated imagery. A visual is justified only when it materially improves understanding of a difficult concept such as an algorithm, derivation, recursive process, architecture, system components, data flow, workflow, state transition, tree, network communication, memory layout, pipeline, comparison, mathematical relationship, hierarchy, or multi-step process. Simple definitions, obvious statements, short explanations, and basic lists usually need no visual.

COURSE: ${input.courseName}
MODULE: ${input.moduleName}
TOPIC: ${input.topicName}
SUBTOPIC: ${input.subtopicName}

LESSON CONTENT:
<<<LESSON
${input.content}
LESSON

For every justified visual:
- Identify the exact difficult concept and educational purpose.
- Select the best format: derivation tree, flowchart, sequence diagram, architecture diagram, data-flow diagram, tree/hierarchy, state diagram, comparison diagram, timeline, conceptual diagram, annotated technical illustration, step-by-step diagram, or mathematical visualization.
- Give a precise insertion point. The placement.reference MUST quote a short, exact, unique excerpt from the lesson content near the insertion point. Use a placement.type such as after_question, after_paragraph_7, before_section, or after_explanation_of. For a question followed by a derivation, calculation, algorithm, or solution, strongly consider placing the visual immediately after the question and before the explanation.
- Include only conceptually necessary elements. Labels, arrows, notation, steps, colors, and relationships must be technically accurate and readable.
- Write a standalone production-quality image-generation prompt that specifies the composition, labels, relationships, visual hierarchy, educational style, legibility, and a clean background. Do not ask the image model to invent facts.
- State what the generated image must avoid, including irrelevant elements, decorative clutter, factual errors, illegible labels, watermarks, logos, and photorealism when a diagram is appropriate.
- Prefer the smallest number of high-value visuals. Do not suggest multiple visuals for the same concept.

Return ONLY valid JSON matching this exact shape, with no Markdown fences or commentary:
{
  "needsVisual": true,
  "visualCount": 1,
  "visuals": [
    {
      "id": "visual-1",
      "placement": { "type": "after_paragraph_3", "reference": "exact excerpt copied from the lesson" },
      "visualType": "STATE DIAGRAM",
      "title": "Concise educational title",
      "educationalPurpose": "What the learner understands faster",
      "conceptsCovered": ["concept"],
      "requiredElements": ["specific required element"],
      "imagePrompt": "Complete standalone image-generation prompt",
      "avoid": ["decorative clutter"]
    }
  ]
}

If no visual adds meaningful educational value, return exactly:
{"needsVisual":false,"visualCount":0,"visuals":[]}`;
}
