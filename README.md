# 📬 InboxHire – Effortless Job Application Tracker

## 📚 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [How It Works](#-how-it-works)
4. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Technical Architecture](#technical-architecture)
   - [System Overview](#system-overview)
   - [Component Details](#component-details)
   - [Data Flow](#data-flow)
6. [API Documentation](#api-documentation)
   - [Inbound Email Endpoints](#inbound-email-endpoints)
   - [Application Endpoints](#application-endpoints)
   - [User Endpoints](#user-endpoints)
7. [AI Integration](#ai-integration)
   - [Gemini Integration](#gemini-integration)
   - [NLP Processing](#nlp-processing)
8. [Database Schema](#database-schema)
9. [Security](#security)
10. [Monitoring & Logging](#monitoring--logging)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)
14. [Future Roadmap](#future-roadmap)

## ✨ Overview

InboxHire is an innovative job application tracking system that leverages Postmark's inbound email parsing capabilities and Google's Gemini AI to automatically organize and manage your job applications. Never miss a follow-up or deadline again!

## ✨ Features

- 📧 **Automatic Email Parsing**: Automatically extracts job details from application confirmation emails
- 📊 **Application Dashboard**: Visual overview of all your job applications
- 🔔 **Smart Notifications**: Get reminded about follow-ups and deadlines
- 📈 **Application Analytics**: Track your application success rates and response times
- 🔍 **Search & Filter**: Easily find specific applications using various criteria
- 📱 **Responsive Design**: Access your application tracker from any device

## ⚙️ How It Works

InboxHire uses Postmark's inbound email parsing to automatically process job application confirmation emails. When you receive an email from a job board or company, InboxHire:

1. Parses the email content
2. Extracts relevant information (company name, position, date, etc.)
3. Creates a new application entry in your dashboard
4. Sends you a confirmation notification

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Postmark account
- Google Cloud account (for Gemini AI)
- ngrok (for local development)

### Installation

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/inbox-hire.git
cd inbox-hire
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Local Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Expose Locally with ngrok

To receive webhooks from Postmark, you'll need to expose your local server:

```bash
ngrok http 3000
```

### 5. Configure Postmark

1. Sign up for a Postmark account
2. Create a new server in Postmark
3. Configure the inbound webhook URL to your ngrok URL
4. Set up email forwarding to your Postmark inbound address

### Configuration

```env
# Postmark Configuration
POSTMARK_API_KEY=your_api_key
POSTMARK_SIGNING_KEY=your_signing_key
POSTMARK_INBOUND_ADDRESS=your_inbound_address

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/inboxhire
DATABASE_SSL=true

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Google Cloud (Gemini AI)
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
GEMINI_API_KEY=your_gemini_api_key

# Application Settings
NODE_ENV=development
PORT=3000
```

## Technical Architecture

### System Overview

```ascii
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Email Service  │────▶│  Postmark API   │────▶│  Webhook Server │
│  (Gmail, etc.)  │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Browser   │◀────│  Next.js App    │◀────│  Data Parser    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                      │
                                 ▼                      ▼
                        ┌─────────────────┐    ┌─────────────────┐
                        │                 │    │                 │
                        │  PostgreSQL DB  │    │   Gemini AI     │
                        │                 │    │                 │
                        └─────────────────┘    └─────────────────┘
```

## API Documentation

### Inbound Email Endpoints

```ascii
┌─────────────────────────────────────────────────────────────┐
│                  Inbound Email Endpoints                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POST /api/inbound/email                                    │
│  ├── Receives Postmark webhooks                             │
│  ├── Validates email signature                              │
│  └── Processes incoming emails                              │
│                                                             │
│  POST /api/inbound/parse                                    │
│  ├── Parses email content                                   │
│  ├── Extracts job details                                   │
│  └── Returns structured data                                │
│                                                             │
│  POST /api/inbound/validate                                 │
│  ├── Validates email format                                 │
│  ├── Checks required fields                                 │
│  └── Returns validation status                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Application Endpoints

```ascii
┌─────────────────────────────────────────────────────────────┐
│                  Application Endpoints                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GET /api/applications                                      │
│  ├── Lists all applications                                 │
│  ├── Supports filtering                                     │
│  └── Pagination support                                     │
│                                                             │
│  POST /api/applications                                     │
│  ├── Creates new application                                │
│  └── Validates input data                                   │
│                                                             │
│  GET /api/applications/:id                                  │
│  ├── Gets specific application                              │
│  └── Includes related data                                  │
│                                                             │
│  PUT /api/applications/:id                                  │
│  ├── Updates application                                    │
│  └── Handles status changes                                 │
│                                                             │
│  DELETE /api/applications/:id                               │
│  ├── Archives application                                   │
│  └── Maintains audit trail                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### User Endpoints

```ascii
┌─────────────────────────────────────────────────────────────┐
│                    User Endpoints                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POST /api/auth/signin                                      │
│  ├── User authentication                                    │
│  └── JWT token generation                                   │
│                                                             │
│  POST /api/auth/signout                                     │
│  ├── Session termination                                    │
│  └── Token invalidation                                     │
│                                                             │
│  GET /api/user/profile                                      │
│  ├── User profile data                                      │
│  └── Preferences                                            │
│                                                             │
│  PUT /api/user/settings                                     │
│  ├── Update preferences                                     │
│  └── Notification settings                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## AI Integration

### Gemini Integration

```ascii
┌─────────────────────────────────────────────────────────────┐
│                    Gemini AI Integration                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Email Analysis                                          │
│     ├── Content extraction                                  │
│     ├── Sentiment analysis                                  │
│     └── Key information identification                      │
│                                                             │
│  2. Job Details Extraction                                  │
│     ├── Company identification                              │
│     ├── Position analysis                                   │
│     └── Requirements parsing                                │
│                                                             │
│  3. Smart Categorization                                    │
│     ├── Job type classification                             │
│     ├── Priority assessment                                 │
│     └── Follow-up suggestions                               │
│                                                             │
│  4. Response Generation                                     │
│     ├── Follow-up templates                                 │
│     ├── Interview preparation                               │
│     └── Custom responses                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### NLP Processing

1. **Text Analysis**
   - Entity recognition
   - Keyword extraction
   - Sentiment analysis
   - Topic modeling

2. **Content Classification**
   - Job type categorization
   - Priority assessment
   - Follow-up requirement detection
   - Deadline extraction

3. **Response Generation**
   - Template-based responses
   - Custom email generation
   - Interview preparation guides
   - Follow-up suggestions

## Database Schema

```
inbox-hire/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── webhook/
│   │   ├── components/
│   │   └── pages/
│   └── data/
├── public/
└── ...
```

## 🧪 Test the Webhook

You can test the webhook using Postmark's test email feature or by sending a test email to your inbound address.

## Technical Details

### System Architecture

```ascii
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Email Service  │────▶│  Postmark API   │────▶│  Webhook Server │
│  (Gmail, etc.)  │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Browser   │◀────│  Next.js App    │◀────│  Data Parser    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  PostgreSQL DB  │
                        │                 │
                        └─────────────────┘
```

### Application Flow

```ascii
┌─────────────────────────────────────────────────────────────┐
│                      Email Processing Flow                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Email Received                                          │
│     ┌─────────────┐                                         │
│     │  Incoming   │                                         │
│     │   Email     │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  2. Postmark Processing                                     │
│     ┌─────▼───────┐                                         │
│     │  Parse      │                                         │
│     │  Email      │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  3. Data Extraction                                         │
│     ┌─────▼───────┐                                         │
│     │  Extract    │                                         │
│     │  Job Info   │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  4. Database Storage                                        │
│     ┌─────▼───────┐                                         │
│     │  Store      │                                         │
│     │  Data       │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  5. User Notification                                       │
│     ┌─────▼───────┐                                         │
│     │  Send       │                                         │
│     │  Alert      │                                         │
│     └─────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

```ascii
┌─────────────────────────────────────────────────────────────┐
│                      Database Schema                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Applications                                               │
│  ├── id: UUID (PK)                                         │
│  ├── company_name: String                                  │
│  ├── position: String                                      │
│  ├── application_date: DateTime                            │
│  ├── status: Enum                                          │
│  ├── source: String                                        │
│  └── notes: Text                                           │
│                                                             │
│  Email_Logs                                                │
│  ├── id: UUID (PK)                                         │
│  ├── application_id: UUID (FK)                             │
│  ├── email_id: String                                      │
│  ├── received_at: DateTime                                 │
│  └── content: Text                                         │
│                                                             │
│  User_Settings                                             │
│  ├── id: UUID (PK)                                         │
│  ├── user_id: UUID (FK)                                    │
│  ├── notification_preferences: JSON                         │
│  └── email_filters: JSON                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Components

1. **Email Receiver (Postmark Inbound Server)**
   - Handles incoming emails
   - Validates email authenticity
   - Processes email attachments
   - Extracts email metadata

2. **Parser (Email Content Extraction)**
   - Uses NLP for job detail extraction
   - Identifies company names
   - Extracts position titles
   - Parses application dates
   - Handles multiple email formats

3. **Processor (Data Normalization)**
   - Standardizes extracted data
   - Validates required fields
   - Enriches data with additional context
   - Handles data deduplication

4. **Notifier (User Notification System)**
   - Sends real-time alerts
   - Manages notification preferences
   - Handles email notifications
   - Provides in-app notifications

### Pipeline Flow

1. **Email Reception**
   ```ascii
   Email → Postmark Server → Webhook Endpoint
   ```

2. **Data Processing**
   ```ascii
   Webhook → Parser → Data Validator → Database
   ```

3. **User Notification**
   ```ascii
   Database → Notification Service → User Interface
   ```

### Environment Configuration

Required environment variables:
```env
# Postmark Configuration
POSTMARK_API_KEY=your_api_key
POSTMARK_SIGNING_KEY=your_signing_key
POSTMARK_INBOUND_ADDRESS=your_inbound_address

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/inboxhire
DATABASE_SSL=true

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development
PORT=3000
```

### Server Endpoints

```ascii
┌─────────────────────────────────────────────────────────────┐
│                      API Endpoints                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POST /api/webhook                                          │
│  ├── Receives Postmark webhooks                             │
│  └── Processes incoming emails                              │
│                                                             │
│  GET /api/applications                                      │
│  ├── Lists all applications                                 │
│  └── Supports filtering and pagination                      │
│                                                             │
│  POST /api/applications                                     │
│  ├── Creates new application                                │
│  └── Validates input data                                   │
│                                                             │
│  GET /api/applications/:id                                  │
│  ├── Gets specific application                              │
│  └── Includes related data                                  │
│                                                             │
│  PUT /api/applications/:id                                  │
│  ├── Updates application                                    │
│  └── Handles status changes                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Error Handling

```ascii
┌─────────────────────────────────────────────────────────────┐
│                      Error Handling Flow                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Error Detection                                         │
│     ┌─────────────┐                                         │
│     │  Identify   │                                         │
│     │  Error      │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  2. Error Classification                                    │
│     ┌─────▼───────┐                                         │
│     │  Categorize │                                         │
│     │  Error      │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  3. Error Response                                          │
│     ┌─────▼───────┐                                         │
│     │  Handle     │                                         │
│     │  Error      │                                         │
│     └─────┬───────┘                                         │
│           │                                                 │
│  4. Error Logging                                           │
│     ┌─────▼───────┐                                         │
│     │  Log        │                                         │
│     │  Error      │                                         │
│     └─────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Monitoring and Logging

1. **Application Monitoring**
   - Real-time performance metrics
   - Error rate tracking
   - Response time monitoring
   - Resource utilization

2. **Logging System**
   - Structured logging
   - Log levels (DEBUG, INFO, WARN, ERROR)
   - Log rotation
   - Log aggregation

3. **Alerting System**
   - Error threshold alerts
   - Performance degradation alerts
   - System health checks
   - User notification alerts

### Best Practices

1. **Security**
   - API key rotation
   - Rate limiting
   - Input validation
   - XSS protection
   - CSRF protection

2. **Performance**
   - Caching strategy
   - Database indexing
   - Query optimization
   - Asset optimization

3. **Code Quality**
   - TypeScript usage
   - Unit testing
   - Integration testing
   - Code documentation
   - Code review process

### Troubleshooting Guide

```ascii
┌─────────────────────────────────────────────────────────────┐
│                      Common Issues                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Webhook Issues                                          │
│     ├── Check Postmark configuration                        │
│     ├── Verify webhook URL                                  │
│     └── Check server logs                                   │
│                                                             │
│  2. Database Issues                                         │
│     ├── Verify connection string                            │
│     ├── Check database logs                                 │
│     └── Verify migrations                                   │
│                                                             │
│  3. Authentication Issues                                   │
│     ├── Check API keys                                      │
│     ├── Verify JWT tokens                                   │
│     └── Check session data                                  │
│                                                             │
│  4. Email Parsing Issues                                    │
│     ├── Check email format                                  │
│     ├── Verify parser rules                                 │
│     └── Check extracted data                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 💡 Future Ideas

- AI-powered application status prediction
- Resume optimization suggestions
- Interview preparation tools
- Company research integration
- Salary negotiation assistant
- Application analytics dashboard

## 🙌 Credits

- Built for the [Postmark Challenge](https://dev.to/challenges/postmark)
- Powered by [Next.js](https://nextjs.org)
- Email processing by [Postmark](https://postmarkapp.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)

## License

MIT License - feel free to use this project for your own purposes!
