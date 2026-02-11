# Purdue ECE Academic Planner

An intelligent course planning application for Purdue ECE students with AI-powered recommendations, real-time grade data, and visual semester planning.

## Features

- **Smart Recommendations**: AI-powered course suggestions based on career goals, interests, and academic history
- **GPA Insights**: Real grade distributions and difficulty ratings from student data
- **Visual Planner**: Drag-and-drop semester planning with conflict detection
- **Career Alignment**: Match courses to career paths (embedded, ML, hardware, software)
- **Course Reviews**: Aggregated reviews from multiple sources
- **AI Explanations**: Personalized course explanations using OpenAI GPT-4

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub, Demo login)
- **AI**: OpenAI API (GPT-4)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: AWS (EC2, S3, Lambda)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd purdue-ece-planner
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ece_planner"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   OPENAI_API_KEY="sk-..."  # Optional
   ```

3. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   npx prisma generate
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
purdue-ece-planner/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   ├── courses/            # Course browser
│   │   ├── dashboard/          # User dashboard
│   │   ├── planner/            # Semester planner
│   │   └── questionnaire/      # Preference questionnaire
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn UI components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts           # Database client
│   │   ├── auth.ts             # NextAuth config
│   │   └── openai.ts           # OpenAI client
│   ├── scrapers/               # Web scrapers
│   │   ├── catalog.ts          # Course catalog scraper
│   │   ├── grades.ts           # Grade distribution scraper
│   │   └── ratings.ts          # Reviews scraper
│   ├── engine/                 # Recommendation engine
│   │   ├── matcher.ts          # Preference matching
│   │   ├── prerequisites.ts    # Prereq analysis
│   │   └── gpa-optimizer.ts    # GPA optimization
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── scripts/
│   └── seed.ts                 # Database seeding
└── lambda/                     # AWS Lambda functions
```

## API Documentation

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Courses
- `GET /api/courses` - List courses with filters
  - Query params: `level`, `sort`, `search`, `limit`
- `GET /api/courses/[code]` - Get course details

### User Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save preferences

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations

### Planner
- `GET /api/planner` - Get user's planned courses
- `POST /api/planner` - Add course to plan
- `PUT /api/planner` - Update planned course
- `DELETE /api/planner?id=` - Remove course from plan

### AI
- `POST /api/openai/explain` - Generate course explanation

### Scraper
- `POST /api/scraper` - Trigger scraper (admin)
- `GET /api/scraper` - Get scraper logs

## Recommendation Algorithm

The recommendation engine scores courses based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| Career Match | 25% | Alignment with career goals |
| GPA Optimal | 20% | Course GPA vs target GPA |
| Prerequisites Ready | 15% | All prereqs completed |
| Difficulty Match | 15% | Matches preferred difficulty |
| Workload Fit | 15% | Within workload limits |
| Interest Match | 10% | Matches topic interests |

## AWS Deployment

### EC2 Setup

1. Launch EC2 instance (t3.small or larger)
2. Install Node.js 18+ and PostgreSQL
3. Clone repository and install dependencies
4. Set up environment variables
5. Configure nginx as reverse proxy
6. Set up PM2 for process management

### S3 Configuration

1. Create S3 bucket for static assets
2. Configure CORS for your domain
3. Set up CloudFront distribution (optional)

### Lambda Scheduled Scraper

1. Package `lambda/scraper-job` with dependencies
2. Create Lambda function (Node.js 18+)
3. Set DATABASE_URL environment variable
4. Create EventBridge rule for scheduling (e.g., daily)
5. Configure VPC if database is in private subnet

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/ece_planner"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="production-secret-key"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."
OPENAI_API_KEY="sk-..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="purdue-ece-planner"
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run scrape:all   # Run all scrapers
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - Built for Purdue ECE students.

## Disclaimer

This application is not officially affiliated with Purdue University. Course data and grade distributions are for educational purposes only.
