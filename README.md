
# UniUyo Safe Hub 🛡️

## Overview

UniUyo Safe Hub is an AI-powered comprehensive campus safety platform designed specifically for the University of Uyo community. The platform leverages cutting-edge artificial intelligence to enhance campus security, streamline emergency response, and foster a safer learning environment for students, faculty, and staff.

## 🚀 Key Features

### 🆘 Emergency Response System
- **SOS Alerts**: One-tap emergency alerts with automatic location sharing
- **AI Emergency Context**: Intelligent context generation for first responders using Groq's llama-3.3-70b-versatile model
- **Real-time Location Tracking**: GPS-based location services for accurate emergency response
- **Emergency Contacts Management**: Centralized emergency contact information

### 🕒 Safety Timer
- **Smart Journey Tracking**: Set timers for safe travels across campus
- **AI Route Analysis**: Intelligent route safety assessment with risk evaluation
- **Guardian Network**: Trusted contacts receive alerts if check-ins are missed
- **Location Monitoring**: Real-time location updates during active timers

### 📋 Incident Reporting
- **Anonymous Reporting**: Report incidents with optional anonymity
- **AI Analysis**: Automated incident categorization and priority assessment
- **Risk Assessment**: AI-powered risk evaluation and recommended actions
- **Admin Dashboard**: Comprehensive incident management for campus security

### 🔍 Lost & Found System
- **Semantic Search**: Advanced AI-powered search using natural language
- **Smart Matching**: Intelligent item matching based on descriptions
- **Contact Management**: Secure communication between finders and owners
- **Category Organization**: Organized browsing by item categories

### 📢 Campus Communication
- **Safety Alerts**: Real-time campus-wide safety notifications
- **University Updates**: Official announcements and news
- **Emergency Broadcasts**: Critical information dissemination
- **Resource Sharing**: Academic and safety resource distribution

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality, accessible UI components
- **React Router DOM** - Client-side routing and navigation
- **TanStack Query** - Powerful data fetching and state management
- **React Hook Form + Zod** - Form handling with runtime validation

### Backend & Database
- **Supabase** - Backend-as-a-Service platform providing:
  - **PostgreSQL Database** - Robust relational database with full SQL support
  - **Authentication** - Secure user management with email/password
  - **Real-time Subscriptions** - Live data updates across clients
  - **Row Level Security (RLS)** - Database-level security policies
  - **Edge Functions** - Serverless functions for custom logic

### AI & Machine Learning
- **Groq API** - Ultra-fast LLM inference for AI features
- **llama-3.3-70b-versatile** - Advanced language model for:
  - Emergency context generation
  - Incident analysis and categorization
  - Route safety assessment
  - Semantic search capabilities
- **LangChain** - AI application framework for structured prompts

### Maps & Location
- **MapLibre GL JS** - Interactive maps and location visualization
- **Geolocation API** - Browser-based location services
- **Geographic Data Types** - PostGIS support for spatial queries

## 🤖 AI Features in Detail

### Emergency Context Generation
Automatically generates contextual information for emergency responders including:
- User profile and department information
- Recent incident history in the area
- Location-specific safety considerations
- Professional emergency briefings

### Incident Analysis
AI-powered analysis provides:
- **Category Suggestions**: Automatic incident categorization
- **Priority Assessment**: Risk-based priority levels (low/medium/high/critical)
- **Action Recommendations**: Suggested response protocols
- **Tag Generation**: Relevant keywords for searchability

### Route Safety Analysis
Comprehensive route evaluation including:
- **Risk Assessment**: Multi-factor safety analysis
- **Time-of-Day Considerations**: Dynamic risk based on time
- **Alternative Routes**: Safer path suggestions
- **Campus-Specific Advice**: Location-aware safety tips

### Semantic Search
Advanced search capabilities featuring:
- **Natural Language Processing**: Search using conversational language
- **Context Understanding**: Understands synonyms and related terms
- **Relevance Scoring**: AI-powered match confidence ratings
- **Search Suggestions**: Intelligent query recommendations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── emergency/       # Emergency-related components
│   ├── lost-found/      # Lost & Found functionality
│   ├── safety/          # Safety timer and guardian management
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication logic
│   ├── useLocation.ts   # Geolocation services
│   ├── useEmergencyAI.ts # AI emergency features
│   ├── useIncidentAI.ts  # AI incident analysis
│   ├── useRouteAnalysis.ts # AI route analysis
│   └── useSemanticSearch.ts # AI semantic search
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Page components
└── main.tsx            # Application entry point

supabase/
├── functions/           # Edge Functions
│   ├── ai-emergency-context/   # Emergency AI
│   ├── ai-incident-analysis/   # Incident AI
│   ├── ai-route-analysis/      # Route AI
│   └── ai-semantic-search/     # Search AI
└── migrations/          # Database migrations
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profile information and preferences
- **incident_reports** - Campus incident reports with AI analysis
- **safety_alerts** - Real-time safety notifications
- **safety_timers** - Active safety timer sessions
- **guardians** - User guardian relationships
- **emergency_contacts** - Emergency contact information
- **lost_items** - Lost and found item listings
- **university_updates** - Official campus communications

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** through authentication policies
- **Anonymous reporting** support with privacy protection
- **Data encryption** for sensitive information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- Supabase account for backend services
- Groq API key for AI features

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uniuyo-safe-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Run the provided SQL migrations
   - Update the Supabase configuration in `src/integrations/supabase/client.ts`

4. **Set up AI services**
   - Obtain a Groq API key from [Groq Console](https://console.groq.com/)
   - Add the API key to Supabase Edge Function secrets as `GROQ_API_KEY`

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

The app uses Supabase for configuration management. Required secrets:
- `GROQ_API_KEY` - For AI features
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - For Edge Functions

## 🔐 Security & Privacy

### Data Protection
- **End-to-end encryption** for sensitive communications
- **Anonymous reporting** options for incident reports
- **User consent** mechanisms for location tracking
- **Data minimization** practices throughout the platform

### Authentication & Authorization
- **Secure authentication** via Supabase Auth
- **Role-based access control** for administrative functions
- **Session management** with automatic timeout
- **Multi-factor authentication** support (future enhancement)

### Privacy Features
- **Optional anonymity** for sensitive reports
- **Data retention policies** for temporary location data
- **User control** over personal information sharing
- **GDPR compliance** considerations

## 🚀 Deployment

### Production Deployment

1. **Prepare production environment**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform** (Vercel, Netlify, etc.)
   - Configure environment variables
   - Set up custom domain (optional)
   - Enable HTTPS and security headers

3. **Configure Supabase for production**
   - Update CORS settings
   - Configure production database
   - Set up monitoring and logging

### Edge Functions Deployment
Edge Functions are automatically deployed when the codebase is updated. Monitor function logs in the Supabase dashboard for debugging.

## 🤝 Contributing

We welcome contributions from the University of Uyo community and beyond!

### Development Guidelines
- **Code Style**: Follow TypeScript and React best practices
- **Component Design**: Create small, focused, reusable components
- **Testing**: Write unit tests for critical functionality
- **Documentation**: Update README and inline comments
- **Security**: Follow security best practices for campus safety apps

### Pull Request Process
1. Fork the repository and create a feature branch
2. Make your changes with appropriate tests
3. Update documentation as needed
4. Submit a pull request with a clear description

## 📖 API Documentation

### Edge Functions

#### `/ai-emergency-context`
Generates AI-powered emergency context for first responders
- **Input**: User ID, location, emergency type, additional context
- **Output**: Formatted emergency briefing with user profile data

#### `/ai-incident-analysis`
Analyzes incident reports using AI for categorization and priority
- **Input**: Description, location, report type
- **Output**: Category suggestions, priority level, risk assessment

#### `/ai-route-analysis`
Provides AI-powered route safety analysis for safety timers
- **Input**: Destination, duration, current location, user profile
- **Output**: Risk assessment, safety tips, alternative routes

#### `/ai-semantic-search`
Performs intelligent search on lost and found items
- **Input**: Search query, item list, search type
- **Output**: Ranked matches with explanations and suggestions

## 🔄 Development Roadmap

### Phase 1 (Current) ✅
- Core safety features (SOS, reporting, safety timer)
- AI-powered incident analysis and emergency context
- Basic lost and found functionality
- User authentication and profiles

### Phase 2 (Planned)
- **Enhanced AI Features**
  - Predictive safety analytics
  - Crowd-sourced safety mapping
  - Multi-language support for AI features
- **Mobile Application**
  - React Native mobile app
  - Push notifications for alerts
  - Offline functionality for emergencies
- **Advanced Admin Features**
  - Comprehensive analytics dashboard
  - Incident response workflow management
  - Integration with campus security systems

### Phase 3 (Future)
- **IoT Integration**
  - Emergency button integration
  - Sensor-based alert systems
  - Smart building connectivity
- **Community Features**
  - Safety forums and discussions
  - Peer-to-peer safety assistance
  - Gamification of safety practices

## 📞 Support & Contact

For technical support, feature requests, or security concerns:

- **Campus IT Support**: [Contact Information]
- **Security Office**: [Emergency Contact]
- **Development Team**: [Developer Contact]
- **Bug Reports**: Use GitHub Issues for technical problems

## 📜 License

Copyright © 2024 University of Uyo. All rights reserved.

This software is proprietary to the University of Uyo and is intended solely for use by the university community. Unauthorized reproduction, distribution, or modification of this software is strictly prohibited.

## 🙏 Acknowledgments

- **University of Uyo** - For supporting campus safety innovation
- **Groq** - For providing fast AI inference capabilities
- **Supabase** - For the comprehensive backend platform
- **Open Source Community** - For the incredible tools and libraries
- **Campus Security Team** - For domain expertise and requirements guidance
- **Student Beta Testers** - For invaluable feedback and testing

---

**Built with ❤️ for the University of Uyo community**

*Enhancing campus safety through intelligent technology and community collaboration.*
