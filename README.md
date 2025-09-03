# Quest Cards - Interactive Learning Adventures for Kids

A fun, educational web application that creates personalized learning adventures for children ages 5-10 using AI-powered storytelling.

## 🌟 Features

### For Children
- **Interactive Learning Stories** - 3-step educational adventures with age-appropriate content
- **Voice Narration** - Text-to-speech with pause/stop controls for accessibility
- **Two Themed Environments** - Space 🚀 and Forest 🌲 adventures
- **Progress Tracking** - Visual indicators and learning journey history
- **Educational Checkpoints** - Fun quizzes to validate understanding

### For Parents
- **Age-Appropriate Content** - Strict vocabulary filtering for 5-10 year olds
- **Parent Digest** - Summary of skills learned and suggested home activities
- **Usage Statistics** - Track learning progress and daily activity
- **Safe Learning Environment** - Multiple content validation layers

### For Educators
- **Curriculum Alignment** - Stories build understanding progressively
- **Session Management** - Save and resume learning sessions
- **Learning Analytics** - Track engagement and completion rates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google AI API key (Gemini 2.0 Flash)
- Supabase account for data storage

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd child-story

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

Create a `.env.local` file with:

```env
VITE_GOOGLE_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: Google Gemini 2.0 Flash API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Voice**: Web Speech API
- **Validation**: Zod schema validation

## 📚 How It Works

### Learning Flow
1. **Topic Selection** - Child asks a question about anything they're curious about
2. **Story Generation** - AI creates a 3-step learning adventure using age-appropriate language
3. **Interactive Experience** - Voice narration with navigation controls
4. **Knowledge Check** - Educational checkpoint quiz
5. **Parent Summary** - Skills learned and suggested activities

### Content Safety
- **Vocabulary Filtering** - Automatic detection and blocking of advanced scientific terms
- **Age Validation** - Content specifically tailored for 5-10 year old comprehension
- **Educational Quality** - Multiple validation layers ensure meaningful learning content
- **Retry Logic** - Automatic content regeneration if validation fails

## 🎯 Target Audience

**Primary Users**: Children ages 5-10
**Secondary Users**: Parents and educators seeking quality educational content

### Age-Specific Features
- **Ages 5-7**: Simple comparisons, basic vocabulary, visual learning
- **Ages 8-10**: Expanded vocabulary, cause-effect reasoning, observation skills

## 🔧 Architecture

### Key Components
- **Quest Interface** - Main learning environment with theme selection
- **Story Panel** - Content display with voice controls and navigation
- **Checkpoint Flow** - Interactive quiz system
- **Session Management** - Progress tracking and conversation history
- **Content Validation** - Multi-layer safety and quality checks

### API Integration
- **Gemini 2.0 Flash** - Story generation with custom prompts
- **Supabase** - User sessions, caching, and usage tracking
- **Web Speech API** - Text-to-speech functionality

## 📊 Content Guidelines

### Vocabulary Standards
- **Approved Words**: Everyday objects, emotions, actions kids know
- **Banned Terms**: Scientific jargon, complex concepts, inappropriate content
- **Quality Metrics**: Logical progression, age-appropriate analogies, clear explanations

### Story Structure
1. **Discovery** - "Wow! Did you know [topic] is like [familiar thing]?"
2. **Explanation** - "The cool thing is [how it works] because [simple reason]!"
3. **Application** - "Now you can [spot/use this knowledge] when [real situation]!"

## 🚦 Usage Limits

- **Daily Limit**: 20 stories per user per day
- **Caching**: 30-day story cache to improve performance
- **Rate Limiting**: Prevents API overuse and ensures fair access

## 🔒 Security & Privacy

- **Content Filtering** - Multiple validation layers for child safety
- **No Personal Data Collection** - Only essential usage analytics
- **Secure Authentication** - Supabase Auth with proper session management
- **API Key Protection** - Environment variables for sensitive data

## 🧪 Testing

Currently uses manual testing. Recommended additions:
- Unit tests for content validation
- Integration tests for API calls
- End-to-end tests for user flows

## 📈 Performance

- **Bundle Size**: ~609KB (consider code splitting for production)
- **Response Time**: ~2-3 seconds for story generation
- **Caching**: Reduces API calls for repeated topics
- **Optimization**: Lazy loading and image compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and TypeScript conventions
- Ensure all content meets age-appropriateness standards
- Test with real children when possible
- Maintain educational quality while keeping content fun

---

**Built with ❤️ for curious young minds**