import { z } from 'zod'

// Zod schema for validating Gemini API responses
export const StoryResponseSchema = z.object({
  steps: z.array(z.string()).length(3, "Must have exactly 3 story steps"),
  choices: z.array(z.array(z.string()).length(2)).length(3, "Must have 2 choices for each of 3 steps"),
  checkpoint: z.object({
    question: z.string().min(5, "Checkpoint question too short"),
    expected: z.string().min(1, "Expected answer required"),
    type: z.enum(['compare', 'count'])
  }),
  hint: z.string().min(5, "Hint too short"),
  parent_digest: z.object({
    skills: z.array(z.string()).min(1, "At least one skill required"),
    note: z.string().min(10, "Parent note too short"),
    home_activity: z.string().min(5, "Home activity required")
  })
})

// Theme validation
export const ThemeSchema = z.enum(['Space', 'Forest'])

// Topic validation (basic safety check)
export const TopicSchema = z.string()
  .min(3, "Topic too short")
  .max(100, "Topic too long")
  .refine((topic) => !containsBannedWords(topic), "Topic contains inappropriate content")

// Session state validation
export const SessionStateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  theme: ThemeSchema,
  topic: z.string(),
  currentStep: z.number().min(0).max(2),
  story: StoryResponseSchema.nullable(),
  checkpointAnswered: z.boolean(),
  choiceLog: z.array(z.string()),
  startTime: z.number(),
  cached: z.boolean()
})

// Safety function to check for banned words
function containsBannedWords(text: string): boolean {
  const bannedWords = [
    'violence', 'scary', 'death', 'hurt', 'blood', 'kill', 
    'weapon', 'gun', 'knife', 'fight', 'war', 'hate'
  ]
  
  const lowerText = text.toLowerCase()
  return bannedWords.some(word => lowerText.includes(word))
}

// Validation helper functions
export function validateStoryResponse(data: unknown) {
  return StoryResponseSchema.safeParse(data)
}

export function validateTopic(topic: string) {
  return TopicSchema.safeParse(topic)
}

export function validateTheme(theme: string) {
  return ThemeSchema.safeParse(theme)
}