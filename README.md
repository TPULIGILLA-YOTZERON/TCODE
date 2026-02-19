# CodeFusion

Production-oriented AI-native browser IDE built with Next.js, TypeScript, Monaco, Tailwind, Zustand, IndexedDB, Pyodide, and Gemini.

## Features
- VS Code-style browser IDE layout
- File explorer with create/rename/delete
- Monaco editor with multi-tab support and autosave
- IndexedDB-backed local project persistence
- HTML/CSS/JS live preview via sandboxed iframe
- Python execution in browser using Pyodide (WASM)
- AI assistant panel with streaming Gemini responses (via secured server route)
- Clear service-layer abstractions for future backend migration

## Architecture

```
app/
  api/ai/route.ts               # Gemini proxy + stream + rate limit
  components/                   # UI modules (sidebar, editor, console, AI, preview)
  services/                     # IndexedDB, AI service, Pyodide, templates
  store/ideStore.ts             # Global IDE state (Zustand)
  types/project.ts              # Domain types
  utils/id.ts                   # Utility helpers
```

## Environment Setup
1. Copy `.env.example` to `.env.local`.
2. Add your Gemini API key:
   - `GEMINI_API_KEY=...`

> API keys are only consumed in `app/api/ai/route.ts` and never exposed directly in client code.

## Development
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Production Build
```bash
npm run build
npm run start
```

## Deploy to Vercel
1. Push repository to GitHub/GitLab/Bitbucket.
2. Import project into Vercel.
3. Set environment variable:
   - `GEMINI_API_KEY`
4. Deploy.

## Future-Ready Extensions
Current architecture is prepared for:
- Backend API proxy / auth integration
- Cloud runtime execution (containers)
- WebSocket terminal and collaboration
- Git integration
- AI usage quotas / billing
- Extension marketplace module
