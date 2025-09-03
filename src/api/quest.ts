import { validateStoryResponse, validateTopic, validateTheme } from '../lib/schema'
import { supabase } from '../lib/supabase'
import type { StoryResponse } from '../lib/types'
import { bannedTopicsData } from '../data/banned-topics'
import { ageWordsData } from '../data/age-words'
import { themesData } from '../data/themes'

// Updated to Gemini 2.0 Flash for better audio support and performance
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

// Rate limiting constants
const MAX_STORIES_PER_DAY = 20
const CACHE_EXPIRY_DAYS = 30

// Enhanced safety check function
async function performSafetyCheck(topic: string): Promise<{ safe: boolean; reason?: string }> {
  const lowerTopic = topic.toLowerCase().trim()
  
  // Check all banned topic categories
  const allBannedWords = [
    ...bannedTopicsData.explicit_banned,
    ...bannedTopicsData.scary_content,
    ...bannedTopicsData.inappropriate_for_age,
    ...bannedTopicsData.personal_info,
    ...bannedTopicsData.warning_phrases,
    ...ageWordsData.banned_complexity
  ]
  
  for (const bannedWord of allBannedWords) {
    if (lowerTopic.includes(bannedWord.toLowerCase())) {
      return { 
        safe: false, 
        reason: `Topic contains inappropriate content for children: "${bannedWord}"` 
      }
    }
  }
  
  // Additional pattern checks
  if (lowerTopic.length < 2) {
    return { safe: false, reason: 'Topic is too short' }
  }
  
  if (lowerTopic.length > 200) {
    return { safe: false, reason: 'Topic is too long' }
  }
  
  // Check for repeated characters (spam-like input)
  if (/(.)\1{5,}/.test(lowerTopic)) {
    return { safe: false, reason: 'Invalid input pattern' }
  }
  
  return { safe: true }
}

// Get theme-specific context for better story generation
function getThemeContext(theme: string, age: number): string {
  const themeData = themesData[theme as keyof typeof themesData]
  
  if (!themeData) {
    return `Create a gentle, age-appropriate story for a ${age}-year-old child.`
  }
  
  const ageAppropriateWords = age <= 7 ? ageWordsData.ages_5_7 : ageWordsData.ages_8_10
  const safeWords = themeData.safeWords.slice(0, 8).join(', ')
  const characters = themeData.characters.join(', ')
  
  return `${themeData.description}

THEME CONTEXT: ${theme} Adventure
- Safe vocabulary: ${safeWords}
- Age-appropriate words: ${ageAppropriateWords.slice(0, 12).join(', ')}
- Friendly characters: ${characters}
- Tone: Wonder, discovery, friendship, and problem-solving
- Avoid: Anything scary, dangerous, or too complex for age ${age}

For ${age}-year-olds, use simple sentences and focus on positive emotions and learning.`
}

// Enhanced age-appropriate vocabulary validation
function validateVocabulary(storyText: string, age: number): { isValid: boolean; reason?: string } {
  const bannedWords = ageWordsData.banned_complexity
  const lowerText = storyText.toLowerCase()
  
  // Check individual banned words
  for (const bannedWord of bannedWords) {
    if (lowerText.includes(bannedWord.toLowerCase())) {
      return {
        isValid: false,
        reason: `Content contains advanced vocabulary "${bannedWord}" inappropriate for age ${age}. Please use simpler language.`
      }
    }
  }
  
  // Check for common problematic phrases that might slip through
  const bannedPhrases = [
    "nuclear fusion", "nuclear fission", "atomic energy", "molecular structure",
    "electromagnetic radiation", "photosynthesis process", "cellular division",
    "gravitational force", "kinetic energy", "potential energy", "thermal energy"
  ]
  
  for (const phrase of bannedPhrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return {
        isValid: false,
        reason: `Content contains complex scientific phrase "${phrase}" inappropriate for age ${age}. Use simple everyday words instead.`
      }
    }
  }
  
  // Additional check for words that require scientific background
  const scienceWords = ["chemistry", "physics", "biology", "molecules", "atoms", "particles", "energy", "force", "process"]
  for (const word of scienceWords) {
    if (lowerText.includes(word)) {
      return {
        isValid: false,
        reason: `Content contains scientific term "${word}" too advanced for age ${age}. Explain using familiar objects and activities instead.`
      }
    }
  }
  
  return { isValid: true }
}

// Enhanced educational content validation
function validateEducationalContent(story: { steps: string[], checkpoint: { question: string } }, topic: string): { isValid: boolean; reason?: string } {
  const topicLower = topic.toLowerCase()
  
  // Check if steps contain educational indicators
  const educationalKeywords = [
    'because', 'this happens when', 'the reason is', 'this works by',
    'caused by', 'due to', 'as a result', 'that\'s why', 'explained by',
    'like when you', 'similar to', 'just like', 'imagine if', 'think of',
    'for example', 'such as', 'including', 'specifically'
  ]
  
  // Check if story steps contain actual explanations
  let hasExplanations = false
  let hasAnalogies = false
  let hasRealWorldConnection = false
  
  const allStepsText = story.steps.join(' ').toLowerCase()
  
  // Look for explanatory language
  hasExplanations = educationalKeywords.some(keyword => 
    allStepsText.includes(keyword.toLowerCase())
  )
  
  // Look for analogies or comparisons
  const analogyWords = ['like', 'similar to', 'just like', 'imagine', 'think of']
  hasAnalogies = analogyWords.some(word => allStepsText.includes(word))
  
  // Look for real-world connections
  const connectionWords = ['when you', 'in your', 'at home', 'every day', 'you can see']
  hasRealWorldConnection = connectionWords.some(word => allStepsText.includes(word))
  
  // Check if the topic is actually mentioned in the content
  const topicMentioned = allStepsText.includes(topicLower) || 
                         story.steps.some((step: string) => 
                           step.toLowerCase().includes(topicLower.split(' ')[0])
                         )
  
  // Validate checkpoint tests understanding, not story details
  const checkpointQuestion = story.checkpoint?.question?.toLowerCase() || ''
  const checkpointTestsTopic = checkpointQuestion.includes(topicLower) ||
                               topicLower.split(' ').some((word: string) => 
                                 word.length > 3 && checkpointQuestion.includes(word)
                               )
  
  // Check for vague or non-educational content
  const vagueWords = ['magical', 'mysterious', 'amazing adventure', 'wonderful journey']
  const hasVagueContent = vagueWords.some(word => allStepsText.includes(word))
  
  // More flexible validation - story should address topic but doesn't need to be perfect
  if (!topicMentioned) {
    console.warn('Topic not directly mentioned, but continuing:', { topic: topicLower, stepsText: allStepsText.substring(0, 100) })
  }
  
  // Count how many educational criteria are met
  let educationalScore = 0
  if (hasExplanations) educationalScore += 1
  if (hasAnalogies) educationalScore += 1 
  if (hasRealWorldConnection) educationalScore += 1
  if (topicMentioned) educationalScore += 2 // Topic mention is worth more
  
  // Require at least 2 out of 5 educational criteria to pass
  if (educationalScore < 2) {
    return { isValid: false, reason: 'Story needs more educational content. Try asking about the topic in a more specific way.' }
  }
  
  if (!checkpointTestsTopic) {
    return { isValid: false, reason: 'Checkpoint question does not test understanding of the topic' }
  }
  
  if (hasVagueContent) {
    return { isValid: false, reason: 'Story uses vague language instead of clear explanations' }
  }
  
  // Check story progression builds understanding
  const step1HasBasic = story.steps[0]?.toLowerCase().includes('what') || 
                        story.steps[0]?.toLowerCase().includes('is') ||
                        story.steps[0]?.toLowerCase().includes('are')
  
  const step2HasHow = story.steps[1]?.toLowerCase().includes('how') || 
                      story.steps[1]?.toLowerCase().includes('because') ||
                      story.steps[1]?.toLowerCase().includes('when')
  
  if (!step1HasBasic || !step2HasHow) {
    return { isValid: false, reason: 'Story does not follow educational progression (what → how → application)' }
  }
  
  return { isValid: true }
}

export async function generateStory(
  userId: string, 
  theme: string, 
  topic: string, 
  age: number = 7
): Promise<StoryResponse & { cached: boolean }> {
  
  // Validate inputs
  const themeValidation = validateTheme(theme)
  const topicValidation = validateTopic(topic)
  
  if (!themeValidation.success) {
    throw new Error(`Invalid theme: ${themeValidation.error.message}`)
  }
  
  if (!topicValidation.success) {
    throw new Error(`Invalid topic: ${topicValidation.error.message}`)
  }

  // Enhanced safety filtering
  const safetyCheck = await performSafetyCheck(topic)
  if (!safetyCheck.safe) {
    throw new Error(safetyCheck.reason || 'Topic not appropriate for children')
  }

  // Validate age range
  if (age < 4 || age > 12) {
    throw new Error('Age must be between 4 and 12 years old')
  }

  // Check cache first
  const cached = await checkCache(userId, theme, topic)
  if (cached) {
    return { ...cached, cached: true }
  }

  // Check rate limit
  await checkRateLimit(userId)

  // Generate new story
  const story = await callGeminiAPI(theme, topic, age)
  
  // Cache the result
  await cacheStory(userId, theme, topic, story)
  
  // Update usage tracking
  await updateUsage(userId)
  
  return { ...story, cached: false }
}

async function checkCache(userId: string, theme: string, topic: string) {
  try {
    const { data, error } = await supabase
      .from('cached_stories')
      .select('response_json')
      .eq('user_id', userId)
      .eq('theme', theme)
      .eq('topic', topic.toLowerCase().trim())
      .maybeSingle() // Use maybeSingle() instead of single() to avoid errors when no results

    if (error) {
      console.warn('Cache check error (non-blocking):', error.message)
      return null
    }

    if (!data) {
      console.log('No cached story found for:', { userId, theme, topic })
      return null
    }

    console.log('Found cached story for:', { theme, topic })
    return data.response_json as StoryResponse
  } catch (error) {
    console.warn('Cache check failed (non-blocking):', error)
    return null // Don't let cache failures break story generation
  }
}

async function checkRateLimit(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('user_sessions')
      .select('questions_asked')
      .eq('user_id', userId)
      .gte('created_at', today)
      .maybeSingle() // Use maybeSingle() instead of single()

    if (error) {
      console.warn('Rate limit check error (non-blocking):', error.message)
      return // Continue on error - don't block story generation
    }

    const questionsToday = data?.questions_asked || 0
    console.log('Daily usage check:', { questionsToday, limit: MAX_STORIES_PER_DAY })
    
    if (questionsToday >= MAX_STORIES_PER_DAY) {
      throw new Error(`Daily limit of ${MAX_STORIES_PER_DAY} stories reached. Try again tomorrow!`)
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Daily limit')) {
      throw error // Re-throw rate limit errors
    }
    console.warn('Rate limit check failed (non-blocking):', error)
    // Continue on other errors - don't block story generation
  }
}

async function callGeminiAPI(theme: string, topic: string, age: number, isRetry?: boolean): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  
  if (!apiKey) {
    throw new Error('Google API key not configured')
  }

  // Fun, childish system prompt for ${age}-year-olds
  const systemPrompt = `You are Ainia, a super fun friend who tells amazing stories to kids! Your job is to make learning feel like the BEST playtime ever!

STORY RULES FOR ${age}-YEAR-OLDS:
- Make it FUN like their favorite cartoon or bedtime story
- Use words they say every day when playing with friends
- Add excitement with "Wow!", "Cool!", "Amazing!", "Guess what?"
- Make everything sound like an adventure or discovery game
- Talk like you're their best friend explaining something awesome

LANGUAGE - TALK LIKE A KID'S BEST FRIEND:
- Use words from playground/home: "big", "tiny", "super", "really", "like", "when", "because"
- Be excited: "Wow! Did you know...", "This is so cool!", "Guess what happens?"
- Compare to kid stuff: toys, games, food, pets, playground, home things
- NO SCARY SCIENCE WORDS: Never say "nuclear", "fusion", "atoms", "molecules", "energy", "force"

HOW TO EXPLAIN STARS (EXAMPLE):
❌ WRONG: "Stars burn gas through nuclear fusion"
✅ RIGHT: "Stars are like the biggest, brightest night lights in the whole sky! They're super hot like a giant campfire that never goes out!"

MAKE IT PLAYFUL:
- Add fun sounds: "Zoom!", "Whoosh!", "Sparkle!"
- Use emotions: "exciting", "wonderful", "amazing", "cool"
- Make kids the hero: "You can see...", "When you look up...", "You might notice..."
- Keep it simple and giggly - like telling secrets to a best friend`

  const themeContext = getThemeContext(theme, age)
  const userPrompt = `Create a fun, logical story about "${topic}" for a ${age}-year-old! Each step should build on the last one like a fun adventure!

TOPIC: ${topic}
AGE: ${age} years old
THEME: ${themeContext}

LOGICAL FUN STORY STEPS:
Step 1: WHAT IS IT? - "Wow! ${topic} is like [fun comparison]! Here's what makes it special..."
Step 2: WHY IS IT COOL? - "The amazing part is [build on step 1]! This happens because [simple reason from step 1]..."
Step 3: WHERE CAN YOU FIND IT? - "Now that you know [recap steps 1&2], you can spot ${topic} when [real place kids go]!"

CRITICAL: MAKE EACH STEP CONNECT LOGICALLY:
- Step 2 MUST reference what you said in Step 1 with "Remember how we said...?"
- Step 3 MUST connect to both Step 1 and Step 2 with "Now you know..."
- Never introduce new concepts in Step 2 or 3 - only build on Step 1
- Each step should feel like continuing the same conversation about the same thing

FUN BUT LOGICAL LANGUAGE:
- Excited: "Wow!", "Cool!", "Amazing!", "Guess what?"
- Kid comparisons: toys, candy, pets, playground, home stuff
- Simple connections: "because", "that's why", "so when you..."
- Build understanding: "Remember how we said...? Well, that's why..."

STARS EXAMPLE - FUN + LOGICAL:
Step 1: "Stars are like giant sparkly diamonds stuck in the sky! They're really, really far away but super bright!"
Step 2: "The cool thing is they're hot like the biggest campfire ever! That's why they can shine so bright even from far away!"
Step 3: "Now you know stars are far away hot sparkly things! When it gets dark, look up and you'll see them twinkling just for you!"

CRITICAL: Return ONLY valid JSON - each step must connect to the previous one:
{
  "steps": [
    "Step 1: Wow! ${topic} is like [kid-friendly thing]! [One simple fact about what it is]",
    "Step 2: The cool thing about ${topic} is [explain WHY from step 1]! Remember how we said [reference step 1]? That's because [simple reason]!",  
    "Step 3: Now you know ${topic} is [recap step 1] and [recap step 2]! When you [kid activity], you can [what to look for] because you learned [connection to steps 1&2]!"
  ],
  "choices": [
    ["Keep exploring!", "Tell me more!"],
    ["Show me more cool stuff!", "Let's play with this idea!"],
    ["I want to try this!", "Share with my friends!"]
  ],
  "checkpoint": {
    "question": "Fun quiz question about ${topic} using simple words",
    "expected": "Easy answer a ${age}-year-old would give",
    "type": "${age <= 6 ? 'count' : 'compare'}"
  },
  "hint": "Friendly reminder of the coolest part we learned",
  "parent_digest": {
    "skills": ["Curiosity about ${topic}", "Making fun connections", "Observing the world"],
    "note": "Your child had an awesome adventure learning about ${topic} through playful stories!",
    "home_activity": "Go on a ${topic} hunt together! Point out examples and have fun discovering more."
  }
}`

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.6, // Slightly lower for more consistent JSON output
      maxOutputTokens: 1500, // Increased for better story quality
      topK: 40,
      topP: 0.8,
      candidateCount: 1
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH", 
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      }
    ]
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error?.message || `HTTP ${response.status}`
      throw new Error(`Gemini API error: ${errorMessage}`)
    }

    const data = await response.json()
    
    // Check for safety blocks
    if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Content blocked by safety filters. Please try a different topic.')
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No response from Gemini API')
    }

    // Enhanced JSON parsing with cleanup
    let storyData: unknown
    try {
      // Remove any markdown formatting or extra text
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      storyData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError, 'Raw text:', text)
      throw new Error('Invalid response format from AI. Please try again.')
    }
    
    // Validate against schema with simple retry
    const validation = validateStoryResponse(storyData)
    if (!validation.success) {
      console.error('Story validation failed:', validation.error)
      
      // Retry once if not already a retry
      if (!isRetry) {
        console.log('Retrying story generation with corrected format...')
        try {
          const retryResult = await callGeminiAPI(theme, topic, age, true)
          return retryResult
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      throw new Error('Generated story does not meet safety standards')
    }

    // Vocabulary age-appropriateness validation
    const allStoryText = validation.data.steps.join(' ') + ' ' + validation.data.checkpoint.question
    console.log('Checking vocabulary for text:', allStoryText.substring(0, 200) + '...')
    
    const vocabularyValidation = validateVocabulary(allStoryText, age)
    if (!vocabularyValidation.isValid) {
      console.error('VOCABULARY VALIDATION FAILED:', vocabularyValidation.reason)
      
      // Retry once if not already a retry
      if (!isRetry) {
        console.log('Retrying story generation due to inappropriate vocabulary...')
        try {
          const retryResult = await callGeminiAPI(theme, topic, age, true)
          return retryResult
        } catch (retryError) {
          console.error('Vocabulary retry failed:', retryError)
        }
      }
      
      throw new Error(vocabularyValidation.reason || 'Story contains vocabulary too advanced for this age group.')
    }

    // Educational content validation  
    const educationalValidation = validateEducationalContent(validation.data as { steps: string[], checkpoint: { question: string } }, topic)
    if (!educationalValidation.isValid) {
      console.error('Educational validation failed:', educationalValidation.reason)
      throw new Error('Story does not contain sufficient educational content. Please try asking about the topic in a different way.')
    }

    return validation.data as StoryResponse

  } catch (error) {
    console.error('Gemini API call failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to generate story. Please try again.')
  }
}

async function cacheStory(userId: string, theme: string, topic: string, story: StoryResponse) {
  try {
    const { error } = await supabase
      .from('cached_stories')
      .insert({
        user_id: userId,
        theme,
        topic: topic.toLowerCase().trim(),
        response_json: story
      })

    if (error) {
      console.warn('Failed to cache story (non-blocking):', error.message)
      return
    }

    console.log('Story cached successfully:', { theme, topic })
  } catch (error) {
    console.warn('Cache storage failed (non-blocking):', error)
    // Don't throw - caching failure shouldn't break the experience
  }
}

async function updateUsage(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()
    
    // First try to increment existing record
    const { data: existing, error: selectError } = await supabase
      .from('user_sessions')
      .select('questions_asked')
      .eq('user_id', userId)
      .gte('created_at', today)
      .maybeSingle()
    
    if (selectError) {
      console.warn('Usage select error (non-blocking):', selectError.message)
      return
    }
    
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('user_sessions')
        .update({
          questions_asked: existing.questions_asked + 1,
          last_activity: now
        })
        .eq('user_id', userId)
        .gte('created_at', today)
      
      if (error) {
        console.warn('Failed to update usage (non-blocking):', error.message)
      } else {
        console.log('Usage updated:', existing.questions_asked + 1)
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          questions_asked: 1,
          last_activity: now,
          created_at: today
        })
      
      if (error) {
        console.warn('Failed to create usage record (non-blocking):', error.message)
      } else {
        console.log('Usage record created for today')
      }
    }
  } catch (error) {
    console.warn('Usage tracking failed (non-blocking):', error)
    // Don't throw - usage tracking failure shouldn't break the experience
  }
}

// Helper function to get user's daily story count
export async function getDailyStoryCount(userId: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('user_sessions')
      .select('questions_asked')
      .eq('user_id', userId)
      .gte('created_at', today)
      .maybeSingle()

    if (error) {
      console.warn('Daily count check error (non-blocking):', error.message)
      return 0
    }

    if (!data) return 0
    return data.questions_asked || 0
  } catch (error) {
    console.warn('Daily count check failed:', error)
    return 0
  }
}

// Helper function to clear old cached stories
export async function clearOldCachedStories(): Promise<void> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - CACHE_EXPIRY_DAYS)
  
  const { error } = await supabase
    .from('cached_stories')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    
  if (error) {
    console.error('Failed to clear old cached stories:', error)
  }
}