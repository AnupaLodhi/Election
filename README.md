 Know Your Vote — Smart Civic Guide

An AI-powered Election Education Assistant for every Indian voter.
Built for the Google Cloud × Hack2Skill Hackathon 2025.

[Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud)](https://your-demo-url.run.app)
[GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/yourusername/know-your-vote)
[License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)



Screenshots

| Home Screen | Role Selection | AI Chat |
|-------------|---------------|---------|
| ![Home](screenshots/home.png) | ![Roles](screenshots/roles.png) | ![Chat](screenshots/chat.png) |

| Election Timeline | Myth vs Fact |
|-------------------|--------------|
| [Timeline](screenshots/timeline.png) | ![Myths](screenshots/myths.png) |


 Problem Statement

Over 26% of eligible Indian voters don't vote — often due to confusion about the process, lack of awareness, or misinformation. Civic education resources are either too complex, not personalised, or unavailable in accessible formats.

**Know Your Vote** solves this by offering a role-aware, AI-powered guide that explains elections simply — for first-time voters, students, senior citizens, rural voters, and NRIs.

Features

1️⃣ Role-Based Personalisation
Choose your voter profile — the AI tailors its explanations accordingly:
 🌱 First-Time Voter
🎓 Student (18–25)
🧓 Senior Citizen
🌾 Rural Voter
✈️ NRI Voter

 2️⃣ Interactive AI Chat (Claude Sonnet)
Ask anything about Indian elections:
How do I register to vote?
What documents are needed on polling day?
What is NOTA?
How does an EVM work?
hat happens if no party gets majority?
"Explain like I'm 12 years old" mode 

3️⃣ Election Timeline Visualiser
Step-by-step visual journey from Election Announcement → Results & Government Formation.

4️⃣ Myth vs. Fact Section
Busts 5 common election misconceptions with verified facts.

5️⃣ Language Toggle
English / हिंदी toggle for wider accessibility.


 Architecture

┌─────────────────────────────────────────────────────┐
│                    User's Browser                    │
│                                                     │
│   ┌─────────────┐    ┌──────────────────────────┐  │
│   │  React SPA  │───▶│   FastAPI Backend         │  │
│   │  (Tailwind) │    │   (Python 3.11)           │  │
│   └─────────────┘    └──────────┬───────────────┘  │
└─────────────────────────────────┼───────────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │     Anthropic Claude API     │
                    │   (claude-sonnet-4-...)      │
                    └─────────────────────────────┘
                                  │
              ┌───────────────────▼────────────────────┐
              │           Google Cloud Run              │
              │   • Auto-scaling  • Public HTTPS URL   │
              │   • Dockerised container               │
              └─────────────────────────────────────────┘
 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS |
| Backend | Python 3.11, FastAPI |
| AI Model | Anthropic Claude Sonnet |
| Containerisation | Docker |
| Cloud Deployment | Google Cloud Run |
| Registry | Google Artifact Registry |


Local Setup

Prerequisites
Node.js 18+
Python 3.11+
Docker Desktop
An [Anthropic API Key](https://console.anthropic.com)

 1. Clone the repo
 2. bash
git clone https://github.com/yourusername/know-your-vote.git
cd know-your-vote

 2. Backend setup
  bash
cd backend
pip install -r requirements.txt
cp .env.example .env
 Add your ANTHROPIC_API_KEY to .env
uvicorn main:app --reload --port 8000


3. Frontend setup
bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173



 Docker

bash
# Build the image
docker build -t know-your-vote .

# Run locally
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY=your_key_here \
  know-your-vote

# Open http://localhost:8080



Deploy to Google Cloud Run

1. Set up GCP project
bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com


2. Build & push to Artifact Registry
bash
# Create repository
gcloud artifacts repositories create know-your-vote \
  --repository-format=docker \
  --location=asia-south1

# Build and push
gcloud builds submit --tag \
  asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/know-your-vote/app


3. Deploy to Cloud Run
bash
gcloud run deploy know-your-vote \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/know-your-vote/app \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars ANTHROPIC_API_KEY=your_key_here


4. Get your public URL
bash
gcloud run services describe know-your-vote \
  --region asia-south1 \
  --format "value(status.url)"


Project Structure


know-your-vote/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── Timeline.jsx
│   │   │   └── Myths.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt
│   └── .env.example
├── Dockerfile
├── .dockerignore
├── screenshots/
└── README.md



 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ Yes |
| `PORT` | Server port (default: 8080) | No |



 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request


 License

MIT License — see [LICENSE](LICENSE) for details.



Author

Anupa Lodhi  
[LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/AnupaLodhi12/a)
[GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/AnupaLodhi)



Acknowledgements

[Anthropic](https://anthropic.com) — Claude AI
[Google Cloud](https://cloud.google.com) — Cloud Run & Artifact Registry
[Election Commission of India](https://eci.gov.in) — Civic data reference
[Hack2Skill](https://hack2skill.com) — Hackathon platform


> "The ballot is stronger than the bullet." — Abraham Lincoln  
> Built with ❤️ for India's 968 million voters.
