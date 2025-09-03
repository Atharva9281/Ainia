export interface StoryResponse {
  steps: string[]
  choices: string[][]
  checkpoint: {
    question: string
    expected: string
    type: 'compare' | 'count'
  }
  hint: string
  parent_digest: {
    skills: string[]
    note: string
    home_activity: string
  }
}

export interface SessionState {
  id: string
  userId: string
  theme: 'Space' | 'Forest'
  topic: string
  currentStep: number
  story: StoryResponse | null
  checkpointAnswered: boolean
  choiceLog: string[]
  startTime: number
  cached: boolean
}

export interface StorySession {
  id: string
  question: string
  story: StoryResponse
  completedAt?: number
  cached: boolean
  checkpointPassed: boolean
}

export interface ConversationSession {
  id: string
  userId: string
  theme: 'Space' | 'Forest'
  stories: StorySession[]
  currentStoryIndex: number
  currentStep: number
  startTime: number
  lastActivity: number
}

export interface CachedStory {
  id: string
  user_id: string
  theme: string
  topic: string
  response_json: StoryResponse
  created_at: string
}

export interface UserSession {
  id: string
  user_id: string
  questions_asked: number
  last_activity: string
  created_at: string
}

export interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}