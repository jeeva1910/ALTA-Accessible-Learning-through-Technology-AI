# ALTA — Accessible Learning Through Technology & AI

> An accessibility-focused learning platform that helps make educational content more usable for learners with visual and hearing accessibility needs through AI-assisted learning, Braille interaction, speech technologies, ISL gloss generation, and media transcription.

## Overview

ALTA is a full-stack web application designed around accessible learning workflows. It combines an accessibility-focused React interface with a Node.js/Express backend, MongoDB persistence, browser speech technologies, and Gemini/OpenRouter AI services.

The project is currently a functional prototype. Some planned capabilities are intentionally kept in the roadmap and are not presented as completed features.

## Problem

Conventional digital learning materials can be difficult to access when educational content depends heavily on visual layouts, spoken lectures, or audio/video without suitable alternatives. ALTA explores a unified workflow where the same learning content can be accessed through different accessibility-oriented interfaces.

## Solution

ALTA provides separate visual- and hearing-oriented learning workflows while keeping common learning assistance available through Lumi, the AI tutor.

The platform supports:
- accessible text and document learning
- speech-based interaction and text-to-speech
- six-dot Braille interaction
- ISL-oriented text-to-gloss conversion with sign-video matching
- audio and video transcription
- contextual AI tutoring
- persistence of user, lesson, note, generated-content, chat-history, and processing data

## Implemented Features

### Accessibility
- Visual and hearing accessibility dashboards
- Voice input using the browser Speech Recognition API where supported
- Text-to-Speech using the browser Speech Synthesis API
- Haptic feedback using the browser Vibration API where supported
- Six-dot Braille keyboard interaction
- Braille note-taking with voice feedback and gesture-based controls
- High-contrast/accessibility-oriented interface controls

### Lumi AI Tutor
- Context-aware AI tutor available across learning workflows
- Uses active screen/lesson/transcript/ISL context when supplied
- Voice query support
- Spoken AI responses through the existing speech pipeline
- Gemini and OpenRouter-backed tutor processing with fallback behavior

### ISL Learning Workflow
- English text/lesson upload using TXT and DOCX files
- Gemini-assisted ISL-style gloss generation
- Rule-based ISL gloss fallback when Gemini is unavailable
- Local ISL dictionary lookup
- Sequential local MP4 sign-video representations for available dictionary entries
- ISL gloss copying and interactive sign sequence display

> The current repository contains a small local sign-video dataset. It should not be described as a complete or comprehensive ISL dataset.

### Audio Learning
- TXT and DOCX learning-material upload
- Audio-file upload for MP3, WAV, M4A, OGG and WEBM inputs
- Browser-side media audio extraction
- Gemini-based speech-to-text processing for uploaded audio
- Sentence segmentation
- Browser text-to-speech playback
- Playback controls, speed adjustment, navigation and double-tap interaction

### Media Transcription
- Video upload for supported video formats including MP4, WEBM, MOV and MKV
- Audio upload for MP3, WAV, M4A, OGG and WEBM
- Browser-side extraction of audio from uploaded media
- Gemini-based transcription through backend APIs
- Timestamped transcript segments
- Speaker labels where returned/available from the processing pipeline
- Optional sound-cue metadata where returned
- Transcript playback synchronization
- Search, editing and copy interactions
- SRT/TXT transcript export where supported by the workspace

### Data Persistence
MongoDB/Mongoose models are present for:
- Users
- Lessons
- Notes
- Chat history
- Processing history
- Generated content
- Tactile diagram records

## Architecture

```text
User
  │
  ▼
React 19 + TypeScript + Vite + Tailwind
  │
  │ JSON / REST / media payloads
  ▼
Node.js + Express
  │
  ├──────────────► Gemini AI
  │                  ├─ ISL gloss generation
  │                  ├─ AI tutoring
  │                  └─ Audio/video transcription
  │
  ├──────────────► OpenRouter
  │                  └─ Lumi tutor path / fallback
  │
  ▼
MongoDB + Mongoose
  │
  └─ users, lessons, notes, history, generated content
```

### Media transcription flow

```text
Audio / Video File
       │
       ▼
Browser Audio Extraction
       │
       ▼
Backend Transcription API
       │
       ▼
Gemini-based Speech-to-Text
       │
       ▼
Timestamped Transcript Segments
       │
       ▼
Learning / Transcription Workspace
```

### ISL flow

```text
English Lesson
     │
     ▼
/api/isl-translate
     │
     ├── Gemini ISL Gloss Generation
     │
     └── Rule-Based Gloss Fallback
     │
     ▼
ISL Gloss + Sign Tokens
     │
     ▼
Local ISL Dictionary
     │
     ▼
Available Sign Video Representation
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript |
| Build tooling | Vite 6 |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 9 |
| AI SDK | `@google/genai` |
| AI services | Google Gemini, OpenRouter |
| Document processing | Mammoth for DOCX extraction |
| Icons/UI | Lucide React |
| Motion | Motion |
| Speech input | Browser Speech Recognition API |
| Speech output | Browser Speech Synthesis API |
| Haptics | Browser Vibration API |
| Media processing | Web Audio API |

## API Workflows

Important backend endpoints include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/isl-translate`
- `POST /api/audio-transcribe`
- `POST /api/video-transcribe`
- `POST /api/media-transcribe`
- `POST /api/tutor`
- `/api/notes`
- `/api/lessons`
- `/api/generated-content`
- `/api/chat-history`
- `/api/processing-history`
- `/api/files/upload`

## Security

The prototype includes several application-level security controls:

- Password hashing with Node.js `scrypt` and unique random salts
- HMAC-SHA256 signed session tokens with seven-day expiration
- JWT-style Bearer authentication and protected routes
- Timing-safe signature/password comparisons
- Request-body/query/parameter sanitization against MongoDB operator injection
- Escaping of user input used in MongoDB regular expressions
- Rate limiting for authentication, write operations and AI endpoints
- Security response headers
- Filename sanitization for uploaded files
- Server-side environment variables for secrets
- Data minimization for generated-content/transcription persistence; raw source media/text is not intentionally stored by the relevant generated-content paths

See [SECURITY.md](SECURITY.md) for details and limitations.

## Installation

### Prerequisites

- Node.js
- MongoDB/MongoDB Atlas if persistent database functionality is required
- Gemini API key for Gemini-backed features
- OpenRouter API key if the OpenRouter tutor path is to be used

### Install

```bash
npm install
```

### Environment variables

Create a local `.env` file from `.env.example` and provide the required values.

```env
GEMINI_API_KEY=
OPENROUTER_API_KEY=
APP_URL=
MONGODB_URI=
JWT_SECRET=
```

Never commit real credentials.

### Run in development

```bash
npm run dev
```

### Type-check

```bash
npm run lint
```

### Production build

```bash
npm run build
```

### Start built server

```bash
npm start
```

## Current Status

ALTA is a functional web prototype with connected frontend, backend, AI, database, accessibility, and media-processing workflows.

Known limitations include AI response variability, API quota/rate limitations, and limited availability of ISL sign-video data. These are active areas for improvement.

## Future Roadmap

Planned/next-phase work may include:

- Diagram → Tactile conversion
- Touch → Concept interaction
- Adaptive/personalized learning
- Expanded ISL datasets and coverage
- Further UI/UX and accessibility refinement
- Additional robustness and scalability improvements

These items are not represented as completed functionality in this repository.

## Third-Party Resources

This project uses open-source libraries and external services. Major dependencies and services can be reviewed in `package.json`.

Important resources include:
- Google Gemini / Google GenAI SDK — AI processing
- OpenRouter — optional AI tutor provider
- React / React DOM — frontend
- Vite — build tooling
- Express — backend server
- Mongoose — MongoDB object modeling
- Mammoth — DOCX text extraction
- Lucide React — interface icons
- Motion — interface animation
- Tailwind CSS — styling

Third-party terms and licenses should be reviewed from each project's official repository/package metadata before redistribution.

## AI Disclosure

Generative AI is part of ALTA's runtime functionality. Gemini is used for ISL-style gloss generation, AI tutoring, and uploaded-media speech-to-text workflows. OpenRouter is also integrated as an AI provider for the Lumi tutor path.

Generative AI tools were also used during development. AI assistance does not replace verification of the application's implementation; generated outputs are handled through application prompts, validation, fallback logic, and user-facing error handling.

## Team

Add the registered team information before the final submission:

| Member | GitHub | Role |
|---|---|---|---|
| JEEVADHARSHINI | jeeva1910 | Developer | 
| [ADD NAME] | kamaleshsiva079 | Developer | 

Do not leave placeholders in the final submitted repository.

## Demo

**Working Prototype / Deployment:** [ADD FINAL LINK]

Add the final working prototype or deployment link before the final submission.

## Reviewer Notes

- This repository represents the current prototype state.
- Gemini responses are probabilistic and may require user verification.
- ISL coverage is constrained by the available local sign-video dictionary/data.
- AI APIs are subject to provider availability, quotas, latency and network conditions.
- Browser speech recognition, speech synthesis and vibration support depend on the user's browser/device.
- Diagram → Tactile and Touch → Concept are roadmap items unless separately implemented in a later revision.
