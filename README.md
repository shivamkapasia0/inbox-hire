# 📬 InboxHire – Effortless Job Application Tracker

## 📚 Table of Contents

1. [Overview](#-overview)
2. [Motivation](#-motivation-aka-why-were-even-doing-this)
3. [Features](#-features-prototype-edition--built-with-sleep-deprivation--caffeine)
4. [How It Works](#how-it-works)
5. [Getting Started](#-getting-started)
6. [Technical Architecture](#technical-architecture)
   - [Project Flow Overview](#project-flow-overview)
   - [System Overview](#system-overview)
   - [Project Structure](#-project-structure)
   - [API Endpoints](#-api-endpoints)
7. [Email Processing Flow](#email-processing-flow)
8. [Security](#-security)
9. [Monitoring & Logging](#-monitoring--logging)
10. [Deployment](#-deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [Future Roadmap](#-future-roadmap-aka-the-quest-for-world-domination-or-at-least-job-domination)
14. [AI Integration](#ai-integration)
    - [Gemini Integration](#gemini-integration)
    - [NLP Processing](#nlp-processing)
15. [License](#license)
16. [Credits](#credits)

## ✨ Overview

InboxHire is an innovative job application tracking system that leverages Postmark's inbound email parsing capabilities and Google's Gemini AI to automatically organize and manage your job applications. Never miss a follow-up or deadline again!

## 🎥 Demo & Screenshots

### Demo Video
[Watch the demo on Loom](https://www.loom.com/share/ddcb17fd023d467f906ef282f722a50e)

*Click the image above to watch the demo video*

### App Screenshots

#### Home Page
![InboxHire Home Page](/public/inboxHire-homePageSS.png)

#### Applications Page
![InboxHire Applications Page](/public/inboxHire-ApplicationPageSS.png)

## 🎯 Motivation (a.k.a. Why We're Even Doing This)

Lets face it — being a job seeker these days is basically a full-time job... without the paycheck.

You are probably juggling applications across every corner of the internet:

- 🔗 **LinkedIn** – Where "Open to Work" becomes a lifestyle.
- 🔥 **Naukri.com** – Where you uploaded your resume once... and they still email you daily.
- ✨ **Shine.com** – Because job hunting needs a little sparkle.
- 🌍 **Turing** – For when you want to work remotely from your couch... in sweatpants.
- 🏢 **Company Career Pages** – Each one with its own password requirements and CAPTCHA puzzles.
- 📋 **Job Boards** – A digital forest of listings (and you're the squirrel).
- 📬 **Direct Applications** – Bold move. Respect. Hope someone actually reads it.

You are everywhere. And thats exactly why **we're building tools to help you keep your sanity** (and maybe even land your dream job in the process).


This multi-platform approach creates several challenges:
1. **Scattered Applications**: Your applications are spread across different platforms, making it difficult to maintain a centralized view
2. **Missed Follow-ups**: Without a unified system, it's easy to miss important follow-ups or deadlines
3. **Inconsistent Tracking**: Each platform has its own way of tracking applications, leading to inconsistent data
4. **Time Management**: Manually tracking applications across platforms is time-consuming and error-prone
5. **Lack of Analytics**: Without centralized data, it's difficult to analyze your application patterns and success rates

InboxHire solves these challenges by:
- Automatically capturing application confirmations from your email
- Centralizing all your applications in one dashboard
- Providing smart notifications for follow-ups
- Offering comprehensive analytics on your application journey
- Saving you time and reducing the mental load of job hunting

Whether you're actively job hunting or passively exploring opportunities, InboxHire helps you stay organized and focused on what matters most - landing your next role.



## ✨ Features (Prototype Edition – Built With Sleep Deprivation & Caffeine)

🚧 *Disclaimer: This is a prototype built during a hackathon. It might not change your life (yet), but it's got potential... and probably a few bugs lovingly added at 3AM.* 🚧

- 📧 **Automatic Email Parsing** – Like a smart intern that reads all your job confirmation emails and never complains.
- 📊 **Application Dashboard** – A crystal-clear command center for all your job-chasing adventures.
- 🔔 **Smart Notifications** – Reminder alerts so you don't forget to follow up... or sleep.
- 📈 **Application Analytics** – Because nothing says "organized" like tracking rejection rates with charts.
- 🔍 **Search & Filter** – Find that one job you applied to two weeks ago at 2AM... without scrolling forever.
- 📱 **Responsive Design** – Works on your laptop, phone, tablet, toaster (okay maybe not toaster).
- 📊 **Data Visualization** – Interactive graphs that make your job hunt look suspiciously like a stock market trend.
- 🔄 **Import/Export** – Move your application data around like a digital nomad on a mission.
- ⚙️ **Customizable Settings** – Tailor email rules and notifications like a boss.

🛠️ *Built in record time, powered by pizza, and an unhealthy amount of enthusiasm.*



## How It Works

*InboxHire* turns your chaotic inbox into a well-oiled job-tracking machine – all while you sip coffee and pretend you're being productive.

Here's how the prototype works (powered by Postmark, Gemini AI, and pure hackathon energy):

1. 📩 **Email Received** – You apply for a job. An email lands in your inbox. The journey begins.
2. 🛠️ **Postmark Jumps In** – Our loyal sidekick, Postmark's inbound email API, catches the email and hands it over like a pro.
3. 🤖 **Gemini AI Extracts the Good Stuff** – Company name, job title, application date — all pulled out faster than you can say "Dear Hiring Manager."
4. 🗂️ **New Entry Created** – A shiny new application appears on your dashboard like magic.
5. 📊 **Analytics Updated** – Your charts get a new data point. You're basically an Excel wizard now.
6. 🔔 **You Get Notified** – Because what's the point of automation if it doesn't humblebrag with a notification?

🧪 *Note: This is a hackathon prototype – results may vary, especially if fueled by instant noodles and last-minute commits.*


## 🚀 Getting Started


### 🧰 Prerequisites

You'll need the following installed (and yes, they're all free to get started):

- 🟢 **Node.js** 18.x or higher – Because JavaScript never sleeps.
- 💌 **Postmark account** – To help us read emails like a nosy but helpful assistant.
- 🤖 **Google Cloud account** – To access Gemini AI and make our app look much smarter than we are.
- 🌐 **ngrok** – So your local server doesn't live in complete isolation.

---

### 🧰 Installation Steps


## 🚀 Getting Started (a.k.a. How to Make the Magic Happen)

So you want to run **InboxHire** — our caffeine-fueled, email-parsing, AI-powered job tracker prototype? Awesome. Let's get you set up before your coffee gets cold.

---

### 🧰 Prerequisites

You'll need the following installed (and yes, they're all free to get started):

- 🟢 **Node.js** 18.x or higher – Because JavaScript never sleeps.
- 💌 **Postmark account** – To help us read emails like a nosy but helpful assistant.
- 🤖 **Google Cloud account** – To access Gemini AI and make our app look much smarter than we are.
- 🌐 **ngrok** – So your local server doesn't live in complete isolation.

---

### 🧰 Installation Steps

1. **Clone the repo like a pro**:
   ```bash
   git clone https://github.com/yourusername/inbox-hire.git
   cd inbox-hire
   ```

2. **Install dependencies (no, `npm i` is not a real word)**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up your environment like a responsible dev**:
   ```bash
   cp .env.example .env.local
   ```

4. **Fire up the dev server and impress your teammates**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser and behold the prototype magic**:
   [http://localhost:3000](http://localhost:3000)

---

### 🛠️ Configuration Files

InboxHire uses simple JSON files for storage and config — because databases are too mainstream for a hackathon.

Located in the `src/data` folder:

- `settings.json` – Your control center:
  - Email parsing rules
  - Dashboard look & feel
  - Gemini AI integration settings

- `emails.json` – Where job apps live:
  - Stores application entries, email content, and status updates
  - Automatically updated when new emails roll in (neat, right?)

> ⚠️ **Heads Up:** The Gemini API key in `settings.json` is just for show. For actual AI wizardry, replace it with your own key.

---

### 🗄️ Data Storage (a.k.a. Where the Magic Lives)

- All app data is stored in good ol' `emails.json`
- Each record = job application + email + status update
- Optimized for fast reads/writes (because ain't nobody got time for lag)

---

### 🔐 Prefer Environment Variables?

No problem! You can ditch the `settings.json` and go full .env mode:

```env
# Google Cloud (Gemini AI)
GEMINI_API_KEY=your_gemini_api_key

# App Config
NODE_ENV=development
PORT=3000
```

💡 *If both `settings.json` and environment variables exist, we prioritize the env variables — because secrets belong in `.env`, not your GitHub repo.*

---

🧪 *Reminder: This is a hackathon prototype. There may be dragons 🐉 (or bugs 🐞). Use responsibly.*


## Technical Architecture

## Project Flow Overview

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│                 │     │                     │     │                  │
│  Incoming Email │────▶│  Inbound Email API  │────▶│   Gemini AI      │
│  (Postmark)     │     │  (Webhook Handler)  │     │  (Gemini 2.0)    │
│                 │     │                     │     │                  │
└─────────────────┘     └─────────────────────┘     └──────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│                 │     │                     │     │                  │
│  Real-time      │◀────│  Data Storage       │◀────│  Keyword         │
│  Updates        │     │  (emails.json)      │     │  Matching        │
│  (Dashboard)    │     │                     │     │  (Fallback)      │
│                 │     │                     │     │                  │
└─────────────────┘     └─────────────────────┘     └──────────────────┘

Flow Description:
1. Email received via Postmark webhook
2. Inbound Email API processes and validates the email
3. Gemini AI extracts key information (status, company, role, etc.)
4. If AI fails, Keyword Matching provides fallback analysis
5. Processed data is stored in emails.json
6. Real-time updates are pushed to the dashboard
```

### System Overview

The application is built using Next.js 14 with the App Router, featuring:

- **Frontend**: React components with Tailwind CSS and shadcn/ui
- **Backend**: Next.js API routes
- **Data Storage**: JSON-based file system (`emails.json` and `settings.json`)
- **Email Processing**: Postmark Inbound API
- **AI Integration**: Google Gemini AI


## 📁 Project Structure

Here's how the magical chaos is organized:

```
src/
├── app/
│   ├── components/          # All the pretty pieces that make the UI sparkle ✨
│   │   ├── Dashboard/       # Where job apps are visualized like stock charts 📊
│   │   ├── Applications/    # The brains of job application management 🧠
│   │   └── Shared/          # Reusable goodies (buttons, cards, etc.) ♻️
│   ├── api/                 # Our mini backend party 🎉
│   │   ├── applications/    # Handles CRUD operations for your job apps 📝
│   │   ├── gemini/          # If you want to handle more Gemini AI tasks currently empty🤖
│   │   └── inbound-email/   # Parses those lovely job confirmation emails 📬
│   ├── utils/               # Helper functions that save lives (and lines of code) 🛠️
│   └── data/                # JSON-based storage – because who needs databases during a hackathon? 📂
```

🧪 *This structure is optimized for speed, sanity, and just enough organization to survive a hackathon weekend.*


### 🚀 API Endpoints

#### 📬 Inbound Email Processing
- `POST /api/inbound-email`: The inbox whisperer that handles incoming emails from Postmark

  **Postmark Integration:**
  - Receives webhook POST requests like a pro
  - Validates Postmark's signature (because security matters 🕵️‍♂️)
  - Parses raw email data (subject, body, headers — all the juicy bits)
  - Extracts metadata (from, to, date, etc.) so nothing gets lost in translation

  **Gemini AI Processing:**
  - Sends parsed email to Gemini 2.0 Flash model for some AI magic ✨
  - Uses fancy structured prompts to extract:
    - Application status (rejected, interview, offer, or "let's wait and see")
    - Job title & company info (because details matter)
    - Employment type & location (remote? onsite? Narnia?)
    - Salary info (hopefully $$$)
    - Next steps or follow-up actions (because we don't want you to miss out)
  - Includes retry logic (3 attempts) — AI can be moody sometimes
  - Validates and cleans AI response (no gibberish allowed!)

  **Data Processing:**
  - Combines Postmark data with Gemini's wisdom 🧠
  - Applies keyword matching as backup (just in case AI naps)
  - Creates a neat, structured application record
  - Stores everything safely in `emails.json`
  - Updates your dashboard in real-time — instant gratification!

#### 📋 Applications Management
- `GET /api/applications` — Show me all my job applications!
- `POST /api/applications` — Add a shiny new application
- `GET /api/applications/:id` — Details, please!
- `PUT /api/applications/:id` — Update that app like a boss
- `DELETE /api/applications/:id` — Say goodbye to that one

#### 💾 Data Management
- `POST /api/import-data` — Bulk upload your app data like a pro
- `POST /api/export-data` — Download all your precious info
- `POST /api/clear-data` — Start fresh, wipe it all clean

#### ⚙️ Settings
- `GET /api/settings` — What's the current game plan?
- `PUT /api/settings` — Change it up, customize away!


## Email Processing Flow

1. **Email Reception**
   - Listens for incoming webhooks from Postmark
   - Validates email format and content to keep things tidy ✅
   - Extracts all the important metadata (subject, body, date, sender info, etc.)

2. **Content Analysis**
   - Carefully reads email subject and body (no skimming allowed!)
   - Uses keyword matching to guess your application status:
     - **Interview keywords**: "interview", "schedule a call", "let's chat"
     - **Offer keywords**: "offer", "congrats", "welcome aboard"
     - **Rejection keywords**: "unfortunately", "not selected", "regret to inform"
     - **Follow-up keywords**: "following up", "checking in", "any updates?"

3. **Data Storage**
   - Crafts a neat, structured record of your application
   - Saves it safely in `emails.json` (no databases harmed in the making)
   - Updates dashboard components so you can see progress at a glance
   - Keeps your full application history intact for posterity

4. **Real-time Updates**
   - Broadcasts fresh updates to app — no FOMO here!
   - Refreshes dashboard stats automatically
   - Sends notifications if you've told it to keep you in the loop 🔔


## 🔐 Security

- API key authentication to keep out the riffraff  
- Email signature verification for legit messages only  
- Rate limiting to prevent API spamming (because we like fair play)  
- Input validation — garbage in, garbage out prevention  
- XSS protection to keep your browser safe from sneaky scripts  
- CSRF protection so no sneaky cross-site attacks happen  

## 📊 Monitoring & Logging

- Application performance monitoring — we keep an eye on the gears turning  
- Error tracking and logging — because bugs like to play hide and seek  
- User activity logging — see what's happening behind the scenes  
- System health checks — making sure everything's running smooth and steady  


## 🚀 Deployment

1. Build the application:  
```bash
npm run build
# or
yarn build
```


## Troubleshooting

Common issues and solutions:

1. **Email Processing Issues**
   - Verify Postmark configuration
   - Check webhook URL
   - Validate email signatures

2. **AI Integration Issues**
   - Verify Gemini API key
   - Check API quotas
   - Validate request format

3. **Database Issues**
   - Check connection string
   - Verify migrations
   - Monitor query performance



## Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add some feature"`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Create a Pull Request and wait for review 🎉  


## 🚀 Future Roadmap (a.k.a. The Quest for World Domination... or at least Job Domination)

- 🔓 **Unlock All the Features** – Like a video game, but instead of defeating dragons, you're defeating job markets.
- 🧠 **AI-Powered Application Status Prediction** – Because "We'll get back to you soon" is just too vague.
- ✨ **Resume Optimization Suggestions** – We'll turn your resume from "meh" to "whoa!".
- 🎤 **Interview Preparation Tools** – Practice so hard you'll ace even a surprise interview in your pajamas.
- 🕵️‍♂️ **Company Research Integration** – Know your potential boss better than they know themselves.
- 💰 **Salary Negotiation Assistant** – For when you want to ask for more money *without* breaking into a nervous sweat.
- 📊 **Advanced Analytics Dashboard** – Numbers! Charts! Graphs! All the grown-up stuff.
- 📱 **Mobile App** – Because job hunting in the bathroom is still job hunting.
- 🧩 **Browser Extension** – Like a mini job coach living rent-free in your browser.
- 📧 **Email Reply Generator** – Ghosting is for haunted houses, not inboxes.
- 🧵 **Track Email Threads** – Never lose track of "Re: Re: Re: FWD: Re: Your Application Status".

## AI Integration

### Gemini Integration

The application uses Google's Gemini AI for intelligent email processing:

1. **Setup & Configuration**
   - Uses `@google/generative-ai` package
   - Requires Gemini API key in settings
   - Uses Gemini 2.0 Flash model for fast processing

2. **Implementation Details**
   ```javascript
   // Initialize Gemini
   const genAI = new GoogleGenerativeAI(settings.api.geminiKey, {
     apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash'
   });


3. **Email Processing Flow**
   - Sends structured prompt to Gemini
   - Extracts key information:
     - Application status (rejected/interview/offer/other)
     - Job title and company
     - Employment type
     - Location and salary
     - Next steps
   - Includes retry logic (3 attempts) for reliability
   - Handles JSON response parsing and validation

4. **Error Handling**
   - Validates API key presence
   - Retries failed requests
   - Validates response format
   - Handles JSON parsing errors
   - Ensures valid status values



### NLP Processing

The application uses a combination of AI and keyword matching to ensure accurate and efficient email understanding:

1. **AI-Powered Analysis**
   - Utilizes Google's Gemini AI for deep semantic understanding of email content.
   - Extracts highly structured data from unstructured text such as:
     - Application status (e.g., rejected, interview scheduled, offer received, or other)
     - Job title and company name
     - Employment type (full-time, part-time, contract)
     - Location and salary details
     - Next steps or follow-up instructions
   - Employs retry logic with up to 3 attempts to handle intermittent API failures.
   - Parses and validates JSON responses to maintain data integrity.
   - Continuously improves understanding by refining prompts and training data.

2. **Keyword Matching**
   - Acts as a lightweight fallback when AI analysis is not feasible or delayed.
   - Uses predefined keyword lists grouped by status categories:
     - Interview Keywords: "interview", "schedule a call", "meet"
     - Offer Keywords: "offer", "congratulations", "welcome aboard"
     - Rejection Keywords: "unfortunately", "not selected", "regret to inform"
     - Follow-up Keywords: "following up", "checking in", "any update"
   - Quickly categorizes emails with simple pattern matching to reduce API usage costs and latency.
   - Helps catch edge cases or very short emails that AI might misinterpret.

3. **Integration Workflow**
   - On receiving a new email, the system first attempts AI processing.
   - If AI fails or is unavailable, keyword matching provides a backup categorization.
   - Results from both approaches are merged and reconciled to generate a final, accurate application record.
   - This hybrid approach balances accuracy with performance and cost-efficiency.

4. **Benefits**
   - Improved accuracy in detecting application statuses and extracting relevant details.
   - Faster processing for common or simple emails.
   - Cost-effective usage of AI by limiting unnecessary calls.
   - Better user experience through timely and reliable email insights.

---


## License

MIT License - feel free to use this project for your own purposes!

## Credits

- Built with [Next.js](https://nextjs.org)  
- Email processing by [Postmark](https://postmarkapp.com)  
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)  
- Hackathon organized by [dev.to](https://dev.to)


## Thank You!

Thank you for checking out this project! Feel free to contribute, report issues, or suggest new features.
## Enjoy and Happy Coding! 🚀

